"use client"

import React, { useCallback, useRef, useState, useTransition } from 'react'
import { FormElementInstance, FormElements } from './FormElement'
import { Button } from './ui/button'
import { Loader, Pointer } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { SubmitForm } from '@/actions/form'
import ReactConfetti from 'react-confetti'

function FormSubmitComponent({
    formUrl, content
} : {
    formUrl:string,
    content:FormElementInstance[]
}) {
    
  const formValues= useRef<{[key:string]:string}>({})
  const formErrors = useRef<{[key:string]:boolean}>({})

  const [renderKey,setRenderKey] = useState(new Date().getTime())
  const [submitted,setSubmitted] = useState(false)

  const [pending,startTransition] = useTransition()

  const validateForm:()=>boolean = useCallback(() => {
    for(const field of content) {
      const actualValue = formValues.current[field.id] || ""
      const valid = FormElements[field.type].validate(field,actualValue)
      
      if(!valid) {
        formErrors.current[field.id] = true
      }
    }

    if(Object.keys(formErrors.current).length > 0) {
      return false;
    }

    return true
  },[content])

  const submitValue = useCallback((key:string, value:string) => {
    formValues.current[key] = value
  } , [])

  const submitForm = async () => {
    formErrors.current = {}
    const validate = validateForm()
    if(!validate) {
      setRenderKey(new Date().getTime())
      toast({
        title:"Error",
        description:"Please check the form for errors",
        variant:"destructive"
      })
      return;
    }

    try {
      const jsonContent = JSON.stringify(formValues.current)
      await SubmitForm(formUrl, jsonContent)
      setSubmitted(true)
    } catch (error) {
      toast({
        title:"Error",
        description:"Something went wrong",
        variant:"destructive"
      })
    }

    // console.log("Values" , formValues.current )
  }

  if(submitted) {
    return (
      <>
        <ReactConfetti width={window.innerWidth} height={window.innerHeight} recycle={false} />
        <div className="flex items-center justify-center w-full h-screen p-8">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border rounded">
           <h1 className="text-2xl font-bold">Form submitted</h1>
            <p className="text-muted-foreground">
             Thank you for submitting the form, you can close this page now.
            </p>
         </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex w-full items-center justify-center p-8">
        <div key={renderKey} className="max-w-[620px] h-full flex flex-col gap-4 bg-background w-full p-8 border overflow-y-auto rounded">
            {content.map((element) => {
                const FormElement = FormElements[element.type].formComponent
                return (
                  <FormElement  
                    key={element.id} 
                    elementInstance={element} 
                    submitValue={submitValue}
                    isInvalid={formErrors.current[element.id]}
                    defaultValue={formValues.current[element.id]}
                  />
                )
            })}
        <Button
            onClick={() => {
                startTransition(submitForm)
            }}
            disabled={pending}
        >
            {
              !pending && (
                <>
                  <Pointer/>
                  Submit
                </>
              )
            }
            {pending && <Loader className='animate-spin'/>}
        </Button>
        </div>
    </div>
  )
}

export default FormSubmitComponent