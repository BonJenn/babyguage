import clientPromise from '../lib/mongodb';
import { BlogPost } from '../types/blog';
import { ObjectId } from 'mongodb';

export class BlogService {
  private static async getCollection() {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    return db.collection('blogPosts');
  }

  static async createPost(post: BlogPost) {
    const collection = await this.getCollection();
    const result = await collection.insertOne({
      ...post,
      _id: new ObjectId(),
      publishDate: new Date(post.publishDate)
    });
    return result;
  }

  static async getPosts(limit = 12) {
    const collection = await this.getCollection();
    return collection
      .find({})
      .sort({ publishDate: -1 })
      .limit(limit)
      .toArray();
  }

  static async getPostBySlug(slug: string) {
    const collection = await this.getCollection();
    return collection.findOne({ slug });
  }

  static async searchPosts(query: string) {
    const collection = await this.getCollection();
    return collection
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      })
      .sort({ publishDate: -1 })
      .toArray();
  }
}
