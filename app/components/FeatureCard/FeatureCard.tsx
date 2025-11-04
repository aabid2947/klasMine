import React from "react";

interface FeatureCardProps {
  image: string;
  title: string;
  des: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ image, title, des }) => {
  return (
    <div className="">
      <img src={image} alt={title} className="w-full object-cover" />

      {/* Text Content */}
      <div className="mt-4 px-9 pt-4 pb-4 flex flex-col justify-center">
        <p className="font-dmSans 
  text-[20px] sm:text-[24px] md:text-[30px] lg:text-[36px] 
  font-[450] text-[#1A1A1A]">
          {title}
        </p>
        <p className="text-[#8C8B99] lg:text-[16px] md:text-sm mt-4 font-dmSans">
          {des}
        </p>
      </div>
    </div>
  );
};
