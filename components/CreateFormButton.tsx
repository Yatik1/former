"use client";

import React from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogTrigger,DialogContent, DialogDescription, DialogFooter  } from './ui/dialog';
import { Button } from './ui/button';


import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { LoaderIcon, PlusIcon } from 'lucide-react';
import { formSchema, formSchemaType } from '@/schemas/form';
import { toast } from '@/hooks/use-toast';
import { CreateForm } from '@/actions/form';
import { useRouter } from 'next/navigation';


function CreateFormButton() {

    const router = useRouter()

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema)
  })

  async function onSubmit(values : formSchemaType) {
    try {
        const formId = await CreateForm(values)
        toast({
            title:"Success",
            description:"Form Created Successfully."
        })
        router.refresh()
    } catch (error) {
        toast({
            title:"Error",
            description:"Something went wrong!",
            variant:'destructive'
        })
    }
  }

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button
                variant={"outline"}
                className='group border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4'
            >   
                <PlusIcon  className='h-8 w-8 text-muted-foreground group-hover:text-primary'/>
                <p className="font-bold text-lg text-muted-foreground group-hover:text-primary">Create new form</p>
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create form</DialogTitle>
                <DialogDescription>
                    Create a new form to start collecting responses
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                    <FormField 
                        control={form.control}
                        name='name'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name='description'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <DialogFooter>
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={form.formState.isSubmitting}
                    className='w-full mt-4'
                >
                    {!form.formState.isSubmitting && <span>Save</span>}
                    {form.formState.isSubmitting && <LoaderIcon className='animate-spin'/>}
                </Button>
            </DialogFooter>
        </DialogContent>

    </Dialog>
  )
}
export default CreateFormButton