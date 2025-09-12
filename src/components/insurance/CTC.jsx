import Image from 'next/image'
import React from 'react'
import Button from '../button'

const CTC = () => {
  return (
    <section className=' h-fit bg-primary containerr flex justify-start  items-start'>

        <div className='flex flex-col w-[55%] gap-[1.5vw] pr-[2vw] '>
            <h2 className='text-[#F1F1F1] w-[100%] subtitle  leading-[1] font-light'>
                Ready to Launch GenAI in 4 Hours? AI/ML Use Cases in 30 Days? 
            </h2>
            <div className='pt-[1vw]'>


            <p className='content tracking-wider leading-[1.5]'>
                Let’s transform your insurance business with real AI. From claims to fraud to underwriting, insurAInce helps you deploy AI with speed, security, and impact. 
            </p>
            </div>
             <div className='flex gap-[1vw] pt-[1.5vw]'>
                 <Button bgColor='bg-gradient-to-r from-[#F16B0D] to-[#E61216]' title='Book a Demo' href='/' textColor='text-white' />
                <Button bgColor='bg-white' title='Schedule a Call' href='/' textColor='text-black' />
               
            </div>
        </div>

        <div className='w-[40%] h-full  relative'>
            <div className='relative z-0 '>
                <div className='h-full w-[45vw] pr-[2vw]'>

                <Image src='/assets/svg/conc-rings.svg' alt='ring' width={500} height={500} className='h-full w-full object-cover p-[0.5vw]' />
                </div>

            </div>
            <div className='flex flex-col ml-[6vw] mt-[3vw] gap-[1.5vw] px-[4vw] w-[90%] absolute inset-0 z-2'>

            <div className='w-[18vw] h-fit self-start'>
                <Image src='/assets/Insur/about-img-1.png' height={500} width={500} className='h-full w-full object-cover rounded-[1vw] border border-neutral-600' alt='about-img' />
            </div>

             <div className='w-[16.5vw] h-fit self-end'>
                <Image src='/assets/Insur/about-img-1.png' height={500} width={500} className='h-full w-full object-cover rounded-[1vw] border border-neutral-600' alt='about-img' />
            </div>
            </div>

        </div>
        
    </section>
  )
}


export default CTC;
