"use client";

import { BookText, SeparatorHorizontalIcon } from "lucide-react";
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


const type:ElementType = "SeparatorField"

export const SeparatorFieldFormElement: FormElement = {
    type,
    construct:(id:string) => ({
        id,
        type,
    }),
    designerBtnElement : {
        icon: SeparatorHorizontalIcon,
        label: "Separator field"
    },
    designerComponent : DesignerComponent,
    formComponent : FormComponent,
    propertiesComponent : PropertiesComponent,

    validate:() => true
}


function DesignerComponent({elementInstance} : {elementInstance:FormElementInstance}) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <Label className="text-sm text-muted-foreground">
                Separator field
            </Label>
            <Separator />
        </div>
    )
}

function FormComponent({
    elementInstance,
} : {
    elementInstance:FormElementInstance , 
}) {
    return (
        <Separator />
    )
}

function PropertiesComponent({elementInstance} : {elementInstance : FormElementInstance}) {
   return (
    <p>No properties for this element</p>
   )
}