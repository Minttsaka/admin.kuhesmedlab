import ManagementFirst from '@/components/UserManagementFIrst'
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function page() {

  const admins = await prisma.user.findMany({

    where:{
      role:{
        not:'researcher'
      }
    },
    include: {
      research: true
    },
  })

  console.log(admins)
  return (
    <div>
        <ManagementFirst admins={admins} />
    </div>
  )
}
