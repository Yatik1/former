import React from 'react'
import { Button } from './ui/button'
import { GitFork } from 'lucide-react'

function PublishFormBtn() {
  return (
    <Button variant={"outline"} className='gap-2 bg-white text-black'>
       <GitFork className='h-4 w-4'/>
       Publish
    </Button>
  )
}

export default PublishFormBtn