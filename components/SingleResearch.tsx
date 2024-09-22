"use client"

import React, { useState } from "react"
import Practice from "./Practice"
import RelatedResearchList from "./RelatedResearchList"
import ResearchReferencesSection from "./ResearchReference"
import Approve from "./Approve"
import ResearchFiles from "./ResearchFIles"
import { Prisma } from "@prisma/client"

export type ResearchWithAllRelations = Prisma.ResearchGetPayload<{
  include:{
    citationTrend:true,
    downloadTrend:true,
    files:true,
    reference:true,
    collaborator:{
      include:{
        user:true
      }
    },
    surveys:{
      include:{
        surveyForm:{
          include:{
            questions:{
              include:{
                choices:true
              }
            }
          }
        }
      }
    }
  }
}>;


export default function SingleResearch({research}:{research:ResearchWithAllRelations}) {

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main content */}
      <div className="w-full p-6">
        <h1 className="mb-4 text-2xl font-bold">Research Review</h1>
        <Practice 
          research={research!}
        />
        <ResearchFiles files={research?.files!} />
        <RelatedResearchList title={research?.title!} />
        <ResearchReferencesSection researchId={research?.id!} actualRef={research?.citeReference!} />
        <Approve id={research?.id!} status={research.status!} />

      </div>
    </div>
  )
}