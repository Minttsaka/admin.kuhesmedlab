
"use client"
import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CopyIcon, CheckIcon } from 'lucide-react'
import { Reference, Reference as Rf } from '@prisma/client'


export default function ResearchReferencesSection({reference}:{reference:Reference[]}) {

  const [searchTerm, setSearchTerm] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string, citation: string) => {
    navigator.clipboard.writeText(citation)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section className="space-y-8 py-2 bg-gradient-to-r from-background to-secondary ">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold tracking-tight mb-2">Research References</h2>
        <p className="text-muted-foreground">
          Properly citing your sources is crucial for academic integrity and giving credit to original ideas.
        </p>
      </div>
    <div className=''>
      <Card className='py-2'>
        <CardContent className="">
          <ScrollArea className="h-[300px] py-4 rounded-md border">
            {reference?.length > 0 ? (
              <Card className="">
             
              <CardContent>
                <div className="relative mb-6">
                  <Input
                    placeholder="Search references..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" w-full bg-muted"
                  />
                </div>
                <ul className="space-y-4">
                  {reference?.map((ref, index) => (
                    <li 
                      key={ref.id} 
                      className={`transition-all duration-300 ease-in-out hover:shadow-md p-2 rounded-lg overflow-hidden ${
                        index % 2 === 0 ? 'bg-muted' : 'bg-background'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm flex-grow">{ref.fullReference}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="whitespace-nowrap"
                          onClick={() => handleCopy(ref.id, ref.fullReference!)}
                        >
                          {copiedId === ref.id ? (
                            <>
                              <CheckIcon className="mr-2 h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <CopyIcon className="mr-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
                {reference?.length === 0 && (
                  <p className="text-center text-muted-foreground mt-8">Reference list will be displayed</p>
                )}
              </CardContent>
            </Card>
            ) : (
              <p className="text-center text-muted-foreground">No references</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

    </div>
     
    </section>
  )
}