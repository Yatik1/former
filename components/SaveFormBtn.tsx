import React, { useTransition } from 'react'
import { Button } from './ui/button'
import { LoaderIcon, Save } from 'lucide-react'
import useDesigner from '@/hooks/useDesigner'
import { UpdateFormContent } from '@/actions/form'
import { toast } from '@/hooks/use-toast'

function SaveFormBtn({id} : {id:number}) {
  const {elements} = useDesigner()
  const [loading, startTransition] = useTransition()

  const updateFormContent = async () => {
    try {
      const JsonElements = JSON.stringify(elements)
      await UpdateFormContent(id,JsonElements)
      toast({
        title:"Success",
        description:"Your form has been saved"
      })
    } catch (error) {
      toast({
        title:"Error",
        description:"Something went wrong",
        variant:"destructive"
      })
    }
  }
  return (
    <Button 
      variant={"outline"} 
      className='gap-2' 
      disabled={loading} 
      onClick={()=> {startTransition(updateFormContent)}}
    >
      <Save className='h-4 w-4'/>
      Save
      {loading && <LoaderIcon className='animate-spin'/>}
    </Button>
  )
}

export default SaveFormBtn