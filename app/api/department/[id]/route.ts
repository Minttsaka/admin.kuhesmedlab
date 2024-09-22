import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    console.log("params", id);

    const files = await prisma.department.findUnique({
      where:{
        id
      }
    });


    if (!files) {
      throw new Error("Form not found");
    }

    return NextResponse.json(files)
  } catch (error: any) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    const session:any = await getServerSession(authOptions);
    const sessionUser= session.user as User

    const user = await prisma.user.findUnique({
      where:{
      id:sessionUser.id
      }
    })

    const data = await req.json()

    const { name } = data

    const dep = await prisma.department.findUnique({
      where:{
        id
      }
    });

    const research = await prisma.roles.create({
      data:{
        name,
        department:{
          connect:{
            id:dep?.id
          }
        },
      }
    });

    if (!research) {
      throw new Error(`research with id ${id} does not exist.`);
    }


    return NextResponse.json("success")
  } catch (error: any) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

