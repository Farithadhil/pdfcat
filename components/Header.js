"use client"; // This is needed for client-side components in Next.js

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname for route detection

const Header = () => {
  const pathname = usePathname(); // Get the current route

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex-shrink-0">
          <a href="/" className="block">
            <img
              src="/PDF-CAT-LOGO-long.svg"
              alt="PDF Compressor Logo"
              className="w-auto h-12"
            />
          </a>
        </div>
        <div className="flex space-x-4">
          <Link href="/">
            <button
              className={`py-2 px-4 rounded-lg ${
                pathname === "/"
                  ? "bg-black text-white"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              Watermark PDF
            </button>
          </Link>
          <Link href="/watermarkpdf">
            <button
              className={`py-2 px-4 rounded-lg ${
                pathname === "/watermarkpdf"
                  ? "bg-black text-white"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              Compress PDF
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
