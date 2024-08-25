import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { SunIcon, MoonIcon, TrendingUpIcon, DownloadIcon, UsersIcon, GlobeIcon } from 'lucide-react'

// Enhanced mock data
const researchPapers = [
  { id: 1, title: "Quantum Entanglement in Neural Networks", author: "Dr. Alice Johnson", year: 2023, citations: 89, downloads: 3420, impact: 9.2 },
  { id: 2, title: "Bioremediation Techniques for Plastic Pollution", author: "Prof. Bob Smith", year: 2022, citations: 132, downloads: 5150, impact: 8.7 },
  { id: 3, title: "AI-Driven Personalized Medicine", author: "Dr. Carol Williams", year: 2023, citations: 76, downloads: 2980, impact: 8.9 },
  { id: 4, title: "Fusion Energy: Breakthrough in Plasma Confinement", author: "Dr. David Brown", year: 2021, citations: 204, downloads: 7630, impact: 9.5 },
  { id: 5, title: "Neuroplasticity in Adult Learning", author: "Prof. Eve Davis", year: 2022, citations: 118, downloads: 4270, impact: 8.4 },
]

const generateTimeSeriesData = (months, baseValue, trend, volatility) => {
  return Array.from({ length: months }, (_, i) => {
    const trendValue = baseValue + (trend * i)
    const random = (Math.random() - 0.5) * 2 * volatility
    return Math.max(0, Math.round(trendValue + random))
  })
}

const generateChartData = (paper) => {
  const citationData = generateTimeSeriesData(24, 10, 4, 10).map((value, index) => ({
    month: `Month ${index + 1}`,
    citations: value
  }))

  const downloadData = generateTimeSeriesData(24, 100, 15, 50).map((value, index) => ({
    month: `Month ${index + 1}`,
    downloads: value
  }))

  const subjectAreaData = [
    { name: 'Computer Science', value: Math.random() * 400 + 100 },
    { name: 'Physics', value: Math.random() * 300 + 100 },
    { name: 'Mathematics', value: Math.random() * 200 + 100 },
    { name: 'Engineering', value: Math.random() * 100 + 100 },
    { name: 'Biology', value: Math.random() * 250 + 100 },
  ]

  const impactMetrics = [
    { subject: 'Citations', A: paper.citations, fullMark: 150 },
    { subject: 'Downloads', A: paper.downloads / 50, fullMark: 150 },
    { subject: 'Social Media', A: Math.random() * 100 + 50, fullMark: 150 },
    { subject: 'News Mentions', A: Math.random() * 50 + 10, fullMark: 150 },
    { subject: 'Policy Citations', A: Math.random() * 30 + 5, fullMark: 150 },
  ]

  return { citationData, downloadData, subjectAreaData, impactMetrics }
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']

export default function Component() {
  const [selectedPaper, setSelectedPaper] = useState(researchPapers[0])
  const [darkMode, setDarkMode] = useState(false)
  const { citationData, downloadData, subjectAreaData, impactMetrics } = generateChartData(selectedPaper)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-4 bg-gradient-to-br from-background to-secondary">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Research Analytics Dashboard</h1>
          <div className="flex items-center space-x-2">
            <SunIcon className="h-5 w-5" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <MoonIcon className="h-5 w-5" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 bg-gradient-to-br from-card to-background">
            <CardHeader>
              <CardTitle>Research Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[80vh]">
                <AnimatePresence>
                  {researchPapers.map((paper) => (
                    <motion.div
                      key={paper.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 mb-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedPaper.id === paper.id ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-card hover:bg-secondary'
                      }`}
                      onClick={() => setSelectedPaper(paper)}
                    >
                      <h3 className="font-semibold">{paper.title}</h3>
                      <p className="text-sm">{paper.author}, {paper.year}</p>
                      <div className="flex justify-between mt-2">
                        <Badge variant="secondary" className="flex items-center">
                          <TrendingUpIcon className="w-3 h-3 mr-1" />
                          {paper.citations}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center">
                          <DownloadIcon className="w-3 h-3 mr-1" />
                          {paper.downloads}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-gradient-to-br from-card to-background">
              <CardHeader>
                <CardTitle>{selectedPaper.title}</CardTitle>
                <CardDescription>{selectedPaper.author}, {selectedPaper.year}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                    <TrendingUpIcon className="w-8 h-8 mb-2 text-primary" />
                    <span className="text-2xl font-bold">{selectedPaper.citations}</span>
                    <span className="text-sm">Total Citations</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-secondary/10 rounded-lg">
                    <DownloadIcon className="w-8 h-8 mb-2 text-secondary" />
                    <span className="text-2xl font-bold">{selectedPaper.downloads}</span>
                    <span className="text-sm">Total Downloads</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-accent/10 rounded-lg">
                    <UsersIcon className="w-8 h-8 mb-2 text-accent" />
                    <span className="text-2xl font-bold">{(Math.random() * 100 + 50).toFixed(0)}</span>
                    <span className="text-sm">Collaborators</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/10 rounded-lg">
                    <GlobeIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                    <span className="text-2xl font-bold">{selectedPaper.impact.toFixed(1)}</span>
                    <span className="text-sm">Impact Factor</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-background">
                <CardHeader>
                  <CardTitle>Citations Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={citationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="citations" stroke="#8884d8" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-card to-background">
                <CardHeader>
                  <CardTitle>Monthly Downloads</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={downloadData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="downloads" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-card to-background">
                <CardHeader>
                  <CardTitle>Subject Area Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subjectAreaData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {subjectAreaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-card to-background">
                <CardHeader>
                  <CardTitle>Research Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={impactMetrics}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} />
                      <Radar name="Paper Metrics" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}