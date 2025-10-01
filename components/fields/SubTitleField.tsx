"use client";

import { Heading, Heading2Icon } from "lucide-react";
import { ElementType, FormElement, FormElementInstance, SubmitFunction } from "../FormElement";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "@/hooks/useDesigner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Separator } from "../ui/separator";


const type:ElementType = "SubTitleField"

const extraAttributes = {
    title:"SubTitle Field",
}

const propertiesSchema = z.object({
    title:z.string().min(2).max(50),
})

export const SubTitleFieldFormElement: FormElement = {
    type,
    construct:(id:string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement : {
        icon: Heading2Icon  ,
        label: "SubTitle field"
    },
    designerComponent : DesignerComponent,
    formComponent : FormComponent,
    propertiesComponent : PropertiesComponent,

    validate:() => true
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function DesignerComponent({elementInstance} : {elementInstance:FormElementInstance}) {

    const element = elementInstance as CustomInstance
    const { title } = element.extraAttributes
    return (
        <div className="flex flex-col gap-1 w-full">
            <Label className="text-sm text-muted-foreground">
                SubTitle field
                <Separator className="my-2"/>
            </Label>
            <p className="text-lg">{title}</p>
        </div>
    )
}

function FormComponent({
    elementInstance,
} : {
    elementInstance:FormElementInstance , 
}) {

    const element = elementInstance as CustomInstance
    const { title } = element.extraAttributes


    return (
        <p className="text-md">{title}</p>
    )
}

function PropertiesComponent({elementInstance} : {elementInstance : FormElementInstance}) {
    const element = elementInstance as CustomInstance
    const {updateElement} = useDesigner()
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode:"onBlur",
        defaultValues:{
            title:element.extraAttributes.title,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    } , [element,form])

    function applyChanges(values:propertiesFormSchemaType) {
        const {title} = values

        updateElement(element.id , {
            ...element,
            extraAttributes:{
                title
            }
        })
    }

    return(
        <Form {...form}>
            <form
                onBlur={form.handleSubmit(applyChanges)}
                onSubmit={(e) => e.preventDefault()}
                className="space-y-3"
            >
                <FormField
                   control={form.control}
                   name="title"
                   render={({field}) => (
                       <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                                {...field}
                                onKeyDown={(e) => {
                                    if(e.key === "Enter") e.currentTarget.blur()
                                }}
                            />
                          </FormControl>
                          <FormMessage />
                       </FormItem>
                   )}
                />                
            </form>
        </Form>
    )
}