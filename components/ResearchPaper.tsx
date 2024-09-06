"use client"

import React, { useState } from 'react'
import { Search, Filter, ChevronDown, Edit, Check, X, Eye, Download, MoreHorizontal, ArrowUpDown } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Prisma, Research } from '@prisma/client'
import Link from 'next/link'


const statusColors = {
  DEVELOPMENT: "bg-green-500",
  APPROVED: "bg-yellow-500",
  PENDING: "bg-blue-500",
  DISAPPROVED: "bg-red-500",
}

export default function ResearchPaper({research}:{research:Research[]}) {
  const [selectedPaper, setSelectedPaper] = useState<Research | null>()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [fieldFilter, setFieldFilter] = useState("All")

  const filteredPapers =research?.filter(paper => 
    (paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     paper.authors.split(",").map(author => author.trim())
     .some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (statusFilter === "All" || paper.status === statusFilter) &&
    (fieldFilter === "All" || paper.affiliation === fieldFilter)
  )

  const handleStatusChange = (paperId:string | undefined, newStatus:string | undefined) => {
    // Implement status change logic here
    console.log(`Changed status of paper ${paperId} to ${newStatus}`)
  }

  return (
    <div className=" p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Research Papers Management</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search papers or authors..."
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
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Development">Development</SelectItem>
            <SelectItem value="Disapproved">Disapproved</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setFieldFilter} defaultValue="All">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Fields</SelectItem>
            <SelectItem value="Oncology">Oncology</SelectItem>
            <SelectItem value="Genetics">Genetics</SelectItem>
            <SelectItem value="Public Health">Public Health</SelectItem>
            <SelectItem value="Pharmacology">Pharmacology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Authors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Field</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {research?.map((paper) => (
                  <tr key={paper.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{paper.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{paper.createdAt.toDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2 overflow-hidden">
                        {paper.authors.split(",").map(author => author.trim()).map((author, index) => (
                          <Avatar key={index} className="inline-block border-2 border-white dark:border-gray-800">
                            <AvatarFallback>{author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${statusColors[paper.status]} text-white`}>{paper.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{paper.field}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setSelectedPaper(paper)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <Link href={`/a/research-papers/${paper.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {
                            selectedPaper?.status==="PENDING" && 
                            <>
                              <DropdownMenuItem onSelect={() => handleStatusChange(paper.id, "Approved")}>
                              <Check className="mr-2 h-4 w-4" />
                              <span>Approve</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(paper.id, "Disapproved")}>
                              <X className="mr-2 h-4 w-4" />
                              <span>Disapprove</span>
                            </DropdownMenuItem>
                          </>
                          }

{
                            selectedPaper?.status==="APPROVED" && 
                            <>
                            <DropdownMenuItem onSelect={() => handleStatusChange(paper.id, "Disapproved")}>
                              <X className="mr-2 h-4 w-4" />
                              <span>Disapprove</span>
                            </DropdownMenuItem>
                          </>
                          }

{
                            selectedPaper?.status==="DISAPPROVED" && 
                            <>
                              <DropdownMenuItem onSelect={() => handleStatusChange(paper.id, "Approved")}>
                              <Check className="mr-2 h-4 w-4" />
                              <span>Approve</span>
                            </DropdownMenuItem>
                          </>
                          }
                          
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers?.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{paper.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <Badge className={`${statusColors[paper.status]} text-white`}>{paper.status}</Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{paper.affiliation}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex -space-x-2 overflow-hidden mr-2">
                      {paper.authors.split(",").map(author => author.trim()).map((author, index) => (
                        <Avatar key={index} className="inline-block border-2 border-white dark:border-gray-800">
                          <AvatarFallback>{author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{paper.authors.split(",").map(author => author.trim()).join(', ')}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{paper.abstract}</p>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" onClick={() => setSelectedPaper(paper)}>
                      View Details
                    </Button>
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleStatusChange(paper.id, "Approved")}>
                          <Check className="mr-2 h-4 w-4" />
                          <span>Approve</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange(paper.id, "Disapproved")}>
                          <X className="mr-2 h-4 w-4" />
                          <span>Disapprove</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>{selectedPaper?.title}</DialogTitle>
            <DialogDescription>
              Submitted on {selectedPaper?.createdAt.toDateString()} | Field: {selectedPaper?.affiliation}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Status:</span>
              <Badge className={`${statusColors[selectedPaper?.status as keyof typeof statusColors]} text-white col-span-3`}>{selectedPaper?.status}</Badge>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Authors:</span>
              <span className="col-span-3">{selectedPaper?.authors.split(",").map(author => author.trim()).join(', ')}</span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="font-medium">Abstract:</span>
              <p className="col-span-3 text-sm">{selectedPaper?.abstract}</p>
            </div>
          </div>
          <div className="flex justify-between">
          {
                            selectedPaper?.status==="PENDING" && 
                            <>
                              <DropdownMenuItem onSelect={() => handleStatusChange(selectedPaper.id, "Approved")}>
                              <Check className="mr-2 h-4 w-4" />
                              <span>Approve</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(selectedPaper.id, "Disapproved")}>
                              <X className="mr-2 h-4 w-4" />
                              <span>Disapprove</span>
                            </DropdownMenuItem>
                          </>
                          }

{
                            selectedPaper?.status==="APPROVED" && 
                            <div>
                            <Button variant="destructive" onClick={() => handleStatusChange(selectedPaper?.id, "Disapproved")}>Disapprove</Button>
                          </div>
                          }

{
                            selectedPaper?.status==="DISAPPROVED" && 
                     
                              <Button className="mr-2" onClick={() => handleStatusChange(selectedPaper?.id, "Approved")}>Approve</Button>
                     
                          }
            <Button variant="outline" onClick={() => setSelectedPaper(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}