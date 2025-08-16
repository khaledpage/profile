'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Article } from '@/types/article';
import type { SiteConfig } from '@/types/content';
import ArticleCard from '@/components/ui/ArticleCard';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { isAdminEnabled } from '@/utils/admin';

type Props = {
  initial: Article[];
  config: SiteConfig;
};

export default function ArticlesExplorer({ initial, config }: Props) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [admin, setAdmin] = useState(isAdminEnabled(config));
  const allowUpload = !!config.admin?.allowZipUpload;

  useEffect(() => {
    const handler = (ev: Event) => {
      const e = ev as CustomEvent<{ enabled?: boolean }>;
      setAdmin(!!e?.detail?.enabled);
    };
    window.addEventListener('adminModeChanged', handler as EventListener);
    return () => window.removeEventListener('adminModeChanged', handler as EventListener);
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    initial.forEach(a => a.metadata.tags.forEach(t => set.add(t)));
    return Array.from(set).sort((a,b)=>a.localeCompare(b));
  }, [initial]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initial.filter(a => {
      const matchesQ = !q || [
        a.metadata.title,
        a.metadata.summary,
        a.metadata.category,
        a.metadata.tags.join(' ')
      ].some(v => v.toLowerCase().includes(q));
      const matchesTags = selectedTags.length === 0 || selectedTags.every(t => a.metadata.tags.includes(t));
      return matchesQ && matchesTags;
    });
  }, [initial, query, selectedTags]);

  // Admin: upload ZIP(s) and package into a single merged zip for download
  const [importsInfo, setImportsInfo] = useState<{slug:string; title?:string}[]>([]);
  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const merged = new JSZip();
    const info: {slug:string; title?:string}[] = [];
  type ZipEntry = { name: string; dir: boolean; async: (type: 'string' | 'arraybuffer') => Promise<string | ArrayBuffer> };

    for (const file of Array.from(files)) {
      const buf = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buf);
      // expect root folder per article or entries directly with metadata.json/article.md
      // find metadata.json to infer slug
  let slug = '';
  const filesArr = Object.values(zip.files) as unknown as ZipEntry[];
  const metaEntry = filesArr.find((f) => f.name.endsWith('metadata.json')) as ZipEntry | undefined;
  if (!metaEntry) continue;
      const metaStr = await metaEntry.async('string');
      let title: string | undefined = undefined;
      try {
        const meta = JSON.parse(String(metaStr));
        title = meta?.title;
      } catch {}
      const parts = metaEntry.name.split('/');
      if (parts.length > 1) slug = parts[parts.length - 2];
      else slug = file.name.replace(/\.zip$/i, '');

      // copy all into merged zip under slug/
      for (const [name, entry] of Object.entries(zip.files) as unknown as [string, ZipEntry][]) {
        if (entry.dir) continue;
  const data = await entry.async('arraybuffer');
  merged.file(`${slug}/${name.replace(/^.*?\//, '')}`, data as ArrayBuffer);
      }
      info.push({ slug, title });
    }

    const blob = await merged.generateAsync({ type: 'blob' });
    saveAs(blob, 'imported-articles.zip');
    setImportsInfo(info);
  };

  const allowZipDownload = !!config.admin?.allowZipDownload;

  return (
    <div>
      {/* Controls */}
      <div className="glass rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <input
            type="text"
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Search by title, summary, tag..."
            className="w-full md:max-w-md px-3 py-2 rounded-lg bg-transparent border"
            style={{ borderColor: 'color-mix(in srgb, var(--card), transparent 60%)', color: 'var(--foreground)' }}
          />
          {admin && allowUpload && (
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <span 
                  className="px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 hover:opacity-80"
                  style={{ 
                    backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 85%)',
                    color: 'var(--accent-1)',
                    borderColor: 'var(--accent-1)'
                  }}
                >
                  Upload Article ZIPs
                </span>
                <input 
                  type="file" 
                  accept=".zip" 
                  multiple 
                  onChange={e=>onUpload(e.target.files)} 
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={()=>setSelectedTags(active ? selectedTags.filter(t=>t!==tag) : [...selectedTags, tag])}
                  className={`px-2 py-1 rounded-lg text-xs border ${active ? 'font-medium' : ''}`}
                  style={{
                    backgroundColor: active ? 'color-mix(in srgb, var(--accent-1), transparent 85%)' : 'transparent',
                    color: active ? 'var(--accent-1)' : 'var(--muted)',
                    borderColor: 'color-mix(in srgb, var(--card), transparent 60%)'
                  }}
                >
                  #{tag}
                </button>
              );
            })}
            {selectedTags.length > 0 && (
              <button
                onClick={()=>setSelectedTags([])}
                className="px-2 py-1 rounded-lg text-xs border"
                style={{ borderColor: 'color-mix(in srgb, var(--card), transparent 60%)', color: 'var(--muted)' }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {admin && importsInfo.length > 0 && (
          <div 
            className="mt-4 p-4 rounded-lg border"
            style={{ 
              backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 90%)',
              borderColor: 'var(--accent-1)',
              color: 'var(--foreground)'
            }}
          >
            <h4 className="font-medium mb-2">Import Successful!</h4>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Imported articles: <strong>{importsInfo.map(i=>i.title || i.slug).join(', ')}</strong>
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              A ZIP file named <code className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>imported-articles.zip</code> was downloaded. 
              Extract it into <code className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>src/content/articles/</code> then rebuild the project.
            </p>
          </div>
        )}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              adminEnabled={admin}
              allowZipDownload={allowZipDownload}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl" style={{ color: 'var(--muted)' }}>
            No matching articles.
          </p>
        </div>
      )}
    </div>
  );
}
