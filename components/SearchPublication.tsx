"use client"

import { useState, useCallback, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Research, Support } from '@prisma/client'
import Link from 'next/link'


// Simulated NLP functions
const tokenize = (text:string) => text.toLowerCase().split(/\W+/).filter((token:string) => token.length > 2)
const removeStopWords = (tokens:string[]) => {
  const stopWords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'or', 'but'])
  return tokens.filter(token => !stopWords.has(token))
}

const stemWord = (word:string) => {
  // Very basic stemming (for demonstration purposes)
  return word.replace(/ing$|s$|ed$/, '')
}

export default function SupportSearch({publicationList, searchQuery }:{searchQuery:string | string[] | undefined, publicationList:Research[]}) {

  console.log(searchQuery)
  const [searchResults, setSearchResults] = useState<{
    score: number;
    matchedTerms: unknown[];
    excerpts: string[];
    id: string;
    slug:string;
    title: string;
    abstract: string | null;
    createdAt: Date;
}[]>([])

  // Simulated semantic search function
  const semanticSearch = useCallback((query:string | string[] | undefined) => {
    const queryTokens = removeStopWords(tokenize(query as string)).map(stemWord)
    
    return publicationList.map(research => {
      const concepts = research.title.split(" ")
      const titleTokens = removeStopWords(tokenize(research.title)).map(stemWord)
      const descriptionTokens = removeStopWords(tokenize(research.abstract!)).map(stemWord)
      const conceptTokens = removeStopWords(tokenize(concepts.join(' '))).map(stemWord)
      
      let score = 0
      let matchedTerms = new Set()
      let excerpts:string[] = []

      // Check title
      queryTokens.forEach((queryToken:string) => {
        titleTokens.forEach((titleToken:string) => {
          if (titleToken.includes(queryToken) || queryToken.includes(titleToken)) {
            score += 3
            matchedTerms.add(titleToken)
          }
        })
      })

      // Check description
      queryTokens.forEach((queryToken:string) => {
        descriptionTokens.forEach((descToken:string, index:number) => {
          if (descToken.includes(queryToken) || queryToken.includes(descToken)) {
            score += 2
            matchedTerms.add(descToken)
            // Extract a brief excerpt around the matched term
            const start = Math.max(0, index - 3)
            const end = Math.min(descriptionTokens.length, index + 4)
            excerpts.push(descriptionTokens.slice(start, end).join(' '))
          }
        })
      })

      // Check concepts
      queryTokens.forEach((queryToken:string) => {
        conceptTokens.forEach((conceptToken:string) => {
          if (conceptToken.includes(queryToken) || queryToken.includes(conceptToken)) {
            score += 1
            matchedTerms.add(conceptToken)
          }
        })
      })

      return { 
        ...research, 
        score, 
        matchedTerms: Array.from(matchedTerms), 
        excerpts: excerpts.slice(0, 2) // Limit to 2 excerpts for brevity
      }
    }).filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
  }, [])

 useEffect(()=>{
    const results = semanticSearch(searchQuery)
    setSearchResults(results)
 },[searchQuery])

  const highlightMatches = (text:string, matches:any) => {
    let highlightedText = text
    matches.forEach((match:string) => {
      const regex = new RegExp(`\\b${match}\\b`, 'gi')
      highlightedText = highlightedText?.replace(regex, `<mark class="bg-yellow-200 rounded px-1">$&</mark>`)
    })
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />
  }

  return (
    <div className="max-w-3xl min-h-screen mx-auto p-4">
      {searchResults.length > 0 ? (
        <div className='mt-20'>
          <h2 className="text-xl font-semibold mb-2">Search Results</h2>
          <ul className="space-y-2">
            {searchResults.map(result => (
              <li key={result.id}>
                <Card>
                  <CardContent className="pt-6">
                    <Link href={`/publications/${result.slug}`} className="font-medium hover:underline text-lg mb-2">
                      {highlightMatches(result.title, result.matchedTerms)}
                    </Link>
                    <div className="text-sm mb-2">
                      <strong>Excerpts:</strong>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {result.excerpts.map((excerpt, index) => (
                          <li key={index}>{highlightMatches(`...${excerpt}...`, result.matchedTerms)}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm">
                      <strong>Related Concepts:</strong>{' '}
                      {highlightMatches(result.excerpts?.join(', '), result.matchedTerms)}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ) : searchQuery && (
        <div className='flex h-screen justify-center items-center'>
          <p className="text-gray-500">No results found. Try different keywords or rephrase your query.</p>
        </div>
        
      )}
    </div>
  )
}