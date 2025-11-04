"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import AuthModal from "../AuthModal";

const images = [
  "/assets/images/bg01.jpg",
  "/assets/images/bg02.jpg",
  "/assets/images/bg03.jpg",
];

export const HeroBanner = () => {
  const [index, setIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [formType, setFormType] = useState<"login" | "signup" | "forgot">("login");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(interval);
  }, []);

  const handleGenerateNowClick = () => {
    if (user) {
      // User is logged in, navigate to TextToImage page
      router.push("/service/TextToImage");
    } else {
      // User is not logged in, open login modal
      setFormType("login");
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Stack all images and animate their opacity */}
      {images.map((src, i) => (
        <motion.img
          key={i}
          src={src}
          alt={`Slide ${i}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ zIndex: i === index ? 1 : 0 }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-5 px-6 md:px-16 lg:px-40 text-center h-full items-center justify-center">
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-dmSans text-lg sm:text-xl md:text-[38px] text-white leading-tight drop-shadow-lg"
        >
          Instantly Transform Ideas into Stunning
        </motion.p>

        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-dmSans text-2xl sm:text-4xl md:text-[66px] text-white font-black drop-shadow-lg"
        >
          AI-Generated Images
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-dmSans sm:text-md text-white max-w-[90%] md:max-w-[75%] drop-shadow-md"
        >
          Effortlessly generate images from text, enhance existing ones, and
          extract hidden text with AI <br /> – innovative, efficient, and
          creative solutions for all!
        </motion.p>

        <motion.button
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={handleGenerateNowClick}
          className="mt-4 relative overflow-hidden cursor-pointer flex items-center text-center gap-3 text-[#1A1A1A] px-6 py-4 rounded-2xl bg-white transition-all duration-500 ease-in-out
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#1A1A1A] before:to-[#333] before:w-0 before:h-full before:transition-all before:duration-500 before:ease-in-out before:rounded-2xl
            hover:before:w-full hover:text-white"
        >
          <span className="relative z-10">Generate Now</span>
          <ArrowUpRight className="relative z-10" strokeWidth={1} />
        </motion.button>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal 
          formType={formType}
          setFormType={setFormType}
          onClose={() => setIsAuthModalOpen(false)} 
        />
      )}
    </div>
  );
};
