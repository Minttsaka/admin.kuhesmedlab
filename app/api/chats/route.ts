
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {

const session:any = await getServerSession(authOptions);
  const sessionUser= session.user as User

  try {
    const data  = await req.json();

    const {name} = data

    await prisma.category.create({
     data:{
      name,
     creatorId:sessionUser.id
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
        const session:any = await getServerSession(authOptions);
        const sessionUser= session.user as User
    
        const chats = await prisma.chat.findMany({
          where: { userId: sessionUser.id },
          include: {
            user: {
              select: { id: true, name: true, image: true }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            }
          }
        })
    
        const formattedChats = chats.map(chat => ({
          id: chat.id,
          user: chat.user,
          lastMessage: chat.messages[0]?.content || '',
          unreadCount: chat.unreadCount,
        }))
    
        NextResponse.json(formattedChats)
      } catch (error) {
        NextResponse.json({ message: 'Error fetching chats', error})
      }
}