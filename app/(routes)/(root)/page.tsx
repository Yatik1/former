"use client";

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent} from '@/components/ui/card'
import { Infinity, Lock } from 'lucide-react'
import Image from 'next/image'


const shapes = [
  {src:"./Ellipse 1.svg", position : "right-0", size:60},
  {src:"./Ellipse 2.svg", position : "left-[7rem] top-[14rem]", size:40},
  {src:"./Polygon 1.svg", position : "right-[20rem] top-[15rem]", size:40},
  {src:"./Polygon 2.svg", position : "top-3 left-[20rem]", size:40},
  {src:"./Star 1.svg", position : "left-0 top-[4rem]", size:50},
  {src:"./Star 2.svg", position : "right-[10rem] top-0", size:50},

]

const cards = [
  { icon:<Minimal />, title:"Minimal by design", content:"Clean, aesthatic and distraction free forms that look great everywhere on desktop, tablet and mobile."} ,
  { icon: <Infinity size={280} strokeWidth={0.1}/>, title: "Unlimited forms", content:"Build as many forms as you like, without limits. No paywalls, no restrictions – just effortless form creation."},
  { icon: <Lock size={280} strokeWidth={0.1} />, title:"Secure and Reliable", content:"Your data is encrypted. Protected privacy and compliance come standard."}
]

function Page() {

  const route = useRouter()

  return (
    <div className="w-full h-screen bg-white">
      <div className='bg-white border pb-2 container min-h-fit h-full'>
      <Navbar />  

      <section className="relative flex items-start justify-center">
        <div className="flex flex-col items-center justify-center gap-5 mt-[7rem]">
            <div className="flex items-center justify-center flex-col">
              <p className='text-[25px] md:text-[60px] tracking-tight leading-none'>Create Forms in minutes</p>
              <p className="text-xs md:text-sm text-[#909090]">Refreshing way to build your form.</p>
            </div>
            <Button className='bg-[#007BFF] hover:bg-blue-500 px-10 py-2 text-xs md:text-sm' onClick={() => route.push("/dashboard")}>{"Get started - it's free"}</Button>


            {shapes.map((shape,index) => (
              <Image key={index} src={shape.src} alt='ellipse' width={shape.size} height={shape.size} className={`absolute ${shape.position}`}/>
            ))}

        </div>
      </section>

      <div className='w-full mt-[4.3rem] px-3 flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-evenly'>
        {cards.map((card, index) => (
          <Card key={index} className='w-[300px] h-[300px] md:w-[329px] md:h-[391px] flex items-center justify-center flex-col shadow-none'>
          {card.icon}
          <CardContent className='flex flex-col gap-1'>
            <p className="font-medium tracking-tight text-[20px]">{card.title}</p>
            <p className="text-xs tracking-tight text-[#464646]">{card.content}</p>
          </CardContent>
        </Card>
        ))}
      </div>
    </div>
    </div>
  )
}

function Minimal() {
  return (
    <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M93.3346 105C93.3346 150.103 129.898 186.667 175.001 186.667C220.105 186.667 256.668 150.103 256.668 105C256.668 59.8967 220.105 23.3333 175.001 23.3333C129.898 23.3333 93.3346 59.8967 93.3346 105Z" stroke="#8B8686" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.3346 175C23.3346 220.103 59.898 256.667 105.001 256.667C150.105 256.667 186.668 220.103 186.668 175C186.668 129.897 150.105 93.3333 105.001 93.3333C59.898 93.3333 23.3346 129.897 23.3346 175Z" stroke="#8B8686" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  )
}

export default Page