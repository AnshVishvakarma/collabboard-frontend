// components/layout/Footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="px-4 py-12 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CollabBoard
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </div>

          <div className="text-sm text-gray-500">
            © 2024 CollabBoard. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}