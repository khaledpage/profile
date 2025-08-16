import Image from 'next/image';
import { getAllContent, getSiteConfig } from '@/utils/content';
import type { Project } from '@/types/content';
import Link from 'next/link';

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
  const cfg = await getSiteConfig().catch(() => null);
  const tCommon = cfg?.i18n?.languages?.[cfg?.i18n?.defaultLocale ?? 'de']?.common ?? { back: 'Zurück', seeAlso: 'Siehe auch' };
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      {/* Breadcrumbs */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="hover:text-accent-1 transition-colors" style={{ color: 'var(--muted)' }}>
              Home
            </Link>
          </li>
          <span style={{ color: 'var(--muted)' }}>/</span>
          <li>
            <Link href="/#projects" className="hover:text-accent-1 transition-colors" style={{ color: 'var(--muted)' }}>
              Projects
            </Link>
          </li>
          <span style={{ color: 'var(--muted)' }}>/</span>
          <li style={{ color: 'var(--foreground)' }}>{project.title}</li>
        </ol>
      </nav>
    {/* Floating Back Button (moved to right) */}
  <Link href="/" className="fab-nav btn-secondary">{tCommon.back} →</Link>
      {/* Header Section */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{project.title}</h1>
          <p className="mb-6" style={{ color: 'var(--muted)' }}>{project.description}</p>

          {/* Meta Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tech?.map((t) => (
              <span key={t} className="px-2 py-0.5 text-[12px] rounded-full" style={{
                backgroundColor: 'color-mix(in srgb, var(--card), transparent 40%)',
                color: 'var(--foreground)',
              }}>{t}</span>
            ))}
          </div>

          {/* Quick Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="glass rounded-xl p-4 text-center">
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{m.label}</div>
                  <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{m.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* External links */}
      <div className="flex gap-3">
            {project.links?.live && (
        <a href={project.links.live} target="_blank" rel="noreferrer" className="btn-primary interactive-border">
                Live ansehen
              </a>
            )}
            {project.links?.repo && (
        <a href={project.links.repo} target="_blank" rel="noreferrer" className="btn-secondary">Repository</a>
            )}
            {!project.links?.live && !project.links?.repo && (
        <a href={project.link} target="_blank" rel="noreferrer" className="btn-secondary">Projektlink</a>
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
          <p style={{ color: 'var(--foreground)' }}>{project.overview}</p>
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
                    <span style={{ color: 'var(--foreground)' }}>{f}</span>
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
                    <span style={{ color: 'var(--foreground)' }}>{c}</span>
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
            <div className="glass rounded-xl p-4"><div className="text-xs" style={{ color: 'var(--muted)' }}>Rolle</div><div className="font-medium" style={{ color: 'var(--foreground)' }}>{project.meta.role}</div></div>
          )}
          {project.meta.duration && (
            <div className="glass rounded-xl p-4"><div className="text-xs" style={{ color: 'var(--muted)' }}>Dauer</div><div className="font-medium" style={{ color: 'var(--foreground)' }}>{project.meta.duration}</div></div>
          )}
          {project.meta.year && (
            <div className="glass rounded-xl p-4"><div className="text-xs" style={{ color: 'var(--muted)' }}>Jahr</div><div className="font-medium" style={{ color: 'var(--foreground)' }}>{project.meta.year}</div></div>
          )}
          {project.meta.teamSize && (
            <div className="glass rounded-xl p-4"><div className="text-xs" style={{ color: 'var(--muted)' }}>Team</div><div className="font-medium" style={{ color: 'var(--foreground)' }}>{project.meta.teamSize}</div></div>
          )}
        </section>
      )}

      {/* See also */}
      <section className="mt-16">
  <h2 className="text-xl font-semibold mb-4">{tCommon.seeAlso}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.projects
            .filter((p) => slugify(p.title) !== slug)
            .slice(0, 3)
            .map((p) => (
              <Link key={p.title} href={`/projects/${slugify(p.title)}`} className="glass rounded-xl p-4 hover:translate-y-[-2px] transition">
                <div className="relative h-28 w-full rounded-lg overflow-hidden mb-3">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm line-clamp-2" style={{ color: 'var(--muted)' }}>{p.description}</div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
