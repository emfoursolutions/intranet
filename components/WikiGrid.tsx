// ABOUTME: Grid component displaying wiki articles/knowledge base cards
// ABOUTME: Opens modal with markdown-rendered content when clicked
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface WikiArticle {
  id: string;
  title: string;
  description: string | null;
  content: string;
  icon: string | null;
  color: string;
  category: string | null;
}

export default function WikiGrid() {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<WikiArticle | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/wiki');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching wiki articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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
    <>
      {/* Wiki Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <button
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-6 group hover:from-dark-700 hover:to-dark-800 transition-all duration-300 border border-white/10 hover:border-primary-500/50 text-left"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg overflow-hidden"
                style={{ backgroundColor: article.color }}
              >
                {article.icon?.startsWith('/') ? (
                  <Image
                    src={article.icon}
                    alt={article.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{article.icon || '📖'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                  {article.title}
                </h4>
                {article.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{article.description}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No wiki articles available</p>
        </div>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-dark-900 rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-4 p-6 border-b border-white/10">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: selectedArticle.color }}
              >
                {selectedArticle.icon?.startsWith('/') ? (
                  <Image
                    src={selectedArticle.icon}
                    alt={selectedArticle.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{selectedArticle.icon || '📖'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white">{selectedArticle.title}</h2>
                {selectedArticle.description && (
                  <p className="text-gray-400 mt-1">{selectedArticle.description}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 prose prose-invert prose-blue max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedArticle.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
