"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useEffect } from 'react'

function Error({error} : {error:Error}) {

    useEffect(() => {
        console.log(error)
    } , [error])

  return (
    <div className='flex w-full h-screen flex-col items-center justify-center gap-4'>
        <h2 className="text-4xl">Something went wrong!</h2>
        <Button asChild>
            <Link href={"/"}>Go back to home</Link>
        </Button>
    </div>
  )
}

export default Error