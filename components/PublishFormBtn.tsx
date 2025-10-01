import React, { useTransition } from 'react'
import { Button } from './ui/button'
import { GitFork, Loader } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { toast } from '@/hooks/use-toast'
import { PublishForm } from '@/actions/form'
import { useRouter } from 'next/navigation'

function PublishFormBtn({id} : {id:number}) {
    const [loading, startTransition] = useTransition()
    const router = useRouter()

    async function publishForm() {
      try {
        await PublishForm(id)
        toast({
          title:"Success",
          description:"Your form is publicly available "
        })
        router.refresh()
      } catch (error) {
        toast({
          title:"Error",
          description:"Something went wrong"
        })
      }
    }
  return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"outline"} className='gap-2 bg-black text-white dark:bg-white dark:text-black'>
            <GitFork className='h-4 w-4'/>
            Publish
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. After publishing you will not be able to edit this form <br /> <br />
              <span className="font-medium">
                By publishing this form you will make it available to the public and you will be able to collect the submissions.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
                disabled={loading} 
                onClick={e => {
                  e.preventDefault()
                  startTransition(publishForm)
                }}
              >
              Proceed {loading && <Loader className='animate-spin'/>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}

export default PublishFormBtn