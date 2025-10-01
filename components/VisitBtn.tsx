"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

function VisitBtn({shareUrl} : {shareUrl:string}) {

    const [mounted, setMounted] = useState(false)
    const shareLink = `${window.location.origin}/submit/${shareUrl}`

    useEffect(() => {
        setMounted(true)
    } , [])

    if(!mounted) return null;

  return (
    <Button
        className='w-[100px] gap-1 rounded-sm'
        onClick={() => {
            window.open(shareLink,"_blank")
        }}
    >
        Visit
        <ArrowRight className='w-4 h-4 rotate-[-45deg]' />
    </Button>
  )
}

export default VisitBtn