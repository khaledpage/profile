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
    overview: 'Beispiel-Überblickstext für ein Projekt.',
    techStack: ['Next.js', 'TypeScript'],
    features: ['Beispiel-Feature 1', 'Beispiel-Feature 2'],
    metrics: [{ label: 'Status', value: 'Alpha' }],
  };

  const tech = project.techStack ?? project.tags;
  const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];
  const cols = project.features && project.features.length > 6 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header Section */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{project.title}</h1>
          <p className="text-gray-300 mb-6">{project.description}</p>

          {/* Meta Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tech?.map((t) => (
              <span key={t} className="px-2 py-0.5 text-[12px] rounded-full bg-white/10 text-white">{t}</span>
            ))}
          </div>

          {/* Quick Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="glass rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-400">{m.label}</div>
                  <div className="text-lg font-semibold">{m.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* External links */}
          <div className="flex gap-3">
            {project.links?.live && (
              <a href={project.links.live} target="_blank" rel="noreferrer" className="relative inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white interactive-border">
                Live ansehen
              </a>
            )}
            {project.links?.repo && (
              <a href={project.links.repo} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl border border-white/15 text-white hover:bg-white/10">Repository</a>
            )}
            {!project.links?.live && !project.links?.repo && (
              <a href={project.link} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl border border-white/15 text-white hover:bg-white/10">Projektlink</a>
            )}
          </div>
        </div>

        {/* Hero Image / Gallery */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl glass">
            <div className="relative h-64 w-full">
              <Image src={gallery[0]} alt={project.title} fill className="object-cover" />
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {gallery.slice(1, 4).map((src, i) => (
                <div key={i} className="relative h-20 rounded-lg overflow-hidden">
                  <Image src={src} alt={`${project.title} ${i+2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overview */}
      {project.overview && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-3">Überblick</h2>
          <p className="text-gray-300">{project.overview}</p>
        </section>
      )}

      {/* Features & Challenges */}
      {(project.features?.length || project.challenges?.length) && (
        <section className="mt-12 grid md:grid-cols-2 gap-6">
          {project.features && project.features.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Wichtigste Features</h3>
              <ul className={`grid ${cols} gap-3`}>
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                    <span className="text-gray-200">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.challenges && project.challenges.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Herausforderungen</h3>
              <ul className="space-y-2">
                {project.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/50" />
                    <span className="text-gray-200">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Meta Info */}
      {project.meta && (
        <section className="mt-12 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {project.meta.role && (
            <div className="glass rounded-xl p-4"><div className="text-xs text-gray-400">Rolle</div><div className="font-medium">{project.meta.role}</div></div>
          )}
          {project.meta.duration && (
            <div className="glass rounded-xl p-4"><div className="text-xs text-gray-400">Dauer</div><div className="font-medium">{project.meta.duration}</div></div>
          )}
          {project.meta.year && (
            <div className="glass rounded-xl p-4"><div className="text-xs text-gray-400">Jahr</div><div className="font-medium">{project.meta.year}</div></div>
          )}
          {project.meta.teamSize && (
            <div className="glass rounded-xl p-4"><div className="text-xs text-gray-400">Team</div><div className="font-medium">{project.meta.teamSize}</div></div>
          )}
        </section>
      )}
    </div>
  );
}
