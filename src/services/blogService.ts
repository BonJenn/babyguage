import { ObjectId, Collection } from 'mongodb';
import clientPromise from '../lib/mongodb';
import { BlogPost, BlogPostDocument } from '../types/blog';

export class BlogService {
  private static async getCollection(): Promise<Collection<BlogPostDocument>> {
    try {
      console.log('Getting MongoDB collection...');
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || 'babyguage';
      const db = client.db(dbName);
      console.log('Database connected, collection name:', 'blogPosts');
      return db.collection<BlogPostDocument>('blogPosts');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  private static mapPostFromDB(post: BlogPostDocument): BlogPost {
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

  static async createPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    console.log('Creating post in MongoDB:', post.title);
    const collection = await this.getCollection();
    try {
      const newPost: Omit<BlogPostDocument, '_id'> = {
        ...post,
        publishDate: new Date(post.publishDate)
      };
      const result = await collection.insertOne(newPost as BlogPostDocument);
      console.log('Post created successfully, ID:', result.insertedId);
      
      return {
        ...post,
        id: result.insertedId.toString()
      };
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
    return this.mapPostFromDB(post);
  }

  static async getPosts(page = 1, limit = 12): Promise<{ posts: BlogPost[]; total: number }> {
    console.log('Fetching posts from MongoDB, page:', page, 'limit:', limit);
    const collection = await this.getCollection();
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      collection
        .find({})
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments({})
    ]);

    return {
      posts: posts.map(this.mapPostFromDB),
      total
    };
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
    return posts.map(this.mapPostFromDB);
  }

  static async getPostsByTag(tag: string, page = 1, limit = 12): Promise<{ posts: BlogPost[]; total: number }> {
    const collection = await this.getCollection();
    const skip = (page - 1) * limit;
    
    const query = { tags: { $regex: new RegExp(`^${tag}$`, 'i') } };
    const [posts, total] = await Promise.all([
      collection
        .find(query)
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ]);

    return {
      posts: posts.map(this.mapPostFromDB),
      total
    };
  }

  static async getSuggestedPosts(postId: string, tags: string[], limit = 3): Promise<BlogPost[]> {
    const collection = await this.getCollection();
    const posts = await collection
      .find({
        _id: { $ne: new ObjectId(postId) },
        tags: { $in: tags }
      })
      .sort({ publishDate: -1 })
      .limit(limit)
      .toArray();

    return posts.map(this.mapPostFromDB);
  }
}
