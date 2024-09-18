"use client";
import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { Collaborator, User } from "@prisma/client";

export function GroupMembers({collaborator}:{collaborator:User[]}) {
  return (
    <div className="flex my-3 w-full">
      <AnimatedTooltip items={collaborator} />
    </div>
  );
}
