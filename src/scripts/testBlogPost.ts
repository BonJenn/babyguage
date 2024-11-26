import { config } from 'dotenv';
import { resolve } from 'path';
import { generateBlogPost } from '../services/blogGenerator';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function testBlogPost() {
    try {
        console.log('Generating test blog post...');
        await generateBlogPost("Early Pregnancy Signs");
        console.log('✅ Blog post generated successfully');
    } catch (error) {
        console.error('❌ Error generating blog post:', error);
        process.exit(1);
    }
}

testBlogPost();
