"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs/server";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
    const user = await currentUser()
    if(!user) {
        throw new UserNotFoundErr()
    }

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
        submissions,
        bounceRate
    }
}

