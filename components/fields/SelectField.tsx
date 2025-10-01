"use client";

import { MousePointerClick, Plus, X } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";


const type:ElementType = "SelectField"

const extraAttributes = {
    label:"Select Field",
    helperText:"Helper Text",
    required:false,
    placeHolder : "Value here....",
    options: [],
}

const propertiesSchema = z.object({
    label:z.string().min(2).max(50),
    helperText:z.string().max(150),
    required:z.boolean().default(false),
    placeHolder:z.string().max(50),
    options:z.array(z.string()).default([])
})

export const SelectFieldFormElement: FormElement = {
    type,
    construct:(id:string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement : {
        icon: MousePointerClick,
        label: "Select field"
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
    const { label, required, helperText, placeHolder, options } = element.extraAttributes
    return (
        <div className="flex flex-col gap-3 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeHolder} />
                </SelectTrigger>
            </Select>
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
    const { label, required, helperText, placeHolder , options} = element.extraAttributes

    const [value,setValue] = useState(defaultValue || "") 
    const [error,setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid])

    return (
        <div className="flex flex-col gap-3 w-full">
            <Label className={cn(error && "text-red-500" )}>
                {label}
                {required && "*"}
            </Label>
            <Select
                defaultValue={value}
                onValueChange={(value) => {
                    setValue(value)
                    if(!submitValue) return;
                    const valid = SelectFieldFormElement.validate(element,value)
                    setError(!valid)
                    submitValue(element.id,value)
                }}
            >
                <SelectTrigger className={cn("w-full" , error && "border-red-500")}>
                    <SelectValue placeholder={placeHolder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {helperText && (
                <p className={cn("text-muted-foreground text-[0.8rem]" , error && "text-red-500")}>{helperText}</p>
            )}
        </div>
    )
}

function PropertiesComponent({elementInstance} : {elementInstance : FormElementInstance}) {
    const element = elementInstance as CustomInstance
    const {updateElement, setSelectedElement} = useDesigner()
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode:"onSubmit",
        defaultValues:{
            label:element.extraAttributes.label,
            helperText:element.extraAttributes.helperText,
            required:element.extraAttributes.required,
            placeHolder:element.extraAttributes.placeHolder,
            options:element.extraAttributes.options,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    } , [element,form])

    function applyChanges(values:propertiesFormSchemaType) {
        const {label,helperText,placeHolder,required, options} = values

        updateElement(element.id , {
            ...element,
            extraAttributes:{
                label,
                helperText,
                placeHolder,
                required,
                options
            }
        })

        toast({
            title:"Success",
            description:"Properties saved successfully"
        })

        setSelectedElement(null)
    }

    return(
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(applyChanges)}
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
                <Separator />
                <FormField
                   control={form.control}
                   name="options"
                   render={({field}) => (
                       <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Options</FormLabel>
                                <Button
                                    className="gap-2"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        form.setValue("options", field.value.concat("New option"))
                                    }}
                                >
                                    <Plus />
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {form.watch("options").map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between gap-1"
                                    >
                                        <Input 
                                            placeholder=""
                                            value={option}
                                            onChange={(e) => {
                                                field.value[index] = e.target.value
                                                field.onChange(field.value)
                                            }}
                                        />
                                        <Button
                                            variant={"ghost"}
                                            size={"icon"}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                const newOptions = [...field.value]
                                                newOptions.slice(index,1)
                                                field.onChange(newOptions)
                                                // alert("Clicked") 
                                            }}
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <FormMessage />
                       </FormItem>
                   )}
                />
                <Separator />
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
                <Separator />
                <Button className="w-full" type="submit">
                    Save
                </Button>
            </form>
        </Form>
    )
}