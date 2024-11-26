import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '../types/blog';

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <Link href={`/blog/${post.slug}`}>
            <div className="relative h-48">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600">{post.excerpt}</p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
