'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-8 h-8">
              <Image
                src="/babyguage_logo.png"
                alt="Baby Gauge Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-semibold">
              <span className="bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">Baby</span>
              <span className="text-gray-900">Gauge</span>
              <span className="bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">.com</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/blog" 
              className="text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              About
            </Link>
            <Link 
              href="/contact"
              className="px-4 py-2 rounded-full bg-pink-500 text-white 
                       hover:bg-pink-600 transition-colors duration-200 
                       shadow-sm hover:shadow-md"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-pink-50 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md 
                         border-b border-pink-100 shadow-lg">
            <nav className="px-4 py-4 space-y-3">
              <Link
                href="/blog"
                className="block px-4 py-2 rounded-lg hover:bg-pink-50 text-gray-600 
                         hover:text-pink-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 rounded-lg hover:bg-pink-50 text-gray-600 
                         hover:text-pink-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 rounded-lg bg-pink-500 text-white 
                         hover:bg-pink-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
