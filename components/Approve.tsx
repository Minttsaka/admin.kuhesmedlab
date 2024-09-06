"sue client"

import { ResearchStatus } from '@prisma/client'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function Approve({id, status}:{id:string, status:ResearchStatus}) {

    const [res, setRes] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const approve = async (action:ResearchStatus)=>{

        try {
            setIsLoading(true)

            const response = await axios.post(`/api/institutions/${id}`,{
                status:action
            })
          
            toast(res)
            
        } catch (error) {
            console.log(error)
        } finally{
            setIsLoading(false)
        }

       
    }
  return (
    <div className='flex justify-between items-center w-full mt-5'>
        {status!=="APPROVED" && 
            <button onClick={()=>{approve("APPROVED"),setRes("APPROVED")}} className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 " disabled={isLoading}>
            {isLoading ? <Loader2 className='animate-spin' /> : 'Approve'}
            </button>}
            {status!=="DISAPPROVED" && 
        <button onClick={()=>{approve("DISAPPROVED"), setRes("DISAPPROVED")}} className="px-12 py-4 rounded-full bg-[red] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 " disabled={isLoading}>
        {isLoading ? <Loader2 className='animate-spin' /> : 'Disapprove'}
        </button>
}
      
    </div>
  )
}
