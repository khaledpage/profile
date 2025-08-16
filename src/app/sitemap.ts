import { MetadataRoute } from 'next'
import { getAllArticles } from '@/utils/articles'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://khaledpage.github.io/profile'
  
  // Get all articles for dynamic routes
  const articles = await getAllArticles()
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic article routes
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.metadata.lastModified || article.metadata.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic project routes (if any projects exist)
  // Add project routes here when projects are implemented

  return [...staticRoutes, ...articleRoutes]
}
