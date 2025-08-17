'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { isAdminEnabled } from '@/utils/admin';
import { Article } from '@/types/article';
import ArticleEditModal from '@/components/articles/ArticleEditModal';

interface ArticleAdminActionsProps {
  article: Article;
}

export default function ArticleAdminActions({ article }: ArticleAdminActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();
  const adminEnabled = isAdminEnabled();

  if (!adminEnabled) {
    return null;
  }

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': localStorage.getItem('adminPassword') || '',
        },
        body: JSON.stringify({ slug: article.slug }),
      });

      if (response.ok) {
        router.push('/articles');
      } else {
        const error = await response.text();
        alert(`Failed to delete article: ${error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete article');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditComplete = async (updatedArticle: Article): Promise<boolean> => {
    try {
      setIsEditModalOpen(false);
      // Refresh the page to show updated content
      router.refresh();
      return true;
    } catch (error) {
      console.error('Edit completion error:', error);
      return false;
    }
  };

  return (
    <div className="fixed right-4 bottom-20 flex flex-col gap-2 z-40">
      {/* Edit Button */}
      <button
        id="article-edit-button"
        onClick={() => setIsEditModalOpen(true)}
        className="flex items-center justify-center p-3 rounded-lg transition-all shadow-lg"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--card), transparent 20%)',
          border: '1px solid color-mix(in srgb, var(--foreground), transparent 90%)',
          color: 'var(--foreground)',
          backdropFilter: 'blur(12px)',
        }}
        title="Edit Article"
      >
        <PencilIcon className="h-5 w-5" />
      </button>

      {/* Delete Button */}
      <button
        id="article-delete-button"
        onClick={handleDelete}
        disabled={isDeleting}
        className={`flex items-center justify-center p-3 rounded-lg transition-all shadow-lg ${
          showDeleteConfirm ? 'ring-2 ring-red-500' : ''
        }`}
        style={{
          backgroundColor: showDeleteConfirm 
            ? 'color-mix(in srgb, red, transparent 20%)'
            : 'color-mix(in srgb, var(--card), transparent 20%)',
          border: `1px solid ${showDeleteConfirm ? 'red' : 'color-mix(in srgb, var(--foreground), transparent 90%)'}`,
          color: showDeleteConfirm ? 'red' : 'var(--foreground)',
          backdropFilter: 'blur(12px)',
          opacity: isDeleting ? 0.5 : 1,
        }}
        title={showDeleteConfirm ? 'Click again to confirm deletion' : 'Delete Article'}
      >
        {isDeleting ? (
          <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <TrashIcon className="h-5 w-5" />
        )}
      </button>

      {showDeleteConfirm && (
        <div className="absolute right-16 bottom-0 p-3 rounded-lg shadow-lg text-sm whitespace-nowrap"
             style={{
               backgroundColor: 'var(--card)',
               border: '1px solid color-mix(in srgb, var(--foreground), transparent 90%)',
               color: 'var(--foreground)',
             }}>
          Click again to confirm deletion
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ArticleEditModal
          article={article}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditComplete}
        />
      )}
    </div>
  );
}
