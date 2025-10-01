"use client";

import { DesignerContext } from '@/context/DesignerContext';
import React, { useContext } from 'react'

function useDesigner() {
    const context = useContext(DesignerContext)
    
    if(!context) throw new Error("useDesigner must be with in Designer Context")

    return context
}

export default useDesigner