// ABOUTME: Admin page for managing files
// ABOUTME: Upload, edit, and delete files with category assignment
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface File {
  id: string;
  name: string;
  description: string | null;
  filePath: string;
  fileSize: number;
  mimeType: string;
  categoryId: string;
  createdAt: string;
  category: Category;
}

export default function FilesAdmin() {
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [filesRes, catsRes] = await Promise.all([
      fetch('/api/files'),
      fetch('/api/categories'),
    ]);

    if (filesRes.ok) {
      const data = await filesRes.json();
      setFiles(data);
    }

    if (catsRes.ok) {
      const data = await catsRes.json();
      setCategories(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (editingFile) {
        const res = await fetch(`/api/files/${editingFile.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          fetchData();
          resetForm();
        }
      } else {
        if (!uploadFile) {
          alert('Please select a file');
          setUploading(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('file', uploadFile);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('categoryId', formData.categoryId);

        const res = await fetch('/api/files', {
          method: 'POST',
          body: formDataToSend,
        });

        if (res.ok) {
          fetchData();
          resetForm();
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to upload file');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    const res = await fetch(`/api/files/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchData();
    }
  };

  const handleEdit = (file: File) => {
    setEditingFile(file);
    setFormData({
      name: file.name,
      description: file.description || '',
      categoryId: file.categoryId,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: '',
    });
    setUploadFile(null);
    setEditingFile(null);
    setShowForm(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 backdrop-blur-sm bg-dark-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Manage Files</h1>
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
              ← Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Files</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            {showForm ? 'Cancel' : '+ Upload File'}
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingFile ? 'Edit File' : 'Upload New File'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingFile && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">File *</label>
                  <input
                    type="file"
                    required
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                  />
                  {uploadFile && (
                    <p className="text-sm text-gray-400 mt-1">
                      Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
                    </p>
                  )}
                </div>
              )}
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
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Category *</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Processing...' : editingFile ? 'Update' : 'Upload'} File
                </button>
                {editingFile && (
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
          {files.map((file) => (
            <div key={file.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium">{file.name}</h4>
                  {file.description && (
                    <p className="text-sm text-gray-400 mt-1">{file.description}</p>
                  )}
                  <div className="flex gap-3 mt-2 text-xs">
                    <span
                      className="px-2 py-1 rounded"
                      style={{ backgroundColor: file.category.color + '20', color: file.category.color }}
                    >
                      {file.category.name}
                    </span>
                    <span className="text-gray-500">{formatFileSize(file.fileSize)}</span>
                    <span className="text-gray-500">{new Date(file.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={file.filePath}
                    download
                    className="px-3 py-1 rounded bg-primary-600 hover:bg-primary-700 text-white text-sm transition-colors"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleEdit(file)}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {files.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No files yet. Click "Upload File" to add one.</p>
          </div>
        )}
      </main>
    </div>
  );
}
