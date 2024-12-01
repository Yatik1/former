"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Share } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

function FormLinkShare({shareUrl} : {shareUrl:string}) {

    const [mounted, setMounted] = useState(false)
    const shareLink = `${window.location.origin}/submit/${shareUrl}`

    useEffect(() => {
        setMounted(true)
    } , [])

    if(!mounted) return null;

  return (
    <div className="flex flex-grow gap-4 items-center">
        <Input value={shareLink} readOnly/>
        <Button
            className='w-[200px] flex items-center justify-center gap-2'
            onClick={() => {
                navigator.clipboard.writeText(shareLink)
                toast({
                    title:"Copied",
                    description:"Link copied to clipboard"
                })
            }}
        >
            <Share className='h-4 w-4'/>
            Share link
    </Button>
    </div>
  )
}

export default FormLinkShare