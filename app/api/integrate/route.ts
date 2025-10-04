// async function POST(req:Request) {

import { CreateForm, CreateFormExternal } from "@/actions/form";
import { verifyingUser } from "@/lib/verifyingUser";
import { NextResponse } from "next/server";


export async function GET(req:Request) {
    return NextResponse.json({message:"hello"})
}

export async function POST(req:Request) {
    try {
        const body = await req.json()
        const {userId, name, description} = body

        if(!userId || !name || !description) {
            console.error("[INVALID DATA] - All the required field are not given")
            return new NextResponse("Invalid data error", {status: 402})
        }

        // const isPlatformValid = await verifyingPlatform(platformId)

        const IsUser = await verifyingUser(userId)

        if(!IsUser) {
            return NextResponse.json({error:"User verfication failed"})
        }

        const dataPayload = {
            name,
            description
        }

        const formId = await CreateFormExternal(dataPayload, userId)

        return NextResponse.json({
            formId
        })

    } catch (error) {
        console.error("[INTEGRATE ERROR RESPONSE]", error)
        return new NextResponse("Internal Error, try again", {status:500})
    }
}