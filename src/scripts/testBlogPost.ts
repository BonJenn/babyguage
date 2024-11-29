import { config } from 'dotenv';
import { resolve } from 'path';
import { generateBlogPost } from '../services/blogGenerator';
import { BlogService } from '../services/blogService';
import clientPromise from '../lib/mongodb';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function testBlogPost() {
    try {
        // Test MongoDB connection first
        console.log('Testing MongoDB connection...');
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        console.log('MongoDB connected successfully');
        console.log('Database name:', process.env.MONGODB_DB);
        
        console.log('Generating test blog post...');
        const post = await generateBlogPost("Early Pregnancy Signs");
        console.log('✅ Blog post generated:', post.title);
        
        console.log('Saving to database...');
        await BlogService.createPost(post);
        console.log('✅ Post saved to database');
        
        // Verify the post was saved
        const savedPost = await db.collection('blogPosts').findOne({ slug: post.slug });
        console.log('Post verification:', savedPost ? '✅ Found in database' : '❌ Not found in database');

    } catch (error) {
        console.error('❌ Error during test:', error);
        process.exit(1);
    }
}

testBlogPost();
