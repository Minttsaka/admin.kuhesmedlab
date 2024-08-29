'use client'

import { useState } from 'react'
import { Moon, Sun, Image as ImageIcon, Hash, Save, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import CreateArticle from './CreateArticle'

export default function CreateBlog() {
  const [darkMode, setDarkMode] = useState(false)


  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-extrabold">Create Content</h1>
            <Toggle aria-label="Toggle dark mode" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Toggle>
          </div>
        </div>
      </header>
    </div>
  )
}