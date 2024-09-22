import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { User } from "@prisma/client";
import { Console } from "console";

export async function GET(req: NextRequest) {

  const session:any = await getServerSession(authOptions);
  const userSession= (session.user as User);
  try {
    

    const notifications = await prisma.notification.findMany({
      where:{
        receiverId:userSession.id
      },
    })

    if (!notifications) {
      throw new Error("Form not found");
    }


    return NextResponse.json(notifications)

  } catch (error: any) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {

  const data = await req.json()

  try {
    

    const feedback = await prisma.feedback.create({
      data
    })

    console.log("saved the feedback")

    if (!feedback) {
      throw new Error("Form not found");
    }


    return NextResponse.json(feedback)

  } catch (error: any) {
    console.error("Error creating feedback", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


