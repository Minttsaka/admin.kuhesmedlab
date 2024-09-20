"use client"

import React, { useState } from 'react'
import { Search, Plus, MoreHorizontal, Edit, Trash2, UserPlus, Shield, FileText, Mail } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Prisma, Research, User } from '@prisma/client'
import Link from 'next/link'



export type UserWithPublishedResearch = Prisma.UserGetPayload<{
  include: {
    research: true,
    departments:true
  },
}>;

const roleColors : Record<'researcher' | 'Reviewer' | 'Admin', string> = {
  researcher: "bg-blue-500",
  Reviewer: "bg-green-500",
  Admin: "bg-purple-500",
}

export default function UserManagement({users}:{users:UserWithPublishedResearch[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [selectedUser, setSelectedUser] = useState<User & { research: Array<Research>} | null>()
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  console.log(typeof(users))

  const filteredUsers =users?.filter(user => 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter === "All" || user.role === roleFilter)
  )

  const handleRoleChange = (userId:string , newRole:string) => {
    // Implement role change logic here
    console.log(`Changed role of user ${userId} to ${newRole}`)
  }

  return (
    <div className=" p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
        <Button onClick={() => setIsAddUserOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={setRoleFilter} defaultValue="All">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            <SelectItem value="Researcher">Researcher</SelectItem>
            <SelectItem value="Reviewer">Reviewer</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Papers</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image!} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`${roleColors[user.role as 'researcher' | 'Reviewer' | 'Admin']} text-white`}>{user.role}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.departments?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.research.length}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setSelectedUser(user)}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/a/profile/${user.id}`} className='flex items-center gap-2'>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Change Role</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Deactivate User</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={selectedUser?.image!} alt={selectedUser?.name} />
                <AvatarFallback>{selectedUser?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{selectedUser?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
                <Badge className={`${roleColors[selectedUser?.role as 'researcher' | 'Reviewer' | 'Admin']} text-white mt-1`}>{selectedUser?.role}</Badge>
              </div>
              <div>
                <Label>Department</Label>
                <p className="mt-1">{selectedUser?.authority}</p>
              </div>
              <div>
                <Label>Papers Published</Label>
                <p className="mt-1">{selectedUser?.research.length}</p>
              </div>
            </div>
            <div>
              <Label>Recent Activity</Label>
              <ul className="mt-2 space-y-2">
                <li className="text-sm">Submitted a new paper: AI in Medical Imaging</li>
                <li className="text-sm">Reviewed 3 papers this month</li>
                <li className="text-sm">Updated profile information</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
            <Button>Edit Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details of the new user to add them to the system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            // Implement add user logic here
            setIsAddUserOpen(false)
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="researcher">Researcher</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Input id="department" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}