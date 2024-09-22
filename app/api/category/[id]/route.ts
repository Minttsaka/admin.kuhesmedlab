import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }


    const category = await prisma.category.findFirst({
      where:{
        id
      }
    });

    if (!category) {
      throw new Error("Category not found");
    }

    await prisma.category.delete({
      where:{
        id:category.id
      }
    })

    return NextResponse.json(category)
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

    const data = await req.json()

    const research = await prisma.research.update({
      where: {
        id
      },
      data
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

