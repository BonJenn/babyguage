import { BlogService } from '../services/blogService';
import HomeContent from '../components/HomeContent';

export default async function HomePage() {
  try {
    const { posts } = await BlogService.getPosts(1, 6);
    return <HomeContent posts={posts} />;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return <HomeContent posts={[]} />;
  }
}
