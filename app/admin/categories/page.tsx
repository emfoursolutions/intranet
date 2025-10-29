// ABOUTME: Admin page for managing file categories
// ABOUTME: Create, edit, and delete categories for organizing files
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  _count?: {
    files: number;
  };
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#0ea5e9',
    icon: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingCategory
      ? `/api/categories/${editingCategory.id}`
      : '/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchCategories();
      resetForm();
    }
  };

  const handleDelete = async (id: string, fileCount: number) => {
    if (fileCount > 0) {
      if (!confirm(`This category has ${fileCount} files. Deleting it will also delete all associated files. Are you sure?`)) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to delete this category?')) {
        return;
      }
    }

    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchCategories();
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#0ea5e9',
      icon: '',
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 backdrop-blur-sm bg-dark-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Manage Categories</h1>
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
              ← Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Categories</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                />
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
                  <label className="block text-sm text-gray-300 mb-1">Icon (emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                >
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
                {editingCategory && (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon || '🏷️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium">{category.name}</h4>
                    <p className="text-sm text-gray-400">
                      {category._count?.files || 0} files
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(category)}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category._count?.files || 0)}
                    className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories yet. Click "Add Category" to create one.</p>
          </div>
        )}
      </main>
    </div>
  );
}
