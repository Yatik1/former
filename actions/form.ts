"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

class UserNotFoundErr extends Error {}


export async function GetFormStats() {
    const user = await currentUser()
    
    if(!user) {
        redirect("/sign-in")
        // throw new UserNotFoundErr()
    }

    const totalForms = await prisma.form.count({
        where:{
            userId:user.id
        }
    })

    const stats = await prisma.form.aggregate({
        where: {
            userId : user.id,
        },
        _sum: {
            visits:true,
            submissions:true
        }
    })

    const visits = stats._sum.visits || 0
    const submissions = stats._sum.submissions || 0

    let submissionRate = 0
    let bounceRate=0

    if(visits > 0) {
        submissionRate = (submissions/visits) * 100
    }

    if(submissionRate > 0) bounceRate = 100-submissionRate;

    return {
        visits,
        submissionRate,
        totalForms,
        submissions,
        bounceRate
    }
}


export async function CreateForm(data:formSchemaType) {
    const validation = formSchema.safeParse(data)
    if(!validation.success) {
        throw new Error("form not valid")
    }
    
    const user = await currentUser()
    if(!user) {
        redirect("/sign-in")
        // throw new UserNotFoundErr()
    }

    const {name,description} = data
    
    const form = await prisma.form.create({
        data:{
            userId:user.id,
            name,
            description
        }
    })

    if(!form) {
        throw new Error("Something went wrong")
    }

    return form.id
}

export async function CreateFormExternal(data:{name:string, description?:string} , userId:string) {
  
    if(!userId) {
        throw new Error("User is not valid")
      }
    
    const {name, description} = data

    if(!name) {
        throw new Error("Name field is required")
    }
  
  const form = await prisma.form.create({
    data: {
        userId, 
        name,
        description
    }
  })

  if(!form) {
    throw new Error("Something went wrong")
  }

  return form.id

}

export async function GetForms() {
    const user = await currentUser()
    if(!user) {
        redirect("/sign-in")
        // throw new UserNotFoundErr()
    }

    const forms =  await prisma.form.findMany({
        where: {
            userId:user.id,
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    return forms
}

export async function GetFormById(id:number) {
    const user = await currentUser()
    if(!user) {
        redirect("/sign-in")
        // throw new UserNotFoundErr()
    }

    const formById = await prisma.form.findUnique({
        where:{
            userId:user.id,
            id:id
        }
    })

    return formById
}

export async function UpdateFormContent(id:number, jsonContent:string) {
    const user = await currentUser()
    if(!user) {
        redirect("/sign-in")
        // throw new UserNotFoundErr()
    }

    return await prisma.form.update({
        where:{
            userId:user.id,
            id,
        },
        data:{
            content : jsonContent
        }
    })
}

export async function PublishForm(id:number) {
     const user = await currentUser()
     if(!user) {
        redirect("/sign-in")
     }

     return await prisma.form.update({
        data:{
            published:true
        },
        where:{
            userId:user.id,
            id
        }
     })
}

export async function GetFormContentByUrl(formUrl:string) {
    return await prisma.form.update({
        select:{
            content:true,
        },
        data:{
            visits:{
                increment:1
            }
        },
        where:{
            shareURL:formUrl
        }
    })
}

export async function SubmitForm(formUrl:string, content:string) {
    return await prisma.form.update({
        data:{
            submissions:{
                increment:1
            },
            FormSubmissions:{
                create:{
                    content
                }
            }
        },
        where:{
            shareURL:formUrl,
            published:true
        }
    })
}

export async function GetFormWithSubmissions(id:number) {
    const user = await currentUser()
    if(!user) {
        redirect("/sign-in")
    }

    return await prisma.form.findUnique({
        where:{
            userId:user.id,
            id,
        },
        include:{
            FormSubmissions:true
        }
    })
}