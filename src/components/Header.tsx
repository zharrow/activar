'use client'

import Link from 'next/link'
import { useState } from 'react'
import '../styles/components/header.scss'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <nav className="header__nav">
          <Link href="/" className="header__logo">
            <span className="header__logo-text">ActivityAround</span>
          </Link>

          <button
            className={`header__burger ${isMenuOpen ? 'header__burger--open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`header__menu ${isMenuOpen ? 'header__menu--open' : ''}`}>
            <li className="header__menu-item">
              <Link href="/activites" onClick={() => setIsMenuOpen(false)}>
                Activités
              </Link>
            </li>
            <li className="header__menu-item">
              <Link href="/sport" onClick={() => setIsMenuOpen(false)}>
                Sport
              </Link>
            </li>
            <li className="header__menu-item">
              <Link href="/intellectuel" onClick={() => setIsMenuOpen(false)}>
                Intellectuel
              </Link>
            </li>
            <li className="header__menu-item">
              <Link href="/blog" onClick={() => setIsMenuOpen(false)}>
                Blog
              </Link>
            </li>
            <li className="header__menu-item">
              <Link href="/faq" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
