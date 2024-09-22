import ManagementFirst from '@/components/UserManagementFIrst'
import prisma from '@/lib/prisma'
import React from 'react'

export default async function page() {

  const admins = await prisma.user.findMany({

    where:{
      role:{
        not:"RESEARCHER"
      },
    },
    include: {
      research: true,
      departments:{
        include:{
          role:true
        }
      }
    },
  })

  return (
    <div>
        <ManagementFirst admins={admins!} />
    </div>
  )
}
