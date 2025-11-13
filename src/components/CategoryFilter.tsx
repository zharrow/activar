'use client'

import { motion } from 'framer-motion'

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: 'all', label: 'Toutes', icon: '🎯' },
  { id: 'sport', label: 'Sports', icon: '⚽' },
  { id: 'intellectual', label: 'Intellectuel', icon: '🧠' }
]

export default function CategoryFilter({
  activeCategory,
  onCategoryChange
}: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <div className="category-filter__buttons">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`category-filter__button ${
              activeCategory === category.id
                ? 'category-filter__button--active'
                : ''
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span className="category-filter__icon">{category.icon}</span>
            <span className="category-filter__label">{category.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
