'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' 
        : 'bg-white/80 backdrop-blur-md border-b border-gray-100/50'
    }`} style={{margin:"24px"}}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 m-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
              <div className="absolute inset-[3px] bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs md:text-sm">CB</span>
              </div>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900">
              Collab<span className="text-blue-600">Board</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/features" 
              className="text-gray-600 hover:text-gray-900 hover:scale-105 transition-all duration-200"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-600 hover:text-gray-900 hover:scale-105 transition-all duration-200"
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 hover:scale-105 transition-all duration-200"
            >
              About
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-600 hover:text-gray-900 hover:scale-105 transition-all duration-200"
            >
              Blog
            </Link>
            <Link 
              href="/support" 
              className="text-gray-600 hover:text-gray-900 hover:scale-105 transition-all duration-200"
            >
              Support
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="default">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-down">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/features" 
                className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/blog" 
                className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/support" 
                className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <div className="pt-4 flex flex-col space-y-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}