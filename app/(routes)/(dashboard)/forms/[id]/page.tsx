import { GetFormById } from '@/actions/form'
import { StatsCard } from '@/app/(routes)/(root)/page';
import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';
import { File, SquareMousePointer, TrendingDown, ViewIcon } from 'lucide-react';
import React from 'react'

async function BuilderPage(
  {params} : {params : {id:string}}
) {

  const {id} = params
  const form = await GetFormById(Number(id))

  if(!form) throw new Error("form not found");

  const {visits,submissions} = form

  let submissionRate = 0
  
  submissionRate = (submissions/visits)*100;

  const bounceRate = 100 - submissionRate

  return (
      <>
        <div className='py-10 px-10 border-b border-muted'>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold truncate">{form.name}</h1>
            <VisitBtn shareUrl={form.shareURL} />
          </div>
        </div>
        <div className="py-4 px-10 border-b border-muted">
         <div className="flex gap-2 items-center justify-between">
            <FormLinkShare  shareUrl={form.shareURL} />
          </div>
        </div>
        <div className="w-screen pt-8 px-10 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
          title="Total Visits"
          icon={<ViewIcon className='w-4 h-4'/>}
          value={visits.toLocaleString() || ""}
          helperText='All time form visits'
          loading={false}
          />
         <StatsCard 
          title="Total Submissions"
          icon={<File className='w-4 h-4'/>}
          value={submissions.toLocaleString() || ""}
          helperText='All time form submissions'
          loading={false}
          />
          <StatsCard 
          title="Submission Rate"
          icon={<SquareMousePointer className='w-4 h-4' />}
          value={submissionRate.toLocaleString()+"%" || ""}
          helperText="Visits that results in form submissions"
          loading={false}
          />
          <StatsCard 
          title="Bounce Rate"
          icon={<TrendingDown className='w-4 h-4' />}
          value={bounceRate.toLocaleString()+"%" || ""}
          helperText='Visits that leaves without interacting'
          loading={false}
          />
        </div>

        <div className="w-full pt-10">
          <SubmissionsTable id={form.id} />
        </div>
    </>
  )
}

export default BuilderPage

function SubmissionsTable({id}:{id:number}) {
  return (
    <>
      <h1 className="text-2xl font-bold my-4 px-10">
        Submissions
      </h1>
    </>
  )
}