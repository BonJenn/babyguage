import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '../types/blog';

interface BlogSidebarProps {
  suggestedPosts: BlogPost[];
  popularTags?: string[];
  currentPostId?: string;
}

export default function BlogSidebar({ suggestedPosts, popularTags, currentPostId }: BlogSidebarProps) {
  // Filter out the current post from suggestions if it exists
  const filteredPosts = currentPostId 
    ? suggestedPosts.filter(post => post.id !== currentPostId)
    : suggestedPosts;

  return (
    <aside className="w-full lg:w-80 space-y-8">
      {/* Suggested Posts Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Related Posts</h2>
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
                      className="object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 group-hover:text-[#4a3f35] line-clamp-2 text-sm">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(post.publishDate).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag}
                        className="text-xs px-2 py-1 bg-[#f5efe9] text-[#4a3f35] rounded"
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
      {popularTags && popularTags.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Popular Tags</h2>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="text-sm px-3 py-1 bg-[#f5efe9] text-[#4a3f35] rounded-lg 
                         hover:bg-[#e8d5c4] transition-colors duration-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}