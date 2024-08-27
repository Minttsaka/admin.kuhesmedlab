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
// Mock data for research projects
const researchProjects = [
  {
    id: 1,
    title: "Effects of Vitamin D on Immune Response",
    researcher: "Dr. Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "2023-05-15",
    status: "Pending",
    abstract: "This study aims to investigate the role of Vitamin D in modulating immune responses, particularly in the context of respiratory infections. We hypothesize that adequate Vitamin D levels enhance the body's ability to fight off pathogens and reduce the severity of symptoms in respiratory illnesses.",
    keywords: ["Vitamin D", "Immune System", "Respiratory Infections"],
    analytics: {
      views: 245,
      downloads: 78,
      citations: 12,
    },
    media: [
      {
        type: "image",
        url: "/placeholder.svg?height=200&width=300",
        caption: "Vitamin D molecular structure",
      },
      {
        type: "image",
        url: "/placeholder.svg?height=200&width=300",
        caption: "Immune response diagram",
      },
    ],
    funding: 75000,
    timeline: "12 months",
    collaborators: ["Dr. Michael Johnson", "Dr. Emily Chen"],
    ethicsApproval: "Approved by IRB #12345",
    progress: 65,
  },
  {
    id: 2,
    title: "Genetic Markers for Early Alzheimer's Detection",
    researcher: "Dr. Michael Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "2023-06-02",
    status: "Under Review",
    abstract: "Our research focuses on identifying specific genetic markers that may indicate a predisposition to Alzheimer's disease. By analyzing genomic data from a diverse population, we aim to develop a more accurate and earlier detection method for Alzheimer's, potentially leading to more effective early interventions.",
    keywords: ["Alzheimer's", "Genetic Markers", "Early Detection"],
    analytics: {
      views: 312,
      downloads: 95,
      citations: 8,
    },
    media: [
      {
        type: "image",
        url: "/placeholder.svg?height=200&width=300",
        caption: "Brain scan comparison",
      },
    ],
    funding: 120000,
    timeline: "24 months",
    collaborators: ["Dr. Sarah Lee", "Dr. Robert Brown"],
    ethicsApproval: "Pending IRB review",
    progress: 30,
  },
  {
    id: 3,
    title: "Microplastics Impact on Gut Microbiome",
    researcher: "Dr. Emily Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "2023-06-10",
    status: "Published",
    abstract: "This study investigates the potential effects of microplastics on the human gut microbiome. We will analyze stool samples from individuals with varying levels of microplastic exposure to determine if there are significant alterations in microbial diversity and composition, and assess potential health implications.",
    keywords: ["Microplastics", "Gut Microbiome", "Environmental Health"],
    analytics: {
      views: 528,
      downloads: 203,
      citations: 31,
    },
    media: [
      {
        type: "image",
        url: "/placeholder.svg?height=200&width=300",
        caption: "Microplastics in water sample",
      },
      {
        type: "image",
        url: "/placeholder.svg?height=200&width=300",
        caption: "Gut microbiome diversity chart",
      },
    ],
    funding: 95000,
    timeline: "18 months",
    collaborators: ["Dr. Alex Wong", "Dr. Lisa Garcia"],
    ethicsApproval: "Approved by IRB #67890",
    progress: 100,
  },
]

export default function SingleResearch({research}:{research:ResearchWithAllRelations}) {
  const [selectedResearch, setSelectedResearch] = useState(researchProjects[0])


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