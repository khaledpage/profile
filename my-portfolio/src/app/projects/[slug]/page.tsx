import Image from 'next/image';
import { getAllContent } from '@/utils/content';
import type { Project } from '@/types/content';

export async function generateStaticParams() {
  try {
    const { projects } = await getAllContent();
    return projects.projects.map((p) => ({ slug: slugify(p.title) }));
  } catch {
    return [];
  }
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function findProject(projects: Project[], slug: string): Project | null {
  return (
    projects.find((p) => slugify(p.title) === slug) ?? null
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { projects } = await getAllContent();
  const project = findProject(projects.projects, slug) || {
    title: 'Unbekanntes Projekt',
    description: 'Dieses Projekt konnte nicht gefunden werden. Hier sind Beispielinhalte.',
    image: '/images/project1.jpg',
    tags: ['Next.js', 'TypeScript'],
    link: '#',
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-gray-300 mb-6">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 text-[12px] rounded-full bg-white/10 text-white">{t}</span>
            ))}
          </div>
          <a href={project.link} target="_blank" rel="noreferrer" className="relative inline-flex px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white interactive-border">
            Live ansehen
          </a>
        </div>
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl glass">
            <div className="relative h-64 w-full">
              <Image src={project.image} alt={project.title} fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {[1,2,3].map((i) => (
          <div key={i} className="glass rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-1">Feature {i}</div>
            <div className="font-medium">Beispielbeschreibung zu einem Projektdetail.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
