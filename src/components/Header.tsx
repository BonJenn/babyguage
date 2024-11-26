'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#e8d5c4] text-[#4a3f35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/babygauge_logo.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold">BabyGauge</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/blog"
              className="text-[#4a3f35] hover:text-[#8b7355] transition-colors"
            >
              Blog
            </Link>
            {/* Add other navigation items here */}
          </div>
        </nav>
      </div>
    </header>
  );
}
