'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function BlogSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="mb-12">
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm rounded-full 
                   border border-pink-100 focus:border-pink-300 
                   shadow-sm focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50
                   text-gray-800 placeholder-gray-400
                   transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2
                   bg-pink-500 hover:bg-pink-600 text-white rounded-full
                   shadow-sm hover:shadow-md transition-all duration-200"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
