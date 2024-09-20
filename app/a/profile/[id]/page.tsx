import ProfileFirst from '@/components/ProfileFirst'
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function page({params:{id}}:{params:{id:string}}) {

  const user = await prisma.user.findUnique({
    where:{
      id
    },
    include:{
      departments:true,
      research:{
        include:{
          citationTrend:true,
          downloadTrend:true,
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
      }
    }

  })
  return (
    <div>
      <ProfileFirst user={user!} />
    </div>
  )
}
