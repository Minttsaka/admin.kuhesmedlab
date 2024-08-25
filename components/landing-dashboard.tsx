'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuIcon, XIcon, ChevronDownIcon } from 'lucide-react'

const menuItems = [
  {
    name: 'Home',
    subLinks: ['Dashboard', 'Analytics', 'Reports'],
  },
  {
    name: 'About',
    subLinks: ['Our Story', 'Team', 'Careers'],
  },
  {
    name: 'Services',
    subLinks: ['Consulting', 'Development', 'Design'],
  },
  {
    name: 'Portfolio',
    subLinks: ['Web Projects', 'Mobile Apps', 'Case Studies'],
  },
  {
    name: 'Contact',
    subLinks: ['General Inquiries', 'Support', 'Partnerships'],
  },
]

export default function LandingFirst() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-800">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
      
      <header className="relative z-10 flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-white">CurvyMenu</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm pt-16"
          >
            <motion.ul
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
              }}
              className="flex w-full max-w-md flex-col items-stretch space-y-2 p-4 text-left"
            >
              {menuItems.map((item) => (
                <motion.li
                  key={item.name}
                  variants={{
                    open: { y: 0, opacity: 1 },
                    closed: { y: 20, opacity: 0 },
                  }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm"
                >
                  <button
                    onClick={() => toggleAccordion(item.name)}
                    className="flex w-full items-center justify-between p-4 text-left text-xl font-semibold text-white transition-colors hover:text-purple-300"
                    aria-expanded={activeAccordion === item.name}
                  >
                    {item.name}
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform ${
                        activeAccordion === item.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === item.name && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        {item.subLinks.map((subLink) => (
                          <motion.li
                            key={subLink}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <a
                              href="#"
                              className="block p-3 pl-8 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {subLink}
                            </a>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex h-full items-center justify-center px-4">
        <h2 className="text-center text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Welcome to our<br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Curved Universe
          </span>
        </h2>
      </main>

      <svg
        className="absolute bottom-0 left-0 w-full text-white/10"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          fillOpacity="1"
          d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,213.3C840,224,960,224,1080,213.3C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>
    </div>
  )
}