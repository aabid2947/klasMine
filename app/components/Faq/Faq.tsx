"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is KLASS ART?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    question: "What is KLASS ART?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    question: "What is KLASS ART?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    question: "What is KLASS ART?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    question: "What is KLASS ART?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    question: "What is KLASS ART?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];

export const Faq = () => {
const [openIndex, setOpenIndex] = useState<number | null>(null);

const toggleFAQ = (index: number) => {
  setOpenIndex(openIndex === index ? null : index);
};

  return (
    <section className="px-6 p-4 pt-[60px] pb-[60px] sm:pt-[90px] sm:pb-[90px] md:pt-[120px] md:pb-[120px] bg-gradient-to-b from-blue-50 to-purple-100 px-6  bg-gradient-to-b from-blue-50 to-purple-100 px-6 ">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col">
          <p className="text-2xl font-[500] text-[#5555FF] font-inter">
            ASK QUESTION
          </p>
          <h2 className="font-dmSans font-semibold text-[28px] sm:text-[36px] md:text-[48px] lg:text-[66px] font-[500]  mb-10">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="  mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="w-full cursor-pointer">
              {/* Question */}
              <button
                className="flex justify-between items-center w-full text-left text-[18px] cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="text-sm font-[400] font-dmSans">
                  {faq.question}
                </div>
                <div>{openIndex === index ? <Minus /> : <Plus />}</div>
              </button>

              {/* Answer (Collapsible) */}
              <div
                className={`text-[14px] w-full transition-all overflow-hidden cursor-pointer ${
                  openIndex === index ? "max-h-40 mt-2" : "max-h-0"
                }`}
              >
                <p className="text-[#888888] text-sm">{faq.answer}</p>
              </div>
              <div className="h-[1px] bg-[#DFDFDF] w-full mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};