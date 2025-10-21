'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

const CreativePage = () => {
  const router = useRouter();
  const handRef = useRef(null);
  const cursorRef = useRef(null);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const [showHand, setShowHand] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef(null);
  const [logoAnimationDone, setLogoAnimationDone] = useState(false);
  
  const visualCursorPos = useRef({ x: 0, y: 0 });
  const realMousePos = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  
  const mouseLocked = useRef(false);

  // Initialize mouse position at component start
  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    realMousePos.current = { x: centerX, y: centerY };
    visualCursorPos.current = { x: centerX, y: centerY };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const updateCursor = (e) => {
      realMousePos.current = { x: e.clientX, y: e.clientY };
      gsap.set(cursor, {
        x: e.clientX - 12,
        y: e.clientY - 12
      });
    };

    document.addEventListener("mousemove", updateCursor);

    return () => {
      document.removeEventListener("mousemove", updateCursor);
    };
  }, []);

  useEffect(() => {
    document.body.style.cursor = 'none';
    if (!logoAnimationDone) return;

    const handleMouseMove = (e) => {
      if (mouseLocked.current) return; // ignore during hand animation

      realMousePos.current = { x: e.clientX, y: e.clientY };
      
      // Only update visual cursor position with actual mouse position
      // Don't apply offset during normal mouse movement
      visualCursorPos.current = { x: e.clientX, y: e.clientY };
      gsap.set(cursorRef.current, { x: e.clientX - 12, y: e.clientY - 12 });

      // reset hand timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => startHandAnimation(), 3500);
    };

    const startHandAnimation = () => {
      if (isAnimating) return;
      if (!buttonRef.current) return;
      setIsAnimating(true);
      mouseLocked.current = true;
      setShowHand(true);

      // Use the actual cursor position (not visual position with offset)
      const startX = realMousePos.current.x;
      const startY = realMousePos.current.y;


      const buttonRect = buttonRef.current.getBoundingClientRect();
      const targetX = buttonRect.left + buttonRect.width / 2;
      const targetY = buttonRect.top + buttonRect.height / 2;

      gsap.set(handRef.current, {
        x: startX - 25,
        y: startY - 50,
        opacity: 0,
        rotation: 0,
      });

      const tl = gsap.timeline({
      onComplete: () => {
  // Unlock the mouse
  setIsAnimating(false);
  mouseLocked.current = false;
  
  // Reset offset
  offset.current = { x: 0, y: 0 };
  
  // Reset hand position offscreen or hidden
  gsap.set(handRef.current, { opacity: 0 });

  document.body.style.cursor = 'auto';

  router.push("/test");
}
      });

      tl.to(handRef.current, { opacity: 1, duration: 0.4 })
        .to(handRef.current, { y: startY - 30, duration: 0.8 })
        .set(handRef.current.querySelector(".hand-emoji"), { innerHTML: "✊" })
        .to(
          [handRef.current, cursorRef.current],
          {
            x: targetX - 25,
            y: targetY - 30,
            duration: 1.8,
            ease: "power2.inOut",
          },
          "move"
        )
        .to(cursorRef.current, {
          x: targetX - 12,
          y: targetY - 12,
          duration: 1.8,
          ease: "power2.inOut",
        })
        .set(handRef.current.querySelector(".hand-emoji"), { innerHTML: "✋" })
        .to(handRef.current, { rotation: 0, y: targetY - 50, duration: 0.5 });
    };

    const initializeAnimations = () => {
      const hand = handRef.current;
      const cursor = cursorRef.current;
      const button = buttonRef.current;
      if (!hand || !cursor || !button) return;

      document.addEventListener("mousemove", handleMouseMove);

      // Start initial timeout in case user doesn't move mouse
      timeoutRef.current = setTimeout(() => startHandAnimation(), 3500);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    };

    initializeAnimations();
  }, [router, logoAnimationDone]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setLogoAnimationDone(true); 
        },
      });

      tl.fromTo(".logo-img", {
        opacity:0,
        scale:1.5,
      } ,{
        opacity:1,
        delay:1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      })
        .to(".logo-img", {
          x: "-10vw",
          duration: 1,
          ease: "power2.inOut",
        })
        .fromTo(".logo-text", {
          opacity: 0,
          delay:1.5,
          duration:1,

        } , {
          opacity:1,
          duration: 1,
          ease: "power2.out",
        })
        .fromTo('.logo-container', {
          opacity:1,
          scale:1,
        }, {
          opacity:0,
          delay:1,
          scale:0.8,
          duration:0.9,
          ease:'power3.out'
        })
        .fromTo('.absolute-container', {
          opacity:0,
          scale:0.9,
        } , {
          scale:1,
          opacity:1,
          duration:0.9,
          scale:1,
          ease:'power3.out'
        })

        .to('.help-button', {
          opacity:1,
          ease:'power2.out',
          duration:0.3,
        })
        .to(".help-text", {
            opacity: 1,
            delay:2,
            duration: 0.8,
            ease: "power2.out"
          });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative h-screen bg-[#FF6B00] p-[2vw] overflow-hidden"
    >
      <div className='bg-[#FF6B00] h-full w-full border-3 border-white overflow-hidden rounded-[2vw]'>

        {/* Custom cursor */}
        <div
          ref={cursorRef}
          className="fixed w-[2.2vw] h-[2.2vw] pointer-events-none z-50"
          style={{ left: 0, top: 0 }}
        >
          <div className="w-full h-full bg-gray-200 rounded-full shadow-lg opacity-90 transform rotate-12"></div>
        </div>

        {/* Animated hand */}
        <div
          ref={handRef}
          className="fixed w-[3vw] h-[3vw] pointer-events-none z-40 opacity-0"
          style={{ left: 0, top: 0 }}
        >
          <div className="hand-emoji text-[3vw] transform -rotate-12">✋</div>
        </div>

        <div className='relative flex h-full justify-center items-center'>
          <div className='flex  w-[45vw] logo-container relative  origin-center'>

            <video 
              src="/assets/what.mp4" 
              width={200} 
              height={200} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="logo-img opacity-0 translate-x-[12vw] w-[20vw]"
            />

            <p className='text-white font-bold logo-text translate-x-[-9.5vw] w-[25vw] font-mono  tracking-wider text-[17vw] opacity-0 text-nowrap'>OOPS!</p>
            
          </div>
        
          <div className='flex flex-col justify-start items-start absolute absolute-container top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[33vw] scale-0 origin-[40%]'>
               <p className='text-white font-bold logo-text w-[25vw] font-mono  h-[21vw] tracking-wider text-[17vw] opacity-0'>404</p>
               <p className='text-white tracking-wider opacity-0 pt-[1vw] text-[1.2vw] font-medium help-text   text-center leading-[1]'>Help you can't escape, think of us as tech support with attachment issues</p>
          </div>

          <div className='absolute top-25 left-1/2 -translate-x-1/2'>
              
          </div>

        </div>

        {/* Button */}
        <button
          ref={buttonRef}
          className="fixed bottom-[12vh] opacity-0 help-button left-1/2 -translate-x-1/2 px-[2vw] py-[1.2vh] bg-white hover:bg-neutral-300 text-black font-semibold rounded-[1vw] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 z-20 text-[1.2vw]"
        >
          HELP ME OUT
        </button>
      </div>
    </div>
  );
};

export default CreativePage;