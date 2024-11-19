import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React from 'react'
import { ElementType, FormElements } from './FormElement'
import { SideBarElementDragOverlay } from './SideBarElement'

function DragOverlayWrapper() {

  const [draggedItem ,setDraggedItem] = React.useState<Active|null>(null)

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

  return (
    <DragOverlay>
        {node}
    </DragOverlay>
  )
}

export default DragOverlayWrapper