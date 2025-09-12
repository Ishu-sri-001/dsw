// "use client";

import React from "react";
import Bg from "@/components/shader-bg/bg";
import Image from "next/image";
import Button from "../button";

const Hero = () => {
  return (
    <section className="w-screen h-screen relative overflow-hidden">
      {/* Shader Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <Bg />
      </div>

      {/* Hero Content */}
     <div className='w-screen relative  h-screen flex justify-center items-center '>
        <div className='flex flex-col items-center gap-[1vw] px-[8vw]'>

            <h1 className='font-normal'>Enterprise AI Platform for Insurance</h1>
            <Image src='/assets/Insur/insur-logo.png' width={500} height={500} alt='insur-logo' className='h-[2.5vw] w-fit' />

            <p className='text-center text-offwhite text-[1.3vw] leading-[1.3] pt-[1vw] px-[2vw]'>
                Purpose-Built, Proven, and Production-Ready . InsurAInce is the enterprise AI platform designed for insurers to build GenAI agents in hours, deploy AI use cases in days, and scale confidently with compliance, speed, and accuracy – all through your policy lifecycle. 
            </p>
            <div className='flex gap-[1vw] pt-[1.5vw]'>
                 <Button bgColor='bg-gradient-to-r from-[#F16B0D] to-[#E61216]' title='Explore the Platform' href='/' textColor='text-white' />
                <Button bgColor='bg-white' title='Book a Demo' href='/' textColor='text-black' />
               
            </div>
        </div>
    </div>
    </section>
  );
};

export default Hero;
