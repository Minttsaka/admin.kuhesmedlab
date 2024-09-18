"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { SunIcon, MoonIcon, TrendingUpIcon, DownloadIcon, UsersIcon, GlobeIcon, ArrowRight, FormInput } from 'lucide-react'
import { Progress } from './ui/progress'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils'
import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import  { PureComponent } from 'react';
import {  Collaborator, Prisma, Research, SurveyForm } from '@prisma/client'
import { GroupMembers } from './GroupMembers'
import { getResearchTrends, saveSurveyData } from '@/lib/actions'


export type ResearchWithAllRelations = Prisma.ResearchGetPayload<{
  include:{
    citationTrend:true,
    downloadTrend:true,
    files:true,
    collaborator:{
      include:{
        user:true
      }
    },
    surveys:{
      include:{
        surveyForm:true
      }
    }
  }
}>;


const generateTimeSeriesData = (months:number, baseValue:number, trend:number, volatility:number) => {
  return Array.from({ length: months }, (_, i) => {
    const trendValue = baseValue + (trend * i)
    const random = (Math.random() - 0.5) * 2 * volatility
    return Math.max(0, Math.round(trendValue + random))
  })
}

const generateChartData = async(paper:Research) => {
  const { 
    citationTrends,
    downloadTrends,
    views,
    citations,
    downloads ,
    subjectAreaData
  } = await getResearchTrends(paper.id);

  const citationData = citationTrends.map(trend => ({
    month: `${trend.month} ${trend.year}`,
    citations: trend.citations
  }));

  const downloadData = downloadTrends.map(trend => ({
    month: `${trend.month} ${trend.year}`,
    downloads: trend.downloads
  }));

  const impactMetrics = [
    { subject: 'Citations', A: citations, fullMark: 150 },
    { subject: 'Downloads', A: downloads, fullMark: 150 },
    { subject: 'Views', A: views, fullMark: 150 },
  ];

  
  return { citationData, downloadData, subjectAreaData, impactMetrics }
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FF`A07A', '#98D8C8']

type Metrics = {


  citationData: {
    month: string;
    citations: number;
}[],
   downloadData: {
    month: string;
    downloads: number;
}[], 
   subjectAreaData: {
    name: string;
    value: number;
}[], 
   impactMetrics:{
    subject: string;
    A: number;
    fullMark: number;
} []
}

export default function Practice(
  { 
    research, 
 
  }:{
    research:ResearchWithAllRelations,

  }) {
    
  const [darkMode, setDarkMode] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [label, setLabel] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>()


  useEffect(()=>{
    const getMetric = async()=>{
      // const { citationData, downloadData, subjectAreaData, impactMetrics }
      const data  = await generateChartData(research)
    setMetrics(data)
    }
    getMetric()
  },[])

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: 'spring', stiffness: 300 } },
    blur: { scale: 1 }
  }

  const collaborators = research.collaborator.map(collaborator=>collaborator.user)

  const totalCitations = research.citationTrend.reduce((sum, citation) => sum + citation.citations, 0);

  // Calculate total downloads
  const totalDownloads = research.downloadTrend.reduce((sum, download) => sum + download.downloads, 0);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`} id='analytics'>
      <div className="p-4 bg-gradient-to-r from-background to-secondary ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl bg-clip-text font-extrabold tracking-tight mb-2 text-transparent bg-gradient-to-r from-primary to-secondary line-clamp-1">{research.title}</h1>
          <div className="flex items-center space-x-2">
            <SunIcon className="h-5 w-5" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <MoonIcon className="h-5 w-5" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-gradient-to-br from-card to-background">
              <CardHeader>
                <CardTitle className='line-clamp-1'>{research.abstract}</CardTitle>
                <div className='flex items-center gap-3'>
                  <GroupMembers collaborator={collaborators} />
                </div>
               
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                    <TrendingUpIcon className="w-8 h-8 mb-2 text-primary" />
                    <span className="text-2xl font-bold">{totalCitations}</span>
                    <span className="text-sm">Total Citations</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                    <DownloadIcon className="w-8 h-8 mb-2 text-primary" />
                    <span className="text-2xl font-bold">{totalDownloads}</span>
                    <span className="text-sm">Total Downloads</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                    <UsersIcon className="w-8 h-8 mb-2 text-primary" />
                    <span className="text-2xl font-bold">{research.collaborator.length}</span>
                    <span className="text-sm">Collaborators</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                    <GlobeIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                    <span className="text-2xl font-bold">{research.views}</span>
                    <span className="text-sm">Views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-background">
                <CardHeader>
                  <CardTitle>Citations Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics?.citationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="citations" stroke="#8884d8" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-card to-background">
                <CardHeader>
                  <CardTitle>Monthly Downloads</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics?.downloadData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="downloads" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-card to-background">
                <CardHeader>
                  <CardTitle>Subject Area Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={metrics?.subjectAreaData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {metrics?.subjectAreaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-card to-background">
                <CardHeader>
                  <CardTitle>Research Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metrics?.impactMetrics}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} />
                      <Radar name="Paper Metrics" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}