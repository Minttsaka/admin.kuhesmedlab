"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarImage } from './ui/avatar'

export function LoadingState() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black  bg-opacity-50 backdrop-blur-md">
      <div className="text-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 rounded-lg p-6 shadow-xl shadow-purple-500">
        <motion.div
          className=" mb-3"
         
        >
          <Avatar>
          <AvatarImage src='/img/official-logo.png' className="object-cover" />
        </Avatar>
        </motion.div>
        <motion.h2
          className="text-4xl font-bold text-white mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading...
        </motion.h2>
        <motion.div
          className="w-64 h-2 bg-white/30 rounded-full mx-auto overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="h-full w-full bg-white rounded-full" />
        </motion.div>
      </div>
    </div>
  )
}