import { MongoClient, ObjectId } from 'mongodb';
import { BlogPost } from '../types/blog';
import clientPromise from '../lib/mongodb';

export class BlogService {
  private static async getCollection() {
    try {
      console.log('Getting MongoDB collection...');
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || 'babyguage';
      const db = client.db(dbName);
      console.log('Database connected, collection name:', 'blogPosts');
      return db.collection('blogPosts');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
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

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    console.log('Fetching post by slug:', slug);
    const collection = await this.getCollection();
    const post = await collection.findOne({ slug });
    
    if (!post) {
      console.log('Post not found for slug:', slug);
      return null;
    }

    console.log('Post found:', post.title);
    return {
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
    };
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

  static async searchPosts(query: string): Promise<BlogPost[]> {
    console.log('Searching posts with query:', query);
    const collection = await this.getCollection();
    
    const searchRegex = new RegExp(query, 'i');
    const posts = await collection
      .find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex }
        ]
      })
      .sort({ publishDate: -1 })
      .toArray();

    console.log(`Found ${posts.length} posts matching query`);
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
