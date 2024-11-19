"use client";

import { Text, Type } from "lucide-react";
import { ElementType, FormElement } from "../FormElement";

const type:ElementType = "TextField"

export const TextFieldFormElement: FormElement = {
    type,
    construct:(id:string) => ({
        id,
        type,
        extraAttribute : {
            label:"Text Field",
            helperText:"Helper Text",
            requied:false,
            placeHolder : "Value here...."
        }
    }),
    designerBtnElement : {
        icon: Type,
        label: "Text field"
    },
    designerComponent : () => <div>Designer Component</div>,
    formComponent : () => <div>Form Component</div>,
    propertiesComponent : () => <div>Properties Component</div>
}