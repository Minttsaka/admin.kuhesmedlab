"use client"

import react, { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SigninForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => setLoginSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [loginSuccess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setLoginSuccess(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-white mb-8">KUHESMEDLAB</h2>
            <div className="space-y-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 text-white placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                isLoading ? 'animate-pulse' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transform origin-left scale-x-0 transition-transform duration-500 ease-out login-progress"></div>
        </form>
        {loginSuccess && (
          <div className="mt-4 p-4 bg-green-500 bg-opacity-90 text-white rounded-lg shadow-lg animate-fade-in-down">
            Login successful! Welcome, Admin.
          </div>
        )}
      </div>
    </div>
  )
}