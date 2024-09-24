'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Calendar, Clock, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Content } from '@prisma/client'
import confetti from 'canvas-confetti'
import { publishContent } from '@/lib/actions'
import { useToast } from './ui/use-toast'

interface BlogPreviewModalProps {
  isOpen: boolean
  onClose: React.Dispatch<React.SetStateAction<boolean>>
  post: Content
}

export default function BlogPreviewModal({ isOpen, onClose, post }: BlogPreviewModalProps) {
  const [animatedPost, setAnimatedPost] = useState(post)
  const [isPublishing, setIsPublishing] = useState(false)

  const {toast} = useToast()

  useEffect(() => {
    if (isOpen) {
      setAnimatedPost(post)
    }
  }, [isOpen, post])

  if (!isOpen) return null

  const onPublish = async()=>{

    try {

      setIsPublishing(true)
      const data = await publishContent(animatedPost.id)

      if(data==="Success"){
        toast({
          title:"Published",
          description:"Successfully Published"
        })

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      } else{
        toast({
          title:" Not Published",
          description:"Failed to Publish due to server error."
        })
      }
      
    } catch (error) {
      
    } finally{
      setIsPublishing(false)
    }

  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden"
        >
          <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 text-white">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:bg-white hover:bg-opacity-20"
              onClick={()=>onClose(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h2 className="text-3xl font-bold mb-2">Preview : {animatedPost?.title}</h2>
            <p className="text-lg opacity-90">Your blog post is ready to inspire the world!</p>
          </div>
          
          <ScrollArea className="h-[60vh] p-6">
            <img src={animatedPost.image!} className='rounded-md my-5' />
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-extrabold mb-4 text-gray-900"
            >
              {animatedPost?.title}
            </motion.h1>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4 mb-6"
            >
              <Avatar>
                <AvatarImage src={animatedPost?.creatorImage! ?? '/avatar.png'} alt={animatedPost?.creatorName} />
                <AvatarFallback>{animatedPost?.creatorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-700">{animatedPost?.creatorName}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(animatedPost?.createdAt).toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 ml-3 mr-1" />
                  <span>{animatedPost?.createdAt.toDateString()}</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {/* {animatedPost?.tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))} */}
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: animatedPost?.body! }}
            />
          </ScrollArea>
          
          <div className="bg-gray-100 p-6 flex justify-between items-center">
            <p className="text-gray-600 italic">
              Great things are done by a series of small things brought together. - Vincent Van Gogh
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={onPublish} className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              disabled={isPublishing}>
               {isPublishing ? "Publishing..." : "Publish Now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}