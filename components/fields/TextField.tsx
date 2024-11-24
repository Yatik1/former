"use client";

import { Text, Type } from "lucide-react";
import { ElementType, FormElement, FormElementInstance } from "../FormElement";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const type:ElementType = "TextField"

const extraAttributes = {
    label:"Text Field",
    helperText:"Helper Text",
    required:false,
    placeHolder : "Value here...."
}

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
    formComponent : () => <div>Form Component</div>,
    propertiesComponent : PropertiesComponent
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

function PropertiesComponent({elementInstance} : {elementInstance : FormElementInstance}) {
    const element = elementInstance as CustomInstance
    return(
        <div>Form Properties of {element.extraAttributes.label}</div>
    )
}

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