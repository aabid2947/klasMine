'use client';

import Image from "next/image";
import { HeroBanner } from "../app/components/HeroBanner/HeroBanner";

import { DetailedFeatures } from "./components/DetailedFeatures/DetailedFeatures";
import { Faq } from "../app/components/Faq/Faq";
import { PricingSection } from "../app/components/PricingSection/PricingSection";
import { Thumbnails } from "./components/Thumnails/Thumnails";
import { UltimateFeature } from "../app/components/UltimateFeature/UltimateFeature";
import ProductGrid from "./components/ProductsPrinted/ProductsPrinted";
import { getRequest } from "./utils/api";
import { useEffect } from "react";

export default function Home() {
 
  
  return (
    <div className="overflow-hidden">
      <HeroBanner />
      <UltimateFeature />
      <DetailedFeatures />
      <Thumbnails />
      <ProductGrid />
      <PricingSection />
      <Faq />
    </div>
  );
}
