"use client";

import { AlignLeftIcon, Text, Type } from "lucide-react";
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
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";


const type:ElementType = "TextAreaField"

const extraAttributes = {
    label:"TextArea Field",
    helperText:"",
    required:false,
    placeHolder : "Text here...",
    rows:3,

}

const propertiesSchema = z.object({
    label:z.string().min(2).max(50),
    helperText:z.string().max(150),
    required:z.boolean().default(false),
    placeHolder:z.string().max(50),
    rows:z.number().min(1).max(10)
})

export const TextAreaFieldFormElement: FormElement = {
    type,
    construct:(id:string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement : {
        icon: AlignLeftIcon,
        label: "TextArea field"
    },
    designerComponent : DesignerComponent,
    formComponent : FormComponent,
    propertiesComponent : PropertiesComponent,

    validate : (formElement:FormElementInstance , currentValue:string):boolean => {
        const element = formElement as CustomInstance
        if(element.extraAttributes.required) {
            return currentValue.length>0
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
    const { label, required, helperText, placeHolder, rows } = element.extraAttributes
    return (
        <div className="flex flex-col gap-3 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Textarea readOnly disabled placeholder={placeHolder} />
            {helperText && (
                <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
            )}
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
    const { label, required, helperText, placeHolder, rows } = element.extraAttributes

    const [value,setValue] = useState(defaultValue || "") 
    const [error,setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid])

    return (
        <div className="flex flex-col gap-3 w-full h-screen">
            <Label className={cn(error && "text-red-500" )}>
                {label}
                {required && "*"}
            </Label>
            <Textarea 
                rows={rows}
                className={cn(error && "border-red-500")}
                placeholder={placeHolder} 
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => {
                    if(!submitValue) return;
                    const valid = TextAreaFieldFormElement.validate(element,e.target.value)
                    setError(!valid)
                    if(!valid) return;
                    submitValue(element.id, e.target.value)
                }}
                value={value}
            />
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
            placeHolder:element.extraAttributes.placeHolder,
            rows:element.extraAttributes.rows,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    } , [element,form])

    function applyChanges(values:propertiesFormSchemaType) {
        const {label,helperText,placeHolder,required,rows} = values

        updateElement(element.id , {
            ...element,
            extraAttributes:{
                label,
                helperText,
                placeHolder,
                required,
                rows,
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
                {/* <FormField
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
                /> */}
                <FormField
                   control={form.control}
                   name="rows"
                   render={({field}) => (
                       <FormItem>
                          <FormLabel>Rows {form.watch("rows")}</FormLabel>
                          <FormControl>
                            <Slider 
                                defaultValue={[field.value]}
                                min={1}
                                max={10}
                                step={1}
                                onValueChange={(value) => {
                                    field.onChange(value[0])
                                }}
                            />
                          </FormControl>
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