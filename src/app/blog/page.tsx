import { BlogService } from '../../services/blogService';
import BlogList from '../../components/BlogList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pregnancy & Fertility Blog | BabyGauge',
  description: 'Expert insights on pregnancy, fertility, and reproductive health.',
};

export default async function BlogPage() {
  const posts = await BlogService.getPosts(12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Pregnancy & Fertility Blog</h1>
      <BlogList posts={posts} />
    </div>
  );
}
