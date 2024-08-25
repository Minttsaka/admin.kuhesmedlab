"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  role: z.enum(["lab_technician", "researcher", "manager", "admin"]),
  department: z.string().min(2, "Department must be at least 2 characters"),
  certifications: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  emergencyContact: z.string().min(2, "Emergency contact must be at least 2 characters"),
  emergencyPhone: z.string().regex(/^\d{10}$/, "Emergency phone must be 10 digits"),
  bio: z.string().max(500, "Bio must not exceed 500 characters"),
  isFullTime: z.boolean(),
})

export default function AddMember() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "lab_technician",
      department: "",
      certifications: "",
      startDate: "",
      emergencyContact: "",
      emergencyPhone: "",
      bio: "",
      isFullTime: true,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log(values)
      toast({
        title: "Team member added successfully",
        description: `${values.firstName} ${values.lastName} has been added to the team.`,
      })
      setIsSubmitting(false)
      form.reset()
    }, 2000)
  }

  return (
    <div className="bg-gray-100 p-6">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white shadow rounded-md p-6">
            <div className="space-y-2">
            <h2 className="text-2xl font-bold">Add New Team Member</h2>
            <p className="text-muted-foreground">Enter the details of the new team member below.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
            <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                    <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                    <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                    <Input type="tel" placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="lab_technician">Lab Technician</SelectItem>
                        <SelectItem value="researcher">Researcher</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                    <Input placeholder="Microbiology" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Certifications</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., ASCP, CLIA" {...field} />
                </FormControl>
                <FormDescription>Enter any relevant certifications, separated by commas.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
            <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                    <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="isFullTime"
                render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                    <FormLabel>Full-time Employee</FormLabel>
                    <FormDescription>
                        Is this team member a full-time employee?
                    </FormDescription>
                    </div>
                </FormItem>
                )}
            />
            </div>

            <div className="space-y-2">
            <h3 className="text-lg font-semibold">Emergency Contact</h3>
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                        <Input type="tel" placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            </div>

            <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Brief description of the team member's background and expertise..."
                    className="resize-none"
                    {...field}
                    />
                </FormControl>
                <FormDescription>
                    Provide a short bio for the team member (max 500 characters).
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Team Member"}
            </Button>
        </form>
        </Form>
    </div>
  )
}