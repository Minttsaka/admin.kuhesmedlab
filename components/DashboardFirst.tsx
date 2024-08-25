"use client"

import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Bell, Calendar, ChevronDown, FileText, Users, BookOpen, ClipboardList, Search, Home, TrendingUp, DollarSign, Settings, HelpCircle, LogOut } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Research, Review, User } from '@prisma/client'

interface ResearchSchema {
  recentResearch: Array<Research & { user: User }>;
}

interface HighReviewSchema {
  highReview: Array<Research & { 
    review: Array<Review>;
  }>;
}


const paperData = [
  { name: 'Jan', papers: 4 },
  { name: 'Feb', papers: 3 },
  { name: 'Mar', papers: 2 },
  { name: 'Apr', papers: 5 },
  { name: 'May', papers: 7 },
  { name: 'Jun', papers: 6 },
]

const trendingData = [
  { name: 'W1', value: 40 },
  { name: 'W2', value: 30 },
  { name: 'W3', value: 45 },
  { name: 'W4', value: 50 },
  { name: 'W5', value: 60 },
  { name: 'W6', value: 65 },
]

const recentPapers = [
  { title: "AI in Medical Diagnosis", author: "Dr. John Smith", avatar: "/placeholder.svg?height=32&width=32" },
  { title: "Nanotechnology in Drug Delivery", author: "Dr. Emily Johnson", avatar: "/placeholder.svg?height=32&width=32" },
  { title: "Gene Therapy Advancements", author: "Dr. Michael Brown", avatar: "/placeholder.svg?height=32&width=32" },
  { title: "Telemedicine Impact on Rural Healthcare", author: "Dr. Sarah Lee", avatar: "/placeholder.svg?height=32&width=32" },
]

const upcomingEvents = [
  { date: "July 15", event: "Research Symposium" },
  { date: "July 22", event: "Grant Proposal Deadline" },
  { date: "August 5", event: "Peer Review Workshop" },
]

const fundingOpportunities = [
  { name: "NIH Research Grant", deadline: "August 31, 2023", amount: "$500,000" },
  { name: "Cancer Research Fund", deadline: "September 15, 2023", amount: "$250,000" },
  { name: "Medical Technology Innovation Grant", deadline: "October 1, 2023", amount: "$750,000" },
]

export default function DashboardFirst({
  published, 
  pending, 
  activeSurvey, 
  collaborations,
  recentResearch,
  highReview
}:{
    published:number, 
    pending:number, 
    activeSurvey:number, 
    collaborations:number,
    recentResearch: ResearchSchema['recentResearch'],
    highReview: HighReviewSchema['highReview']
  }) {
  return (
      <main className=" ">
        {/* Dashboard Content */}
        <div className="p-6">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Dashboard Overview</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Published Papers</CardTitle>
                <FileText className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{published}</div>
                <p className="text-xs opacity-75">+20% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Publications</CardTitle>
                <ClipboardList className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pending}</div>
                <p className="text-xs opacity-75">5 awaiting review</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Surveys</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSurvey}</div>
                <p className="text-xs opacity-75">3 closing this week</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Collaborators</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collaborations}</div>
                <p className="text-xs opacity-75">+12 this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Research Papers Published</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={paperData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="papers" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Submissions and Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Paper Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                  {recentResearch.map((paper, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={paper.user.image!} alt={paper.user.name} />
                        <AvatarFallback>{paper.user.name}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{paper.title}</p>
                        <p className="text-xs text-gray-500">{paper.user.name}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <li key={index} className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-gray-500">{event.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Funding Opportunities */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Research With High Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Title</th>
                      <th className="pb-2">NO. of Review</th>
                      <th className="pb-2">CreatedAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highReview.map((research, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-2">{research.title}</td>
                        <td className="py-2">{research.review.length}</td>
                        <td className="py-2">{research.createdAt.toDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Submit New Paper</Button>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">Create Survey</Button>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Manage Collaborators</Button>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">Apply for Funding</Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-md mt-8 py-4">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © 2023 KUHESMedLab. All rights reserved.
              </div>
              <div className="flex mt-4 md:mt-0">
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 mr-4">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 mr-4">Terms of Service</a>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500">Contact Us</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
  )
}