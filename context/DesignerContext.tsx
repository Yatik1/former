"use client";

import { FormElementInstance } from "@/components/FormElement";
import { createContext, useState } from "react";

type DesignContextProps = {
    elements:FormElementInstance[]
    addElement:(index:number , element:FormElementInstance) => void
    removeElement:(id:string) => void
}

export const DesignerContext = createContext<DesignContextProps | null>(null)

export default function DesignerContextProvider({children} : {children : React.ReactNode}) {


    const [elements,setElements] = useState<FormElementInstance[]>([])
    const addElement = (index:number , element:FormElementInstance) => {
        setElements((prev) => {
            const newElement = [...prev]
            newElement.splice(index,0,element)
            return newElement
        })
    }

    const removeElement = (id:string) => {
        setElements((prev) => prev.filter((element) => element.id !== id))
    }

    return (
        <DesignerContext.Provider
            value={{
                elements,
                addElement,
                removeElement
            }}
        >
            {children}
        </DesignerContext.Provider>
    )
}