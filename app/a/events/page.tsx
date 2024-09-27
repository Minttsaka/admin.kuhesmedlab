
import dynamic from 'next/dynamic'
import React from 'react'

const Events = dynamic(() => import('@/components/Events'), {
  ssr: false,
})

export default function page() {
  return (
    <div>
      <Events />
    </div>
  )
}
