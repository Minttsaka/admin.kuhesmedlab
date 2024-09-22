
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data  = await req.json();
    await prisma.institution.create({
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
    const institutions = await prisma.institution.findMany();
    return NextResponse.json(
      institutions
    );
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}