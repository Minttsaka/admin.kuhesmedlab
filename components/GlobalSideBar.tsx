"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, ChevronLeft, Home,Newspaper, FileText,Building, Users, BarChart2, Book, Calendar, Settings, HelpCircle, LogOut, LucideProps, SortDesc } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { User } from '@prisma/client'



export default function GlobalSideBar() {
  
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  const [collapsed, setCollapsed] = React.useState(false)

  const {data:session }= useSession()
  const user = session?.user as User

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
    // In a real application, you'd apply the theme change here
  }

  const NavItem = ({ icon: Icon, children, href }:{ icon:React.FC<LucideProps>, children:React.ReactNode, href:string }) => {
   
    return(
    
    <Link href={href} passHref>
      <Button variant="ghost" className={`w-full font-normal justify-start text-gray-600 ${collapsed ? 'px-2' : 'px-4'}`}>
        <Icon className={`h-5 w-5 ${collapsed ? 'mr-0' : 'mr-2'}`} />
        {!collapsed && <span>{children}</span>}
      </Button>
    </Link>
  )}

  return (
    <div className={`flex flex-col h-screen bg-white shadow ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex items-center justify-between p-4">
        {!collapsed && <span className="text-lg font-bold">Kuhesmedlab</span>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-grow">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {!collapsed && "Dashboard"}
            </h2>
            <div className="space-y-1">
              <NavItem icon={Home} href="/a/dashboard">Overview</NavItem>
              <NavItem icon={BarChart2} href="/a/department">Departments</NavItem>
              <NavItem icon={FileText} href="/a/analytics">Reports</NavItem>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {!collapsed && "Research"}
            </h2>
            <div className="space-y-1">
              <NavItem icon={Book} href="/a/research-papers">Research Library</NavItem>
              <NavItem icon={Book} href="/a/survey">Survey</NavItem>
              <NavItem icon={Book} href="/a/category">Research Field</NavItem>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {!collapsed && "Management"}
            </h2>
            <div className="space-y-1">
              <NavItem icon={Calendar} href="/a/events">Schedule</NavItem>
              <NavItem icon={Users} href="/a/admins-management">Team</NavItem>
              <NavItem icon={Newspaper} href="/a/content">Content</NavItem>
              <NavItem icon={Building} href="/a/institutions">Institution</NavItem>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {!collapsed && "Support"}
            </h2>
            <div className="space-y-1">
              <NavItem icon={HelpCircle} href="/a/support">Help Center</NavItem>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 p-4 bg-background">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user?.image! ?? '/avatar.png'} alt="@johndoe" className='object-cover' />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.role ?? "Admin"}</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
              <Link target='__blank' href={`https://kuhesmedlab.vercel.app/mw/dashboard`}>
                Go to app
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link target='__blank' href={`https://kuhesmedlab.vercel.app/mw/profile`}>
              Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm">{!collapsed && "Dark Mode"}</span>
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
        </div>
      </div>
    </div>
  )
}