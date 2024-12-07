import React from 'react'
import SideBarElement from './SideBarElement'
import { FormElements } from './FormElement'
import { Separator } from './ui/separator'

function FormElementsSidebar() {
  return (
    <div>
        <p className="text-sm text-foreground/70">Drag & Drop elements</p>
        <Separator className='my-2' />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
          <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
            Layout Elements
          </p>
          <SideBarElement formElement={FormElements.TitleField} />
          <SideBarElement formElement={FormElements.SubTitleField} />
          <SideBarElement formElement={FormElements.ParagraphField} />
          <SideBarElement formElement={FormElements.SeparatorField} />
          <SideBarElement formElement={FormElements.SpacerField} />

          <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
            Form Elements
          </p>
          <SideBarElement formElement={FormElements.TextField} />
          <SideBarElement formElement={FormElements.NumberField} />
          <SideBarElement formElement={FormElements.TextAreaField} />
          <SideBarElement formElement={FormElements.DateField} />
          <SideBarElement formElement={FormElements.SelectField} />
          <SideBarElement formElement={FormElements.CheckboxField} />

        </div>
    </div>
  )
}

export default FormElementsSidebar