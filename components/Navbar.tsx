"use client"

import { useAuth, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function Navbar() {

  const pathname = usePathname()

  return (
    <div className={`flex items-center justify-between ${pathname === "/" && "border-b "} h-[60px] px-[2.5rem] py-3`}>
        <Logo />
        <div className='flex gap-4 items-center'>
          {/* {pathname !== "/" && <ThemeToggle />} */}
          <Auth />
        </div>
      </div>
  )
}

export default Navbar

function Auth() {
    const {isSignedIn} = useAuth()
    const router = useRouter()

    return(
        <div className='flex item-center justify-center gap-2'>
            {isSignedIn ? <UserButton /> : <Button className="bg-[#0384FD] hover:bg-blue-500 text-xs md:text-sm md:px-3 md:py-2" onClick={() => router.push("/sign-in")}>Create  <ArrowRight /></Button>}
        </div>
    )
}

function Logo() {
  const {isSignedIn} = useAuth()

  return (
    <Link 
        href={isSignedIn ? "/dashboard" : "/"}
        className='flex items-center justify-center text-2xl hover:cursor-pointer'
    >
        formers.
    </Link>
  )
}