import { BlogService } from '../../services/blogService';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { siteConfig } from '../../config/site'

export const metadata: Metadata = {
  title: 'Pregnancy & Fertility Blog | BabyGauge',
  description: 'Expert insights on pregnancy, fertility, and reproductive health.',
};

export default async function BlogPage() {
  const posts = await BlogService.getPosts(12);
  console.log('Fetched posts:', posts);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-bold mb-12 text-gray-800">{siteConfig.name}</h1>
      <p className="text-xl mb-8 text-gray-600">{siteConfig.description}</p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              {post.coverImage && (
                <div className="relative h-48">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-[#4a3f35]">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-[#f5efe9] text-[#4a3f35] px-3 py-1 rounded-lg text-sm">
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
  );
}
