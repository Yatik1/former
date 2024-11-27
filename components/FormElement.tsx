import { TextFieldFormElement } from "./fields/TextField";

export type ElementType = "TextField";

export type FormElement = {
    type:ElementType;

    construct : (id:string) => FormElementInstance

    designerBtnElement : {
        icon:React.ElementType,
        label:string
    };

    designerComponent:React.FC<{
        elementInstance:FormElementInstance;
    }>;
    formComponent:React.FC<{
        elementInstance:FormElementInstance
    }>;
    propertiesComponent:React.FC<{
        elementInstance:FormElementInstance
    }>;
}

export type FormElementInstance = {
    id:string,
    type:ElementType,
    extraAttributes?:Record<string,any>
}

type FormElementType = {
    [key in ElementType]: FormElement
}

export const FormElements: FormElementType = {
    TextField : TextFieldFormElement
}