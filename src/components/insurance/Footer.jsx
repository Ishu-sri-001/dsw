import Image from "next/image";
import React from "react";
import Link from "next/link";

const navLinks = [
  {
    name: "NAVIGATION",
    link: "/",
  },
  {
    name: "Product",
    link: "/",
  },
  {
    name: "Solutions",
    link: "/",
  },
  {
    name: "About Us",
    link: "/",
  },
  {
    name: "Resources",
    link: "/",
  },
  {
    name: "Pilot Program",
    link: "/",
  },
  {
    name: "Contact",
    link: "/",
  },
];

const socials = ['/assets/svg/fb.svg','/assets/svg/linkedin.svg','/assets/svg/twitter.svg','/assets/svg/ig.svg']

const Footer = () => {
  return (
    <div className="pt-[6vw] pb-[2vw] px-[4vw] ">
      <div className="h-[70vh] px-[2vw] py-[4vw] w-full bg-white/10 bckdrop-blur-[2vw] rounded-[2vw] flex">
        <div className="w-[50%] flex flex-col justify-between">
          <div className="h-[9vw] w-fit">
            <Image
                alt='logo'
              src="/assets/svg/unify-logo.svg"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-12 font-display pb-[1vw]">CONTACT US</p>
            <p className="text-12 font-display ">+91 96640 56847</p>
            <p className="text-12 font-display">+353 894015233</p>
            <p className="text-12 font-display">
              contact@datasciencewizards.ai
            </p>
          </div>
        </div>

        <div className="w-[50%] flex justify-between p-[2vw]">
          <div className="flex flex-col gap-[1vw]">
            {navLinks.map((nav, index) => (
              <div key={index}>
                <Link
                  key={index}
                  href={nav.link}
                  className="text-white text-12"
                >
                  {nav.name}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="w-[20vw] text-12">
                Subscribe to our newsletter for the latest tech insights and
                updates.
              </p>

              <form className="py-[1vw] flex border-b border-offwhite">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full "
                />
                <div className="flex gap-[0.5vw] items-center">

                <p>SUBSRIBE</p>
                <p className="w-[1vw] h-[1vw]"><svg className="w-[1vw] h-[1vw]" width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.0583 8.71874L11.6285 15.2161C11.4945 15.3516 11.3126 15.4277 11.1231 15.4277C10.9335 15.4277 10.7517 15.3516 10.6176 15.2161C10.4835 15.0806 10.4082 14.8969 10.4082 14.7053C10.4082 14.5138 10.4835 14.33 10.6176 14.1946L15.8284 8.92991H1.83552C1.64604 8.92991 1.46433 8.85385 1.33034 8.71846C1.19636 8.58307 1.12109 8.39944 1.12109 8.20798C1.12109 8.01651 1.19636 7.83288 1.33034 7.6975C1.46433 7.56211 1.64604 7.48605 1.83552 7.48605L15.8284 7.48605L10.6176 2.22138C10.4835 2.08591 10.4082 1.90219 10.4082 1.71061C10.4082 1.51904 10.4835 1.33531 10.6176 1.19985C10.7517 1.06438 10.9335 0.988281 11.1231 0.988281C11.3126 0.988281 11.4945 1.06438 11.6285 1.19985L18.0583 7.69721C18.1248 7.76426 18.1775 7.84388 18.2134 7.93152C18.2494 8.01916 18.2679 8.1131 18.2679 8.20798C18.2679 8.30285 18.2494 8.39679 18.2134 8.48443C18.1775 8.57207 18.1248 8.65169 18.0583 8.71874Z" fill="white" stroke="white" strokeWidth="0.3"/>
</svg>
</p>
                </div>

              </form>
            </div>

            <div className="flex gap-[1vw] ">
                {socials.map((item,index) => (
                    <div key={index} className="cursor-pointer">
                        <Image src={item} width={200} height={200} className="h-[3vw] w-fit" />
                    </div>
                ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
