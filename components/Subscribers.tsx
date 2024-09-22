"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination"
import { NewsletterSubscription } from '@prisma/client'
import { Badge } from './ui/badge'



export default function NewsletterSubscribers({subscribers}:{subscribers:NewsletterSubscription[]}) {
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscription | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = subscribers.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(subscribers.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className=" p-4">
      <h1 className="text-2xl font-bold mb-4">Newsletter Subscribers</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email<Badge className={`bg-[green] text-white w-fit`}>{subscribers.length}</Badge></TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Subscribed On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((subscriber) => (
            <TableRow key={subscriber.id}>
              <TableCell>{subscriber.email}</TableCell>
              <TableCell>All</TableCell>
              <TableCell>{subscriber.createdAt.toDateString()}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedSubscriber(subscriber)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink 
                onClick={() => handlePageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Dialog open={!!selectedSubscriber} onOpenChange={() => setSelectedSubscriber(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscriber Details</DialogTitle>
          </DialogHeader>
          {selectedSubscriber && (
            <div>
              <p><strong>Email:</strong> {selectedSubscriber.email}</p>
              <p><strong>Category:</strong> All</p>
              <p><strong>Subscribed On:</strong> {selectedSubscriber.createdAt.toDateString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}