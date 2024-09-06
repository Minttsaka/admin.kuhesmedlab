"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileIcon, ImageIcon, VideoIcon, DownloadIcon, UploadIcon, SearchIcon, Presentation, FileTextIcon } from 'lucide-react'
import axios from 'axios'
import useSWR from 'swr'
import { File } from "@prisma/client"

type FileType = 'image' | 'video' | 'pdf' | 'pptx'

interface FileInfo {
  type: FileType
  file: File | null
}

const fetcher = async (url:string) => {
  const res = await axios.get(url);

  return res.data;
};

export default function ResearchFiles({files}:{files:File[]}) {

  return (
    <div className="bg-gradient-to-r from-background to-secondary py-12 px-4 sm:px-6 lg:px-8" id='files'>
      <div className="max-w-7xl mx-auto">
        <div className="lg:flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Research Files and Media</h2>
            <p className="text-xl text-purple-200">Organize and access your research materials with ease</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files?.map((file) => (
             <Card key={file.id} className="bg-white  w-full shadow-lg bg-opacity-10 backdrop-filter backdrop-blur-lg border-purple-400 hover:bg-opacity-20 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
             <CardContent className="p-6">
             {file.fileType === 'image' &&  
              <div className=" space-y-2 rounded-lg overflow-hidden ">
               <div className='flex justify-between items-center'>
                 <ImageIcon className="h-10 w-10 text-green-400 mr-3" />
                   <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white hover:bg-purple-600" asChild>
                     <a href={file.url} download>
                       <DownloadIcon className="h-5 w-5" />
                       <span className="sr-only">Download</span>
                     </a>
                 </Button>
               </div>
               <img src={file.url} alt={file.filename} className="w-full h-48 object-cover" />
               <div>
                 <h3 className="font-bold text-lg mb-1">{file.filename}</h3>
                 <p className="text-sm text-purple-300">{file.fileType}</p>
               </div>
               </div>
               }
             {file.fileType === 'pdf' &&
             <div className=" space-y-2 rounded-lg overflow-hidden ">
             <div className='flex justify-between items-center'>
                 <FileIcon className="h-10 w-10 text-yellow-400 mr-3" />
                 <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white hover:bg-purple-600" asChild>
                   <a href={file.url} download>
                     <DownloadIcon className="h-5 w-5" />
                     <span className="sr-only">Download</span>
                   </a>
               </Button>
             </div>
             <iframe src={`https://drive.google.com/viewerng/viewer?url=${file.url}?pid=explorer&efh=false&a=v&chrome=false&embedded=true`} className='w-full' height="300px"  />
               <div>
                 <h3 className="font-bold text-lg mb-1">{file.filename}</h3>
                 <p className="text-sm text-purple-300">{file.fileType}</p>
               </div>
             </div> 
             }
             {file.fileType === 'video' && 
             <div className=" space-y-2 rounded-lg overflow-hidden ">
             <div className='flex justify-between items-center'>
               <VideoIcon className="h-10 w-10 text-red-400 mr-3" />
                 <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white hover:bg-purple-600" asChild>
                   <a href={file.url} download>
                     <DownloadIcon className="h-5 w-5" />
                     <span className="sr-only">Download</span>
                   </a>
               </Button>
             </div>
             <video src={file.url} className="w-full h-48 object-cover" controls>
                 Your browser does not support the video tag.
               </video>
               <div>
                 <h3 className="font-bold text-lg mb-1">{file.filename}</h3>
                 <p className="text-sm text-purple-300">{file.fileType}</p>
               </div>
             </div> 
             }
             </CardContent>
           </Card>
          ))}
        </div>

        {files?.length ==0 && (
          <div className="text-center py-12">
            <div className="inline-block p-6 rounded-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg mb-4">
              <SearchIcon className="h-12 w-12 text-purple-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No files found</h3>
            <p className="text-purple-300">Try adjusting your search or upload a new file.</p>
          </div>
        )}
      </div>
    </div>
  )
  
}

const LoadingSpinner: React.FC = () => {
  return (
    <svg
      className="animate-spin h-6 w-6 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
  );
};
