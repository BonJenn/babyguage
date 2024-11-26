import { MongoClient, Collection } from 'mongodb';
import clientPromise from '../lib/mongodb';

interface UsedTopic {
  topic: string;
  createdAt: Date;
}

export class TopicService {
  private static async getCollection(): Promise<Collection<UsedTopic>> {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    return db.collection<UsedTopic>('usedTopics');
  }

  static async isTopicUsed(topic: string): Promise<boolean> {
    const collection = await this.getCollection();
    const count = await collection.countDocuments({
      topic: { $regex: new RegExp(`^${topic}$`, 'i') } // Case insensitive
    });
    return count > 0;
  }

  static async addTopic(topic: string): Promise<void> {
    const collection = await this.getCollection();
    await collection.insertOne({
      topic,
      createdAt: new Date()
    });
  }

  static async getRecentTopics(days: number = 30): Promise<string[]> {
    const collection = await this.getCollection();
    const recentTopics = await collection
      .find({
        createdAt: {
          $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      })
      .sort({ createdAt: -1 })
      .toArray();

    return recentTopics.map(t => t.topic);
  }
}
