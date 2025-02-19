import React, { useState } from 'react'
import DesignerSidebar from './DesignerSidebar'
import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import useDesigner from '@/hooks/useDesigner'
import { ElementType, FormElementInstance, FormElements } from './FormElement'
import { idGenerator } from '@/lib/idGenerator'
import { Trash } from 'lucide-react'
import { Button } from './ui/button'

function Designer() {

    const {elements,addElement,setSelectedElement,selectedElement,removeElement} = useDesigner()

    const droppable = useDroppable({
        id:"designer-drop-area",
        data:{
            isDesignerDropArea:true
        }
    })

    useDndMonitor({
        onDragEnd:(event:DragEndEvent)=>{
            const {active, over} = event
            if(!active || !over) return;

            const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement
            const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea

            if(isDesignerBtnElement && isDroppingOverDesignerDropArea) {    // :: isDroppingOverDesignerDropArea -> on dropping over element topHalf or bottomHalf , element won't dropped in the designer unless it dragged over the designer component 
                const type = active?.data?.current?.type
                const newElement = FormElements[type as ElementType].construct(
                    idGenerator()
                )
                addElement(elements.length,newElement)
                return
            }

            const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement
            const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement

            const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf | isDroppingOverDesignerElementBottomHalf
            const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement

            // console.log("Dropping" ,droppingSidebarBtnOverDesignerElement)

            if(droppingSidebarBtnOverDesignerElement) {
                const type = active?.data?.current?.type
                const newElement = FormElements[type as ElementType].construct(
                    idGenerator()
                )

                const overId = over.data?.current?.elementId

                const overElementIndex = elements.findIndex((el) => el.id === overId)
                if(overElementIndex === -1) throw new Error("Element not found");

                let indexForNewElement = overElementIndex
                if(isDroppingOverDesignerElementBottomHalf) {
                    indexForNewElement = overElementIndex + 1
                }

                addElement(indexForNewElement,newElement)
                return
            }
                // console.log("Event end",event)
            
            const isDraggingDesignerElement = active.data?.current?.isDesignerElement

            const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement

            if(draggingDesignerElementOverAnotherDesignerElement) {
                const activeId = active.data?.current?.elementId
                const overId = over.data?.current?.elementId


                const activeElementIndex = elements.findIndex((el) => el.id === activeId)
                const overElementIndex = elements.findIndex((el) => el.id === overId)

                if(activeElementIndex === -1 || overElementIndex === -1 ) throw new Error("Element not found");

                let indexForNewElement = overElementIndex
                if(isDroppingOverDesignerElementBottomHalf) {
                    indexForNewElement = overElementIndex + 1
                }

                const activeElement = {...elements[activeElementIndex]}
                removeElement(activeId)

                addElement(indexForNewElement , activeElement)
            }


        }
    })

    // console.log("Elements" , elements)

  return (
    <div className='flex w-full h-full'>
        <div className="p-4 w-full" onClick={() => {
            if (selectedElement) setSelectedElement(null)
        }}>
            <div 
              ref={droppable.setNodeRef}
              className={cn(
                "bg-background max-w-[920px] h-screen m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
                droppable.isOver && "ring-2 ring-primary ring-inset"
              )}
            >
                {!droppable.isOver && elements.length === 0 && (
                    <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
                        Drop here
                    </p>
                )}
                {droppable.isOver && elements.length === 0 && (
                    <div className="p-4 w-full">
                        <div className="h-[120px] rounded-md bg-primary/20"></div>
                    </div>
                )}
                {elements.length > 0 && (
                    <div className="flex flex-col w-full gap-2 p-4">
                        {elements.map((element) => (
                            <DesignerElementWrapper key={element.id} element={element} />
                        ))}
                    </div>
                )}
            </div>
        </div>
        <DesignerSidebar />
    </div>
  )
}

function DesignerElementWrapper({element} : {element : FormElementInstance}) {

    const [isMouseOver, setIsMouseOver] = useState<boolean>(false)
    const {removeElement,selectedElement,setSelectedElement} = useDesigner()

    const topHalf = useDroppable({
        id:element.id+"-top",
        data:{
            type:element.type,
            elementId:element.id,
            isTopHalfDesignerElement:true,
        }
    })


    const bottomHalf = useDroppable({
        id:element.id + "-bottom",
        data: {
            type:element.type,
            elementId:element.id,
            isBottomHalfDesignerElement:true
        }
    })

    const draggable = useDraggable({
        id:element.id + "-drag-handler",
        data: {
            type:element.type,
            elementId:element.id,
            isDesignerElement:true
        }
    })

    if(draggable.isDragging) return null;

    // console.log("Selected Element" , element)
    const DesignerElement = FormElements[element.type].designerComponent

    return (
        <div 
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false )}
            onClick={(e) => {
                e.stopPropagation()
                setSelectedElement(element)
            }}
        >
            <div 
                ref={topHalf.setNodeRef}
                className="absolute w-full h-1/2 rounded-t-md" 
                // className={cn("absolute w-full h-1/2 rounded-t-md", topHalf.isOver && "bg-green-500")}
            />

            <div 
                ref={bottomHalf.setNodeRef}
                className="absolute w-full h-1/2 bottom-0 rounded-b-md" 
            />

            {isMouseOver && (
                <>
                    <div className="absolute right-0 h-full">
                        <Button 
                            variant={"outline"}
                            className="flex justify-center h-full border rounded-md rounded-l-none hover:bg-red-600 bg-red-500"
                            onClick={(e) => {
                                    e.stopPropagation()
                                    removeElement(element.id)
                                }
                            }
                        >
                            <Trash className='w-6 h-6' />
                        </Button>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                        <div className="text-muted-foreground text-sm">
                            Click for properties or drag to move
                        </div>
                    </div>
                </>
            )}

            {topHalf.isOver && (
                <div className='absolute w-full top-0 rounded-md h-[3px] bg-primary border-b-none' />
            )}

            <div className={cn("flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100", isMouseOver && "opacity-20")}>
                <DesignerElement elementInstance={element} />
            </div>

            {bottomHalf.isOver && (
                <div className='absolute w-full bottom-0 rounded-md h-[3px] bg-primary border-t-none' />
            )}

        </div>
    )
}

export default Designer