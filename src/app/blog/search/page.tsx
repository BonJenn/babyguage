import { BlogService } from '../../../services/blogService';
import BlogList from '../../../components/BlogList';
import BlogSearch from '../../../components/BlogSearch';

interface SearchParams {
  q: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const posts = await BlogService.searchPosts(query);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Search Results</h1>
      <BlogSearch />
      
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">
          No posts found for &quot;{query}&quot;
        </p>
      ) : (
        <>
          <p className="mb-8">Found {posts.length} posts for &quot;{query}&quot;</p>
          <BlogList posts={posts} />
        </>
      )}
    </div>
  );
}
