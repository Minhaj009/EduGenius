import React, { useState } from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const LoginPage = (): JSX.Element => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Login form submitted:', formData);
  };

  return (
    <main className="flex flex-col w-full bg-[#0f1419] min-h-screen">
      <HeroSection />
      
      <section className="flex items-center justify-center px-4 md:px-10 py-20 w-full bg-[#0f1419] min-h-[calc(100vh-80px)]">
        <div className="flex flex-col max-w-[420px] w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="[font-family:'Lexend',Helvetica] font-black text-white text-3xl md:text-4xl tracking-[-1.00px] leading-[1.1] mb-4">
              Welcome Back
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-base tracking-[0] leading-6">
              Sign in to continue your learning journey with EduGenius
            </p>
          </div>

          {/* Login Form */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica]"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica]"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 bg-[#0f1419] border border-[#3d4f5b] rounded focus:border-[#3f8cbf] focus:outline-none"
                    />
                    <label className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-sm">
                      Remember me
                    </label>
                  </div>
                  <a 
                    href="/forgot-password" 
                    className="[font-family:'Lexend',Helvetica] font-medium text-[#3f8cbf] text-sm hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full h-12 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-lg [font-family:'Lexend',Helvetica] font-bold text-white transition-colors"
                >
                  Sign In
                </Button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-sm">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-[#3f8cbf] hover:underline font-medium">
                      Create Account
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3d4f5b]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#0f1419] text-[#9eafbf] [font-family:'Lexend',Helvetica]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                className="w-full h-12 bg-[#1e282d] border border-[#3d4f5b] hover:bg-[#2a3540] rounded-lg [font-family:'Lexend',Helvetica] font-medium text-white transition-colors"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 bg-white rounded-full" />
                  Google
                </div>
              </Button>
              <Button
                type="button"
                className="w-full h-12 bg-[#1e282d] border border-[#3d4f5b] hover:bg-[#2a3540] rounded-lg [font-family:'Lexend',Helvetica] font-medium text-white transition-colors"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 bg-[#1877f2] rounded-full" />
                  Facebook
                </div>
              </Button>
            </div>
          </div>

          {/* Quick Access */}
          <div className="mt-8 text-center">
            <p className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-4">
              Quick Access
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-xs text-center">
                  Dashboard
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-xs text-center">
                  AI Tutor
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-xs text-center">
                  Progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};