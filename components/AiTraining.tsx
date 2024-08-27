"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap, CheckCircle, XCircle, BarChart2, Database, Cpu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Aitraining() {
  const [criteria, setCriteria] = useState({
    minSampleSize: 100,
    pValue: 0.05,
    confidenceInterval: 95,
    peerReviewed: true,
  })
  const [research, setResearch] = useState({ title: "", sampleSize: 0, pValue: 0, confidenceInterval: 0, peerReviewed: false })
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [validationResult, setValidationResult] = useState<boolean>()
  const [trainedModels, setTrainedModels] = useState([
    { id: 1, name: "Sentiment Analysis Model", accuracy: 92.5 },
    { id: 2, name: "Image Classification Model", accuracy: 88.7 },
  ])

  const handleCriteriaChange = (key:string, value:number | boolean) => {
    setCriteria({ ...criteria, [key]: value })
  }

  const handleResearchChange = (key:string, value:any) => {
    setResearch({ ...research, [key]: value })
  }

  const validateResearch = () => {
    const isValid = 
      research.sampleSize >= criteria.minSampleSize &&
      research.pValue <= criteria.pValue &&
      research.confidenceInterval >= criteria.confidenceInterval &&
      (!criteria.peerReviewed || research.peerReviewed)
    
    setValidationResult(isValid)
  }

  const startTraining = () => {
    setIsTraining(true)
    setProgress(0)
  }

  useEffect(() => {
    if (isTraining) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            setIsTraining(false)
            clearInterval(timer)
            setTrainedModels([...trainedModels, { 
              id: trainedModels.length + 1, 
              name: `New AI Model ${trainedModels.length + 1}`, 
              accuracy: Math.round((Math.random() * (99 - 85) + 85) * 10) / 10
            }])
            return 0
          }
          const diff = Math.random() * 10
          return Math.min(oldProgress + diff, 100)
        })
      }, 500)
      return () => clearInterval(timer)
    }
  }, [isTraining])

  return (
    <div className="w-full p-4 bg-gradient-to-br from-blue-900 to-purple-900 min-h-screen text-white">
      <header className="mb-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
        >
          AI Model Training Hub
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-blue-300 mt-2"
        >
          Revolutionize your research with cutting-edge AI
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-blue-800 bg-opacity-50 backdrop-blur-lg border-blue-600">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-300 flex items-center">
              <Brain className="mr-2" />
              Set Validation Criteria
            </CardTitle>
            <CardDescription className="text-blue-400">Define the standards for your research</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="min-sample-size" className="text-blue-300">Minimum Sample Size</Label>
              <Input
                id="min-sample-size"
                type="number"
                value={criteria.minSampleSize}
                onChange={(e) => handleCriteriaChange('minSampleSize', parseInt(e.target.value))}
                className="bg-blue-700 border-blue-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-value" className="text-blue-300">Maximum p-value</Label>
              <Slider
                id="p-value"
                min={0.01}
                max={0.1}
                step={0.01}
                value={[criteria.pValue]}
                onValueChange={([value]) => handleCriteriaChange('pValue', value)}
                className="py-4"
              />
              <div className="text-right text-blue-300">{criteria.pValue}</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence-interval" className="text-blue-300">Minimum Confidence Interval</Label>
              <Slider
                id="confidence-interval"
                min={90}
                max={99}
                step={1}
                value={[criteria.confidenceInterval]}
                onValueChange={([value]) => handleCriteriaChange('confidenceInterval', value)}
                className="py-4"
              />
              <div className="text-right text-blue-300">{criteria.confidenceInterval}%</div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="peer-reviewed"
                checked={criteria.peerReviewed}
                onCheckedChange={(checked) => handleCriteriaChange('peerReviewed', checked)}
              />
              <Label htmlFor="peer-reviewed" className="text-blue-300">Require Peer Review</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-800 bg-opacity-50 backdrop-blur-lg border-purple-600">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-300 flex items-center">
              <Zap className="mr-2" />
              Validate Research
            </CardTitle>
            <CardDescription className="text-purple-400">Check if your research meets the criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="research-title" className="text-purple-300">Research Title</Label>
              <Input
                id="research-title"
                value={research.title}
                onChange={(e) => handleResearchChange('title', e.target.value)}
                className="bg-purple-700 border-purple-500 text-white"
                placeholder="Enter research title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sample-size" className="text-purple-300">Sample Size</Label>
              <Input
                id="sample-size"
                type="number"
                value={research.sampleSize}
                onChange={(e) => handleResearchChange('sampleSize', parseInt(e.target.value))}
                className="bg-purple-700 border-purple-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="research-p-value" className="text-purple-300">p-value</Label>
              <Input
                id="research-p-value"
                type="number"
                step="0.01"
                value={research.pValue}
                onChange={(e) => handleResearchChange('pValue', parseFloat(e.target.value))}
                className="bg-purple-700 border-purple-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="research-confidence-interval" className="text-purple-300">Confidence Interval</Label>
              <Input
                id="research-confidence-interval"
                type="number"
                value={research.confidenceInterval}
                onChange={(e) => handleResearchChange('confidenceInterval', parseInt(e.target.value))}
                className="bg-purple-700 border-purple-500 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="research-peer-reviewed"
                checked={research.peerReviewed}
                onCheckedChange={(checked) => handleResearchChange('peerReviewed', checked)}
              />
              <Label htmlFor="research-peer-reviewed" className="text-purple-300">Peer Reviewed</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={validateResearch} className="w-full bg-purple-600 hover:bg-purple-700">
              Validate Research
            </Button>
          </CardFooter>
        </Card>
      </div>

      <AnimatePresence>
        {validationResult !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card className={`bg-opacity-50 backdrop-blur-lg ${validationResult ? 'bg-green-800 border-green-600' : 'bg-red-800 border-red-600'}`}>
              <CardHeader>
                <CardTitle className={`text-2xl font-bold flex items-center ${validationResult ? 'text-green-300' : 'text-red-300'}`}>
                  {validationResult ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
                  Validation Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-lg ${validationResult ? 'text-green-300' : 'text-red-300'}`}>
                  {validationResult
                    ? "Congratulations! Your research meets all the criteria."
                    : "Sorry, your research does not meet all the required criteria."}
                </p>
              </CardContent>
              {validationResult && (
                <CardFooter>
                  <Button onClick={startTraining} className="w-full bg-green-600 hover:bg-green-700" disabled={isTraining}>
                    {isTraining ? "Training in Progress..." : "Start AI Model Training"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {isTraining && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-indigo-800 bg-opacity-50 backdrop-blur-lg border-indigo-600">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-indigo-300 flex items-center">
                <Cpu className="mr-2" />
                AI Model Training Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full h-2 bg-indigo-700" />
              <p className="text-indigo-300 mt-2 text-center">{Math.round(progress)}% Complete</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-violet-800 bg-opacity-50 backdrop-blur-lg border-violet-600">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-violet-300 flex items-center">
              <Database className="mr-2" />
              Trained AI Models
            </CardTitle>
            <CardDescription className="text-violet-400">Your arsenal of intelligent models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainedModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between bg-violet-700 bg-opacity-50 p-4 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-violet-300">{model.name}</h3>
                    <div className="flex items-center mt-1">
                      <BarChart2 className="text-violet-400 mr-1 h-4 w-4" />
                      <span className="text-violet-400 text-sm">Accuracy: {model.accuracy}%</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-violet-600 text-violet-200">
                    Trained
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}