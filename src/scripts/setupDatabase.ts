import clientPromise from '../lib/mongodb';

async function setupDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Create unique index on topic field
    await db.collection('usedTopics').createIndex(
      { topic: 1 }, 
      { unique: true }
    );
    
    // Create index on createdAt for efficient queries
    await db.collection('usedTopics').createIndex({ createdAt: -1 });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
