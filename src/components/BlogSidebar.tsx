import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '../types/blog';

interface BlogSidebarProps {
  suggestedPosts: BlogPost[];
  popularTags: string[];
  currentPostId?: string;
}

export default function BlogSidebar({ suggestedPosts, popularTags, currentPostId }: BlogSidebarProps) {
  const filteredPosts = currentPostId 
    ? suggestedPosts.filter(post => post.id !== currentPostId)
    : suggestedPosts;

  return (
    <aside className="hidden lg:block w-80">
      {/* Related Posts Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 mb-6 
                    border border-pink-100">
        <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-pink-600 to-pink-400 
                     bg-clip-text text-transparent">
          Related Posts
        </h2>
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="flex gap-4">
                {post.coverImage && (
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover rounded-xl group-hover:scale-105 
                               transition-transform duration-300"
                    />
                    <div className="absolute inset-0 rounded-xl group-hover:bg-pink-500/10 
                                transition-colors duration-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 group-hover:text-pink-600 
                              line-clamp-2 text-sm transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(post.publishDate).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag}
                        className="text-xs px-2 py-1 bg-pink-50 text-pink-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tags Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 
                    border border-pink-100">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-pink-600 to-pink-400 
                     bg-clip-text text-transparent">
          Popular Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags?.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 rounded-full text-sm bg-pink-50 text-pink-600 
                       hover:bg-pink-100 hover:text-pink-700 transition-all duration-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}