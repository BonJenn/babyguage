import { ObjectId } from 'mongodb';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  publishDate: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export interface BlogPostDocument {
  _id: ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  publishDate: Date;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export interface BlogImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}
