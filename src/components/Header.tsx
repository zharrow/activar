'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from './ui/button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/activites', label: 'Activités' },
    { href: '/sport', label: 'Sport' },
    { href: '/intellectuel', label: 'Intellectuel' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
              ActivityAround
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="px-4 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Link href="/activites">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm">
                Découvrir
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 animate-slide-up">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-md text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 px-4">
              <Link href="/activites" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                  Découvrir les activités
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
