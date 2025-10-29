// ABOUTME: Dedicated page for knowledge base articles
// ABOUTME: Full page layout for wiki/documentation browsing
import Link from 'next/link';
import Image from 'next/image';
import WikiGrid from '@/components/WikiGrid';

export default function WikiPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-dark-900/50 sticky top-0 z-50">
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

            <nav className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                ← Back to Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Knowledge Base</h1>
          <p className="text-gray-400">Guides, tutorials, and instructions for connecting to XNET services</p>
        </div>

        <WikiGrid />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} XNET. Internal use only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
