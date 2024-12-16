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
          content: `You are one of several expert writers for a women's health blog. Each post should have a unique voice and perspective. Write in a conversational, engaging style.

          For Q&A posts: Write as Dr. Sarah Thompson, a compassionate OB-GYN
          For personal stories: Write as a real person sharing their experience
          For research posts: Write as a health journalist
          For general topics: Rotate between different expert voices (nutritionist, therapist, midwife, etc.)

          Important formatting:
          - Use bold for emphasis (**text**)
          - Use italics for quotes (*text*)
          - Use bullet points when appropriate
          - Break into clear paragraphs
          - NO heading tags (h2, h3) - use bold text instead
          - Include a brief author bio at the end`
        },
        {
          role: "user",
          content: `Write a comprehensive blog post about ${topic}. Structure the content with clear sections and ensure proper paragraph spacing.`
        }
      ],
      temperature: 0.7,
    });

    const content = contentResponse.choices[0].message.content || "";
    
    // Add logging to check content structure
    console.log('Generated content structure check:', {
      topic,
      sectionCount: (content.match(/## /g) || []).length,
      subsectionCount: (content.match(/### /g) || []).length,
      firstFewLines: content.split('\n').slice(0, 5),
    });

    // Validate content structure
    if (!content.includes('## ')) {
      console.error('Content missing required section markers for topic:', topic);
      throw new Error('Generated content missing required structure');
    }

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
        strict: true,
        trim: true,
        remove: /[*+~.()'"!:@]/g
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
      id: result.id,
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
    return 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/blog-images/default-blog-image.jpg';
  }
}

async function generateUniqueTopic(): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a women's health content curator. Generate a unique blog topic from these diverse categories:

        1. Reproductive Health Deep Dives
        2. Ask Dr. Sarah (Q&A format about intimate health concerns)
        3. Real Stories & Experiences
        4. Latest Research & Studies
        5. Lifestyle & Wellness
        6. Mental Health & Relationships
        7. Sexual Health & Intimacy
        8. Hormonal Health
        9. Reproductive Rights & Advocacy
        10. Alternative & Holistic Approaches
        11. Life Stages & Transitions
        12. Body Literacy & Education
        
        For Q&A posts, format as: "Ask Dr. Sarah: [Question]"
        For personal stories, format as: "My Journey: [Topic]"
        For research posts, format as: "New Study: [Finding]"
        
        Never repeat previously used topics. Be specific and unique.
        Return only the topic title, no additional text.`
      },
      {
        role: "user",
        content: "Generate a unique women's health topic."
      }
    ],
    temperature: 0.9,
    max_tokens: 50
  });

  return response.choices[0].message.content?.trim() || "Women's Health Tips";
}

// Export it so we can use it in the API route
export { generateUniqueTopic };
