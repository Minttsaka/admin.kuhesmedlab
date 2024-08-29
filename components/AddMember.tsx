"use client"

import { useEffect, useState } from "react"
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
import { Institution, Prisma, Roles } from "@prisma/client"
import { countries } from 'countries-list'
import { Label } from "./ui/label"
import { addMember } from "@/lib/actions"


export type DepType = Prisma.DepartmentGetPayload<{
    include: {
      role:true
    };
  }>;

  const countryOptions = Object.entries(countries).map(([code, country]) => ({
    value: code,
    label: country.name
  }))

const formSchema = z.object({
  name: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["MALE", "FEMALE"]),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  authority: z.string().min(2, "Role must be at least 2 characters"),
  country: z.string().min(2, "country must be at least 2 characters"),
  institution:  z.string().min(2, "country must be at least 2 characters"),
  age: z.string()})

export default function AddMember({
    dep,
    institutions
}:{
    dep:DepType[],
    institutions:Institution[]
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string>()
  const [requiredRoles, setrequiredRoles]=useState<Roles[]>()

  useEffect(()=>{
    const reqDep = dep.find(de=>de.id===selectedDepartment)
    setrequiredRoles(reqDep?.role)
  },[selectedDepartment])


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      institution:"",
      age:"",
      authority: "",
      country: "",

    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulate API call
    await addMember(selectedDepartment!, values)
      setIsSubmitting(false)
      form.reset()
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
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                    <Input placeholder="miracle tsaka" {...field} />
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
            {/* <FormField
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
            /> */}
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
                name="country"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a Country" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {countryOptions.map(country=>(
                            <SelectItem  key={country.label} value={country.label}>{country.label}</SelectItem>
                        ))} 
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a Gender" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="MALE">male</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 items-center">
                <div>
                    <Label>Department</Label>
                    <Select onValueChange={(e)=>{setSelectedDepartment(e)}} defaultValue={selectedDepartment}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {dep?.map(dept=>(
                            <SelectItem  key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))} 
                    </SelectContent>
                    </Select>
                </div>

            <FormField
                control={form.control}
                name="authority"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>authority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a authority" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {requiredRoles?.map(authority=>(
                            <SelectItem  key={authority.id} value={authority.name}>{authority.name}</SelectItem>
                        ))} 
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            {/* <FormField
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
            /> */}

            <div className="grid gap-4 sm:grid-cols-2">
            {/* <FormField
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
            /> */}
            {/* <FormField
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
            /> */}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
            <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>institution</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.name}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a institution" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {institutions?.map(institution=>(
                            <SelectItem  key={institution.id} value={institution.id}>{institution.name}</SelectItem>
                        ))} 
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                        <Input type="tel" placeholder="18+" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            {/* <FormField
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
            /> */}
            </div>

            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Team Member"}
            </Button>
        </form>
        </Form>
    </div>
  )
}