import OpenAI from 'openai';
import { BlogPost } from '../types/blog';
import slugify from 'slugify';
import { BlogService } from './blogService';

const openai = new OpenAI();

export async function generateBlogPost(topic: string): Promise<void> {
  try {
    // Generate content with GPT-4
    const contentResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional writer specializing in pregnancy and fertility topics. Write in a clear, engaging style with proper headings and SEO optimization."
        },
        {
          role: "user",
          content: `Write a comprehensive blog post about ${topic}. Include H2 and H3 headings, and format in markdown.`
        }
      ],
      temperature: 0.7,
    });

    // Generate SEO metadata
    const seoResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Generate SEO metadata as JSON with title, description, and keywords array."
        },
        {
          role: "user",
          content: `Generate SEO metadata for a blog post about ${topic}.`
        }
      ],
      temperature: 0.3,
    });

    // Generate and store image
    const imageUrl = await generateAndStoreImage(topic);

    const seoData = JSON.parse(seoResponse.choices[0].message.content || "{}");
    
    const blogPost: BlogPost = {
      id: new Date().getTime().toString(),
      title: seoData.title,
      slug: slugify(seoData.title, { lower: true }),
      content: contentResponse.choices[0].message.content || "",
      excerpt: seoData.description,
      coverImage: imageUrl,
      publishDate: new Date().toISOString(),
      tags: seoData.keywords,
      seoTitle: seoData.title,
      seoDescription: seoData.description,
      seoKeywords: seoData.keywords,
    };

    // Save to MongoDB
    await BlogService.createPost(blogPost);
  } catch (error) {
    console.error('Error generating blog post:', error);
    throw error;
  }
}

async function generateAndStoreImage(topic: string): Promise<string> {
  // Image generation logic here
  // You might want to store images in a service like Cloudinary or S3
  // Return the URL of the stored image
}
