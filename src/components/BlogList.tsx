import Link from 'next/link';
import { BlogPost } from '../types/blog';
import OptimizedImage from './OptimizedImage';

export default function BlogList({ posts = [] }: { posts: BlogPost[] }) {
  if (!posts) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article 
          key={post.id} 
          className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm 
                   hover:shadow-md transition-all duration-300 overflow-hidden 
                   border border-pink-100 hover:border-pink-200"
        >
          <Link href={`/blog/${post.slug}`}>
            <div className="relative h-56">
              <OptimizedImage
                src={post.coverImage || '/images/default-blog-cover.jpg'}
                alt={post.title}
                className="object-cover w-full h-full group-hover:scale-105 
                         transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-medium mb-3 text-gray-800 
                         group-hover:text-pink-600 transition-colors duration-200">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 rounded-full text-sm bg-pink-50 
                               text-pink-600 hover:bg-pink-100 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(post.publishDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
