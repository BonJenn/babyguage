import { BlogService } from '../../../services/blogService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import BlogSidebar from '../../../components/BlogSidebar';

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
  try {
    const post = await BlogService.getPostBySlug(decodeURIComponent(resolvedParams.slug));

    if (!post) {
      notFound();
    }

    // Get suggested posts based on current post's tags
    const suggestedPosts = await BlogService.getSuggestedPosts(post.id, post.tags);
    
    // Get all unique tags from suggested posts and current post
    const allTags = Array.from(new Set([
      ...post.tags,
      ...suggestedPosts.reduce((tags: string[], post) => {
        return [...tags, ...post.tags];
      }, [])
    ]));

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="flex-1">
            {post.coverImage && (
              <div className="relative h-[400px] mb-12 rounded-xl overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}
            
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-pink-400 
                           bg-clip-text text-transparent">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {post.tags.map((tag: string) => (
                <Link 
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="px-4 py-1.5 rounded-full text-sm bg-pink-50 text-pink-700 
                           hover:bg-pink-100 transition-colors duration-200"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <div className="prose prose-pink max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>
          
          <BlogSidebar 
            suggestedPosts={suggestedPosts} 
            popularTags={allTags}
            currentPostId={post.id}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}
