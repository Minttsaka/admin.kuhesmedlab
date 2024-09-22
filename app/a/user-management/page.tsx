
import UserManagement from '@/components/UserManagement'
import prisma from '@/lib/prisma'
import React from 'react'

export default async function page() {

  const user = await prisma.user.findMany({

    include: {
      research: true,
      departments:true
    },
  })

  return (
    <div>
        <UserManagement users={user!} />
    </div>
  )
}
