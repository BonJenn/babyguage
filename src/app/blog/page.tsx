import { BlogService } from '../../services/blogService';
import BlogList from '../../components/BlogList';
import BlogSearch from '../../components/BlogSearch';
import BlogSidebar from '../../components/BlogSidebar';
import Pagination from '../../components/Pagination';
import { siteConfig } from '../../config/site';
import Link from 'next/link';
import { BlogPost as _BlogPost } from '../../types/blog';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const categories = [
  {
    name: 'Fertility',
    description: 'Conception tips, fertility tracking, and reproductive health',
    icon: '🌱', // Optional: you can add emoji icons or use proper icon components
    tags: ['fertility', 'ovulation', 'conception', 'reproductive health']
  },
  {
    name: 'Pregnancy',
    description: 'Pregnancy stages, symptoms, and prenatal care',
    icon: '🤰',
    tags: ['pregnancy', 'prenatal', 'trimester', 'baby development']
  },
  {
    name: 'Wellness',
    description: 'Health, nutrition, and lifestyle for fertility',
    icon: '💪',
    tags: ['wellness', 'nutrition', 'exercise', 'mental health']
  },
  {
    name: 'Family Planning',
    description: 'Birth control, family planning, and preconception',
    icon: '👨‍👩‍👦',
    tags: ['family planning', 'birth control', 'preconception']
  }
];

export default async function BlogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 12;
  const { posts, total } = await BlogService.getPosts(page, limit);
  const totalPages = Math.ceil(total / limit);

  const allTags = Array.from(new Set(
    posts.reduce((tags: string[], post) => {
      return [...tags, ...post.tags];
    }, [])
  ));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 
                     bg-clip-text text-transparent">
          {siteConfig.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {siteConfig.description}
        </p>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/blog/category/${encodeURIComponent(category.name.toLowerCase())}`}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6
                     border border-pink-100 hover:border-pink-200 
                     shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="text-center">
              {category.icon && (
                <span className="text-3xl mb-3 block">{category.icon}</span>
              )}
              <h3 className="text-lg font-medium text-gray-800 group-hover:text-pink-600 
                           transition-colors duration-200">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Search Section */}
      <div className="mb-16">
        <BlogSearch />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Latest Articles</h2>
          <BlogList posts={posts} />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/blog"
            />
          )}
        </div>
        
        <BlogSidebar 
          suggestedPosts={posts.slice(0, 3)}
          popularTags={allTags}
          currentPostId={null}
        />
      </div>

      {/* Newsletter Section */}
      <div className="mt-16 bg-gradient-to-r from-pink-50 to-purple-50 
                    rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
          Stay Updated
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest articles, tips, and insights about fertility and women's health.
        </p>
        <form className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-3 rounded-full border border-pink-100 
                     focus:border-pink-300 focus:ring-2 focus:ring-pink-200 
                     focus:ring-opacity-50"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-pink-500 text-white rounded-full
                     hover:bg-pink-600 transition-colors duration-200
                     shadow-sm hover:shadow-md"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
