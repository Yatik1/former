import { GetFormById } from '@/actions/form'
import FormBuilder from '@/components/FormBuilder';
import VisitBtn from '@/components/VisitBtn';
import React from 'react'

async function BuilderPage(
  {params} : {params : {id:string}}
) {

  const {id} = params
  const form = await GetFormById(Number(id))

  if(!form) throw new Error("form not found");

  const {visits,submissions} = form

  let submissionRate = 0
  if(visits>0) submissionRate = (submissions-visits)*100;

  const bounceRate = 100 - submissionRate

  return (
    <div className='py-10 px-10 border-b border-muted'>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold truncate">{form.name}</h1>
        <VisitBtn shareUrl={form.shareURL} />
      </div>
    </div>
  )
}

export default BuilderPage