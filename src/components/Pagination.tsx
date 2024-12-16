import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="px-4 py-2 bg-white rounded-lg text-[#8b7355] border border-[#8b7355] hover:bg-[#8b7355] hover:text-white transition-colors"
        >
          Previous
        </Link>
      )}
      
      <span className="px-4 py-2 text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      
      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="px-4 py-2 bg-white rounded-lg text-[#8b7355] border border-[#8b7355] hover:bg-[#8b7355] hover:text-white transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  );
}
