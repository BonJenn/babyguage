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
