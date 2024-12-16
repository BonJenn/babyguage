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

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="flex-1">
            {post.coverImage && (
              <div className="relative h-[400px] mb-12">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover rounded-xl shadow-lg"
                />
              </div>
            )}
            
            <h1 className="text-5xl font-bold mb-6 text-gray-800">{post.title}</h1>
            
            <div className="flex flex-wrap gap-3 mb-12">
              {post.tags.map((tag: string) => (
                <Link 
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="bg-[#f5efe9] text-[#4a3f35] px-4 py-2 rounded-lg text-sm font-medium 
                           hover:bg-[#e8d5c4] transition-colors duration-200"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <div className="prose prose-lg max-w-none
              prose-headings:font-bold
              prose-h1:text-5xl prose-h1:mb-8
              prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-gray-800
              prose-h3:text-3xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-700
              prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-p:text-gray-600
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-li:text-gray-600 prose-li:mb-2
              prose-strong:font-bold prose-strong:text-gray-800">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>

          <BlogSidebar 
            suggestedPosts={suggestedPosts}
            popularTags={post.tags}
            currentPostId={post.id}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}
