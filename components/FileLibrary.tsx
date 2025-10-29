// ABOUTME: File library component for browsing and downloading company files
// ABOUTME: Includes category filtering and search functionality
'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
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

export default function FileLibrary() {
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [filesRes, categoriesRes] = await Promise.all([
        fetch('/api/files'),
        fetch('/api/categories'),
      ]);

      if (filesRes.ok) {
        const filesData = await filesRes.json();
        setFiles(filesData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.categoryId === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎬';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return '📦';
    return '📎';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-white/10 rounded-lg w-full max-w-md animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 transition-colors"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Files List */}
      <div className="space-y-3">
        {filteredFiles.map(file => (
          <div key={file.id} className="glass-card-hover p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="text-2xl flex-shrink-0">
                  {getFileIcon(file.mimeType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-white font-medium truncate">{file.name}</h5>
                  {file.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {file.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span
                      className="px-2 py-1 rounded"
                      style={{ backgroundColor: file.category.color + '20', color: file.category.color }}
                    >
                      {file.category.name}
                    </span>
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <a
                href={file.filePath}
                download
                className="flex-shrink-0 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery || selectedCategory !== 'all'
              ? 'No files match your search'
              : 'No files available'}
          </p>
        </div>
      )}
    </div>
  );
}
