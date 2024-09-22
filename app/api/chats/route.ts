
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

        const user = await prisma.user.findUnique({
          where:{
            email:sessionUser.email
          }
        })
    
        const chats = await prisma.chat.findMany({
          include: {
            user: {
              select: { id: true, name: true, image: true }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
            }
          }
        })
    
        const formattedChats = chats.map(chat => ({
          id: chat.id,
          user: chat.user,
          topic:chat.topic,
          lastMessage: chat.messages[0]?.content || '',
          unreadCount: chat.unreadCount,
        }))
    
        return NextResponse.json(formattedChats)
      } catch (error) {
        return  NextResponse.json({ message: 'Error fetching chats', error})
      }
}