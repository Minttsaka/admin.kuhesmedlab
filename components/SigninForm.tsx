"use client"

import react, { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn, useSession } from "next-auth/react"
import { toast } from "./ui/use-toast"
import { LoadingState } from './LoadingState'


const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string({
    required_error: "Please enter your password",
  }),
});

type InputType = z.infer<typeof FormSchema>;


export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const router=useRouter()

  const {data:session , status, } =useSession()

  if (status ==="loading") {
    LoadingState()
  }

  if (status === "authenticated") {
    router.push("/a/dashboard");
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting ,isSubmitted},
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: data.email,
        password: data.password,
      });
      if (!result?.ok) {
        toast({
          title: "error",
          description: result?.error,
          variant: "destructive",
        })
        console.log(result?.error)
        return;
      }

      if(result.ok){
        toast({
          title: "Success",
          description: "Success",
          variant:"default",
        })
        setLoginSuccess(true)
        router.push("/a/dashboard")
      }
     
  
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description:"error",
          variant: "destructive",
        })
      }
      
    }
   
    
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-white mb-8">KUHESMEDLAB</h2>
            <div className="space-y-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Username"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 text-white placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...register("password")}
                  className="w-full pl-10 pr-12 py-3 bg-white bg-opacity-20 text-white placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className={`w-full mt-8 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition duration-300 ${
                isSubmitting ? 'animate-pulse' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transform origin-left scale-x-0 transition-transform duration-500 ease-out login-progress"></div>
        </form>
       
      </div>
    </div>
  )
}