"use client";
import React, { useRef, useState } from "react";

export default function FAQs() {
  const [openAccordion, setOpenAccordion] = useState(null);

  const faqData = [
    {
      question: "What is UnifyAI?",
      answer:
        "UnifyAI is an enterprise AI platform that enables businesses to develop, deploy, and manage AI models seamlessly. It supports real-time serving, Generative AI, and large language models (LLMs), while ensuring security, compliance, and scalability.",
    },
    {
      question: "Who can use UnifyAI?",
      answer:
        "Organizations of all sizes looking to implement and manage AI solutions in a secure, compliant environment. This includes enterprises, tech companies, and businesses across various industries.",
    },
    {
      question: "How does UnifyAI integrate with existing systems?",
      answer:
        "UnifyAI offers seamless integration capabilities with your existing infrastructure through APIs, connectors, and custom integration options, minimizing disruption to your current workflows.",
    },
    {
      question: "Is UnifyAI secure?",
      answer:
        "Yes, UnifyAI is built with enterprise-grade security features including data encryption, access controls, audit logging, and compliance with industry standards to protect your sensitive information and AI assets.",
    },
    {
      question: "What types of AI models does UnifyAI support?",
      answer:
        "UnifyAI supports a wide range of AI models including traditional machine learning models, deep learning frameworks, large language models (LLMs), and various generative AI applications.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="containerr h-fit">
      <div className="w-[90%] mx-auto">
        <h2 className="subtitle mb-[4vw] text-center">
          Frequently Asked Questions
        </h2>

        <div className="flex  flex-col">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border-b border-white/10 mx-auto py-[2vw]"
            >
              {/* Accordion Header */}
              <div
                className="flex px-[2vw] justify-between py-[1vw] items-center cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <p className="text-contain text-[1.3vw] font-medium">
                  {faq.question}
                </p>

                <div
                  className={`rounded-full cursor-pointer h-[4vw] w-[4vw] p-[0.5vw] flex items-center justify-center border-white/10
                    ${openAccordion === index
                      ? "bg-gradient-to-r from-[#F16B0D] to-[#E61216]"
                      : "border bg-white/5"
                    }`}
                >
                  {openAccordion === index ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5vw"
                      height="1.5vw"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <rect x="4" y="11" width="18" height="2" rx="1" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5vw"
                      height="1.5vw"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Accordion Content */}
              <div
                className={`grid px-[2vw] transition-all duration-500 ease-in-out
                  ${openAccordion === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <p className="content w-[80%] opacity-90 py-[1vw]">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
