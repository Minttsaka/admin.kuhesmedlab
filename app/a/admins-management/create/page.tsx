import AddMember from '@/components/AddMember'
import prisma from '@/lib/prisma'
import React from 'react'

export default async function page() {

  const [department, institutions] = await prisma.$transaction([
    prisma.department.findMany({
      include:{
        role:true
      }
    }),

    prisma.institution.findMany({
      orderBy:{
        createdAt:"desc"
      }
    })

  ])


  console.log(department)
  return (
    <div>
      <AddMember dep={department!} institutions={institutions!} />
    </div>
  )
}
