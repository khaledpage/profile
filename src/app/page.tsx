import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import ProjectCard from '@/components/ui/ProjectCard';
import { getAllContent, getSiteConfig } from '@/utils/content';
import SkillsShowcaseMultiDesign from '@/components/sections/SkillsShowcaseMultiDesign';
import ArticlesSection from '@/components/sections/ArticlesSection';
import WorkflowSection from '@/components/sections/WorkflowSection';
import HomeSectionsController from '@/components/sections/HomeSectionsController';
import { Project } from '@/types/content';

// Pre-render the homepage as static with revalidation once per day (works for static export)
export const revalidate = 86400;

export default async function Home() {
  try {
    const content = await getAllContent();
    const config = await getSiteConfig();
  const { hero, projects, contact } = content;

    return (
      <div id="home-page" className="min-h-dvh text-foreground">
        <Header config={config} />
        <HomeSectionsController content={content} config={config} />

        <footer id="main-footer" className="py-10 text-center text-sm" style={{ color: 'var(--muted)' }}>
          © {new Date().getFullYear()} Khaled Alabsi. Built with Next.js.
        </footer>
      </div>
    );
  } catch (error) {
    console.error('Error loading content:', error);
    return (
      <div id="error-page" className="min-h-screen flex items-center justify-center">
        <div id="error-content" className="text-center">
          <h1 id="error-title" className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Error Loading Content</h1>
          <p id="error-message" style={{ color: 'var(--muted)' }}>Please make sure all content files are properly formatted.</p>
        </div>
      </div>
    );
  }
}
