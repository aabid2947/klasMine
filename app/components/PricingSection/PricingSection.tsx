"use client";
import React from "react";
import { motion } from "framer-motion";

export const PricingSection = () => {
  return (
    <section className="pt-[60px] pb-[60px] sm:pt-[90px] sm:pb-[90px] md:pt-[120px] md:pb-[120px] bg-gradient-to-b from-blue-50 to-purple-100 px-6 ">
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.28 }} // Moves in from left or right based on `reverse`
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          <h3 className="font-openSans text-[18px] font-semibold text-blue-600 tracking-wide">
            PRICING PLANS
          </h3>
          <h2 className="font-openSans  text-3xl sm:text-4xl md:text-[66px] font-bold text-[#333333] mt-2">
            Experience AI Without Limits
          </h2>
          <p className="font-openSans   text-[16px] font-[400] text-[#6F6C90] mt-3 max-w-2xl mx-auto">
            Go beyond basic AI tools with our Pro and Premium plans for
            high-quality <br /> image generation and customization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto relative mt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.28 }} // Moves in from left or right based on `reverse`
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white shadow-lg rounded-3xl p-8 py-12"
          >
            <div className="flex gap-2">
              <img className="w-16 h-16" src="/assets/images/icon/pricing-icon01.svg" />
              <div className="">
                <p className="text-[#6F6C90] font-openSans text-[18px] font-[400]">
                  Free Plan
                </p>
                <p className="font-openSans text-2xl font-bold text-gray-900 ">
                  Basic Access
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-sm my-6 font-openSans leading-[26px]">
              Best for casual users who want to try AI-generated images with
              basic features.
            </p>
            <p className="font-openSans text-6xl font-black text-[#5555FF] mt-4">
              <span>
                <span className="font-dmSans">₹</span> 0.00{" "}
                <span className="text-sm text-gray-500 font-light">
                  /monthly
                </span>
              </span>
            </p>
            <p className="text-black font-bold font-openSans">
              What’s included
            </p>
            <ul className="mt-4 text-left text-gray-600 space-y-2 font-openSans">
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img alt="Check" src="/assets/images/icon/Check.png" /></span>{" "}
                Limited AI image generations
              </li>
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img alt="Check" src="/assets/images/icon/Check.png" /></span>{" "}
                Watermarked images
              </li>
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img alt="Check" src="/assets/images/icon/Check.png" /></span>{" "}
                Basic resolution output
              </li>
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img alt="Check" src="/assets/images/icon/Check.png" /></span>{" "}
                Limited text extraction
              </li>
            </ul>
            <div className="text-center">
              <button className="font-openSans rounded-2xl cursor-pointer mt-6 w-[80%] bg-[linear-gradient(-120deg,_#5555FF,_#C289FF)] hover:bg-[linear-gradient(-90deg,_#C289FF,_#5555FF)] transition-all duration-300 text-white py-4 rounded-lg">
                Start for Free
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.28 }} // Moves in from left or right based on `reverse`
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="md:transform md:-translate-y-12 bg-[linear-gradient(-120deg,_#5555FF,_#C289FF)] hover:bg-[linear-gradient(-90deg,_#C289FF,_#5555FF)] text-white shadow-lg rounded-3xl p-8 py-12"
          >
            <div className="flex gap-2  relative">
              <img className="w-16 h-16" src="/assets/images/icon/pricing-icon02.svg" />
              <div className="">
                <p className="text-white">Pro Plan</p>
                <p className="font-openSans text-2xl font-bold text-white ">
                  Best for Creators
                </p>
              </div>
              <div className="absolute px-8 py-2 bg-white/20 right-0 -top-5 rounded-lg">
                Popular
              </div>
            </div>
            <p className="text-gray-200 text-sm my-6 leading-[26px]">
              Content creators, designers, and users who need more flexibility.
            </p>
            <p className="text-6xl font-black text-gray-20 mt-4">
              <span>
                <span className="font-dmSans">₹</span> 499{" "}
                <span className="text-sm text-white font-light">/monthly</span>
              </span>
            </p>
            <p className="text-white font-bold font-openSans">
              What’s included
            </p>
            <ul className="font-openSans mt-4 text-left text-white space-y-2">
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img src="/assets/images/icon/blue-Check.png" alt="Check" /></span>{" "}
                Unlimited AI image generations
              </li>
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img src="/assets/images/icon/blue-Check.png" alt="Check" /></span>{" "}
                High-resolution images
              </li>
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img src="/assets/images/icon/blue-Check.png" alt="Check" /></span>{" "}
                No watermark on generated images
              </li>
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img src="/assets/images/icon/blue-Check.png" alt="Check" /></span>
                Access to multiple styles
              </li>
            </ul>
            <div className="text-center">
              <button className="font-openSans rounded-2xl mt-6 w-[80%] bg-white   text-purple-900 py-4 rounded-lg hover:shadow-2xl cursor-pointer">
                Get started
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.28 }} // Moves in from left or right based on `reverse`
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white shadow-lg rounded-3xl p-8 py-12"
          >
            <div className="flex gap-2">
              <img className="w-16 h-16" src="/assets/images/icon/pricing-icon03.svg" />
              <div className="">
                <p className="text-[#6F6C90] font-openSans">Premium Plan</p>
                <p className="font-openSans text-2xl font-bold text-gray-900 ">
                  For Professionals
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-sm my-6 font-openSans leading-[26px]">
              Best for: Businesses, agencies, and professionals who need AI
              without limits.
            </p>
            <p className="text-6xl font-black text-[#5555FF] mt-4">
              <span>
                <span className="font-dmSans">₹</span> 999{" "}
                <span className="text-sm text-gray-500 font-light">
                  /monthly
                </span>
              </span>{" "}
            </p>
            <p className="text-black font-bold font-openSans">
              What’s included
            </p>
            <ul className="mt-4 text-left text-gray-600 space-y-2 font-openSans">
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img alt="Check" src="/assets/images/icon/Check.png" /></span>{" "}
                Unlimited AI image generations
              </li>
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img alt="Check" src="/assets/images/icon/Check.png" /></span>{" "}
                Ultra HD & 4K resolution outputs
              </li>
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img alt="Check" src="/assets/images/icon/Check.png" /></span>{" "}
                No limits – full commercial rights.
              </li>
              <li className="flex items-center text-sm my-3">
                <span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[32px] h-[32px] rounded-full p-2 mr-2"><img alt="Check" src="/assets/images/icon/Check.png" /></span>{" "}
                Enhanced product placement.
              </li>
            </ul>
            <div className="text-center">
              <button className="font-openSans rounded-2xl cursor-pointer mt-6 w-[80%] bg-[linear-gradient(-120deg,_#5555FF,_#C289FF)] hover:bg-[linear-gradient(-90deg,_#C289FF,_#5555FF)] transition-all duration-300 text-white py-4 ">
                Start for Free
              </button>
            </div>
          </motion.div>
        </div>
      </>
    </section>
  );
};