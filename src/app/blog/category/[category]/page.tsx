import { BlogService } from '../../../../services/blogService';
import BlogList from '../../../../components/BlogList';
import BlogSearch from '../../../../components/BlogSearch';
import Pagination from '../../../../components/Pagination';
import { notFound } from 'next/navigation';
import BlogSidebar from '../../../../components/BlogSidebar';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 12;
  const category = decodeURIComponent(resolvedParams.category);

  try {
    const { posts, total } = await BlogService.getPostsByCategory(category, page, limit);
    const totalPages = Math.ceil(total / limit);

    const allTags = Array.from(new Set(
      posts.reduce((tags: string[], post) => {
        return [...tags, ...post.tags];
      }, [])
    ));

    if (posts.length === 0 && page === 1) {
      notFound();
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-pink-400 
                         bg-clip-text text-transparent">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h1>
            <BlogSearch />
            <BlogList posts={posts} />
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={`/blog/category/${encodeURIComponent(category)}`}
              />
            )}
          </div>
          
          <BlogSidebar 
            suggestedPosts={posts.slice(0, 3)}
            popularTags={allTags}
            currentPostId={null}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching category posts:', error);
    throw error;
  }
}