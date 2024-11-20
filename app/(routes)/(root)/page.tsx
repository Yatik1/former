
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

function page() {
  return (
    <div className='conatiner pt-4 px-8'>
        <Suspense fallback={<StatsCards loading={true} />}>
          <CardStateWrapper />
        </Suspense>
        <Separator className='my-6'/>
        <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
        <Separator className='my-6'/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateFormButton />
          <Suspense fallback={[1,2,3,4,5].map((el) => (
            <FormCardSkeleton key={el}/>
          ))}>
            <FormCards />
          </Suspense>
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
    <div className='w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard 
          title="Total Visits"
          value={data?.visits.toLocaleString() || ""}
          helperText='All time form visits'
          loading={loading}
        />
        <StatsCard 
          title="Total Submissions"
          value={data?.visits.toLocaleString() || ""}
          helperText='All time form submissions'
          loading={loading}
        />
        <StatsCard 
          title="Submission Rate"
          value={data?.submissionRate.toLocaleString()+"%" || ""}
          helperText="Visits that results in form submissions"
          loading={loading}
        />
        <StatsCard 
          title="Bounce Rate"
          value={data?.bounceRate.toLocaleString()+"%" || ""}
          helperText='Visits that leaves without interacting'
          loading={loading}
        />
    </div>
  )
}

function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
} : {
  title:string,
  value:string,
  icon?:React.ReactNode,
  helperText:string,
  loading:boolean,
  className?:string
}) {
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className='opacity-0'>Skeleton</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
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
    <Card>
      <CardHeader>
        <CardTitle className='flex item-center justify-between gap-2'>
          <span className='truncate font-bold'>{form.name}</span>
          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
        </CardTitle>
        <CardDescription className='flex items-center justify-between text-muted-foreground text-sm'>
          {formatDistance(form.createdAt , new Date() , {
            addSuffix:true
          })}
          {!form.published && (
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
          <Button asChild className='w-full mt-2 text-md gap-3'>
             <Link href={`/forms/${form.id}`}>
                View Submissions <ArrowRight />
             </Link>
          </Button>
        )}
        {!form.published && (
          <Button asChild variant={'secondary'} className='w-full mt-2 text-md gap-3'>
             <Link href={`/builder/${form.id}`}>
                Edit form <Edit />
             </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default page