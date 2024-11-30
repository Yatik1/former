"use client";

import { Text, Type } from "lucide-react";
import { ElementType, FormElement, FormElementInstance, SubmitFunction } from "../FormElement";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "@/hooks/useDesigner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";


const type:ElementType = "TextField"

const extraAttributes = {
    label:"Text Field",
    helperText:"Helper Text",
    required:false,
    placeHolder : "Value here...."
}

const propertiesSchema = z.object({
    label:z.string().min(2).max(50),
    helperText:z.string().max(150),
    required:z.boolean().default(false),
    placeHolder:z.string().max(50)
})

export const TextFieldFormElement: FormElement = {
    type,
    construct:(id:string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement : {
        icon: Type,
        label: "Text field"
    },
    designerComponent : DesignerComponent,
    formComponent : FormComponent,
    propertiesComponent : PropertiesComponent
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function DesignerComponent({elementInstance} : {elementInstance:FormElementInstance}) {

    const element = elementInstance as CustomInstance
    const { label, required, helperText, placeHolder } = element.extraAttributes
    return (
        <div className="flex flex-col gap-3 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Input readOnly disabled placeholder={placeHolder} />
            {helperText && (
                <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
            )}
        </div>
    )
}

function FormComponent({elementInstance,submitValue} : {elementInstance:FormElementInstance , submitValue?:SubmitFunction}) {

    const element = elementInstance as CustomInstance
    const { label, required, helperText, placeHolder } = element.extraAttributes

    const [value,setValue] = useState("") 

    return (
        <div className="flex flex-col gap-3 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Input 
                placeholder={placeHolder} 
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => {
                    if(!submitValue) return;
                    submitValue(element.id, e.target.value)
                }}
                value={value}
            />
            {helperText && (
                <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
            )}
        </div>
    )
}

function PropertiesComponent({elementInstance} : {elementInstance : FormElementInstance}) {
    const element = elementInstance as CustomInstance
    const {updateElement} = useDesigner()
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode:"onBlur",
        defaultValues:{
            label:element.extraAttributes.label,
            helperText:element.extraAttributes.helperText,
            required:element.extraAttributes.required,
            placeHolder:element.extraAttributes.placeHolder
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    } , [element,form])

    function applyChanges(values:propertiesFormSchemaType) {
        const {label,helperText,placeHolder,required} = values

        updateElement(element.id , {
            ...element,
            extraAttributes:{
                label,
                helperText,
                placeHolder,
                required
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
                   name="label"
                   render={({field}) => (
                       <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input 
                                {...field}
                                onKeyDown={(e) => {
                                    if(e.key === "Enter") e.currentTarget.blur()
                                }}
                            />
                          </FormControl>
                          <FormDescription>
                            The label of the field. <br /> It will be displayed above the field.
                          </FormDescription>
                          <FormMessage />
                       </FormItem>
                   )}
                />
                <FormField
                   control={form.control}
                   name="placeHolder"
                   render={({field}) => (
                       <FormItem>
                          <FormLabel>PlaceHolder</FormLabel>
                          <FormControl>
                            <Input 
                                {...field}
                                onKeyDown={(e) => {
                                    if(e.key === "Enter") e.currentTarget.blur()
                                }}
                            />
                          </FormControl>
                          <FormDescription>
                            The placeholder of the field.
                          </FormDescription>
                          <FormMessage />
                       </FormItem>
                   )}
                />
                <FormField
                   control={form.control}
                   name="helperText"
                   render={({field}) => (
                       <FormItem>
                          <FormLabel>Helper text</FormLabel>
                          <FormControl>
                            <Input 
                                {...field}
                                onKeyDown={(e) => {
                                    if(e.key === "Enter") e.currentTarget.blur()
                                }}
                            />
                          </FormControl>
                          <FormDescription>
                            The hepler text of the field. <br /> It will be displayed below the field.
                          </FormDescription>
                          <FormMessage />
                       </FormItem>
                   )}
                />
                <FormField
                   control={form.control}
                   name="required"
                   render={({field}) => (
                       <FormItem className="flex items-center justify-between border rounded-lg shadow-md p-3 gap-2">
                          <div className="space-y-0.5">
                            <FormLabel>Required</FormLabel>
                            <FormDescription>
                                Indicates whether this field must be filled out before submission.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
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