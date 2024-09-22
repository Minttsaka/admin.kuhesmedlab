import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }


    const messages = await prisma.message.findMany({
      where: { chatId:id },
      include: {
        sender: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name,
      timestamp: message.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedMessages)
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

    const { content, senderId } = await req.json()

    if (!content || !senderId) {
      return NextResponse.json({ message: 'Missing required fields' })
    }

    const newMessage = await prisma.message.create({
      data: {
        content,
        chatId:id,
        senderId,
      },
      include: {
        sender: {
          select: { id: true, name: true }
        }
      }
    })

    // Update the chat's lastMessage and unreadCount
    await prisma.chat.update({
      where: { id },
      data: {
        lastMessage: content,
        unreadCount: { increment: 1 },
      }
    })

    return NextResponse.json({
      id: newMessage.id,
      content: newMessage.content,
      senderId: newMessage.senderId,
      senderName: newMessage.sender.name,
      timestamp: newMessage.createdAt.toISOString(),
    })
  } catch (error) {
    NextResponse.json({ message: 'Error sending message', error })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }


    const { chatId } = await req.json()

    await prisma.chat.update({
      where: { id: chatId },
      data: { unreadCount: 0 }
    })

    return NextResponse.json({ message: 'Chat marked as read' })
  } catch (error: any) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


