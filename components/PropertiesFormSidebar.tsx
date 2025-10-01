import useDesigner from '@/hooks/useDesigner'
import React from 'react'
import { FormElements } from './FormElement';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Separator } from './ui/separator';

function PropertiesFormSidebar() {
    const {selectedElement,setSelectedElement} = useDesigner()
    if(!selectedElement) return null;

    const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent

  return (
    <div className='flex flex-col p-2'>
        <div className="flex justify-between items-center">
            <p className="text-sm text-foreground/70">Element properties</p>
            <Button 
                size={"icon"}
                variant={"ghost"}
                onClick={() => setSelectedElement(null)}
            >
                <X />
            </Button>
        </div>
        <Separator className='mb-4'/>
        <PropertiesForm elementInstance={selectedElement}/>
    </div>
  )
}

export default PropertiesFormSidebar