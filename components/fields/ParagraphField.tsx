"use client";

import { BookText } from "lucide-react";
import { ElementType, FormElement, FormElementInstance, SubmitFunction } from "../FormElement";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";


const type:ElementType = "ParagraphField"

const extraAttributes = {
    text:"Text here...",
}

const propertiesSchema = z.object({
    text:z.string().min(2).max(500),
})

export const ParagraphFieldFormElement: FormElement = {
    type,
    construct:(id:string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement : {
        icon: BookText,
        label: "Paragraph field"
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
    const { text } = element.extraAttributes
    return (
        <div className="flex flex-col gap-1 w-full">
            <Label className="text-sm text-muted-foreground">
                Paragraph field
                <Separator className="my-2" />
            </Label>
            <p>{text}</p>
        </div>
    )
}

function FormComponent({
    elementInstance,
} : {
    elementInstance:FormElementInstance , 
}) {

    const element = elementInstance as CustomInstance
    const { text } = element.extraAttributes


    return (
        <p className="text-sm">{text}</p>
    )
}

function PropertiesComponent({elementInstance} : {elementInstance : FormElementInstance}) {
    const element = elementInstance as CustomInstance
    const {updateElement} = useDesigner()
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode:"onBlur",
        defaultValues:{
            text:element.extraAttributes.text,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    } , [element,form])

    function applyChanges(values:propertiesFormSchemaType) {
        const {text} = values

        updateElement(element.id , {
            ...element,
            extraAttributes:{
                text
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
                   name="text"
                   render={({field}) => (
                       <FormItem>
                          <FormLabel>Text</FormLabel>
                          <FormControl>
                            <Textarea 
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