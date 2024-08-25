
"use client"
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Download, Printer, FileText, Moon, Sun, Menu } from 'lucide-react'

export default function AnalyticsFirst() {
  const [activeTab, setActiveTab] = useState("overview")
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sample data for charts
  const researchData = [
    { name: 'Study A', participants: 120, completionRate: 85 },
    { name: 'Study B', participants: 250, completionRate: 92 },
    { name: 'Study C', participants: 180, completionRate: 78 },
    { name: 'Study D', participants: 300, completionRate: 88 },
  ]

  const demographicData = [
    { name: '18-25', value: 20 },
    { name: '26-35', value: 30 },
    { name: '36-45', value: 25 },
    { name: '46-55', value: 15 },
    { name: '56+', value: 10 },
  ]

  const trendData = [
    { month: 'Jan', participants: 150 },
    { month: 'Feb', participants: 200 },
    { month: 'Mar', participants: 180 },
    { month: 'Apr', participants: 220 },
    { month: 'May', participants: 250 },
    { month: 'Jun', participants: 280 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // Placeholder for export functionality
    console.log("Exporting data...")
  }

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log("Downloading report...")
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-secondary">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none lg:hidden">
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-semibold text-primary ml-4">Reports & Analytics</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <FileText className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="research">Research Studies</TabsTrigger>
                  <TabsTrigger value="demographics">Demographics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2,850</div>
                        <p className="text-xs text-muted-foreground">+15% from last month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Studies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">3 new studies this quarter</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">85.7%</div>
                        <p className="text-xs text-muted-foreground">+2.3% from previous studies</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Data Points Collected</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1.2M</div>
                        <p className="text-xs text-muted-foreground">Across all active studies</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Research Study Participation</CardTitle>
                      <CardDescription>Number of participants and completion rates per study</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={researchData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="participants" fill="#8884d8" name="Participants" />
                          <Bar yAxisId="right" dataKey="completionRate" fill="#82ca9d" name="Completion Rate (%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Participant Trend</CardTitle>
                        <CardDescription>Monthly participant enrollment</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="participants" stroke="#8884d8" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex justify-between items-center">
                            <span>New participant enrolled in Study B</span>
                            <span className="text-sm text-muted-foreground">2 hours ago</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span>Study C reached 80% completion</span>
                            <span className="text-sm text-muted-foreground">1 day ago</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span>New research proposal submitted</span>
                            <span className="text-sm text-muted-foreground">2 days ago</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="research" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Research Studies Overview</CardTitle>
                      <CardDescription>Detailed breakdown of ongoing and completed studies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {researchData.map((study, index) => (
                          <div key={index} className="flex items-center justify-between border-b pb-2">
                            <div>
                              <h3 className="font-medium">{study.name}</h3>
                              <p className="text-sm text-muted-foreground">Participants: {study.participants}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{study.completionRate}%</p>
                              <p className="text-sm text-muted-foreground">Completion Rate</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Studies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>Cardiovascular Health in Young Adults</span>
                          <span className="text-sm text-muted-foreground">Starts in 2 weeks</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Effects of Plant-Based Diet on Cholesterol</span>
                          <span className="text-sm text-muted-foreground">Starts in 1 month</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Sleep Patterns in Shift Workers</span>
                          <span className="text-sm text-muted-foreground">Starts in 6 weeks</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="demographics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Participant Demographics</CardTitle>
                      <CardDescription>Age distribution of study participants</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={demographicData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {demographicData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Participant Diversity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Gender Balance</span>
                          <span>48% Male / 52% Female</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ethnic Diversity</span>
                          <span>Represented: 6 major groups</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Geographic Spread</span>
                          <span>12 states, 3 countries</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
    </div>
  )
}