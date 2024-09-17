"use client"

import React, { KeyboardEvent, useState } from 'react'
import { MoonIcon, SunIcon, SearchIcon, BookOpenIcon, ChartBarIcon, UsersIcon, BellIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Notifications from './Notifications'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation"

export default function TopBar() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  const {data:session} = useSession()

  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const user = session?.user

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
    // In a real application, you'd apply the theme change here
  }

  return (
    <div className={`w-full bg-white shadow-lg ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
     

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 bg-muted rounded-full px-3 py-1 flex-grow max-w-md mx-4">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              type="search"
              placeholder="Search research..."
              className="border-none bg-transparent focus:outline-none focus:ring-0"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Link href={'/a/user-management'}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <BookOpenIcon className="h-5 w-5 mr-1" />
              Users
              </Button>
            </Link>
            <Link href={'/a/analytics'}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <ChartBarIcon className="h-5 w-5 mr-1" />
                Analytics
              </Button>
            </Link>
            <Link href={'/a/admins-management'}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <UsersIcon className="h-5 w-5 mr-1" />
                Team
              </Button>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Notifications />

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </Button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image!} alt="@johndoe" className='object-cover'/>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}