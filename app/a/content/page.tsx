import ContentList from '@/components/ContentList'
import React from 'react'
import prisma from "@/lib/prisma"

export default async function page() {

    const contentList = await prisma.content.findMany({
        orderBy:{
            createdAt:"desc"
        }
    })
  return (
    <div>
      <ContentList content={contentList!} />
    </div>
  )
}
