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
import { Event, Prisma, Research, Review, User } from '@prisma/client'
import Link from 'next/link'

interface ResearchSchema {
  recentResearch: Array<Research & { user: User }>;
}

type HighCitationsSchema = Prisma.ResearchGetPayload<{
  include: {
    citationTrend: true,
  }
}>

const trendingData = [
  { name: 'W1', value: 40 },
  { name: 'W2', value: 30 },
  { name: 'W3', value: 45 },
  { name: 'W4', value: 50 },
  { name: 'W5', value: 60 },
  { name: 'W6', value: 65 },
]

const upcomingEvents = [
  { date: "July 15", event: "Research Symposium" },
  { date: "July 22", event: "Grant Proposal Deadline" },
  { date: "August 5", event: "Peer Review Workshop" },
]


export default function DashboardFirst({
  published, 
  pending, 
  events,
  activeSurvey, 
  user,
  recentResearch,
  highCitations,
  paperData
}:{
    published:number, 
    pending:Research[], 
    activeSurvey:number, 
    user:number,
    events:Event[]
    recentResearch: ResearchSchema['recentResearch'],
    highCitations: HighCitationsSchema[],
    paperData: {
      name: string;
      papers: number;
  }[]
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
                <p className="text-xs opacity-75">Now</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Publications</CardTitle>
                <ClipboardList className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pending.length}</div>
                <p className="text-xs opacity-75">Now</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Surveys</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSurvey}</div>
                <p className="text-xs opacity-75">Now</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user}</div>
                <p className="text-xs opacity-75">Now</p>
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
                    <Link href={`/a/research-papers/${paper.id}`} key={index} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={paper.user.image!} alt={paper.user.name} />
                        <AvatarFallback>{paper.user.name}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{paper.title}</p>
                        <p className="text-xs text-gray-500">{paper.user.name}</p>
                      </div>
                    </Link>
                  ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {events.map((event, index) => (
                    <li key={index} className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.createdAt.toDateString()}</p>
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
              <CardTitle>Research With Citations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Title</th>
                      <th className="pb-2">NO. of Citations</th>
                      <th className="pb-2">CreatedAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highCitations.map((research, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-2">
                            <Link href={`/a/research-papers/${research.id}`}>
                            {research.title}
                            </Link>
                          </td>
                        <td className="py-2">{research.citationTrend.length}</td>
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
             <Link href={`/a/research-papers/${pending.length > 0 ? pending[0].id : ""}`}>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Manage Research Papers</Button>
             </Link>
             <Link href={`https://kuhesmedlab.vercel.app/mw/research`}>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">Create Survey</Button>
             </Link>
             <Link href={`/a/events`}>
              <Button className="w-full bg-green-600 hover:bg-green-500">Schedule</Button>
             </Link>
             <Link href={`/a/content/create`}>
              <Button className="w-full bg-purple-600 hover:bg-purple-500">Create Blog</Button>
             </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-md mt-8 py-4">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © 2024 KUHESMedLab. All rights reserved.
              </div>
              
            </div>
          </div>
        </footer>
      </main>
  )
}