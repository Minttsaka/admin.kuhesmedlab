"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, FileText, User, Calendar, Tag, BarChart, Download, MessageSquare } from "lucide-react"
import { Prisma } from "@prisma/client"
import Practice from "./Practice"
import RelatedResearchList from "./RelatedResearchList"
import ResearchReferencesSection from "./ResearchReference"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

type ResearchWithUserAndAuthorsPayload = Prisma.ResearchGetPayload<{ 
    include:{
      user:true,
      authors:true
    }
}>;


export default function SingleSideBarResearchList({research, id }:{research:ResearchWithUserAndAuthorsPayload[], id:string}) {

    const [activeTab, setActiveTab] = useState("all")

    const filteredProjects = research.filter((project) => {
      if (activeTab === "all") return true
      if (activeTab === "pending") return project.status=== "PENDING"
      if (activeTab === "review") return project.status === "DEVELOPMENT"
      if (activeTab === "published") return project.status === "APPROVED"
      return true
    })

  return (
    <div>
        <div className="w-80 border-r bg-white">
        <div className="p-4">
          <h2 className="mb-2 text-lg font-semibold">Research Projects</h2>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
            </TabsList>
          </Tabs>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            {filteredProjects.map((project) => (
              <Link href={`/a/research-papers/${project.id}`} key={project.id}>
                <button
                  className={`flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-accent ${
                    id === project.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={project.user.image!} alt={project.user.name} />
                      <AvatarFallback>{project.user.name}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-medium">{project.title}</span>
                      <p className="text-xs text-muted-foreground">{project.authors.split(",").map(author => author.trim()).map(author=>(<span key={author}>{author}, </span>))}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <Separator className="my-2" />
              </Link>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
