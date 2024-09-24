"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Content, ContentType } from "@prisma/client"
import Link from "next/link"
import { deleteContent, saveContent } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { toast } from "./ui/use-toast"

//type ContentType = "BLOG" | "ANNOUNCEMENT" | "DISCOVERY" | "EVENT"
type Category = "Technology" | "Science" | "Arts" | "Lifestyle" | "Business"


const typeColors: Record<ContentType, string> = {
  BLOG: "bg-pink-200 text-pink-800",
  ANNOUNCEMENT: "bg-purple-200 text-purple-800",
  DISCOVERY: "bg-blue-200 text-blue-800",
  EVENT:"bg-blue-200 text-green-800",
  SUPPORT:"bg-blue-200 text-yellow-800"
}

export default function ContentList({content}:{content:Content[]}) {

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const router = useRouter()

  const handleDelete = async(id: string) => {
    try {
      await deleteContent(id)
      toast({
        title:"Deleted",
        description:'The post has been successfully deleted.'
        })
        router.refresh()
    } catch (error) {
      
    }
  }

  const handleSave = async(item: {title:string,type: string}) => {
    try {
        const savedData = await saveContent(item!)
        toast({
          title:"Created",
          description:'The post has been successfully created.'
          })
        router.push(`/a/content/edit/${savedData?.slug}`)
    } catch (error) {
        
    } finally{
    setIsDialogOpen(false)
    }
  }

  return (
    <div className="p-8  min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-600 flex items-center justify-center">
        <Sparkles className="mr-2 h-8 w-8" />
        Content Management
      </h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" /> Create New Content
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-600 mb-4">
               Create New Content
            </DialogTitle>
          </DialogHeader>
          <ContentForm onSave={handleSave} />
        </DialogContent>
      </Dialog>
      <div className="bg-white rounded-lg shadow-xl p-6 mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-purple-600">Title</TableHead>
              <TableHead className="text-purple-600">Type</TableHead>
              <TableHead className="text-purple-600">Category</TableHead>
              <TableHead className="text-purple-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.map((item) => (
              <TableRow key={item.id} className="hover:bg-pink-50 transition-colors duration-200">
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeColors[item.type as keyof typeof typeColors]}`}>
                    {item.type}
                  </span>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                <Link href={`/a/content/edit/${item.slug}`}>
                    <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
                        <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface ContentFormProps {
  onSave: (item:{title:string,type: string}) => void
}

function ContentForm({  onSave }: ContentFormProps) {
  const [title, setTitle] = useState( "")
  const [creating, setCreating] = useState(false)
  const [type, setType] = useState<ContentType>( "BLOG")

  const handleSubmit = (e: React.FormEvent) => {
    setCreating(true)
    e.preventDefault()
    onSave({  title, type })
    setCreating(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <Select value={type} onValueChange={(value: ContentType) => setType(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BLOG">Blog</SelectItem>
            <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
            <SelectItem value="SUPPORT">Support</SelectItem>
            <SelectItem value="DISCOVERY">Discovery</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        disabled={creating}
        className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
      >
        {creating ? "Creating...":"Save"}
      </Button>
    </form>
  )
}