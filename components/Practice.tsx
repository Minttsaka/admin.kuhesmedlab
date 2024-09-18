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
import { PaperPlaneIcon, PlusIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import  { PureComponent } from 'react';
import {  Collaborator, Prisma, Research, SurveyForm } from '@prisma/client'
import { UploadResearchPaper } from './upload-research-paper'
import { GroupMembers } from './GroupMembers'
import ResearchInvite from './ResearchInvite'
import { useToast } from './ui/use-toast'
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

  const { toast } = useToast()
  const router = useRouter();

  useEffect(()=>{
    const getMetric = async()=>{
      // const { citationData, downloadData, subjectAreaData, impactMetrics }
      const data  = await generateChartData(research)
    setMetrics(data)
    }
    getMetric()
  },[])

  const handleSubmit = async() => {

    const data={
      title,
      description,
      label,
      researchId:research.id
    }
    try {
      setIsSubmitting(true)

      const res:any = await saveSurveyData(data)

      if(res==="label"){
          toast({
            title:"Status",
            description:"Change the label"
          })
          setIsSubmitting(false)
        } else {
          toast({
            title:"Survey",
            description:"Successfully created"
          })
          router.push(`/mw/survey/questionner/${res.id!}/${research.id}`)
  
        }
      
    } catch (error) {
      
    } finally{
      setIsSubmitting(false)
    }
  }

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
          <Card className="lg:col-span-1 bg-gradient-to-br from-card to-background">
            <CardHeader>
              <CardTitle className='text-md flex items-center justify-between'>
                Survey
                <Dialog>
                  <DialogTrigger className='absolute top-3 right-3 p-2 rounded-md bg-primary text-primary-foreground shadow-lg ' asChild>
                    <button className="px-8 py-2 rounded-xl relative bg-gray-100 text-gray-600 text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200">
                        <span className="relative text-xs z-20">
                          Create Survey form
                        </span>
                      </button>
                  </DialogTrigger>
                  <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl border-none rounded-none  shadow-purple-500 ">
                    <h2 className='text-gray-600 font-bold space-y-5 text-center'>Create New Survey</h2>
                    <div className="rounded-xl ">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid gap-6"
                      >
                        <motion.div className="space-y-2">
                          <Label htmlFor="title" className="text-sm font-medium text-slate-200">
                            Title
                          </Label>
                          <motion.div variants={inputVariants} whileFocus="focus" >
                            <Input
                              id="title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="bg-transparent border-b-2 border-blue-500 focus:border-teal-400 text-white placeholder-slate-400 focus:ring-0 focus:outline-none transition-colors duration-300"
                              placeholder="Enter title"
                            />
                          </motion.div>
                        </motion.div>

                        <motion.div className="space-y-2">
                          <Label htmlFor="description" className="text-sm font-medium text-slate-200">
                            Description
                          </Label>
                          <motion.div variants={inputVariants} whileFocus="focus" >
                            <Input
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="bg-transparent border-b-2 border-blue-500 focus:border-teal-400 text-white placeholder-slate-400 focus:ring-0 focus:outline-none transition-colors duration-300"
                              placeholder="Enter description"
                            />
                          </motion.div>
                        </motion.div>

                        <motion.div className="space-y-2">
                          <Label htmlFor="label" className="text-sm font-medium text-slate-200">
                            Label
                          </Label>
                          <motion.div variants={inputVariants} whileFocus="focus" >
                            <Input
                              id="label"
                              value={label}
                              onChange={(e) => setLabel(e.target.value)}
                              className="bg-transparent border-b-2 border-blue-500 focus:border-teal-400 text-white placeholder-slate-400 focus:ring-0 focus:outline-none transition-colors duration-300"
                              placeholder="Enter label"
                            />
                          </motion.div>
                        </motion.div>

                        <motion.button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="px-8 py-3 rounded-full relative bg-gradient-to-r from-blue-600 to-teal-400 text-white text-sm font-medium hover:shadow-2xl hover:shadow-teal-500/20 transition duration-300 overflow-hidden group"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-600"
                            initial={{ x: '100%' }}
                            animate={{ x: isSubmitting ? '0%' : '100%' }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                          />
                          <span className="relative z-10 flex items-center justify-center">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Creating...
                              </>
                            ) : (
                              'Create New Survey'
                            )}
                          </span>
                          <motion.div
                            className="absolute inset-x-0 h-1 bottom-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                          />
                        </motion.button>
                      </motion.div>
                    </div>
                  </DialogContent>
                </Dialog>
         
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="md:h-full">
                <AnimatePresence>
                  {research?.surveys.map((survey) => (
                    <motion.div
                      key={survey.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 mb-4 rounded-lg cursor-pointer transition-all duration-300 bg-primary text-primary-foreground shadow-lg '
                      }`}
                    
                    >
                      <h3 className="font-semibold">{survey.title}</h3>
                      <p className="text-sm">{survey.description}</p>
                      <div className="flex justify-between mt-2">
                        <Badge variant="secondary" className="flex items-center">
                          <FormInput className="w-3 h-3 mr-1" />
                          {survey.surveyForm.length} - {survey.surveyForm.length === 1 ? "form" :"forms "}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center ">
                          {survey.label} 
                        </Badge>
                        <Link  href={`/mw/survey/questionner/${survey.id}/${research.id}`} target='_blank' >
                          <Badge variant="secondary" className="flex items-center">
                            <ArrowRight className="w-3 h-3 mr-1" />
                            View
                          </Badge>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-gradient-to-br from-card to-background">
              <CardHeader>
                <CardTitle className='line-clamp-1'>{research.abstract}</CardTitle>
                <div className='flex items-center gap-3'>
                <GroupMembers collaborator={collaborators} />
                <ResearchInvite id={research.id} />
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