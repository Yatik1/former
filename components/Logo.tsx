import Link from 'next/link'
import React from 'react'

function Logo() {
  return (
    <Link 
        href={"/"}
        className='flex items-center justify-center font-bold text-2xl hover:cursor-pointer'
    >
        Former
    </Link>
  )
}

export default Logo