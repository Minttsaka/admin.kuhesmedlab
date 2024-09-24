
import CreateBlog from '@/components/CreateBlog'
import dynamic from 'next/dynamic'
import React from 'react'
import prisma from '@/lib/prisma'

const CreateArticle = dynamic(() => import('@/components/CreateArticle'), {
  ssr: false,
})

export default async function page({params:{slug}}:{params:{slug:string}}) {

  const post = await prisma.content.findUnique({
    where:{
      slug
    }
  })
  return (
    <div>
      <CreateBlog />
      <CreateArticle post={post!} />
    </div>
  )
}
