"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, PlusCircle, Users, MapPin, Clock, Search } from "lucide-react"
import { format } from "date-fns"

const eventTypes = [
  "Conference",
  "Workshop",
  "Seminar",
  "Training",
  "Lab Tour",
  "Research Presentation",
  "Networking Event",
  "Equipment Demonstration",
]

const initialEvents = [
  {
    id: 1,
    title: "Annual Medical Lab Symposium",
    type: "Conference",
    date: new Date(2023, 7, 15),
    location: "Grand Medical Center Auditorium",
    description: "Join us for the annual symposium featuring the latest advancements in medical laboratory science.",
    attendees: 250,
  },
  {
    id: 2,
    title: "New Equipment Training",
    type: "Training",
    date: new Date(2023, 7, 22),
    location: "Lab 3, Research Wing",
    description: "Hands-on training session for the newly acquired mass spectrometer.",
    attendees: 20,
  },
  {
    id: 3,
    title: "Microbiology Research Presentation",
    type: "Research Presentation",
    date: new Date(2023, 8, 5),
    location: "Virtual Meeting Room",
    description: "Dr. Emily Chen presents her latest findings on antibiotic-resistant bacteria.",
    attendees: 100,
  },
]

export default function EventsFirst() {
  const [events, setEvents] = useState(initialEvents)
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "",
    date: new Date(),
    location: "",
    description: "",
    attendees: 0,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setNewEvent((prev) => ({ ...prev, type: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setNewEvent((prev) => ({ ...prev, date }))
    }
  }

  const handleCreateEvent = () => {
    const eventToAdd = {
      ...newEvent,
      id: events.length + 1,
      attendees: parseInt(newEvent.attendees.toString(), 10),
    }
    setEvents((prev) => [...prev, eventToAdd])
    setNewEvent({
      title: "",
      type: "",
      date: new Date(),
      location: "",
      description: "",
      attendees: 0,
    })
    setIsDialogOpen(false)
  }

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className=" px-4 py-6">
          <h1 className="text-md font-bold text-gray-900">Events Organization</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new medical lab event.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`col-span-3 justify-start text-left font-normal ${
                          !newEvent.date && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newEvent.date}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="attendees" className="text-right">
                    Attendees
                  </Label>
                  <Input
                    id="attendees"
                    name="attendees"
                    type="number"
                    value={newEvent.attendees}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateEvent}>Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ScrollArea className="h-[600px] w-full rounded-md border bg-white p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>{event.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center mb-2 text-sm text-gray-600">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{format(event.date, "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center mb-2 text-sm text-gray-600">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center mb-4 text-sm text-gray-600">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{event.attendees} attendees</span>
                      </div>
                      <p className="text-sm text-gray-700">{event.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="upcoming">
            <p className="text-muted-foreground">Upcoming events will be displayed here.</p>
          </TabsContent>
          <TabsContent value="past">
            <p className="text-muted-foreground">Past events will be displayed here.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}