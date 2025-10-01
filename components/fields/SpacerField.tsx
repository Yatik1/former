"use client";

import { AlignVerticalSpaceAround, Heading1 } from "lucide-react";
import { ElementType, FormElement, FormElementInstance, SubmitFunction } from "../FormElement";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";


const type:ElementType = "SpacerField"

const extraAttributes = {
    height:20,
}

const propertiesSchema = z.object({
    height:z.number().min(5).max(200),
})

export const SpacerFieldFormElement: FormElement = {
    type,
    construct:(id:string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement : {
        icon: AlignVerticalSpaceAround,
        label: "Spacer field"
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
    const { height } = element.extraAttributes
    return (
        <div className="flex w-full items-center justify-center gap-2">
            <AlignVerticalSpaceAround className="w-8 h-8" />
            <Label className="text-sm text-muted-foreground">
                Spacer field: {height}px
                {/* Spacer field */}
            </Label>
        </div>
    )
}

function FormComponent({
    elementInstance,
} : {
    elementInstance:FormElementInstance , 
}) {

    const element = elementInstance as CustomInstance
    const { height } = element.extraAttributes

    return (
        <div style={{height:height,width:"100%"}}></div>
    )
}

function PropertiesComponent({elementInstance} : {elementInstance : FormElementInstance}) {
    const element = elementInstance as CustomInstance
    const {updateElement} = useDesigner()
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode:"onBlur",
        defaultValues:{
            height:element.extraAttributes.height,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    } , [element,form])

    function applyChanges(values:propertiesFormSchemaType) {
        const {height} = values

        updateElement(element.id , {
            ...element,
            extraAttributes:{
                height
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
                   name="height"
                   render={({field}) => (
                       <FormItem>
                          <FormLabel>Height (px) : {form.watch("height")} </FormLabel>
                          <FormControl className="pt-2">
                            <Slider 
                                defaultValue={[field.value]}
                                min={5}
                                max={200}
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
            </form>
        </Form>
    )
}