// ABOUTME: Grid component displaying internal applications with SSO/direct links
// ABOUTME: Fetches applications from API and renders in responsive grid layout
'use client';

import { useEffect, useState } from 'react';
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
}

export default function ApplicationsGrid() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(applications.map(app => app.category).filter(Boolean))];
  const filteredApps = filter === 'all'
    ? applications
    : applications.filter(app => app.category === filter);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="w-12 h-12 bg-white/10 rounded-lg mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === cat
                  ? 'bg-primary-600 text-white'
                  : 'glass-card-hover text-gray-300'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredApps.map(app => (
          <a
            key={app.id}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-6 group hover:from-dark-700 hover:to-dark-800 transition-all duration-300 border border-white/10 hover:border-primary-500/50 overflow-hidden"
          >
            {/* Hover Arrow */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg"
                style={{ backgroundColor: app.color }}
              >
                {app.icon || '📱'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                  {app.name}
                </h4>
                {app.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{app.description}</p>
                )}
                {app.ssoEnabled && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-accent-aqua/20 text-accent-aqua">
                    SSO
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No applications available</p>
        </div>
      )}
    </div>
  );
}
