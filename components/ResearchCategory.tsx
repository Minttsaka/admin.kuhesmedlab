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
import { z } from 'zod'
import { Prisma, Research } from '@prisma/client'
import { ScrollArea } from './ui/scroll-area'
import Link from 'next/link'

type Category = Prisma.ResearchCategoryGetPayload<{
  include:{
    papers:true
  }
}>

const formSchema = z.object({
  category: z.string().min(2, "field must be at least 2 characters"),
  label: z.string().min(2, "field must be at least 2 characters").max(2, "field  label must be at not greater than 2 characters"),
  description: z.string().min(2, "Last name must be at least 2 characters"),

})

const fetcher = async (url:string) => {
  const res = await axios.get(url);

  return res.data;
};

export default function Category() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [selectedcategory, setSelectedcategory] = useState<Research[] | null>()
  const [isAddcategoryOpen, setIsAddcategoryOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      label: "",
      description: "",
    },
  })

  const { data, mutate, isLoading, error } = useSWR<Category[]>(
    `/api/research-category`,
    fetcher
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await axios.post('/api/research-category',{
        values
      })
      mutate()
    } catch (error) {
      
      
    } finally{
      setIsSubmitting(false)
      setIsAddcategoryOpen(false)
    }
    
  }

  const categories = Array.isArray(data) ? data : [];

  const filteredcategories = categories?.filter(category => 
    (category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     category.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (typeFilter === "All" || category.category === typeFilter)
  )

  return (
    <div className=" p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">category Management</h1>
        <Button onClick={() => setIsAddcategoryOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New category
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search categories..."
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
            {data?.map(category=>(<SelectItem key={category.id} value="University">{category.category}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredcategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                  <CardTitle>{category.category}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Badge className={`bg-[green] text-white`}>{category.label}</Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">{category.papers.length} papers</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setSelectedcategory(category.papers)}>
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

      <Dialog open={!!selectedcategory} onOpenChange={() => setSelectedcategory(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Research Papers</DialogTitle>
            <DialogDescription>
              A list of recent research papers with their abstracts and publication dates.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {selectedcategory?.map((paper) => (
              <div key={paper.id} className="mb-6 last:mb-0">
                <Link href={`https://kuhesmedlab.vercel.app/publications/${paper.slug}`} className="text-lg font-semibold">{paper.title}</Link>
                <p className="text-sm text-muted-foreground mt-1">Published on: {paper.createdAt.toDateString()}</p>
                <Link href={`/a/research-papers/${paper.id}`} className="mt-2 text-sm hover:underline">{paper.abstract}</Link>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddcategoryOpen} onOpenChange={setIsAddcategoryOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Add New category</DialogTitle>
            <DialogDescription>
              Enter the details of the new category to add it to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
              <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                    <Input placeholder="Name of category" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                    <FormControl>
                    <Input placeholder="label of your field with 2 characters. eg F1" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>description</FormLabel>
                    <FormControl>
                    <Input placeholder="description of the category" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}