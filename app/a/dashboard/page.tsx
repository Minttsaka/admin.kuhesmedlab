import DashboardFirst from '@/components/DashboardFirst'
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function page() {

  const [ published, pending, activeSurvey, collaborations, recentPapers, highReview] = await prisma.$transaction([

    prisma.research.count({
      where:{
        publicationDate:{
          not: null,
        }
      },
      
    }),
    prisma.research.findMany({
     where:{
      status:"PENDING"
     }   
    }),

    prisma.survey.count({
        where:{
          status:"active"
        }
    }),
    prisma.research.count({
      where: {
        collaborator: {
          some: {},
        },
      }
    }),
    prisma.research.findMany({
      orderBy:{
        createdAt:"desc"
      },
      include:{
        user:true
      },
      take:5
    }),
    prisma.research.findMany({
      include: {
        review: true,
      },
      orderBy: {
        review: {
          _count: 'desc',
        },
      },
      take: 5,
    })
  ])
  return (
    <div>
      <DashboardFirst 
      published={published!} 
      pending={pending!} 
      activeSurvey={activeSurvey!} 
      collaborations={collaborations!}
      recentResearch={recentPapers!}
      highReview={highReview}
       />
    </div>
  )
}
