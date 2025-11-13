'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Activités à Toulouse
        </motion.h1>
        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Découvrez tous les clubs sportifs et intellectuels de Toulouse
        </motion.p>
        <motion.div
          className="hero__stats"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="hero__stat-item">
            <span className="hero__stat-icon">⚽</span>
            <span className="hero__stat-label">Activités sportives</span>
          </div>
          <div className="hero__stat-item">
            <span className="hero__stat-icon">🧠</span>
            <span className="hero__stat-label">Activités intellectuelles</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
