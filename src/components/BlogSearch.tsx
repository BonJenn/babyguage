'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/blog/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blog posts..."
          className="w-full px-4 py-2 rounded-lg border border-[#d4c4b7] focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-[#8b7355] text-white rounded-md"
        >
          Search
        </button>
      </div>
    </form>
  );
}
