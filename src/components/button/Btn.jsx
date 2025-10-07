"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Button = ({ bgColor, title, href, textColor }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-fit px-[1.5vw] cursor-pointer rounded-full flex gap-[0.5vw] font-display justify-center items-center py-[0.8vw] ${bgColor}`}
    >
      <svg
        className={`w-[0.6vw] h-[0.6vw]  ${textColor}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <circle cx="50" cy="50" r="40" />
      </svg>

      <p className={`text-[1.1vw] font-medium tracking-wider ${textColor}`}>{title}</p>
    </button>
  );
};

export default Button;
