import { NextResponse } from "next/server"
import prisma from "./prisma";

export async function verifyingUser(userId:string) {
    try {
        if(!userId) {
            console.error("[USER ID ERROR] - User id is not given")
            return false
        }
    
        const IsUser = await prisma.form.findFirst({
            where: {userId: userId},
        });
    
        if(!IsUser) {
            console.error("[FORM USER CHECK ERROR] - No forms and user found")
            return false
        }
        
        return true;
    } catch (error) {
        console.error("INTERNAL DB ERROR", error)
        return false
    }
}