'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AvatarDropdown from './AvatarDropdown'; // Make sure this is correctly imported

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-300 relative z-50">
      {/* Logo */}
      <Link href="/" className="text-3xl font-bold">
        <img src="/assets/images/logo.svg" alt="Logo" className="h-8 w-[160px]" />
      </Link>

      {/* Hamburger for mobile */}
      <div className="flex gap-5 lg:hidden">
        <button
        onClick={() => setMenuOpen(true)}
        className="text-gray-700"
        aria-label="Open Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <AvatarDropdown />
      </div>


      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center space-x-6">
        <ul className="flex space-x-6 items-center">
          <li>
            <Link href="/account/dashboard" className="text-gray-800 hover:text-indigo-600">
              Dashboard
            </Link>
          </li>
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-800 hover:text-indigo-600 flex items-center"
            >
              Services
              <svg className="w-4 h-4 ml-2 mt-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" strokeWidth="2" d="M6 9l6 6 6-6"></path>
              </svg>
            </button>

            {dropdownOpen && (
              <ul className="absolute z-50 mt-2 w-[260px] bg-white rounded-md shadow-lg">
                <li>
                  <Link href="/service/TextToImage"  onClick={()=>setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                    Text to Image
                  </Link>
                </li>
                <li>
                  <Link href="/service/ImageToImage" onClick={()=>setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                    Image to Image
                  </Link>
                </li>
                {/* <li>
                  <Link href="/service/TextBehindImage" onClick={()=>setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100">
                    Text Behind Image
                  </Link>
                </li> */}
              </ul>
            )}
          </li>
          <li>
            <Link href="/products" className="text-gray-800 hover:text-indigo-600">
              Marketplace
            </Link>
          </li>
          <li>
            <Link href="/my-posts" className="text-gray-800 hover:text-indigo-600">
              My Posts
            </Link>
          </li>
          <li>
            <Link href="/subscription" className="text-gray-800 hover:text-indigo-600">
              Subscription
            </Link>
          </li>
          <li>
            <Link href="/cart" className="flex items-center text-gray-800 hover:text-indigo-600">
              <img src="/assets/images/icon/cart.svg" alt="Cart" className="w-5 h-5 mr-2" />
              Cart
            </Link>
          </li>
        </ul>

        {/* Upgrade Button */}
        <Link href="/account/my-plan">
          <div className="flex items-center cursor-pointer">
            <img src="/assets/images/icon/win.svg" alt="Upgrade" className="w-5 h-5 mr-2" />
            <span className="text-sm text-gray-800">Upgrade</span>
          </div>
        </Link>

        {/* Avatar */}
        <AvatarDropdown />
      </div>

      {/* Mobile Menu - Slide from right */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-[0_0_20px_0_#ccc]
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}
      >
        {/* Close Button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          aria-label="Close Menu"
        >
          ✕
        </button>

        <ul className="mt-12 space-y-4">
          <li   onClick={() => setMenuOpen(false)} >
            <Link href="/account/dashboard" className="block border-b border-gray-200 px-4 py-2 text-gray-800 hover:text-indigo-600">
              Dashboard
            </Link>
          </li>
          <li   onClick={() => setMenuOpen(false)}>
            <Link href="/service/TextToImage" className="block border-b border-gray-200 px-4 py-2 text-gray-800 hover:text-indigo-600">
              Text to Image
            </Link>
          </li>
          <li   onClick={() => setMenuOpen(false)}>
            <Link href="/service/ImageToImage" className="block border-b border-gray-200 px-4 py-2 text-gray-800 hover:text-indigo-600">
              Image to Image
            </Link>
          </li>
          <li    onClick={() => setMenuOpen(false)}>
            <Link href="/service/TextBehindImage" className="block border-b border-gray-200 px-4 py-2 text-gray-800 hover:text-indigo-600">
              Text Behind Image
            </Link>
          </li>
          <li   onClick={() => setMenuOpen(false)}>
            <Link href="/products" className="block border-b border-gray-200 px-4 py-2 text-gray-800 hover:text-indigo-600">
              Marketplace
            </Link>
          </li>
          <li  onClick={() => setMenuOpen(false)}>
            <Link href="/subscription" className="block border-b border-gray-200 px-4 py-2 text-gray-800 hover:text-indigo-600">
              Subscription
            </Link>
          </li>
          <li   onClick={() => setMenuOpen(false)}>
            <Link href="/cart" className="flex border-b border-gray-200 px-4 py-2 text-gray-800 hover:text-indigo-600">
              <img src="/assets/images/icon/cart.svg" alt="Cart" className="w-5 h-5 mr-2" />Cart
            </Link>
          </li>
          <li   onClick={() => setMenuOpen(false)}>
            <Link href="/account/my-plan" className="flex px-4 py-2 text-gray-800 hover:text-indigo-600">
              <div className="flex items-center cursor-pointer">
                <img src="/assets/images/icon/win.svg" alt="Upgrade" className="w-5 h-5 mr-2" />
                <span className="text-sm text-gray-800">Upgrade</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
