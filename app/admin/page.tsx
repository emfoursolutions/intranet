// ABOUTME: Admin dashboard page for managing applications and files
// ABOUTME: Main hub with navigation to different management sections
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    applications: 0,
    files: 0,
    categories: 0,
    wiki: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [appsRes, filesRes, catsRes, wikiRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/files'),
        fetch('/api/categories'),
        fetch('/api/wiki'),
      ]);

      const [apps, files, cats, wiki] = await Promise.all([
        appsRes.json(),
        filesRes.json(),
        catsRes.json(),
        wikiRes.json(),
      ]);

      setStats({
        applications: apps.length,
        files: files.length,
        categories: cats.length,
        wiki: wiki.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const adminCards = [
    {
      title: 'Applications',
      count: stats.applications,
      description: 'Manage internal applications and links',
      href: '/admin/applications',
      icon: '📱',
      color: '#0ea5e9',
    },
    {
      title: 'Wiki',
      count: stats.wiki,
      description: 'Manage knowledge base articles',
      href: '/admin/wiki',
      icon: '📖',
      color: '#22d3ee',
    },
    {
      title: 'Files',
      count: stats.files,
      description: 'Upload and manage file library',
      href: '/admin/files',
      icon: '📁',
      color: '#a78bfa',
    },
    {
      title: 'Categories',
      count: stats.categories,
      description: 'Organize files into categories',
      href: '/admin/categories',
      icon: '🏷️',
      color: '#075985',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-dark-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </Link>
            </div>
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
          <p className="text-gray-400">Manage your intranet content and applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="glass-card-hover p-6 group"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl"
                style={{ backgroundColor: card.color }}
              >
                {card.icon}
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">
                  {card.title}
                </h3>
                <span className="text-2xl font-bold text-white">{card.count}</span>
              </div>
              <p className="text-sm text-gray-400">{card.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
