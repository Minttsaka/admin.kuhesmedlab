import SupportTopics from '@/components/HelpCenter'
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function page() {

  const topics = await prisma.support.findMany({
    orderBy:{
      createdAt:"desc"
    }
  })

  console.log(topics)
  return (
    <div>
      <SupportTopics topics={topics!} />
    </div>
  )
}
