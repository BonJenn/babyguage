import { BlogService } from '../../../../services/blogService';
import BlogList from '../../../../components/BlogList';
import BlogSearch from '../../../../components/BlogSearch';
import Pagination from '../../../../components/Pagination';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Params {
  tag: string;
}

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

interface PageProps {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 12;
  const tag = decodeURIComponent(resolvedParams.tag);

  try {
    const { posts, total } = await BlogService.getPostsByTag(tag, page, limit);
    const totalPages = Math.ceil(total / limit);

    if (posts.length === 0 && page === 1) {
      notFound();
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-8">Posts tagged with &quot;{tag}&quot;</h1>
            <BlogSearch />
            
            <BlogList posts={posts} />
            
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={`/blog/tag/${encodeURIComponent(tag)}`}
              />
            )}
          </div>
          
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
              <div className="flex flex-wrap gap-2">
                {posts.reduce((tags: string[], post) => {
                  post.tags.forEach(tag => {
                    if (!tags.includes(tag)) {
                      tags.push(tag);
                    }
                  });
                  return tags;
                }, []).slice(0, 10).map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="bg-[#f5efe9] text-[#4a3f35] px-3 py-1 rounded-lg text-sm hover:bg-[#e8d5c4] transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading tagged posts:', error);
    notFound();
  }
}
