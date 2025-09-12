import Image from 'next/image'
import React from 'react'

export const About = () => {
  return (
    <section className=' h-fit bg-primary containerr flex justify-start  items-start'>
        <div className='w-[40%] h-full ml-[6vw] '>
            <div className='flex flex-col gap-[1.5vw] px-[4vw] w-[90%] '>

            <div className='w-[18vw] h-fit self-start'>
                <Image src='/assets/Insur/about-img-1.png' height={500} width={500} className='h-full w-full object-cover rounded-[1vw] border border-neutral-600' alt='about-img' />
            </div>

             <div className='w-[16.5vw] h-fit self-end'>
                <Image src='/assets/Insur/about-img-1.png' height={500} width={500} className='h-full w-full object-cover rounded-[1vw] border border-neutral-600' alt='about-img' />
            </div>
            </div>

        </div>
        <div className='flex flex-col w-[55%] gap-[1.5vw] pr-[2vw] pt-[3vw] '>
            <h2 className='text-[#F1F1F1] w-[100%] text-30  leading-[1] font-light'>
                One Platform. Built with Insurance DNA. Unified AI and GenAI.
            </h2>
            <div className='pt-[1vw]'>

            <p className='content tracking-wider leading-[1.5]'>
                The pressure to modernize is high, but most insurers still struggle to move from pilot projects to production-ready AI. Long development cycles, fragmented tools, and rising compliance risks make AI adoption complex, expensive, and slow. 

            </p>

            <p className='content tracking-wider leading-[1.5]'>
                insurAInce solves this. Built from the ground up for insurance, it lets you deploy real-world AI and GenAI use cases faster, securely, and at scale. All on a unified platform. No more fragmented AI, just fast and real outcomes.  
            </p>
            </div>
        </div>
    </section>
  )
}
