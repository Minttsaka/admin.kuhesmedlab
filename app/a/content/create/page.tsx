
import CreateBlog from '@/components/CreateBlog'
import dynamic from 'next/dynamic'
import React from 'react'

const CreateArticle = dynamic(() => import('@/components/CreateArticle'), {
  ssr: false,
})

export default function page() {
  return (
    <div>
      <CreateBlog />
      <CreateArticle />
    </div>
  )
}
