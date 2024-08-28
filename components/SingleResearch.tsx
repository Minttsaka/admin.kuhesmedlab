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
import Approve from "./Approve"

export type ResearchWithAllRelations = Prisma.ResearchGetPayload<{
  include: {
    tag: true;
    review: true;
    surveys: {
      include: {
        surveyForm: {
          include: {
            questions: {
              include: {
                choices: true;
              };
            };
          };
        };
      };
    };
    authors: true;
    files: true;
    user: true;
    institution: true;
    collaborator: true;
    reference: true;
  };
}>;


export default function SingleResearch({research}:{research:ResearchWithAllRelations}) {

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Research Review</h1>
        <Practice 
          researchId={research?.id!} 
          surveys={research?.surveys!} 
          downloads={research?.downloadCount!}
          citations={research?.citationCount!}
          title={research?.title!}
          abstract={research?.abstract!}
          collaborators={research?.collaborator!}
        />
        <RelatedResearchList title={research?.title!} />
        <ResearchReferencesSection reference={research?.reference!} />
        <Approve id={research?.id!} />

      </div>
    </div>
  )
}