import cloudinary from '../lib/cloudinary';
import OpenAI from 'openai';
import { BlogPost } from '../types/blog';
import slugify from 'slugify';
import { BlogService } from './blogService';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_2 });

export async function generateBlogPost(topic: string): Promise<BlogPost> {
  try {
    // Generate content with GPT-4
    const contentResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional writer specializing in pregnancy and fertility topics. Write content using markdown formatting. Use ## for main sections and ### for subsections. Each section should have a clear heading followed by well-structured paragraphs. Use proper markdown for lists, emphasis, and other formatting."
        },
        {
          role: "user",
          content: `Write a comprehensive blog post about ${topic}. Structure the content with clear sections using markdown headings (## and ###) and ensure proper paragraph spacing.`
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
      slug: slugify(seoData.title, { 
        lower: true,
        strict: true, // Removes special characters
        remove: /[*+~.()'"!:@]/g // Remove additional special characters
      }),
      content: contentResponse.choices[0].message.content || "",
      excerpt: seoData.description,
      coverImage: imageUrl || "",
      publishDate: new Date().toISOString(),
      tags: seoData.keywords,
      seoTitle: seoData.title,
      seoDescription: seoData.description,
      seoKeywords: seoData.keywords,
    };

    console.log('Generated blog post:', {
      title: blogPost.title,
      slug: blogPost.slug
    });

    // Save to MongoDB
    const result = await BlogService.createPost(blogPost);
    console.log('Blog post saved to database:', {
      id: result.insertedId,
      title: blogPost.title,
      slug: blogPost.slug,
      publishDate: blogPost.publishDate
    });
    return blogPost;
  } catch (error) {
    console.error('Error generating blog post:', error);
    throw error;
  }
}

async function generateAndStoreImage(topic: string): Promise<string> {
  try {
    // Generate image with DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A professional, medical-style image related to ${topic} for a pregnancy and fertility blog. The image should be clean, professional, and suitable for medical content.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL received from OpenAI');
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
      folder: 'blog-images',
      transformation: [
        { width: 1200, height: 630, crop: 'fill' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error generating/storing image:', error);
    // Return a default image URL if generation fails
    return 'https://your-default-image-url.jpg';
  }
}

async function generateUniqueTopic(): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a fertility and pregnancy expert. Generate a specific, unique blog topic from one of these categories:
        1. Fertility Optimization (tracking, timing, methods)
        2. Pregnancy Preparation (physical and mental readiness)
        3. Medical Aspects (treatments, procedures, research)
        4. Lifestyle & Wellness (diet, exercise, stress management)
        5. Common Concerns (symptoms, complications, myths)
        6. Partner Support & Relationships
        7. Mental Health & Emotional Wellbeing
        8. Scientific Research & Studies
        
        Return only the topic title, no additional text.`
      },
      {
        role: "user",
        content: "Generate a unique, specific pregnancy or fertility topic."
      }
    ],
    temperature: 0.9,
    max_tokens: 50
  });

  return response.choices[0].message.content?.trim() || "Fertility Tips";
}

// Export it so we can use it in the API route
export { generateUniqueTopic };
