
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {

  const session:any = await getServerSession(authOptions);
  const sessionUser= session.user as User
  try {
    const data  = await req.json();
    await prisma.event.create({
      data:{
       ...data,
       userEmail:sessionUser.email
      }
    })
      ;

    return NextResponse.json(
     "success"
    );
  } catch (error: any) {
    console.log(error)
    throw new Error("Something went wrong");
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy:{
        createdAt:"desc"
      }
    });
    return NextResponse.json(
      events
    );
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}