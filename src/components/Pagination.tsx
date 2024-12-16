import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  return (
    <div className="flex justify-center items-center space-x-4 mt-12">
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="px-4 py-2 rounded-full bg-pink-50 text-pink-600 
                   hover:bg-pink-100 transition-colors duration-200"
        >
          Previous
        </Link>
      )}
      
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      
      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="px-4 py-2 rounded-full bg-pink-50 text-pink-600 
                   hover:bg-pink-100 transition-colors duration-200"
        >
          Next
        </Link>
      )}
    </div>
  );
}
