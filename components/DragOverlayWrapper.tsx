import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React from 'react'
import { ElementType, FormElements } from './FormElement'
import { SideBarElementDragOverlay } from './SideBarElement'
import useDesigner from '@/hooks/useDesigner'

function DragOverlayWrapper() {

  const [draggedItem ,setDraggedItem] = React.useState<Active|null>(null)

  const {elements} = useDesigner()

  useDndMonitor({
    onDragStart:(event) => {
        setDraggedItem(event.active)
    },
    onDragCancel:() => {
        setDraggedItem(null)
    },
    onDragEnd:() => {
        setDraggedItem(null)
    }
  })

  let node = <div>No drag Overlay</div>

  if(!draggedItem) return null;
  const isSidebarBtnElement = draggedItem.data?.current?.isDesignerBtnElement;

  if(isSidebarBtnElement) {
    const type = draggedItem.data?.current?.type as ElementType
    node = <SideBarElementDragOverlay formElement={FormElements[type]}/>
  }

  const isDesignerElement = draggedItem.data?.current?.isDesignerElement
  if(isDesignerElement) {

    const  elementId = draggedItem.data?.current?.elementId
    const element = elements.find((el) => el.id === elementId)

    if(!element) node = <div>No Element</div>;
    else {
      const DesignerElementComponent = FormElements[element.type].designerComponent

      node = (
        <div className="flex bg-accent border rounded-md h-[120px] w-full py-4 px-4 opacity-80 pointer-events-none">
          <DesignerElementComponent elementInstance={element} />
        </div>
      )
    }
  }

  return (
    <DragOverlay>
        {node}
    </DragOverlay>
  )
}

export default DragOverlayWrapper