"use client"

import { useEffect, useState } from "react";
import "react-quill/dist/quill.bubble.css";
import { useRouter, useSearchParams } from "next/navigation";
import ReactQuill from "react-quill";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Cross, ImageIcon, Loader2, PlusCircle, Save, Send, Upload, VideoIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { uploadToS3 } from '@/lib/s3';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
//import { MultiFiles } from '@/lib/s3MultiFiles';
import { formats, modules } from "@/lib/quillModules";
import { useToast } from "./ui/use-toast";
import { editContent, saveContent } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Check, Trash2 } from "lucide-react"
import useSWR from "swr";
import axios from "axios";
import { Category, Content } from "@prisma/client";
import BlogPreviewModal from "./ContentPreview";


const contentTypes = ['BLOG', 'ANNOUNCEMENT', 'DISCOVERY', 'EVENT', 'SUPPORT'] as const
type ContentType = typeof contentTypes[number]

type DataSchema={
  fileKey: string;
  fileName: string;
}

// 'uploads/1719569651846women.jpg'
const fetcher = async (url:string) => {
  const res = await axios.get(url);

  return res.data;
};


export default function CreateArticle({post}:{post:Content}) {

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [contentImage, setContentImage] = useState<string | undefined>(post.image! ?? undefined);

  const [videoFileKey, setVideoFileKey] = useState<DataSchema>();
  const [value, setValue] = useState(post.body ?? "");
  const [uploading, setUploading] = useState(false);
  const [isToggle, setIsToggle] = useState(false);
  const [featuredImgs, setFeaturedImgs] = useState<string[]>(['uploads/1719595146812pngwing.com.png']);
  const [featuredVideo, setFeaturedVideo] = useState<string[]>([]);
  const [title, setTitle] = useState(post.title ?? "")
  const [selectedType, setSelectedType] = useState<ContentType>(post.type ?? 'BLOG')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState<Content>()
  const [isOpen, setIsOpen] = useState(false)

  const [selectedCategories, setSelectedCategories] = useState<string>(post.category ?? null)
  const [newCategory, setNewCategory] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const { data, mutate, isLoading, error } = useSWR(
    `/api/category`,
    fetcher
  );

  const categories = Array.isArray(data as Category[]) ? data as Category[] : [];
  

  const toggleCategory = (category: Category) => {
    setSelectedCategories(category.name)
  }

  const addCategory = async () => {

    try {

      setIsAdding(true)
        axios.post('/api/category',{
          name:newCategory
        })
        mutate()
      
        setIsAdding(false)
      
    } catch (error) {
      
    }
    
  }

  const deleteCategory =async (id: string) => {

    try {
      axios.get(`/api/category/${id}`)
      mutate()
    } catch (error) {
      
    }
    
  }

  const { toast } = useToast()

  const searchParams = useSearchParams()

  //const slug = searchParams.get('kml')

    const uploadSingleMedia = async (file:{format:string,file:File})=>{

    try {

      setUploading(true);
      const data = await uploadToS3(file.file);

      // if(file.format==="image"){
      //   setImageFileKey(data)
      // } else {
      //   setVideoFileKey(data)
      // }
      
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  }

  const handleimageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    try {
      if (file) {
        setUploading(true);
        const data = await uploadToS3(file)
          setContentImage(data?.fileKey);
      }
      
    } catch (error) {
      
    }finally{
      setUploading(false);
    }
    
  };



  const uploadMultiMedia = async (file:{format:string,file:any})=>{
    try {
      setUploading(true);
      const data = "success"
      if(file.format==="image"){
        setFeaturedImgs(prevState => [...prevState, data]);
      } else {
        setFeaturedVideo(prevState => [...prevState, data]);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }

  }

  const slugify = (str:string) =>str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  
  const handleSubmit = async () => {

    const data ={
      title,
      image:contentImage!,
      category:selectedCategories,
      body:value,
      type:selectedType
    }
    try {

    if (data.title.trim().length === 0 || !data.title) { 
      toast({
        title:"Missing options",
        description:'Title is required'
      })

      return
      
    } 
    if (!data.category || data.category==="") {
      toast({
        title:"Missing options",
        description:'You did not select the category'
      })

      return
      
    } 
    if (data.body.trim().length === 0 || data.body===""){
      toast({
        title:"Missing options",
        description:'Body is required'
      })

      return
      
    }
    if (!data.type) {
      toast({
        title:"Error",
        description:'You must select a content type'
      })
      
    }  
      setIsSubmitting(true)
      const savedData = await editContent(post.slug,data!)

      if(typeof(savedData?.id ) ==="string"){

      toast({
        title:"Action completed",
        description:"Saved the draft"
      })
    } else {

      toast({
        title:"Error",
        description:"Something went wrong!"
      })

    }

      setPreview(savedData)
      setIsOpen(true)
      
    } catch (error) {

      console.log(error)
      
    } finally{
      setIsSubmitting(false)
    }
 
  }

  return (
    <div>
      {isOpen && <BlogPreviewModal isOpen={isOpen!} post={preview!} onClose={setIsOpen}  />}
      <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-purple-800">
        Select category
      </h2>
      <div className="flex flex-wrap gap-3 justify-center">
        <AnimatePresence>
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
              className="relative group"
            >
              <Button
                variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                onClick={() => toggleCategory(category)}
                className={`rounded-full px-4 py-2 ${
                  selectedCategories.includes(category.name)
                    ? "bg-purple-600 text-white"
                    : "bg-white text-purple-600"
                }`}
              >
                {category.name}
                {selectedCategories.includes(category.name) && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </Button>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteCategory(category.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-center">
        {!isAdding ? (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="rounded-full bg-white text-purple-600 hover:bg-purple-100"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        ) : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="rounded-l-full"
            />
            <Button onClick={addCategory} className="rounded-r-full bg-purple-600">
              Add
            </Button>
            <Button
              onClick={() => setIsAdding(false)}
              variant="outline"
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
      <div className="text-center text-sm text-purple-700">
        Selected: {selectedCategories ?? post.category}
      </div>
    </div>
    <div className='bg-white m-6 p-6 rounded-3xl'>
      <div className='flex gap-1 bg-gray-100 p-6 rounded-3xl'>
        <div className='relative  w-full h-[80vh] bg-white rounded-3xl shadow'>       
          <div className='top-24 py-5'>
              {!open && (
                <div className="m-2 flex items-center justify-between ">
                  <Input
                    type="file"
                    id="image"
                    onChange={handleimageChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  <Input
                    type="file"
                    id="video"
                    onChange={(e) => uploadSingleMedia({
                      format:"image",
                      file:e.target.files?.[0]!

                    })}
                    style={{ display: "none" }}
                    accept="video/*"
                  />
                  <div className='grid grid-cols-3 bg-white p-1 gap-5'>
                    <label  htmlFor="image">
                    <Camera className='text-blue-500 h-4 w-4 cursor-pointer  '  />
                    </label>
                    <label  htmlFor="video">
                      <VideoIcon className='text-blue-500 h-4 w-4 cursor-pointer ' />
                    </label>
                    <div className='relative'>

                      <Upload className='text-blue-500 h-4 w-4 cursor-pointer  ' onClick={()=>setIsToggle((prev)=>!prev)} />

                        <Input
                          type="file"
                          id="multi-img"
                          onChange={(e) => uploadMultiMedia({
                          format:"image",
                          file:e.target.files!

                        })}
                          style={{ display: "none" }}
                          multiple
                          accept="image/*"
                        />
                        <Input
                          type="file"
                          id="multi-video"
                          onChange={(e) => uploadMultiMedia({
                          format:"video",
                          file:e.target.files!

                        })}
                          style={{ display: "none" }}
                          multiple
                          accept="video/*"
                        />
                      {
                        isToggle && 
                        <div className=' bg-white shadow px-5 py-1 absolute left-7 bottom-1/2'>
                          <p className='text-xs mb-2 text-gray-700 border-b pb-2 text-nowrap'>Featured media</p>
                          <div className='flex items-center gap-5'>
                            <label htmlFor="multi-img">
                            <ImageIcon className='text-blue-500 h-4 w-4 cursor-pointer  rounded-full' />
                            </label>
                            <label htmlFor="multi-video">
                              <VideoIcon className='text-blue-500 h-4 w-4 cursor-pointer  rounded-full' />
                            </label>
                          </div>
                          
                        </div>
                      }
                    </div>
                  </div>
                  <Textarea
                    placeholder="Title"
                    defaultValue={post.title}
                    className='shadow text-3xl w-full h-3 focus-visible:ring-0 border-none bg-gray-100 mx-2'
                    onChange={(e) => setTitle(e.target.value)}
                  ></Textarea>
                </div>
              )}
          </div>

          <ReactQuill
            className="h-[60vh] z-50 bg-gray-100  mx-2 placeholder:text-2xl outline-none"
            theme="bubble"
            modules={modules}
            formats={formats}
            value={value}
            onChange={setValue}
            placeholder="Tell your story..."
          />
          <div className="flex space-x-4 mt-10 mx-5">
              <Button variant="outline" 
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1" 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                >
                <Save className="h-5 w-5 mr-2" />
                Edit post
              </Button>
            </div>
        </div>
        <div className='w-[20vw]'>
        <div className="p-2 m-2 shadow rounded-2xl bg-white">    
            <div className="grid grid-cols-1 gap-4">
              {contentTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={selectedType === type}
                    onCheckedChange={() => setSelectedType(type)}
                  />
                  <Label htmlFor={type} className="font-bold text-xs text-gray-700 bg-gray-100 p-2 rounded-2xl">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          <h3 className="font-semibold">Options</h3>
          <p className='text-xs text-gray-700'>
            The options above will determine the section where your posts are allocated,
             which means you need to be sure of the type you are selecting.
          </p>
          
          </div>
          <div>
          {contentImage && <img src={contentImage} className='object-center h-20 w-20 rounded-lg object-cover'/>}
          {uploading && <Loader2 className="animate-spin" />}
          </div>
          
        </div>
        
      </div>
    </div>
    </div>
  )
}
