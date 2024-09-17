
"use client"
import { KeyboardEvent, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Research } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, AlertCircle } from 'lucide-react'

export default function PublicationSearch({researchList}:{researchList:Research[]}) {
  
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/support/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const articlesPerPage = 3

  const keywordsParse = (keywords:string):string[] =>{
    return keywords.split(',').map(word => word.trim())
  }

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = researchList.slice(indexOfFirstArticle, indexOfLastArticle)

  const totalPages = Math.ceil(researchList.length / articlesPerPage)

  return (
    <div className="">
      <div className='h-[50vh] bg-blue-500 flex items-center justify-center text-white' >
      <div className='container text-center max-w-3xl space-y-5 mx-auto'>
            <h1 className="text-3xl font-bold mb-8">Publications Search</h1>
            <p>Your Gateway to a World of Scientific Knowledge, Discoveries, and Innovations. This is where everyone can access science</p>
            <div className="flex mb-6">
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow text-black rounded-none"
        />
        <Button className="ml-2 rounded-none" onClick={handleSearch}>
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
        </div>
        
      </div>
        

        <div className='max-w-4xl mx-auto'>
        
      <div className="space-y-6 max-w-2xl mx-auto">
        {currentArticles.length===0 &&
      <Card className="w-full max-w-2xl mx-auto bg-white ">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">No Publications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              There are currently no Publications. Our team is working on publishing research papers for the future.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                <p className="text-sm text-yellow-700">
                  Stay tuned for updates on our upcoming publications. We will be adding new publications soon!
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                In the meantime, you can:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {/* <li>Check out our past event recordings</li> */}
                <li>Subscribe to our newsletter for blog notifications</li>
                <li>Follow us on social media for the latest updates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>}
        {currentArticles.map((article) => (
          <Card className='border-b' key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {article.creatorName} | {article.journal} | Published: {article.createdAt.toDateString()}
              </p>
              {article.doi && <p className="text-sm mb-4">DOI: {article.doi}</p>}
              <div className="flex flex-wrap gap-2 mb-4">
                {keywordsParse(article.keyWords).map((keyword, index) => (
                  <Badge key={index} variant="secondary">{keyword}</Badge>
                ))}
              </div>
              <p className="text-sm">{article.abstract}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/publications/${article.slug}`}>
                <Button variant="outline">Read Full Article</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {researchList.length > articlesPerPage && (
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

        </div>
      
      
    </div>
  )
}