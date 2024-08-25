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

const surveys = [
  {
    id: 1,
    title: "Patient Satisfaction in Telemedicine",
    researchPaper: "The Impact of Telemedicine on Rural Healthcare Outcomes",
    status: "Active",
    questions: 15,
    responses: 89,
    createdDate: "2023-06-15",
  },
  {
    id: 2,
    title: "COVID-19 Vaccine Efficacy Follow-up",
    researchPaper: "Long-term Efficacy of mRNA Vaccines",
    status: "Draft",
    questions: 20,
    responses: 0,
    createdDate: "2023-06-20",
  },
  {
    id: 3,
    title: "Mental Health in Healthcare Workers",
    researchPaper: "Burnout Syndrome in Frontline Medical Staff",
    status: "Archived",
    questions: 25,
    responses: 150,
    createdDate: "2023-05-10",
  },
  {
    id: 4,
    title: "Nutrition and Chronic Disease Management",
    researchPaper: "Dietary Interventions in Type 2 Diabetes",
    status: "Active",
    questions: 18,
    responses: 72,
    createdDate: "2023-06-01",
  },
]

const statusColors = {
  Active: "bg-green-500",
  Draft: "bg-yellow-500",
  Archived: "bg-gray-500",
}

export default function SurveyFirst() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false)

  const filteredSurveys = surveys.filter(survey => 
    (survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     survey.researchPaper.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "All" || survey.status === statusFilter)
  )

  const handleStatusChange = (surveyId, newStatus) => {
    // Implement status change logic here
    console.log(`Changed status of survey ${surveyId} to ${newStatus}`)
  }

  return (
    <div className=" p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Survey Management</h1>
        <Button onClick={() => setIsCreateSurveyOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Survey
        </Button>
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
              <CardDescription>{survey.researchPaper}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Badge className={`${statusColors[survey.status]} text-white`}>{survey.status}</Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">Created: {survey.createdDate}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>{survey.questions} questions</span>
                <span>{survey.responses} responses</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setSelectedSurvey(survey)}>
                View Details
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Survey</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleStatusChange(survey.id, "Active")}>
                    <Play className="mr-2 h-4 w-4" />
                    <span>Activate</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleStatusChange(survey.id, "Archived")}>
                    <Archive className="mr-2 h-4 w-4" />
                    <span>Archive</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedSurvey} onOpenChange={() => setSelectedSurvey(null)}>
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
                <Badge className={`${statusColors[selectedSurvey?.status]} text-white mt-1`}>{selectedSurvey?.status}</Badge>
              </div>
              <div>
                <Label>Created Date</Label>
                <p className="mt-1">{selectedSurvey?.createdDate}</p>
              </div>
              <div>
                <Label>Questions</Label>
                <p className="mt-1">{selectedSurvey?.questions}</p>
              </div>
              <div>
                <Label>Responses</Label>
                <p className="mt-1">{selectedSurvey?.responses}</p>
              </div>
            </div>
            <div>
              <Label>Research Paper</Label>
              <p className="mt-1">{selectedSurvey?.researchPaper}</p>
            </div>
            <div>
              <Label>Survey Questions</Label>
              <ul className="mt-2 space-y-2 list-disc list-inside">
                <li>How satisfied were you with the telemedicine service?</li>
                <li>Did you experience any technical difficulties during the consultation?</li>
                <li>How would you rate the quality of care received via telemedicine?</li>
                {/* Add more example questions */}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSurvey(null)}>Close</Button>
            <Button>Edit Survey</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateSurveyOpen} onOpenChange={setIsCreateSurveyOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Create New Survey</DialogTitle>
            <DialogDescription>
              Enter the details of the new survey to create it in the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            // Implement create survey logic here
            setIsCreateSurveyOpen(false)
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="researchPaper" className="text-right">
                  Research Paper
                </Label>
                <Input id="researchPaper" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea id="description" className="col-span-3" />
              </div>
              <div>
                <Label>Questions</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Enter a question" />
                    <Button size="sm" variant="outline">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* You can add more question inputs dynamically */}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Survey</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}