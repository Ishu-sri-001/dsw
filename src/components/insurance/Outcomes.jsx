import React from "react";
import Image from "next/image";

const Card = ({ src, content }) => {
  return (
    <div className="flex flex-col gap-[1vw] w-[16vw] min-h-[20vh]">
      <div className="w-[5.5vw] h-[5.5vw]">
        <Image
          src={src}
          alt="card-icon"
          width={60}
          height={60}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="text-offwhite text-12 font-display">{content}</p>
      <div className="w-full h-[1px] bg-foreground/30 mt-auto" />
    </div>
  );
};

const cardsData = [
  {
    src: "/assets/svg/AI.svg",
    content: "Unified GenAI and AI Studios for faster development",
  },
  {
    src: "/assets/svg/verified.svg",
    content: "ISO 42001, ISO 27001, SOC 2, HIPAA certified and GDPR compliant",
  },
  {
    src: "/assets/svg/alert.svg",
    content: "Real-time dashboards and alerts for continuous oversight",
  },
  {
    src: "/assets/svg/deploy.svg",
    content: "Cloud or on-prem deployment with no vendor lock-in",
  },
  {
    src: "/assets/svg/cost.svg",
    content: "Predictable scaling with lower cost per use case",
  },
];

const Outcomes = () => {
  return (
    <div className="w-screen h-fit containerr space-y-[1vw]">
      <h2 className="flex flex-col small-heading">
        <span>One Platform. </span>
        <span>AI and GenAI Working Together.</span>
      </h2>

      <p className="w-[40%] content ">
        One secure platform. Many powerful outcomes.
        <br />
        Whether you're deploying fraud models or launching a GenAI assistant for
        claims, insurAInce brings everything into one secure platform that
        scales with your business. 
      </p>

      <div className="flex justify-end w-full pt-[3vw]">
        <div className="w-[65%]">
          <div className="grid grid-cols-3 gap-y-[4vw] gap-x-[2vw] w-full">
            {cardsData.map((card, index) => (
              <Card key={index} src={card.src} content={card.content} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outcomes;
