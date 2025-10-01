import { CheckboxFieldFormElement } from "./fields/CheckboxField";
import { DateFieldFormElement } from "./fields/DateField";
import { NumberFieldFormElement } from "./fields/NumberField";
import { ParagraphFieldFormElement } from "./fields/ParagraphField";
import { SelectFieldFormElement } from "./fields/SelectField";
import { SeparatorFieldFormElement } from "./fields/SeparatorField";
import { SpacerFieldFormElement } from "./fields/SpacerField";
import { SubTitleFieldFormElement } from "./fields/SubTitleField";
import { TextAreaFieldFormElement } from "./fields/TextAreaField";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";

export type ElementType = "TextField" |
                          "TitleField" |  
                          "SubTitleField" |
                          "ParagraphField" |
                          "SeparatorField" | 
                          "SpacerField" |
                          "NumberField"|
                          "TextAreaField" |
                          "DateField" |
                          "SelectField" |
                          "CheckboxField" ;

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
    TextField : TextFieldFormElement,
    TitleField: TitleFieldFormElement,
    SubTitleField: SubTitleFieldFormElement,
    ParagraphField: ParagraphFieldFormElement,
    SeparatorField: SeparatorFieldFormElement,
    SpacerField: SpacerFieldFormElement,
    NumberField: NumberFieldFormElement,
    TextAreaField: TextAreaFieldFormElement,
    DateField: DateFieldFormElement,
    SelectField: SelectFieldFormElement,
    CheckboxField:CheckboxFieldFormElement
}