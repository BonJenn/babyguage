import clientPromise from '../lib/mongodb';
import { BlogPost } from '../types/blog';
import { ObjectId } from 'mongodb';

export class BlogService {
  private static async getCollection() {
    try {
      console.log('Getting MongoDB collection...');
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || 'babyguage';
      const db = client.db(dbName);
      console.log('Database connected:', dbName);
      return db.collection('blogPosts');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  static async createPost(post: BlogPost) {
    console.log('Creating post in MongoDB:', post.title);
    const collection = await this.getCollection();
    try {
      const result = await collection.insertOne({
        ...post,
        _id: new ObjectId(),
        publishDate: new Date(post.publishDate)
      });
      console.log('Post created successfully, ID:', result.insertedId);
      return result;
    } catch (error) {
      console.error('Error creating post in MongoDB:', error);
      throw error;
    }
  }

  static async getPosts(limit = 12): Promise<BlogPost[]> {
    console.log('Fetching posts from MongoDB, limit:', limit);
    const collection = await this.getCollection();
    const posts = await collection
      .find({})
      .sort({ publishDate: -1 })
      .limit(limit)
      .toArray();

    console.log(`Found ${posts.length} posts`);
    return posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      publishDate: post.publishDate.toISOString(),
      tags: post.tags,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords,
    }));
  }

  static async getPostBySlug(slug: string) {
    const collection = await this.getCollection();
    const decodedSlug = decodeURIComponent(slug);
    console.log('Looking for post with slug:', decodedSlug);
    const post = await collection.findOne({ slug: decodedSlug });
    console.log('Found post:', post ? 'yes' : 'no');
    return post;
  }

  static async searchPosts(query: string): Promise<BlogPost[]> {
    const collection = await this.getCollection();
    const posts = await collection
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      })
      .sort({ publishDate: -1 })
      .toArray();

    return posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      publishDate: post.publishDate.toISOString(),
      tags: post.tags,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords,
    }));
  }
}
