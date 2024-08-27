"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building, Plus, Trash2, UserPlus, Users } from "lucide-react"
import { motion } from "framer-motion"

export default function DepartmentFirst() {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Human Resources", roles: ["HR Manager", "Recruiter", "HR Assistant"] },
    { id: 2, name: "Information Technology", roles: ["IT Director", "System Administrator", "Software Developer"] },
    { id: 3, name: "Marketing", roles: ["Marketing Manager", "Content Creator", "SEO Specialist"] },
  ])
  const [newDepartment, setNewDepartment] = useState("")
  const [newRole, setNewRole] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)

  const handleAddDepartment = () => {
    if (newDepartment.trim() !== "") {
      setDepartments([...departments, { id: Date.now(), name: newDepartment, roles: [] }])
      setNewDepartment("")
    }
  }

  const handleAddRole = () => {
    if (selectedDepartment && newRole.trim() !== "") {
      const updatedDepartments = departments.map(dept =>
        dept.id === selectedDepartment.id
          ? { ...dept, roles: [...dept.roles, newRole] }
          : dept
      )
      setDepartments(updatedDepartments)
      setNewRole("")
    }
  }

  const handleRemoveDepartment = (id:number) => {
    setDepartments(departments.filter(dept => dept.id !== id))
    if (selectedDepartment && selectedDepartment.id === id) {
      setSelectedDepartment(null)
    }
  }

  const handleRemoveRole = (deptId:number, role:string) => {
    const updatedDepartments = departments.map(dept =>
      dept.id === deptId
        ? { ...dept, roles: dept.roles.filter(r => r !== role) }
        : dept
    )
    setDepartments(updatedDepartments)
  }

  return (
    <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300">Department Management</h1>
        <p className="text-xl text-purple-600 dark:text-purple-400">Organize your company structure</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center">
              <Building className="mr-2" />
              Add New Department
            </CardTitle>
            <CardDescription>Create a new department for your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department-name">Department Name</Label>
                <Input
                  id="department-name"
                  placeholder="Enter department name"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddDepartment} className="w-full bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" /> Add Department
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center">
              <UserPlus className="mr-2" />
              Add New Role
            </CardTitle>
            <CardDescription>Add a new role to a department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department-select">Select Department</Label>
                <select
                  id="department-select"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onChange={(e) => setSelectedDepartment(departments.find(d => d.id === parseInt(e.target.value)))}
                  value={selectedDepartment ? selectedDepartment.id : ""}
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  placeholder="Enter role name"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddRole} className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={!selectedDepartment}>
              <Plus className="mr-2 h-4 w-4" /> Add Role
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-8 bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center">
            <Users className="mr-2" />
            Departments and Roles
          </CardTitle>
          <CardDescription>Overview of your organization structure</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {departments.map((dept) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 last:mb-0 p-4 bg-purple-50 dark:bg-gray-700 rounded-lg shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300">{dept.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveDepartment(dept.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dept.roles.map((role, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1 text-sm flex items-center gap-1">
                      {role}
                      <button
                        onClick={() => handleRemoveRole(dept.id, role)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}