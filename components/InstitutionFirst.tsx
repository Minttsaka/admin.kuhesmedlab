"use client"

import React, { useState } from 'react'
import { Search, Plus, MoreHorizontal, Edit, Building, MapPin, FileText, Globe, HelpCircle } from 'lucide-react'

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
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios'
import useSWR from 'swr'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { z } from 'zod'
import { Prisma, Research } from '@prisma/client'
import { ScrollArea } from './ui/scroll-area'
import Link from 'next/link'

type Institution = Prisma.InstitutionGetPayload<{
  include:{
    research:true
  }
}>

const typeColors = {
  "University": "bg-blue-500",
  "Research Institute": "bg-green-500",
  "Non-Profit Organization": "bg-purple-500",
  "Hospital": "bg-red-500",
}

const formSchema = z.object({
  name: z.string().min(2, "First name must be at least 2 characters"),
  location: z.string().min(2, "Last name must be at least 2 characters"),
  type: z.enum(["University", "Non-Profit Organization", "Research Institute", "Hospital"]),
  website: z.string(),
  logo: z.string().min(2, "Last name must be at least 2 characters"),
})

const fetcher = async (url:string) => {
  const res = await axios.get(url);

  return res.data;
};

export default function InstitutionFirst() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null)
  const [isAddInstitutionOpen, setIsAddInstitutionOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      type: "University",
      website: "",
      logo:""

    },
  })

  const { data, mutate, isLoading, error } = useSWR<Institution[]>(
    `/api/institutions`,
    fetcher
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await axios.post('/api/institutions',{
        values
      })
      mutate()
    } catch (error) {
      
      
    } finally{
      setIsSubmitting(false)
      setIsAddInstitutionOpen(false)
    }
    
  }

  const institutions = Array.isArray(data) ? data : [];

  const filteredInstitutions = institutions?.filter(institution => 
    (institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     institution.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (typeFilter === "All" || institution.type === typeFilter)
  )

  return (
    <div className=" p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Institution Management</h1>
        <Button onClick={() => setIsAddInstitutionOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Institution
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search institutions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={setTypeFilter} defaultValue="All">
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            {data?.map(institution=>(<SelectItem key={institution.id} value="University">{institution.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstitutions.map((institution) => (
          <Card key={institution.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={institution.logo ?? '/avatar.png'} alt={institution.name} />
                  <AvatarFallback>{institution.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{institution.name}</CardTitle>
                  <CardDescription>{institution.location}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Badge className={`${typeColors[institution.type as keyof typeof typeColors]} text-white`}>{institution.type}</Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">{institution.research.length} papers</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Globe className="mr-2 h-4 w-4" />
                <a href={`https://${institution.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {institution.website}
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setSelectedInstitution(institution)}>
                View Papers
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span className='text-xs text-[red]'>Please contact Ict support if you want to delete.</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedInstitution} onOpenChange={() => setSelectedInstitution(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Research Papers : ({selectedInstitution?.name})</DialogTitle>
            <DialogDescription>
              A list of recent research papers with their abstracts and publication dates.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {selectedInstitution?.research?.map((paper) => (
              <div key={paper.id} className="mb-6 last:mb-0">
                <Link href={`https://kuhesmedlab.vercel.app/publications/${paper.slug}`} className="text-lg font-semibold">{paper.title}</Link>
                <p className="text-sm text-muted-foreground mt-1">Published on: {paper.createdAt.toDateString()}</p>
                <Link href={`/a/research-papers/${paper.id}`} className="mt-2 text-sm hover:underline">{paper.abstract}</Link>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddInstitutionOpen} onOpenChange={setIsAddInstitutionOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Add New Institution</DialogTitle>
            <DialogDescription>
              Enter the details of the new institution to add it to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
              <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                    <Input placeholder="Name of institution" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>location</FormLabel>
                    <FormControl>
                    <Input placeholder="location of the institution" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select type of the institution" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="Research Institute">Research Institute</SelectItem>
                      <SelectItem value="Non-Profit Organization">Non-Profit Organization</SelectItem>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                    <Input placeholder="http or https" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                    <Input placeholder="Enter the url logo(optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Institution"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}