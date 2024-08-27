
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, BookOpen, FileText, GraduationCap, LineChart, PieChart, Users } from "lucide-react"

export default function ProfileFirst() {
  const [user, setUser] = useState({
    name: "Dr. Alice Johnson",
    email: "alice.johnson@research.edu",
    role: "Senior Researcher",
    department: "Data Science",
    bio: "Passionate about leveraging data science to solve complex societal problems. Specializing in machine learning applications in healthcare.",
    avatar: "/placeholder.svg?height=100&width=100",
    notifications: true,
    theme: "system",
  })

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prevUser) => ({ ...prevUser, [name]: value }))
  }

  // const handleAvatarChange = (e:any) => {
  //   const file = e.target.files[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
        
  //       setUser((prevUser) => ({ ...prevUser, avatar: reader.result }))
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  const handleSwitchChange = (checked:boolean) => {
    setUser((prevUser) => ({ ...prevUser, notifications: checked }))
  }

  const handleThemeChange = (value:any) => {
    setUser((prevUser) => ({ ...prevUser, theme: value }))
  }

  const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Updated user data:", user)
    alert("User information updated successfully!")
  }

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
          <TabsTrigger value="data" className="text-xs">
            <BarChart className="mr-2 h-5 w-5" />
            Data
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
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        //onChange={handleAvatarChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={user.name} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" name="role" value={user.role} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" name="department" value={user.department} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={user.bio}
                    //onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="theme">Theme Preference</Label>
                    <Select onValueChange={handleThemeChange} defaultValue={user.theme}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-1/2 space-y-2">
                    <Label htmlFor="notifications" className="block mb-2">
                      Notifications
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifications"
                        checked={user.notifications}
                        onCheckedChange={handleSwitchChange}
                      />
                      <Label htmlFor="notifications">Receive email notifications</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
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
              <ScrollArea className="h-[900px] w-full rounded-md border p-4">
                {[1, 2, 3, 4, 5].map((paper) => (
                  <div key={paper} className="mb-4 last:mb-0">
                    <h3 className="text-lg font-semibold">Machine Learning in Healthcare: A Comprehensive Review</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Published in Journal of AI in Medicine, 2023</p>
                    <div className="flex space-x-2 mt-2">
                      <Badge>AI</Badge>
                      <Badge>Healthcare</Badge>
                      <Badge>Machine Learning</Badge>
                    </div>
                    <p className="mt-2 text-sm">This paper provides a comprehensive review of machine learning applications in healthcare, focusing on diagnostic accuracy, treatment optimization, and patient outcome prediction.</p>
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
              <CardDescription>Ongoing and completed surveys for your research projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {[1, 2, 3].map((survey) => (
                  <div key={survey} className="mb-4 last:mb-0 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold">Healthcare Professionals Perception of AI in Medicine</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status: Ongoing | Responses: 1,234</p>
                    <progress className="w-full mt-2" value="65" max="100"></progress>
                    <p className="mt-2 text-sm">This survey aims to understand the perception and readiness of healthcare professionals in adopting AI-powered tools in their practice.</p>
                    <Button className="mt-4" variant="outline">View Details</Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Research Data</CardTitle>
              <CardDescription>Visualizations of your research data and findings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Adoption in Hospitals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                      <PieChart className="h-32 w-32 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Diagnostic Accuracy Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                      <BarChart className="h-32 w-32 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                    <div className="text-4xl font-bold">1,234</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total citations across all papers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">h-index</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">18</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your current h-index</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Publications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">42</div>
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