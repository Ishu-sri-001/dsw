'use client'
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

const ExpandablePanels = () => {
  const [activePanel, setActivePanel] = useState(2); 
  const panelsRef = useRef([]);
  const contentRef = useRef([]);

  const panelsData = [
    {
      title: "Mr. Ritesh Rathod",
      name: "Mr. Ritesh Rathod",
      position: "Senior Data Analyst",
      company: "Tech Solutions",
      description: "Expert in data visualization and business intelligence with extensive experience in transforming complex datasets into actionable insights.",
      logo: "/assets/svg/customer-logo-1.svg"
    },
    {
      title: "Mr. Stefano Bonfa",
      name: "Mr. Stefano Bonfa",
      position: "Lead Data Engineer", 
      company: "Data Corp",
      description: "Specialized in building robust data pipelines and implementing machine learning solutions for enterprise-level applications.",
      logo: "/assets/svg/customer-logo-1.svg"
    },
    {
      title: "Mr. Neeraj Kulkarni",
      name: "Mr. Neeraj Kulkarni",
      position: "President / Chief Data Scientist",
      company: "CIEK Solutions",
      description: "Great expertise and analytical diligence by DSW UnifyAI in developing an end-to-end data pipeline - making analytical insights available in the form of interactive, advanced dashboards",
      logo: "/assets/svg/customer-logo-1.svg"
    },
    {
      title: "Mr. Ritesh Tiwari",
      name: "Mr. Ritesh Tiwari",
      position: "AI Solutions Architect",
      company: "AI Innovations",
      description: "Pioneer in artificial intelligence and machine learning implementations, focusing on scalable AI solutions for modern businesses.",
      logo: "/assets/svg/customer-logo-1.svg"
    }
  ];

  useEffect(() => {
    panelsRef.current.forEach((panel, index) => {
      if (index === activePanel) {
        gsap.set(contentRef.current[index], { opacity: 1, x: 0 });
      } else {
        gsap.set(contentRef.current[index], { opacity: 0, x: -100 });
      }
    });
  }, []);

  const handlePanelHover = (index) => {

    if (index === activePanel) return;

    // Animate out current active content
    gsap.to(contentRef.current[activePanel], {
      opacity: 0,
      x: -100,
      duration: 1,
      ease: "power2.inOut"
    });

    // Animate in new active content
    gsap.to(contentRef.current[index], {
      opacity: 1,
      x: 0,
      duration: 0.5,
      delay: 0.5,
      ease: "power2.out"
    });
    setActivePanel(index);
  };

  return (
    <div className="containerr h-fit bg-[radial-gradient(ellipse_45%_45%,_#081B57,_#01030F)]">
         <h2 className='small-heading text-center pb-[5vw]'>
            Real Customer Quotes
        </h2>
        <div className='flex items-center justify-center'>

     
      <div className="flex w-full h-[80vh] px-[4vw] overflow-hidden ">
        {panelsData.map((panel, index) => (
          <div
            key={index}
            ref={el => panelsRef.current[index] = el}
            className={`relative cursor-pointer transition-all duration-1000 ease-out border-r border-white/10  overflow-hidden group ${
              activePanel === index 
                ? 'flex-[3] ' 
                : 'flex-1'
            } ${(index === 0) ? 'border-l ' : ''}`}
            onMouseEnter={() => handlePanelHover(index)}
          >
            
            {/* Vertical title for inactive panels */}
            <div className={`absolute inset-0 flex flex-col py-[1vw] items-center justify-between  transition-opacity duration-500 ${
              activePanel === index ? 'opacity-0 pointer-events-none' : 'opacity-90'
            }`}>
                <Image src='/assets/svg/plus.svg' width={200} height={200} className='w-[2vw] h-[2vw]' alt='plus-icon' />
              <h3 className="text-white text-[2vw] pl-[15vw] transform -rotate-90 whitespace-nowrap">
                {panel.title}
              </h3>
            </div>

            {/* Content for active panel */}
            <div
              ref={el => contentRef.current[index] = el}
              className={`absolute inset-0 flex flex-col justify-center items-start px-[2vw] text-center text-white ${
                activePanel === index ? 'block' : 'hidden'
              }`}
            >
              <div className="flex flex-col gap-[10vw] justify-center items-start">
                 <p className="text-12 leading-relaxed text-start text-white/90  w-[38vw]">
                  {panel.description}
                </p>
                <div>
                <h2 className="text-[2vw] text-start text-[#F16B0D]  leading-tight">
                  {panel.name}
                </h2>
                <p className="text-[1.2vw] text-start text-white/90 ">
                  {panel.position}
                </p>
                <p className="text-base text-start text-white/80 ">
                  {panel.company}
                </p>
               
                </div>
              </div>
              
              {/* Company logo placeholder */}
              <div className="py-[2vw] items-start">
               <Image src={panel.logo} height={200} width={200} alt='company-logo' className='h-[3vw] w-fit' />
              </div>
            </div>
          </div>
        ))}
      </div>
         </div>
    </div>
  );
};

export default ExpandablePanels;