import './globals.css';
import { ReactNode } from 'react';
import LayoutWrapper from './LayoutWrapper';
import { Open_Sans } from "next/font/google";
import { DM_Sans, Geist, Geist_Mono, Inter, Poppins } from "next/font/google";

export const metadata = {
  title: "KLASS ART",
  description: "KLASS ART",
  icons: {
    icon: "/favicon.ico", // or any other custom icon path
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-openSans", // ✅ Define the CSS variable
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dmSans", // ✅ Define the CSS variable
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // ✅ Define the CSS variable
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"], // Add the required weights
  variable: "--font-inter", // ✅ Define the CSS variable
});
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="overflow-x-hidden">
        {/* LayoutWrapper will handle login state and switch between layouts */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
