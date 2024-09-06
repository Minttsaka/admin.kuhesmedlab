import SurveyFirst from '@/components/SurveyFirst'
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function page() {


  const survey = await prisma.surveyForm.findMany({
    include:{
      survey:{
        include:{
          research:true
        }
      },
      questions:{
        include:{
          choices:true
        }
      }
    },
    orderBy:{
      createdAt:"desc"
    }
  })
  return (
    <div>
        <SurveyFirst surveys={survey!} />
      
    </div>
  )
}
