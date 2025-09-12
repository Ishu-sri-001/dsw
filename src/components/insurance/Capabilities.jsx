import React from "react";
import Image from "next/image";

const capabilities = [
  {
    id: "01",
    src: "/assets/capabilities/cap1.svg",
    text: "Automate servicing, documentation, and communications with human-like agents",
  },
  {
    id: "02",
    src: "/assets/capabilities/cap2.svg",
    text: "Use Retrieval-Augmented Generation (RAG), MCP and A2A protocols for smart, secure responses",
  },
  {
    id: "03",
    src: "/assets/capabilities/cap3.svg",
    text: "Configure memory, tone, and rules for each agent",
  },
  {
    id: "04",
    src: "/assets/capabilities/cap4.svg",
    text: "Deploy in hours with built-in monitoring and compliance guardrails",
  },
];

const Capabilities = () => {
  return (
    <div className="w-screen h-fit containerr bg-primary ">
      <h2 className=" subtitle text-left ">
        Turn Common Insurance Tasks into Intelligent Agents 
      </h2>

      <div className="flex justify-between pt-[4vw]">
        <div className="w-[45%]">
          <p className="text-white text-[2.6vw] leading-[1.35] font-display">
            These aren’t chatbots. They’re intelligent teammates for your
            operations. 
          </p>
        </div>

        <div className="w-[50%] pt-[0.5vw]">
          <p className="content">
            From claim status queries to automated underwriting support,
            insurAInce gives you over 300 prebuilt GenAI agents that are
            designed for real insurance workflows. 
          </p>
          <p className="text-offwhite text-[1.3vw] font-display">
            Key Capabilities: 
          </p>

          <div>
            <div className="flex flex-col gap-[2.7vw] pt-[4vw]">
              {capabilities.map((cap) => (
                <div
                  key={cap.id}
                  className="flex items-start justify-start gap-[4vw] border-t border-white/10 pt-[2vw] "
                >
                  <p className="text-white text-[1vw] tracking-wider w-[2vw] font-display">
                    {cap.id}
                  </p>

                  <div className="w-[5.5vw] h-[5.5vw]">
                    <Image
                      src={cap.src}
                      alt={`capibility-${cap.id}`}
                      width={40}
                      height={40}
                      className="object-contain h-full w-full"
                    />
                  </div>

                  <p className="text-white/80 text-[1.25vw] leading-relaxed max-w-[28vw]">
                    {cap.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Capabilities;
