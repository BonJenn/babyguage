import { BlogService } from '../../../services/blogService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

interface Params {
  slug: string;
}

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

interface PageProps {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  try {
    const post = await BlogService.getPostBySlug(decodedSlug);
    
    if (!post) {
      return {
        title: 'Post Not Found | BabyGauge',
      };
    }

    return {
      title: post.seoTitle,
      description: post.seoDescription,
      keywords: post.seoKeywords,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | BabyGauge',
    };
  }
}

export default async function BlogPostPage({ params, searchParams: _searchParams }: PageProps) {
  const resolvedParams = await params;
  // Remove or use resolvedSearchParams if not needed
  // const resolvedSearchParams = await searchParams;
  try {
    const post = await BlogService.getPostBySlug(resolvedParams.slug);

    if (!post) {
      notFound();
    }

    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {post.coverImage && (
          <div className="relative h-[400px] mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex gap-2 mb-8">
          {post.tags.map((tag) => (
            <span 
              key={tag}
              className="bg-[#e8d5c4] text-[#4a3f35] px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}
