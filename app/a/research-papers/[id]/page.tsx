import SingleResearch from '@/components/SingleResearch'
import SingleSideBarResearchList from '@/components/SingleSideBarResearchList'
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function page({params:{id}}:{params:{id:string}}) {


  const [researchList , research ] = await prisma.$transaction([

    prisma.research.findMany({
      where:{
        publicationDate:null,
        status:"PENDING"
      },
      include:{
        user:true,
        authors:true
      }
    }),

    prisma.research.findUnique({
      where:{
        id
      },
      include:{
        tag:true,
        review:true,
        surveys:{
          include:{
            surveyForm:{
              include:{
                questions:{
                  include:{
                    choices:true
                  }
                }
              }
            }
          }
        },
        authors:true,
        files:true,
        user:true,
        institution:true,
        collaborator:true,
        reference:true
      }
    })

  ])

 
  return (
    <div className='flex'>
      <SingleSideBarResearchList research={researchList!} id={id} />
      <SingleResearch research={research!} />
    </div>
  )
}
