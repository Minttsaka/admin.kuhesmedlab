
"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, BookOpen, FileText, GraduationCap, LineChart, PieChart, Users } from "lucide-react"
import { Prisma, UserRole } from "@prisma/client"
import { changeRole } from "@/lib/actions"
import { useRouter } from "next/navigation"

type User = Prisma.UserGetPayload<{
  include:{
    departments:true,
    research:{
      include:{
        citationTrend:true,
        downloadTrend:true,
        surveys:{
          include:{
            surveyForm:{
              include:{
                questions:{
                  include:{
                    choices:true
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}>

export default function ProfileFirst({ user }:{user:User}) {

  const [role, setRole] = useState<UserRole>()
  const [isSaving, setIsSaving] = useState(false)

  const router = useRouter()
  const handleSubmit = async (e:React.ChangeEvent<HTMLFormElement>) => {

    const data = {
      role,
      departments:undefined,
      authority:undefined
    }

    try {

      e.preventDefault()
      setIsSaving(true)
      await changeRole(user.id, data)

      router.push('/a/admin-management')
    } catch (error) {

      console.log(error)
      
    } finally{
      setIsSaving(false)
    }
   
  }



  const calculateTotalTrends = () =>{
    let totalDownloads = 0;
    let totalCitations = 0;
    let totalViews = 0;
    let totalResponses=0;
  
    user.research.forEach((researchItem) => {
      totalDownloads += researchItem.downloadTrend.length ?? 0;
      totalCitations += researchItem.citationTrend.length ?? 0;
      totalViews += researchItem.views ?? 0;
    });

    user.research.forEach((researchItem) => {
      researchItem.surveys.forEach((survey)=>{
        survey.surveyForm.forEach(form=>
          form.questions.forEach(question=>
            totalResponses += question.choices.length
          )
        )
      })
    });


  
    return {
      totalDownloads,
      totalCitations,
      totalViews,
      totalResponses
    };
  }

  const totalDownloads = calculateTotalTrends().totalDownloads;
  const totalCitations = calculateTotalTrends().totalDownloads;
  const totalViews = calculateTotalTrends().totalViews;


  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <header className="mb-8">
        <h1 className=" font-bold text-gray-800 dark:text-gray-100">Profile</h1>
        <p className="text-xs text-gray-600 dark:text-gray-300">Welcome back, {user.name}</p>
      </header>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <TabsTrigger value="profile" className="text-xs">
            <GraduationCap className="mr-2 h-5 w-5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="papers" className="text-xs">
            <FileText className="mr-2 h-5 w-5" />
            Papers
          </TabsTrigger>
          <TabsTrigger value="surveys" className="text-xs">
            <Users className="mr-2 h-5 w-5" />
            Surveys
          </TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs">
            <LineChart className="mr-2 h-5 w-5" />
            Metrics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Researcher Profile</CardTitle>
                <CardDescription>Manage your account settings and research preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                  <div className="w-full md:w-1/3">
                    <Label htmlFor="avatar-upload" className="block mb-2 text-sm font-medium">
                      Profile Picture
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={user.image!} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={user.name} disabled/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={user.email} disabled/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" name="role" value={user.role} disabled/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" name="department" value={user.departments?.name} disabled/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={user.bio!}
                    className="min-h-[100px]"
                    disabled
                  />
                </div>
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="theme">Role</Label>
                    <Select onValueChange={(e)=>setRole(e as UserRole)} defaultValue={user.role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Change a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="RESEARCHER">RESEARCHER</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto" disabled={isSaving}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        <TabsContent value="papers">
          <Card>
            <CardHeader>
              <CardTitle>Research Papers</CardTitle>
              <CardDescription>Your published and ongoing research work.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-full w-full rounded-md border p-4">
                {user.research.map((paper) => (
                  <div key={paper.id} className="mb-4 last:mb-0">
                    <h3 className="text-lg font-semibold">M{paper.title}</h3>
                    {paper.journal && <p className="text-sm text-gray-500 dark:text-gray-400">Published in {paper.journal}</p>}
                    <div className="flex space-x-2 mt-2">
                      {JSON.parse(paper.keyWords).map((keyword:string)=>(<Badge key={keyword}>{keyword}</Badge>))}
                      
                    </div>
                    <p className="mt-2 text-sm">{paper.abstract}</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="surveys">
          <Card>
            <CardHeader>
              <CardTitle>Research Surveys</CardTitle>
              <CardDescription>Ongoing and completed surveys.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {user.research.map(research=>research.surveys.map(survey=>survey.surveyForm.map(form => (
                  <div key={research.id} className="mb-4 last:mb-0 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold">{form.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status: {form.status} | Responses: {calculateTotalTrends().totalResponses}</p>
                    <progress className="w-full mt-2" value="65" max="100"></progress>
                    <p className="mt-2 text-sm">{form.description}</p>
                    <Button className="mt-4" variant="outline">View Details</Button>
                  </div>
                ))) )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Research Metrics</CardTitle>
              <CardDescription>Key performance indicators for your research work.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Citations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{totalCitations}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total citations across all papers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{totalDownloads}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Downloads</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Publications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{user.research.map(research=>research.status==="APPROVED").length}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total published papers</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}