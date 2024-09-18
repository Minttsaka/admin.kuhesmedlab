"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDownIcon, ChevronUpIcon, BookmarkIcon, ExternalLinkIcon, StarIcon, SunIcon, MoonIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Article = {
    id: string;
    title: string;
    summary: string;
    link: string;
    citationCount:number | null;
    published: string;
    updated: string;
    authors: { name: string; affiliation: string }[];
  };

const researchPapers = [
  {
    id: 1,
    title: "The Impact of Artificial Intelligence on Modern Software Engineering Practices",
    authors: ["Jane Doe", "John Smith"],
    date: "2023-05-15",
    citations: 42,
    rating: 4.5,
    abstract: "This paper explores the profound impact of artificial intelligence on modern software engineering practices. We analyze how AI-driven tools and methodologies are reshaping the landscape of software development, from code generation to testing and deployment. Our findings suggest a significant shift towards more efficient and intelligent software creation processes, while also highlighting potential challenges and ethical considerations that arise with increased AI integration in the field."
  },
  {
    id: 2,
    title: "Quantum Computing: A New Frontier in Cryptography",
    authors: ["Alice Johnson", "Bob Williams"],
    date: "2023-04-22",
    citations: 31,
    rating: 4.2,
    abstract: "As quantum computing continues to advance, its potential impact on cryptography becomes increasingly relevant. This paper examines the implications of quantum computing on current cryptographic methods and explores quantum-resistant algorithms. We provide an overview of post-quantum cryptography and discuss the challenges and opportunities that lie ahead in securing digital communications in a quantum computing era."
  },
  {
    id: 3,
    title: "The Role of Edge Computing in IoT Ecosystems",
    authors: ["Charlie Brown", "Diana Garcia"],
    date: "2023-03-10",
    citations: 28,
    rating: 4.0,
    abstract: "This research investigates the crucial role of edge computing in Internet of Things (IoT) ecosystems. We analyze how edge computing addresses the challenges of latency, bandwidth, and privacy in large-scale IoT deployments. Our study includes case studies from various industries, demonstrating the practical benefits and potential drawbacks of implementing edge computing solutions in IoT environments."
  }
]

async function fetchCitationCount(doi: string): Promise<number | null> {
    try {
      const response = await fetch(`https://api.crossref.org/works/${doi}`);
      const data = await response.json();
  
      // CrossRef provides citation count under the 'is-referenced-by-count' field
      const citationCount = data.message['is-referenced-by-count'];
      return citationCount;
    } catch (error) {
      console.error('Error fetching citation count:', error);
      return null;
    }
  }
  

export default function RelatedResearchList({title}:{title:string}) {
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<number, boolean>>({})
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleAbstract = (id: number) => {
    setExpandedAbstracts(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://export.arxiv.org/api/query?search_query=all:${title}&start=0&max_results=9`
        );
        const text = await response.text();
    
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
    
        const entries = xml.getElementsByTagName('entry');
        const data: Article[] = [];
    
        for (let i = 0; i < entries.length; i++) {
          const id = entries[i].getElementsByTagName('id')[0].textContent || '';
          const title = entries[i].getElementsByTagName('title')[0].textContent || '';
          const summary = entries[i].getElementsByTagName('summary')[0].textContent || '';
          const link = id; // Use the ID as the link
          const published = entries[i].getElementsByTagName('published')[0].textContent || '';
          const updated = entries[i].getElementsByTagName('updated')[0].textContent || '';
    
          const authors: { name: string; affiliation: string }[] = [];
          const authorElements = entries[i].getElementsByTagName('author');
    
          for (let j = 0; j < authorElements.length; j++) {
            const name = authorElements[j].getElementsByTagName('name')[0].textContent || '';
            const affiliation = authorElements[j].getElementsByTagName('arxiv:affiliation')[0]
              ?.textContent || 'Unknown affiliation';
            authors.push({ name, affiliation });
          }

          const doiElement = entries[i].getElementsByTagName('arxiv:doi')[0];
          const doi = doiElement ? doiElement.textContent : null;
  
          let citationCount = null;
          if (doi) {
            // Fetch citation count using DOI
            citationCount = await fetchCitationCount(doi);
          }
    
          data.push({ id, title, summary, citationCount, link, published, updated, authors });
        }
    
        setArticles(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center">
    <LoadingSpinner />
  </div>

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark text-white' : 'bg-gradient-to-r from-background to-secondary'}`} id='related'>
      <div className="w-full  dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-4xl font-extrabold tracking-tight mb-2">
            Related Research
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[800px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">{paper.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {paper.authors.map(author =>(author.name)).join(', ')} • {new Date(paper.published).toLocaleDateString()}
                      </p>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(4.2)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm">{4.2.toFixed(1)}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <AnimatePresence>
                        {expandedAbstracts[index] && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm mb-4"
                          >
                            {paper.summary}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAbstract(index)}
                        className="mb-4"
                      >
                        {expandedAbstracts[index] ? (
                          <>
                            <ChevronUpIcon className="mr-2 h-4 w-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon className="mr-2 h-4 w-4" />
                            Read Abstract
                          </>
                        )}
                      </Button>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Citation Impact:</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${(paper.citationCount! / 50) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">{paper.citationCount}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Link target='__blank' href={paper.link}>
                        <Button variant="outline" size="sm">
                          <ExternalLinkIcon className="mr-2 h-4 w-4" />
                          View Full Paper
                        </Button>
                      </Link>
                      
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </div>
    </div>
  )
}

const LoadingSpinner: React.FC = () => {
    return (
      <svg
        className="animate-spin h-10 w-10 text-gray-500"
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
  