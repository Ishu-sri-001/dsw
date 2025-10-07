'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const YugaStyleShader = () => {
  const containerRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const prevMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothPrevMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseVelocityRef = useRef(0);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  
  const trailBufferRef = useRef(null);
  const trailSceneRef = useRef(null);
  const trailCameraRef = useRef(null);

  const elasticBufferRef = useRef(null);
  const elasticSceneRef = useRef(null);
  const elasticCameraRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // --- GPU-based trail system using texture buffer ---
    const trailRT1 = new THREE.WebGLRenderTarget(512, 512, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    });
    const trailRT2 = trailRT1.clone();
    trailBufferRef.current = { read: trailRT1, write: trailRT2 };

    const trailScene = new THREE.Scene();
    const trailCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    trailSceneRef.current = trailScene;
    trailCameraRef.current = trailCamera;

    const trailGeometry = new THREE.PlaneGeometry(2, 2);

    // Initialize trail buffer to zero
    const initTrailMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        void main() { gl_FragColor = vec4(0.0); }
      `
    });

    const initTrailMesh = new THREE.Mesh(trailGeometry, initTrailMaterial);
    trailScene.add(initTrailMesh);
    renderer.setRenderTarget(trailRT1); renderer.render(trailScene, trailCamera);
    renderer.setRenderTarget(trailRT2); renderer.render(trailScene, trailCamera);
    renderer.setRenderTarget(null);
    trailScene.remove(initTrailMesh);

    // Trail update shader - adds new trail and fades old trail
    const trailUpdateMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tPrev: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVelocity: { value: 0.0 },
        uActive: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform sampler2D tPrev;
        uniform vec2 uMouse;
        uniform vec2 uPrevMouse;
        uniform float uMouseVelocity;
        uniform float uActive;
        varying vec2 vUv;

        void main() {
          vec4 prev = texture2D(tPrev, vUv);
          
          // Fade previous trail
          float intensity = prev.r * 0.96;
          
          // Add new trail point
          if (uActive > 0.5) {
            float dist = length(vUv - uMouse);
            float radius = 0.015 + uMouseVelocity * 0.12;
            float newIntensity = smoothstep(radius, 0.0, dist);
            intensity = max(intensity, newIntensity);
            
            // Interpolate along mouse movement path
            vec2 mouseDir = uMouse - uPrevMouse;
            float pathDist = length(mouseDir);
            if (pathDist > 0.001) {
              vec2 mouseNorm = normalize(mouseDir);
              vec2 toPoint = vUv - uPrevMouse;
              float projDist = dot(toPoint, mouseNorm);
              
              if (projDist > 0.0 && projDist < pathDist) {
                vec2 closestPoint = uPrevMouse + mouseNorm * projDist;
                float perpDist = length(vUv - closestPoint);
                float lineIntensity = smoothstep(radius, 0.0, perpDist);
                intensity = max(intensity, lineIntensity);
              }
            }
          }
          
          gl_FragColor = vec4(intensity, 0.0, 0.0, 1.0);
        }
      `
    });

    const trailUpdateMesh = new THREE.Mesh(trailGeometry, trailUpdateMaterial);
    trailScene.add(trailUpdateMesh);

    // --- Elastic UV feedback system ---
    const elasticRT1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    });
    const elasticRT2 = elasticRT1.clone();
    elasticBufferRef.current = { read: elasticRT1, write: elasticRT2 };

    const elasticScene = new THREE.Scene();
    const elasticCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    elasticSceneRef.current = elasticScene;
    elasticCameraRef.current = elasticCamera;

    const elasticGeometry = new THREE.PlaneGeometry(2, 2);

    const initElasticMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() { gl_FragColor = vec4(vUv, 0.0, 0.0); }
      `
    });

    const initMesh = new THREE.Mesh(elasticGeometry, initElasticMaterial);
    elasticScene.add(initMesh);
    renderer.setRenderTarget(elasticRT1); renderer.render(elasticScene, elasticCamera);
    renderer.setRenderTarget(elasticRT2); renderer.render(elasticScene, elasticCamera);
    renderer.setRenderTarget(null);
    elasticScene.remove(initMesh);

    // --- Elastic update shader ---
    const elasticMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tPrev: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVelocity: { value: 0.0 },
        dtRatio: { value: 1.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform sampler2D tPrev;
        uniform vec2 uMouse;
        uniform vec2 uPrevMouse;
        uniform float uMouseVelocity;
        uniform float dtRatio;
        varying vec2 vUv;

        void main() {
          vec4 prev = texture2D(tPrev, vUv);
          vec2 prevUV = prev.rg;
          vec2 prevVel = prev.ba;

          vec2 vel = uMouse - uPrevMouse;
          float dist = length(vUv - uMouse);
          float radius = 0.08 + uMouseVelocity * 0.05;
          float influence = smoothstep(radius, 0.0, dist);
          influence = pow(influence, 2.0);

          prevVel += vel * influence * 0.3 * dtRatio;

          vec2 disp = vUv - prevUV;
          float len = length(disp);
          vec2 dispNor = len > 0.0 ? normalize(disp) : vec2(0.0);
          prevVel += dispNor * (len * 0.015) * dtRatio;

          prevVel *= exp2(log2(0.88) * dtRatio);
          prevUV += prevVel * dtRatio * 0.5;

          gl_FragColor = vec4(prevUV, prevVel);
        }
      `
    });

    const elasticMesh = new THREE.Mesh(elasticGeometry, elasticMaterial);
    elasticScene.add(elasticMesh);

    const bgTextureData = '/assets/bg4.png';
    const logoTextureData = '/assets/logo.png';

    const textureLoader = new THREE.TextureLoader();
    let bgTexture, logoTexture;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColorBg: { value: new THREE.Color(0x000000) },
        uColorLogo: { value: new THREE.Color(0xffffff) },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        time: { value: 0.0 },
        uNoise: { value: 0.0 },
        uNoise1Opts: { value: new THREE.Vector2(1.25, 0.25) },
        uNoise2Opts: { value: new THREE.Vector2(2.0, 0.8) },
        uNoise3Opts: { value: new THREE.Vector3(5.0, 2.0, 3.8) },
        uNoise4Opts: { value: new THREE.Vector4(-3.8, -2.0, -3.9, -2.5) },
        uGlobalShape: { value: 1.0 },
        uGlobalOpen: { value: -0.01 },
        uNoiseMultiplier: { value: 1.0 },
        uLogoAnimation: { value: 1.0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVelocity: { value: 0.0 },
        tTrail: { value: null },
        tBg: { value: null },
        tLogo: { value: null },
        uTexturesLoaded: { value: 0.0 },
        uUV: { value: null }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        
        uniform vec3 uColorBg;
        uniform vec3 uColorLogo;
        uniform vec2 resolution;
        uniform float time;
        uniform float uNoise;
        uniform vec2 uNoise1Opts;
        uniform vec2 uNoise2Opts;
        uniform vec3 uNoise3Opts;
        uniform vec4 uNoise4Opts;
        uniform float uGlobalShape;
        uniform float uGlobalOpen;
        uniform float uNoiseMultiplier;
        uniform float uLogoAnimation;
        uniform vec2 uMouse;
        uniform vec2 uPrevMouse;
        uniform float uMouseVelocity;
        uniform sampler2D tTrail;
        uniform sampler2D tBg;
        uniform sampler2D tLogo;
        uniform float uTexturesLoaded;
        uniform sampler2D uUV;
        
        varying vec2 vUv;
        
        vec2 rotateUV(vec2 uv, float rotation, vec2 mid) {
          return vec2(
            cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
            cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
          );
        }
        
        vec2 scaleUV(vec2 uv, float scale, vec2 mid) {
          uv -= mid;
          uv *= 1.0 / scale;
          uv += mid;
          return uv;
        }
        
        float quadraticInOut(float t) {
          float p = 2.0 * t * t;
          return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
        }
        
        float quadraticOut(float t) {
          return -t * (t - 2.0);
        }
        
        float fc(float x, float a1, float a2, float b1, float b2) {
          float t = (x - a1) / (a2 - a1);
          return clamp(b1 + t * (b2 - b1), min(b1, b2), max(b1, b2));
        }
        
        float stp(float a, float b, float t) {
          return clamp((t - a) / (b - a), 0.0, 1.0);
        }
        
        float fl(float a, float b, float c, float f, float e) {
          float p = mix(b - f, c, e);
          return stp(p + f, p, a);
        }
        
        // Noise functions - modified for diagonal lines
        vec3 hash(vec3 p3) {
          p3 = fract(p3 * vec3(.1031, .1030, .0973));
          p3 += dot(p3, p3.yxz+33.33);
          return fract((p3.xxy + p3.yxx)*p3.zyx) - 0.5;
        }
        
        vec2 hash22(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
          p3 += dot(p3, p3.yzx+33.33);
          return fract((p3.xx+p3.yz)*p3.zy);
        }
        
       
        float noise(in vec3 p) {
          // Move noise diagonally from bottom-left to top-right
          // by offsetting both x and y equally over time
          p.xy += vec2(time * 0.15, time * 0.15); // controls diagonal speed and direction

          const float K1 = 0.333333333;
          const float K2 = 0.166666667;
          
          vec3 i = floor(p + (p.x + p.y + p.z) * K1);
          vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
          vec3 e = step(vec3(0.0), d0 - d0.yzx);
          vec3 i1 = e * (1.0 - e.zxy);
          vec3 i2 = 1.0 - e.zxy * (1.0 - e);
          vec3 d1 = d0 - (i1 - 1.0 * K2);
          vec3 d2 = d0 - (i2 - 2.0 * K2);
          vec3 d3 = d0 - (1.0 - 3.0 * K2);
          vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
          vec4 n = h * h * h * h * vec4(
            dot(d0, hash(i)),
            dot(d1, hash(i + i1)),
            dot(d2, hash(i + i2)),
            dot(d3, hash(i + 1.0))
          );
          return dot(n, vec4(52.0));
        }

        
        float cellNoise(in vec2 uv, in float aspect) {
          uv -= 0.5;
          uv.x *= aspect;
          uv += 0.5;
          
          // Rotate to create diagonal lines from bottom-left to top-right
          float angle = -0.785398; // -45 degrees
          uv = rotateUV(uv, angle, vec2(0.5));
          
          uv *= uNoise2Opts.x;
          
          vec2 i_st = floor(uv);
          vec2 f_st = fract(uv);
          
          float m_dist = 1.;
          
          for (int y= -1; y <= 1; y++) {
            for (int x= -1; x <= 1; x++) {
              vec2 neighbor = vec2(float(x),float(y));
              vec2 point = hash22(i_st + neighbor);
              point = 0.5 + 0.5*sin(time * uNoise2Opts.y + 6.2831*point);
              vec2 diff = neighbor + point - f_st;
              float dist = length(diff);
              m_dist = min(m_dist, dist);
            }
          }
          
          return m_dist;
        }
        
        float linearNoise(in vec2 uv, in float aspect) {
          uv -= 0.5;
          uv.x *= aspect;
          uv += 0.5;
          
          // Rotate to create diagonal lines from bottom-left to top-right
          float angle = -0.785398; // -45 degrees
          uv = rotateUV(uv, angle, vec2(0.5));
          
          uv *= uNoise3Opts.x;
          return (sin(uv.x + time * uNoise3Opts.y) + 1.0) * 0.5;
        }
        
        float linearNoise2(in vec2 uv, in float aspect) {
          // Rotate to create diagonal effect
          float angle = -0.785398; // -45 degrees
          uv = rotateUV(uv, angle, vec2(0.5));
          
          vec2 multX = rotateUV(vec2(aspect + uNoise4Opts.w * aspect, 1.0), angle, vec2(0.0));
          uv -= 0.5;
          uv *= multX;
          float len = (sin(length(uv) * uNoise4Opts.x + time * uNoise4Opts.y) + 1.0) * 0.5;
          return len;
        }
        
        void main() {
          float ww = fwidth(vUv.y);
          float aspect = resolution.x / resolution.y;
          
          // Use elastic UV from feedback buffer
          vec2 bgUV = texture2D(uUV, vUv).rg;
          
          float mouseDist = length(bgUV - uMouse);
          float baseRadius = 0.8;
          float maxRadius = 1.5;
          float dynamicRadius = baseRadius + uMouseVelocity * 0.15;
          dynamicRadius = min(dynamicRadius, maxRadius);
          float dye = 0.0;
          
          // Sample trail from GPU texture - single texture lookup!
          float trailDye = texture2D(tTrail, bgUV).r * 0.9;
          trailDye = min(trailDye, 0.6);
          
          float n1 = 0.0;
          
          if (uNoise < 1.0) {
            n1 = quadraticInOut(fc(noise(vec3(bgUV * uNoise1Opts.x + 24.143, time * uNoise1Opts.y + 65.343)), -0.2, 0.7, 0.0, 0.6));
          } else if (uNoise < 2.0) {
            n1 = fc(cellNoise(vUv, aspect), 0.4, 0.8, 0.0, 0.6);
          } else if (uNoise < 3.0) {
            n1 = quadraticInOut(fc(linearNoise(vUv, aspect), 0.0, 1.0, 0.0, 0.4));
          } else {
            n1 = quadraticInOut(fc(linearNoise2(vUv, aspect), 0.0, 1.0, 0.0, 0.4));
          }
          
          n1 *= uNoiseMultiplier;
          
          // Logo handling
          vec2 uvLogo = bgUV;
          uvLogo -= 0.5;
          uvLogo.x *= aspect;
          uvLogo += 0.5;
          uvLogo = scaleUV(uvLogo, min(resolution.x, resolution.y) * 0.00025 + ww * 300.0, vec2(0.5));
          
          vec2 dLogo = 1.0 - texture2D(tLogo, uvLogo).rg;
          float borderLogo = ww + 0.0175;
          float logoDF = dLogo.r + n1;
          
          float shapeInside = fl(logoDF, 0.15, 1.0, borderLogo, fc(uLogoAnimation, 0.0, 1.0, 0.01, 0.85));
          vec3 bg = mix(uColorBg, uColorLogo, shapeInside);
          
          // Background texture
          vec2 uv = bgUV;
          uv -= 0.5;
          uv.x *= aspect;
          uv += 0.5;
          
          float frequency = 20.0;  
          uv = uv * frequency;
          uv = fract(uv);
          
          vec2 texSize = vec2(textureSize(tBg, 0));
          uv = floor(uv * texSize) / texSize;
          
          float dist = 1.0 - texture2D(tBg, uv).r;
          
          float diff = 0.075;
          diff += n1;
          diff += uGlobalOpen;
          diff += (dye + trailDye) * uNoiseMultiplier;
          diff *= uGlobalShape;
          
          float border = ww + 0.0175;
          float shape = fl(dist, 0.0, 1.0, border, fc(diff, 0.0, 1.0, 0.0, 1.0));
          
          vec3 colorFront = mix(uColorLogo, uColorBg, shapeInside * (dye + trailDye) * 3.0);
          
          bg = mix(bg, colorFront, shape);
          
          gl_FragColor = vec4(bg, 1.0);
        }
      `
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.onload = () => {
      canvas.width = bgImage.width;
      canvas.height = bgImage.height;
      ctx.drawImage(bgImage, 0, 0);
      bgTexture = new THREE.CanvasTexture(canvas);
      bgTexture.wrapS = THREE.RepeatWrapping;
      bgTexture.wrapT = THREE.RepeatWrapping;
      bgTexture.minFilter = THREE.LinearFilter;
      bgTexture.magFilter = THREE.LinearFilter;
      bgTexture.generateMipmaps = false;
      material.uniforms.tBg.value = bgTexture;
      checkTexturesLoaded();
    };
    
    const logoImage = new Image();
    logoImage.crossOrigin = 'anonymous';
    logoImage.onload = () => {
      const logoCanvas = document.createElement('canvas');
      const logoCtx = logoCanvas.getContext('2d');
      logoCanvas.width = logoImage.width;
      logoCanvas.height = logoImage.height;
      logoCtx.drawImage(logoImage, 0, 0);
      logoTexture = new THREE.CanvasTexture(logoCanvas);
      logoTexture.wrapS = THREE.ClampToEdgeWrapping;
      logoTexture.wrapT = THREE.ClampToEdgeWrapping;
      material.uniforms.tLogo.value = logoTexture;
      checkTexturesLoaded();
    };

    bgImage.src = bgTextureData;
    logoImage.src = logoTextureData;

    const checkTexturesLoaded = () => {
      if (material.uniforms.tBg.value && material.uniforms.tLogo.value) {
        material.uniforms.uTexturesLoaded.value = 1.0;
        setTexturesLoaded(true);
      }
    };

    const clock = new THREE.Clock();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      material.uniforms.resolution.value.set(w, h);
      elasticBufferRef.current.read.setSize(w, h);
      elasticBufferRef.current.write.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let isMouseActive = false;

    const animate = () => {
      const dt = clock.getDelta();

      // --- Elastic mouse smoothing for hover effect ---
      const smoothFactor = 0.15;
      smoothPrevMouseRef.current.copy(smoothMouseRef.current);
      smoothMouseRef.current.lerp(mouseRef.current, smoothFactor);

      // Mouse velocity
      const vx = mouseRef.current.x - prevMouseRef.current.x;
      const vy = mouseRef.current.y - prevMouseRef.current.y;
      const currentVelocity = Math.sqrt(vx * vx + vy * vy);
      mouseVelocityRef.current = mouseVelocityRef.current * 0.95 + currentVelocity * 0.05;

      // --- Update trail buffer (GPU-based) ---
      trailUpdateMaterial.uniforms.tPrev.value = trailBufferRef.current.read.texture;
      trailUpdateMaterial.uniforms.uMouse.value.copy(mouseRef.current);
      trailUpdateMaterial.uniforms.uPrevMouse.value.copy(prevMouseRef.current);
      trailUpdateMaterial.uniforms.uMouseVelocity.value = Math.min(mouseVelocityRef.current * 50.0, 1.0);
      trailUpdateMaterial.uniforms.uActive.value = isMouseActive ? 1.0 : 0.0;

      renderer.setRenderTarget(trailBufferRef.current.write);
      renderer.render(trailSceneRef.current, trailCameraRef.current);
      renderer.setRenderTarget(null);
      [trailBufferRef.current.read, trailBufferRef.current.write] = [trailBufferRef.current.write, trailBufferRef.current.read];

      // --- Update elastic UV buffer for hover distortion ---
      elasticMaterial.uniforms.tPrev.value = elasticBufferRef.current.read.texture;
      elasticMaterial.uniforms.uMouse.value.copy(smoothMouseRef.current);
      elasticMaterial.uniforms.uPrevMouse.value.copy(smoothPrevMouseRef.current);
      elasticMaterial.uniforms.uMouseVelocity.value = Math.min(mouseVelocityRef.current * 40.0, 1.0);
      elasticMaterial.uniforms.dtRatio.value = Math.min(dt * 60, 2.0);

      renderer.setRenderTarget(elasticBufferRef.current.write);
      renderer.render(elasticSceneRef.current, elasticCameraRef.current);
      renderer.setRenderTarget(null);
      [elasticBufferRef.current.read, elasticBufferRef.current.write] = [elasticBufferRef.current.write, elasticBufferRef.current.read];

      // --- Update main shader ---
      material.uniforms.time.value = clock.getElapsedTime();
      material.uniforms.uMouse.value.copy(mouseRef.current);
      material.uniforms.uPrevMouse.value.copy(prevMouseRef.current);
      material.uniforms.uMouseVelocity.value = Math.min(mouseVelocityRef.current * 50.0, 1.0);
      material.uniforms.uUV.value = elasticBufferRef.current.read.texture;
      material.uniforms.tTrail.value = trailBufferRef.current.read.texture;

      // Render scene
      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      prevMouseRef.current.copy(mouseRef.current);
      mouseRef.current.set(
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height
      );
      isMouseActive = true;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const rect = renderer.domElement.getBoundingClientRect();
      const touch = e.touches[0];
      prevMouseRef.current.copy(mouseRef.current);
      mouseRef.current.set(
        (touch.clientX - rect.left) / rect.width,
        1.0 - (touch.clientY - rect.top) / rect.height
      );
      isMouseActive = true;
    };

    const handleMouseLeave = () => {
      isMouseActive = false;
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('touchmove', handleTouchMove);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      elasticGeometry.dispose();
      trailGeometry.dispose();
      material.dispose();
      elasticMaterial.dispose();
      initElasticMaterial.dispose();
      trailUpdateMaterial.dispose();
      initTrailMaterial.dispose();
      elasticRT1.dispose();
      elasticRT2.dispose();
      trailRT1.dispose();
      trailRT2.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          overflow: 'hidden', 
          background: '#000',
        }} 
      />
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '12px',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '4px'
      }}>
        
      </div>
    </div>
  );
};

export default YugaStyleShader;