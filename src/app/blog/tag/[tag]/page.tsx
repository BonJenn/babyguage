import { BlogService } from '../../../../services/blogService';
import BlogList from '../../../../components/BlogList';
import BlogSearch from '../../../../components/BlogSearch';
import Pagination from '../../../../components/Pagination';
import { notFound } from 'next/navigation';
import BlogSidebar from '../../../../components/BlogSidebar';

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

    // Extract all unique tags from posts
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
          
          <BlogSidebar 
            suggestedPosts={posts.slice(0, 3)} 
            popularTags={allTags}
            currentPostId={undefined}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}
