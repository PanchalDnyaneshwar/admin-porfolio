export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags: string[];
  category?: string;
  isPublished: boolean;
  publishedAt?: string;
  readTime: number;
  createdAt?: string;
  updatedAt?: string;
}
