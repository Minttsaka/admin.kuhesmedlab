import ResearchPaper from '@/components/ResearchPaper'
import prisma from '@/lib/prisma'
import React from 'react'

export default async function page() {

  const research = await prisma.research.findMany({
    orderBy:{
      createdAt:"desc"
    },
  })

  console.log(research)
  return (
    <div>
      <ResearchPaper research={research!} />
    </div>
  )
}
