import React from 'react'
import SideBarElement from './SideBarElement'
import { FormElements } from './FormElement'

function FormElementsSidebar() {
  return (
    <div>
        Elements
        <SideBarElement formElement={FormElements.TextField}/>
    </div>
  )
}

export default FormElementsSidebar