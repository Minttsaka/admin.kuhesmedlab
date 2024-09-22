
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data  = await req.json();
    await prisma.category.create({
      data:data.values
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
    const categories = await prisma.category.findMany();
    return NextResponse.json(
      categories
    );
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}