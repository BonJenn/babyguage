import { config } from 'dotenv';
import { resolve } from 'path';
import cloudinary from '../lib/cloudinary';
import OpenAI from 'openai';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

// Verify environment variables
console.log('Environment variables check:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅' : '❌');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅' : '❌');
console.log('OPENAI_API_KEY_2:', process.env.OPENAI_API_KEY_2 ? '✅' : '❌');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_2,
});

async function testImageGeneration() {
    try {
        console.log('\n1. Testing OpenAI connection...');
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: "A simple medical illustration of a pregnancy test, minimal style",
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = response.data[0].url;
        if (!imageUrl) {
            throw new Error('No image URL received from OpenAI');
        }
        console.log('✅ OpenAI image generated successfully');
        console.log('Image URL:', imageUrl);

        console.log('\n2. Testing Cloudinary upload...');
        const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
            folder: 'blog-images-test',
        });
        console.log('✅ Cloudinary upload successful');
        console.log('Cloudinary URL:', uploadResponse.secure_url);

        return uploadResponse.secure_url;
    } catch (error) {
        console.error('❌ Error during test:', error);
        process.exit(1);
    }
}

testImageGeneration()
    .then(() => {
        console.log('\n✅ All tests completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });
