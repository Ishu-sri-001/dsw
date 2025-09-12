"use client";

import * as THREE from "three";
import React, { useRef } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";


const SingleWaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector3(),
    uWaveSpeed: 1.0,
    uWaveAmplitude: 0.15,
    uWaveFrequency: 2.0,
    uBandWidth: 0.4, // large width
    uColor: new THREE.Color("#1626F8"), // wave color
    uBackgroundColor: new THREE.Color("#030815"), // background color
  },
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  precision highp float;
  uniform float uTime;
  uniform vec3 uResolution;
  uniform float uWaveSpeed;
  uniform float uWaveAmplitude;
  uniform float uWaveFrequency;
  uniform float uBandWidth;
  uniform vec3 uColor;
  uniform vec3 uBackgroundColor;
  varying vec2 vUv;

  float wave(vec2 uv, float d, float o){
    return 1.0 - smoothstep(0.0, d, distance(
      uv.y,
      0.2 + sin(o * uWaveSpeed + uv.x * uWaveFrequency) * uWaveAmplitude
    ));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    
    // Start with background color
    vec3 col = uBackgroundColor;

    // single wide wave
    float w = wave(uv, uBandWidth, uTime);
    
    // Mix wave color on top of background
    col = mix(col, uColor, w);

    gl_FragColor = vec4(col, 1.0);
  }
  `
);

extend({ SingleWaveMaterial });

export const SingleWave = (props) => {
  const shaderRef = useRef();
  const { gl, scene } = useThree();

  // Set background color to #030815
  React.useEffect(() => {
    gl.setClearColor(new THREE.Color("#030815"));
    // Also set the scene background as a fallback
    scene.background = new THREE.Color("#030815");
  }, [gl, scene]);

  useFrame(({ clock, size }) => {
    if (shaderRef.current) {
      shaderRef.current.uTime = clock.getElapsedTime();
      shaderRef.current.uResolution.set(size.width, size.height, 1);
    }
  });

  return (
    <mesh {...props}>
      <planeGeometry args={[20, 10]} />
      <singleWaveMaterial ref={shaderRef} />
    </mesh>
  );
};

export default function Bg() {
  return (
    <div className="h-screen w-screen" style={{ backgroundColor: '#030815' }}>
      <Canvas className="h-full w-full">
        <SingleWave />
      </Canvas>
    </div>
  );
}