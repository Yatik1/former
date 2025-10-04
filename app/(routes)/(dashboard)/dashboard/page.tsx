import { GetForms, GetFormStats } from '@/actions/form'
import CreateFormButton from '@/components/CreateFormButton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Form } from '@prisma/client'
import React, { Suspense } from 'react'
import {formatDistance} from "date-fns"
import { ArrowRight, Edit, Folder, View } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

function page() {
  return (
    <div className='container'>
        <Navbar />
        <div className="pt-4 px-8">
        <Suspense fallback={<StatsCards loading={true} />}>
          <CardStateWrapper />
        </Suspense>
        <Separator className='my-6'/>
        <h2 className="text-4xl font-medium col-span-2 tracking-tighter">All forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <CreateFormButton />
          <Suspense fallback={[1,2,3,4,5].map((el) => (
            <FormCardSkeleton key={el}/>
          ))}>
            <FormCards />
          </Suspense>
        </div>
        </div>
    </div>
  )
}

async function CardStateWrapper() {
  const stats = await GetFormStats()
  return <StatsCards loading={false} data={stats} />
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>
  loading:boolean
}

function StatsCards(props : StatsCardProps) {

  const {data,loading} = props

  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <StatsCard 
          title="Total Forms"
          value={data?.totalForms.toLocaleString() || ""}
          helperText='All forms created'
          loading={loading}
          className='text-white bg-gradient-to-br from-[#92C7FF] from-0% via-[#76B8FF] via-15% to-[#007BFF] to-72% border-none shadow-none'
        />
        <StatsCard 
          title="Total Visits"
          value={data?.visits.toLocaleString() || ""}
          helperText='All time forms visited'
          loading={loading}
        />
        <StatsCard 
          title="Total Submissions"
          value={data?.submissions.toLocaleString() || ""}
          helperText="All time forms submission"
          loading={loading}
        />
    </div>
  )
}

export function StatsCard({
  title,
  value,
  helperText,
  loading,
  className,
} : {
  title:string,
  value:string,
  helperText:string,
  loading:boolean,
  className?:string,
}) {
  return (
    <Card className={`${className} rounded-md shadow-none`}>
      <CardContent className='flex flex-col items-start justify-between space-y-5 pt-6 px-8'>
        <div className={`text-4xl font-semibold tracking-tight`}>
          {loading && (
            <Skeleton>
              <span className='opacity-0'>Skeleton</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>

        <div className={`text-sm font-medium flex flex-col items-center justify-center w-full tracking-tight`}>
          <p className="w-full text-[17px] font-medium">{title}</p>
          <p className={`w-full text-xs`}>{helperText}</p>
        </div>
        
      </CardContent>
    </Card>
  )
}

function FormCardSkeleton() {
  return <Skeleton className='border-2 border-primary/20 h-[190px] w-full'/>
}

async function FormCards() {
  const forms = await GetForms()

  return <>
   {forms.map((form) => (
      <FormCard key={form.id} form={form} />
   ))}
  </>
}

function FormCard({form} : {form:Form}) {
  return (
    <Card className='shadow-none rounded-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='flex item-center justify-between'>
          <span className='truncate font-semibold'>{form.name}</span>
          {form.published && <Badge className='bg-blue-100 font-normal shadow-none text-blue-500'>Published</Badge>}
          {!form.published && <Badge className="bg-orange-100 font-normal shadow-none text-orange-500 " >Draft</Badge>}
        </CardTitle>
        <CardDescription className='flex items-center justify-between text-muted-foreground text-sm'>
          {formatDistance(form.createdAt , new Date() , {
            addSuffix:true
          })}
          {form.published && (
            <span className='flex items-center justify-between gap-3'>
              <span className='flex items-center justify-center gap-1'>
                <View className='text-muted-foreground w-5 h-5' />
                <span>{form.visits.toLocaleString()}</span>
              </span>
              <span className='flex items-center justify-center gap-1'>
                <Folder className='text-muted-foreground w-5 h-5'/>
                <span>{form.submissions.toLocaleString()}</span>
              </span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[20px] truncate text-sm text-muted-foreground'>
        {form.description || "No description"}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className='w-full mt-2 text-sm gap-1 bg-[#0384FD] hover:bg-blue-400'>
             <Link href={`/forms/${form.id}`}>
                View Submissions <ArrowRight />
             </Link>
          </Button>
        )}
        {!form.published && (
          <Button asChild variant={'secondary'} className='w-full mt-2 text-sm gap-1'>
             <Link href={`/builder/${form.id}`}>
             <Edit /> Edit form 
             </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default page