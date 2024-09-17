import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { User } from "@prisma/client";

export async function GET(req: NextRequest) {

  console.log(req)
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    console.log(id)

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    const notifications = await prisma.notification.update({
      where:{
        id
      },
      data:{
        status:"READ",
        readAt:new Date()
      }
    })

    console.log("marked as red single")

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

  const session:any = await getServerSession(authOptions);
  const userSession= (session.user as User);
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    const notifications = await prisma.notification.updateMany({
      where:{
        receiverId:userSession.id
      },
      data:{
        status:"READ",
        readAt:new Date()
      }
    })

    console.log("marked as red all")

    if (!notifications) {
      throw new Error("Form not found");
    }

    return NextResponse.json(notifications)

  } catch (error: any) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


