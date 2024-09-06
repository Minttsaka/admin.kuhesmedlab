"use client"

import React, { useState } from 'react'
import { Search, Plus, MoreHorizontal, Edit, Archive, Eye, Play, PlusCircle, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Prisma } from '@prisma/client'
import Link from 'next/link'


type SurveyForm = Prisma.SurveyFormGetPayload<{
  include:{
    survey:{
      include:{
        research:true
      }
    },
    questions:{
      include:{
        choices:true
      }
    }
  },
}>

const statusColors = {
  Active: "bg-green-500",
  Draft: "bg-yellow-500",
  Archived: "bg-gray-500",
}

export default function SurveyFirst({surveys}:{surveys:SurveyForm[]}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyForm | null>()
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false)

  const filteredSurveys = surveys.filter(survey => 
    (survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     survey.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "All" || survey.status === statusFilter)
  )

  const handleStatusChange = (surveyId:string, newStatus:any) => {
    // Implement status change logic here
    console.log(`Changed status of survey ${surveyId} to ${newStatus}`)
  }

  return (
    <div className=" p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Survey Management</h1>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search surveys..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={setStatusFilter} defaultValue="All">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <Card key={survey.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{survey.title}</CardTitle>
              <CardDescription>{survey.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Badge className={`${statusColors[survey.status as keyof typeof statusColors]} text-white`}>{survey.status}</Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">Created: {survey.createdAt.toDateString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>{survey.questions.length} questions</span>
                <span>{survey.questions.map(question=>question.choices).length} responses</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setSelectedSurvey(survey)}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedSurvey} >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedSurvey?.title}</DialogTitle>
            <DialogDescription>
              Detailed information about the selected survey.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Badge className={`${statusColors[selectedSurvey?.status as keyof typeof selectedSurvey]} text-white mt-1`}>{selectedSurvey?.status}</Badge>
              </div>
              <div>
                <Label>Created Date</Label>
                <p className="mt-1">{selectedSurvey?.createdAt.toDateString()}</p>
              </div>
              <div>
                <Label>Questions</Label>
                <p className="mt-1">{selectedSurvey?.questions.length}</p>
              </div>
              <div>
                <Label>Responses</Label>
                <p className="mt-1">{selectedSurvey?.questions.map(question=>question.choices).length}</p>
              </div>
            </div>
            <div>
              <Label>Research Paper</Label>
              <p className="mt-1">{selectedSurvey?.survey.research.title}</p>
            </div>
            <div>
              <h3 className='font-semibold'>Description</h3>
              <p className='text-sm'>{selectedSurvey?.description}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setSelectedSurvey(null)}>Close</Button>
            <Button>
              <Link href={``}>View Survey</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}