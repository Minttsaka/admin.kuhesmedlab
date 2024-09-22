import SupportDashboard from '@/components/Support'
import prisma from '@/lib/prisma'
import React from 'react'

export default async function page({params:{slug}}:{params:{slug:string}}) {

  const support = await prisma.support.findUnique({
    where:{
      slug
    }
  })


  return (
    <div>
      <SupportDashboard support={support!} />
    </div>
  )
}
