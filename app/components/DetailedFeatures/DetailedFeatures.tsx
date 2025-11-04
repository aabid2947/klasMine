"use client";
import React from "react";
import { SingleFeature } from "../SingleFeature/SingleFeature";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
export const DetailedFeatures = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Ensures it animates only once when in view
    threshold: 0.2, // 20% of the element must be visible before triggering
  });
  return (
    <section className="pt-[60px] pb-[60px] sm:pt-[90px] sm:pb-[90px] md:pt-[120px] md:pb-[120px] bg-[url('/assets/images/section-bg02.jpg')] bg-no-repeat bg-cover bg-center">
      <div
        ref={ref}
        className="container mx-auto px-4 py-4"
      >
        <div className="">
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }} // Start small and transparent
            animate={inView ? { opacity: 1, scale: 1 } : {}} // Scale up when in view
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth transition
            className="text-center font-openSans text-[28px] sm:text-[36px] md:text-[48px] lg:text-[66px] font-bold pt-6 pb-20"
          >
            Products that can be printed on (Klass art)
          </motion.p>
          <div>
            {[
              {
                title: { first: "Give prompt and", second: "make it perfect" },
                desc: "Enter a text prompt and let AI transform your imagination into stunning visuals. Experience effortless creativity as AI generates breathtaking images, bringing your ideas to life with precision and artistic brilliance.",
                img: "/assets/images/product01.png",
              },
              {
                title: { first: "Generate your", second: "image" },
                desc: "Upload an image, and let AI create unique, visually stunning variations with intelligent enhancements. Experience effortless creativity as AI reimagines your visuals with artistic precision and innovative transformations.",
                img: "/assets/images/product02.png",
                button: "Enhance Image",
              },
              {
                title: { first: "Get it printed or sell on", second: "Marketplace" },
                desc: "Upload an image, and let our AI precisely extract and convert text into an editable digital format, ensuring accuracy, efficiency, and seamless accessibility for your documents and content.",
                img: "/assets/images/product03.png",
                button: "Extract Text",
              },
            ].map((item, index) => {
              return (
                <SingleFeature
                  key={index}
                  reverse={index % 2 === 1}
                  img={item.img}
                  title={item.title}
                  desc={item.desc}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};