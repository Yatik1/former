import { TextFieldFormElement } from "./fields/TextField";

export type ElementType = "TextField";

export type SubmitFunction = (key:string, value:string) => void

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
        elementInstance:FormElementInstance,
        submitValue?: SubmitFunction,
        isInvalid?:boolean,
        defaultValue?:string
    }>;
    propertiesComponent:React.FC<{
        elementInstance:FormElementInstance
    }>;

    validate:(formElement:FormElementInstance , currentValue :string) => boolean,
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