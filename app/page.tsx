// ABOUTME: Main landing page component for the intranet
// ABOUTME: Displays navigation and applications dashboard
import Link from 'next/link';
import Image from 'next/image';
import ApplicationsGrid from '@/components/ApplicationsGrid';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-dark-900/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-lg"
              />
            </div>

            <nav className="flex items-center space-x-6">
              <Link
                href="/streams"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Streams
              </Link>
              <Link
                href="/wiki"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Wiki
              </Link>
              <Link
                href="/files"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Files
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-primary-400 via-accent-purple to-accent-aqua bg-clip-text text-transparent">
            XNET
          </h2>
          <p className="text-xl text-gray-400">
            Human Decisions, Machine Speed
          </p>
        </div>
      </section>

      {/* Applications Dashboard */}
      <section id="apps" className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-white mb-2">Applications</h3>
          <p className="text-gray-400">Access XNET tools and services</p>
        </div>
        <ApplicationsGrid />
      </section>

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
