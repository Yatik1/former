import { GetFormById, GetFormWithSubmissions } from '@/actions/form'
import { ElementType, FormElementInstance } from '@/components/FormElement';
import FormLinkShare from '@/components/FormLinkShare';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import VisitBtn from '@/components/VisitBtn';
import { format, formatDistance } from 'date-fns';
import React from 'react'
import { StatsCard } from '../../dashboard/page';

async function BuilderPage(
  {params} : any
) {

  const {id} = params as {id:string}
  const form = await GetFormById(Number(id))

  if(!form) throw new Error("form not found");

  const {visits,submissions} = form

  let submissionRate = 0
  
  submissionRate = (submissions/visits)*100;

  const bounceRate = 100 - submissionRate

  return (
      <>
        <div className='py-10 px-10 border-b border-muted'>
          <div className="flex justify-start items-center gap-3" >
            <h1 className="text-3xl font-medium truncate tracking-tight">{form.name}</h1>
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
          value={visits.toLocaleString() || ""}
          helperText='All time form visits'
          loading={false}
          className='text-white bg-gradient-to-br from-[#92C7FF] from-0% via-[#76B8FF] via-15% to-[#007BFF] to-72% border-none shadow-none'
          />
         <StatsCard 
          title="Total Submissions"
          value={submissions.toLocaleString() || ""}
          helperText='All time form submissions'
          loading={false}
          className='text-white bg-gradient-to-br from-[#3ed877] to-[#08490c] border-none shadow-none'
          />
          <StatsCard 
          title="Submission Rate"
          value={submissionRate.toLocaleString()+"%" || ""}
          helperText="Visits that results in form submissions"
          loading={false}
          />
          <StatsCard 
          title="Bounce Rate"
          value={bounceRate.toLocaleString()+"%" || ""}
          helperText='Visits that leaves without interacting'
          loading={false}
          className='text-white bg-gradient-to-br from-[#ff3838] to-[#ff8f06] border-none shadow-none'
          />
        </div>

        <div className="w-full pt-10">
          <SubmissionsTable id={form.id} />
        </div>
    </>
  )
}

export default BuilderPage

type Row = {[key:string]:string} & {
  submittedAt:Date;
}

async function SubmissionsTable({id}:{id:number}) {

  const form = await GetFormWithSubmissions(id)
  if(!form) {
    throw new Error("form not found")
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[]
  const columns:{
    id:string,
    label:string, 
    required:boolean,
    type:ElementType
  }[] = []

  formElements.forEach((element) => {
    switch(element.type) {
      case "TextField":
      case "NumberField":
      case "DateField":
      case "TextAreaField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id:element.id,
          label:element.extraAttributes?.label,
          required:element.extraAttributes?.required,
          type:element.type
        })
        break;
      default:
        break;
    }
  })

  const rows:Row[] = []
  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content)
    rows.push({
      ...content, 
      submittedAt:submission.createdAt
    })
  })

  return (
    <>
      <h1 className="text-2xl font-bold my-4 px-10"> Submissions </h1>
      <div className="rounded-md border mx-10 px-4">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="capitalize text-sm">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className='text-muted-foreground text-right capitalize text-sm'>Submitted At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row,index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell 
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className='text-muted-foreground text-right'>
                  {formatDistance(row.submittedAt, new Date() , {
                    addSuffix:true
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

function RowCell({type,value} : {type:ElementType , value:string}) {
  let node:React.ReactNode = value

  switch(type) {
    case "DateField":
      if(!value) break;
      const date = new Date(value)
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>
      break;

    case "CheckboxField":
      const checked = value === "true"
      node = <Checkbox checked={checked} disabled />
      break;
  }

  return (
    <TableCell>{node}</TableCell>
  )
}