"use client"

import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUp, Search, Edit, Trash2, Plus, Menu } from 'lucide-react'

export default function GuidelinesAndPolicies() {
  const [activeTab, setActiveTab] = useState("guidelines")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sample data for guidelines and policies
  const documents = [
    { id: 1, title: "Research Ethics Guidelines", category: "Ethics", date: "2023-05-15" },
    { id: 2, title: "Data Protection Policy", category: "Policy", date: "2023-06-01" },
    { id: 3, title: "Informed Consent Procedure", category: "Guideline", date: "2023-04-22" },
    { id: 4, title: "Conflict of Interest Policy", category: "Policy", date: "2023-05-30" },
    { id: 5, title: "Biosafety Guidelines", category: "Guideline", date: "2023-03-10" },
  ]

  return (
    <div className="flex h-screen bg-background w-full text-foreground">

      <div className="flex w-full flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-secondary">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none lg:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-primary ml-4">Guidelines and Policies</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search documents..." className="pl-8 w-64" />
            </div>
            <Button>
              <FileUp className="mr-2 h-4 w-4" />
              Upload New Document
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="guidelines">Guidelines & Policies</TabsTrigger>
                <TabsTrigger value="ethical">Ethical Considerations</TabsTrigger>
                <TabsTrigger value="support">Support Content</TabsTrigger>
              </TabsList>

              <TabsContent value="guidelines" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Management</CardTitle>
                    <CardDescription>View, edit, and manage KUHES guidelines and policies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] w-full rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {documents.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.title}</TableCell>
                              <TableCell>{doc.category}</TableCell>
                              <TableCell>{doc.date}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ethical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ethical Considerations</CardTitle>
                    <CardDescription>Create and manage ethical guidelines for research</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="Enter the title of the ethical consideration" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Describe the ethical consideration in detail" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="informed-consent">Informed Consent</SelectItem>
                            <SelectItem value="data-privacy">Data Privacy</SelectItem>
                            <SelectItem value="vulnerable-populations">Vulnerable Populations</SelectItem>
                            <SelectItem value="conflict-of-interest">Conflict of Interest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Ethical Consideration
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Support Content Creation</CardTitle>
                    <CardDescription>Create helpful resources and FAQs for researchers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="support-title">Title</Label>
                        <Input id="support-title" placeholder="Enter the title of the support content" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support-content">Content</Label>
                        <Textarea id="support-content" placeholder="Write the support content or FAQ answer" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support-category">Category</Label>
                        <Select>
                          <SelectTrigger id="support-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="faq">Frequently Asked Questions</SelectItem>
                            <SelectItem value="guide">How-to Guide</SelectItem>
                            <SelectItem value="policy-explanation">Policy Explanation</SelectItem>
                            <SelectItem value="best-practices">Best Practices</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Support Content
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}