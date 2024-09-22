import SingleResearch from '@/components/SingleResearch'
import SingleSideBarResearchList from '@/components/SingleSideBarResearchList'
import prisma from '@/lib/prisma'
import React from 'react'

export default async function page({params:{id}}:{params:{id:string}}) {


  const [researchList , research ] = await prisma.$transaction([

    prisma.research.findMany({
  
      include:{
        user:true,
      }
    }),

    prisma.research.findUnique({
      where:{
        id
      },
      include:{
        citationTrend:true,
        downloadTrend:true,
        files:true,
        reference:true,
        collaborator:{
          include:{
            user:true
          }
        },
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
        }
      }
    })

  ])

  console.log(researchList)

 
  return (
    <div className='flex'>
      <SingleSideBarResearchList research={researchList!} id={id} />
      <SingleResearch research={research!} />
    </div>
  )
}
