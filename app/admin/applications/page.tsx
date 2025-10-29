// ABOUTME: Admin page for managing applications
// ABOUTME: Create, edit, and delete internal application links
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Application {
  id: string;
  name: string;
  description: string | null;
  url: string;
  ssoEnabled: boolean;
  icon: string | null;
  category: string | null;
  color: string;
  sortOrder: number;
}

export default function ApplicationsAdmin() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    ssoEnabled: false,
    icon: '',
    category: '',
    color: '#0ea5e9',
    sortOrder: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await fetch('/api/applications');
    if (res.ok) {
      const data = await res.json();
      setApplications(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingApp
      ? `/api/applications/${editingApp.id}`
      : '/api/applications';
    const method = editingApp ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchApplications();
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchApplications();
    }
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setFormData({
      name: app.name,
      description: app.description || '',
      url: app.url,
      ssoEnabled: app.ssoEnabled,
      icon: app.icon || '',
      category: app.category || '',
      color: app.color,
      sortOrder: app.sortOrder,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      url: '',
      ssoEnabled: false,
      icon: '',
      category: '',
      color: '#0ea5e9',
      sortOrder: 0,
    });
    setEditingApp(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 backdrop-blur-sm bg-dark-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Manage Applications</h1>
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
              ← Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Applications</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Application'}
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingApp ? 'Edit Application' : 'New Application'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm text-gray-300 mb-1">URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Icon (emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
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
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ssoEnabled"
                  checked={formData.ssoEnabled}
                  onChange={(e) => setFormData({ ...formData, ssoEnabled: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="ssoEnabled" className="text-sm text-gray-300">SSO Enabled</label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                >
                  {editingApp ? 'Update' : 'Create'} Application
                </button>
                {editingApp && (
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
          {applications.map((app) => (
            <div key={app.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: app.color }}
                  >
                    {app.icon || '📱'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium">{app.name}</h4>
                    <p className="text-sm text-gray-400 truncate">{app.url}</p>
                    {app.description && (
                      <p className="text-sm text-gray-500 mt-1">{app.description}</p>
                    )}
                    <div className="flex gap-2 mt-2 text-xs">
                      {app.category && (
                        <span className="px-2 py-1 rounded bg-white/10 text-gray-300">
                          {app.category}
                        </span>
                      )}
                      {app.ssoEnabled && (
                        <span className="px-2 py-1 rounded bg-accent-aqua/20 text-accent-aqua">
                          SSO
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(app)}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications yet. Click "Add Application" to create one.</p>
          </div>
        )}
      </main>
    </div>
  );
}
