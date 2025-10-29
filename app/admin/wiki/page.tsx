// ABOUTME: Admin page for managing wiki articles/knowledge base
// ABOUTME: Create, edit, and delete wiki articles with markdown support
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface WikiArticle {
  id: string;
  title: string;
  description: string | null;
  content: string;
  icon: string | null;
  color: string;
  category: string | null;
  sortOrder: number;
}

export default function WikiAdmin() {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<WikiArticle | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    icon: '',
    color: '#0ea5e9',
    category: '',
    sortOrder: 0,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const res = await fetch('/api/wiki');
    if (res.ok) {
      const data = await res.json();
      setArticles(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let iconPath = formData.icon;

      // Upload icon file if provided
      if (iconFile) {
        const iconFormData = new FormData();
        iconFormData.append('file', iconFile);
        iconFormData.append('type', 'icon');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: iconFormData,
        });

        if (uploadRes.ok) {
          const { filePath } = await uploadRes.json();
          iconPath = filePath;
        } else {
          alert('Failed to upload icon');
          setUploading(false);
          return;
        }
      }

      const url = editingArticle
        ? `/api/wiki/${editingArticle.id}`
        : '/api/wiki';
      const method = editingArticle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, icon: iconPath }),
      });

      if (res.ok) {
        fetchArticles();
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      alert('An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    const res = await fetch(`/api/wiki/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchArticles();
    }
  };

  const handleEdit = (article: WikiArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      description: article.description || '',
      content: article.content,
      icon: article.icon || '',
      color: article.color,
      category: article.category || '',
      sortOrder: article.sortOrder,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      icon: '',
      color: '#0ea5e9',
      category: '',
      sortOrder: 0,
    });
    setIconFile(null);
    setEditingArticle(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 backdrop-blur-sm bg-dark-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Manage Wiki Articles</h1>
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
              ← Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Wiki Articles</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Article'}
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingArticle ? 'Edit Article' : 'New Article'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short description shown on card"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Content (Markdown) *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  placeholder="Write your content in Markdown format...&#10;&#10;# Heading 1&#10;## Heading 2&#10;- Bullet point&#10;1. Numbered list&#10;**Bold text**&#10;`code`&#10;```&#10;code block&#10;```"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports Markdown: headings, lists, links, code blocks, tables, etc.
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Icon</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Emoji or Text</label>
                    <input
                      type="text"
                      placeholder="📖 or text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Or Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary-600 file:text-white file:cursor-pointer"
                    />
                    {iconFile && (
                      <p className="text-xs text-gray-400 mt-1">Selected: {iconFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 rounded-lg bg-white/5 border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Saving...' : editingArticle ? 'Update' : 'Create'} Article
                </button>
                {editingArticle && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: article.color }}
                  >
                    {article.icon?.startsWith('/') ? (
                      <Image
                        src={article.icon}
                        alt={article.title}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{article.icon || '📖'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium">{article.title}</h4>
                    {article.description && (
                      <p className="text-sm text-gray-400">{article.description}</p>
                    )}
                    <div className="flex gap-2 mt-2 text-xs">
                      {article.category && (
                        <span className="px-2 py-1 rounded bg-white/10 text-gray-300">
                          {article.category}
                        </span>
                      )}
                      <span className="text-gray-500">
                        {article.content.length} characters
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(article)}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No wiki articles yet. Click "Add Article" to create one.</p>
          </div>
        )}
      </main>
    </div>
  );
}
