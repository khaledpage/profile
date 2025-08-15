export interface ArticleMetadata {
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  lastModified?: string;
  tags: string[];
  category: string;
  coverImage: string; // Can be URL or relative path to assets
  readingTime: number; // in minutes
  featured: boolean;
  published: boolean;
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}

export interface Article {
  slug: string;
  metadata: ArticleMetadata;
  content: string;
  assets: string[]; // List of local assets in the article folder
}
