'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "../../store/sidebarStore"; // ✅ import store

const options = [
  {
    label: "Image",
    icon: "/assets/images/icon/text-to-image01.svg",
    activeIcon: "/assets/images/icon/text-to-image-active01.svg",
    href: "/service/TextToImage",
  },
  {
    label: "Reimagine",
    icon: "/assets/images/icon/text-to-image02.svg",
    activeIcon: "/assets/images/icon/text-to-image-active02.svg",
    href: "/service/ImageToImage",
  }
  // {
  //   label: "Text",
  //   icon: "/assets/images/icon/text-to-image03.svg",
  //   activeIcon: "/assets/images/icon/text-to-image-active03.svg",
  //   href: "/service/TextBehindImage",
  // },
];

export default function MenuSidebar() {
  const pathname = usePathname();
  const setShowLeftSidebar = useSidebarStore((state) => state.setShowLeftSidebar);

  return (
    <div className="h-[calc(100vh-65px)] bg-white flex flex-col items-center py-10 2xl:px-5">
      <ul className="flex flex-col gap-6">
        {/* ✕ Close button for mobile/tab only */}
        <li className="flex items-center justify-center gap-5 2xl:hidden">
          <button
            className="text-gray-700"
            onClick={() => setShowLeftSidebar(false)}
            aria-label="Close Left Sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </li>

        {options.map((option, index) => {
          const isActive = pathname === option.href || (pathname === "/" && index === 0);
          return (
            <li key={index}>
              <Link
                href={option.href}
                className={`flex flex-col items-center justify-center rounded-xl w-[90px] h-[100px] 2xl:w-[110px] 2xl:h-[110px] transition-all duration-300 ${
                  isActive
                    ? "2xl:bg-[linear-gradient(112.06deg,rgba(194,137,255,0.3)-6.95%,rgba(85,85,255,0.3)59.24%)]"
                    : ""
                } p-[15px] px-[30px]`}
              >
                <span
                  className={`p-3 rounded-md w-[50px] h-[50px] ${
                    isActive
                      ? "bg-[linear-gradient(112.06deg,#C289FF_-6.95%,#5555FF_59.24%)]"
                      : "bg-[rgba(241,242,244,1)]"
                  }`}
                >
                  <img
                    src={isActive ? option.activeIcon : option.icon}
                    alt={option.label}
                    className="w-8 h-8"
                  />
                </span>
                <span className="mt-2 text-[14px] font-normal text-gray-800">{option.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
