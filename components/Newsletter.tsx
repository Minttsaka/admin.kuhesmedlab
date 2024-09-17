import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Search } from "lucide-react"

type ListItem = {
  id: string
  name: string
  email: string
  date: string
  status?: string
  details?: string
}

type SortConfig = {
  key: keyof ListItem
  direction: 'asc' | 'desc'
}

const TableComponent = ({ items, type }: { items: ListItem[], type: string }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' })
  const [search, setSearch] = useState("")
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null)

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (search) {
      sortableItems = sortableItems.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    sortableItems.sort((a, b) => {
      const aKey = a[sortConfig.key];
      const bKey = b[sortConfig.key];
  
      // Check if both aKey and bKey are defined before comparing
      if (aKey && bKey) {
        if (aKey < bKey) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aKey > bKey) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
      }
  
      return 0;
    });
  
    return sortableItems;
  }, [items, sortConfig, search]);
  

  const requestSort = (key: keyof ListItem) => {
    setSortConfig(current => {
      if (current.key === key && current.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return { key, direction: 'asc' }
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{type}</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <Button variant="ghost" onClick={() => requestSort('name')}>
                Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => requestSort('email')}>
                Email <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => requestSort('date')}>
                Date <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            {type === 'Disapproved Publications' && (
              <TableHead>Status</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedItem(item)}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.date}</TableCell>
              {type === 'Disapproved Publications' && (
                <TableCell>
                  <Badge variant={item.status === 'Pending Review' ? 'outline' : 'destructive'}>
                    {item.status}
                  </Badge>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Email:</span>
              <span className="col-span-3">{selectedItem?.email}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Date:</span>
              <span className="col-span-3">{selectedItem?.date}</span>
            </div>
            {type === 'Disapproved Publications' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Status:</span>
                <span className="col-span-3">{selectedItem?.status}</span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Details:</span>
              <span className="col-span-3">{selectedItem?.details}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function SubscriberLists() {
  // Mock data for demonstration
  const [subscribers] = useState<ListItem[]>([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', date: '2023-06-01', details: 'Subscribed to weekly newsletter' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', date: '2023-06-02', details: 'Subscribed to monthly digest' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', date: '2023-06-03', details: 'Subscribed to all topics' },
    { id: '4', name: 'Diana Prince', email: 'diana@example.com', date: '2023-06-04', details: 'Subscribed to tech news' },
    { id: '5', name: 'Ethan Hunt', email: 'ethan@example.com', date: '2023-06-05', details: 'Subscribed to industry updates' },
  ])

  const [feedbacks] = useState<ListItem[]>([
    { id: '1', name: 'Frank Castle', email: 'frank@example.com', date: '2023-06-01', details: 'Provided feedback on user interface' },
    { id: '2', name: 'Gina Davis', email: 'gina@example.com', date: '2023-06-02', details: 'Suggested new feature for mobile app' },
    { id: '3', name: 'Harry Potter', email: 'harry@example.com', date: '2023-06-03', details: 'Reported a bug in checkout process' },
  ])

  const [publications] = useState<ListItem[]>([
    { id: '1', name: 'Ivan Drago', email: 'ivan@example.com', date: '2023-06-01', status: 'Disapproved', details: 'Content violates community guidelines' },
    { id: '2', name: 'Julia Roberts', email: 'julia@example.com', date: '2023-06-02', status: 'Pending Review', details: 'Awaiting editorial review' },
    { id: '3', name: 'Kevin Bacon', email: 'kevin@example.com', date: '2023-06-03', status: 'Disapproved', details: 'Plagiarism detected' },
  ])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Subscriber Management Dashboard</CardTitle>
        <CardDescription>Manage newsletter subscribers, feedbacks, and publications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="newsletters" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
            <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
            <TabsTrigger value="publications">Disapproved Publications</TabsTrigger>
          </TabsList>
          <TabsContent value="newsletters">
            <TableComponent items={subscribers} type="Newsletter Subscribers" />
          </TabsContent>
          <TabsContent value="feedbacks">
            <TableComponent items={feedbacks} type="Feedbacks" />
          </TabsContent>
          <TabsContent value="publications">
            <TableComponent items={publications} type="Disapproved Publications" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}