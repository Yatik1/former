"use client";

import { CheckSquare2, Text, Type } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";


const type:ElementType = "CheckboxField"

const extraAttributes = {
    label:"Checkbox Field",
    helperText:"Helper Text",
    required:false,
}

const propertiesSchema = z.object({
    label:z.string().min(2).max(50),
    helperText:z.string().max(150),
    required:z.boolean().default(false),
})

export const CheckboxFieldFormElement : FormElement = {
    type,
    construct:(id:string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement : {
        icon: CheckSquare2,
        label: "Checkbox field"
    },
    designerComponent : DesignerComponent,
    formComponent : FormComponent,
    propertiesComponent : PropertiesComponent,

    validate : (formElement:FormElementInstance , currentValue:string):boolean => {
        const element = formElement as CustomInstance
        if(element.extraAttributes.required) {
            return currentValue === "true"
        }  
        return true
    }
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function DesignerComponent({elementInstance} : {elementInstance:FormElementInstance}) {

    const element = elementInstance as CustomInstance
    const { label, required, helperText } = element.extraAttributes
    const id=`checkbox-${element.id}`
    return (
        <div className="flex items-top space-x-2">
            <Checkbox id={id} />
            <div className="grid gap-2 leading-none">
                <Label htmlFor={id}>
                    {label}
                    {required && "*"}
                </Label>
                {helperText && (
                    <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
                )}
            </div>
        </div>
    )
}

function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue,
} : {
    elementInstance:FormElementInstance , 
    submitValue?:SubmitFunction,
    isInvalid?:boolean,
    defaultValue?:string,
}) {

    const element = elementInstance as CustomInstance
    const { label, required, helperText, placeHolder } = element.extraAttributes

    const [value,setValue] = useState<boolean>(defaultValue === "true" ? true:false) 
    const [error,setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid])
    
    const id=`checkbox-${element.id}`

    return (
        <div className="flex items-start justify-start w-full gap-1.5">
            <Checkbox 
                id={id} 
                checked={value}
                className={cn(error && "border-red-500")}
                onCheckedChange={(checked) => {
                    let value = false
                    if(checked === true) value=true;

                    setValue(value)
                    if(!submitValue) return;
                    const stringValue = value?"true":"false"
                    const valid=CheckboxFieldFormElement.validate(element, stringValue)
                    setError(!valid)
                    submitValue(element.id, stringValue)
                }}
            />
            <div className="grid gap-2 leading-none">
                <Label htmlFor={id} className={cn(error && "text-red-500")}>
                    {label}
                    {required && "*"}
                </Label>
                {helperText && (
                    <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>
                )}
            </div>
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
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    } , [element,form])

    function applyChanges(values:propertiesFormSchemaType) {
        const {label,helperText,required} = values

        updateElement(element.id , {
            ...element,
            extraAttributes:{
                label,
                helperText,
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