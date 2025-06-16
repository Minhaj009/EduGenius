import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get current page from URL
  const currentPath = window.location.pathname;

  const navigationItems = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: "📊",
      active: currentPath === "/dashboard"
    },
    { 
      name: "AI Tutor", 
      href: "/dashboard/ai-tutor", 
      icon: "🤖",
      active: currentPath === "/dashboard/ai-tutor"
    },
    { 
      name: "Progress", 
      href: "/dashboard/progress", 
      icon: "📈",
      active: currentPath === "/dashboard/progress"
    },
    { 
      name: "Study Materials", 
      href: "/dashboard/materials", 
      icon: "📚",
      active: currentPath === "/dashboard/materials"
    },
    { 
      name: "Tests & Quizzes", 
      href: "/dashboard/tests", 
      icon: "📝",
      active: currentPath === "/dashboard/tests"
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Get page title based on current path
  const getPageTitle = () => {
    const item = navigationItems.find(item => item.active);
    if (currentPath === "/dashboard/settings") return "Settings";
    return item ? item.name : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e282d] border-r border-[#3d4f5b] transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#3d4f5b] cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
          <div className="w-6 h-6 bg-[#3f8cbf] rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg">
            MyEduPro
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-[#3f8cbf] text-white'
                      : 'text-[#9eafbf] hover:bg-[#2a3540] hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="[font-family:'Lexend',Helvetica] font-medium text-sm">
                    {item.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section: User Profile, Settings, and Sign Out */}
        <div className="border-t border-[#3d4f5b]">
          {/* Settings */}
          <div className="px-4 py-2">
            <a
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentPath === "/dashboard/settings"
                  ? 'bg-[#3f8cbf] text-white'
                  : 'text-[#9eafbf] hover:bg-[#2a3540] hover:text-white'
              }`}
            >
              <span className="text-lg">⚙️</span>
              <span className="[font-family:'Lexend',Helvetica] font-medium text-sm">
                Settings
              </span>
            </a>
          </div>

          {/* User Profile */}
          <div className="px-6 py-4 border-t border-[#3d4f5b]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3f8cbf] rounded-full flex items-center justify-center overflow-hidden">
                {profile?.profile_picture_url ? (
                  <img 
                    src={profile.profile_picture_url} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm [font-family:'Lexend',Helvetica]">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm [font-family:'Lexend',Helvetica] truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica] truncate">
                  {profile?.grade || 'Complete your profile'}
                </p>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="p-4">
            <Button
              onClick={handleSignOut}
              className="w-full bg-transparent border border-[#3d4f5b] text-[#9eafbf] hover:bg-[#2a3540] hover:text-white rounded-lg [font-family:'Lexend',Helvetica] font-medium text-sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="bg-[#1e282d] border-b border-[#3d4f5b] px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-8 h-8 text-white"
            >
              <div className="space-y-1">
                <span className="block w-5 h-0.5 bg-white"></span>
                <span className="block w-5 h-0.5 bg-white"></span>
                <span className="block w-5 h-0.5 bg-white"></span>
              </div>
            </button>

            {/* Page Title */}
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl lg:text-2xl">
              {getPageTitle()}
            </h1>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button 
                className="hidden sm:flex bg-[#3f8cbf] hover:bg-[#2d6a94] text-white rounded-lg px-4 py-2 [font-family:'Lexend',Helvetica] font-medium text-sm"
                onClick={() => window.location.href = '/dashboard/ai-tutor'}
              >
                Ask AI Tutor
              </Button>
              <div className="w-8 h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center overflow-hidden">
                {profile?.profile_picture_url ? (
                  <img 
                    src={profile.profile_picture_url} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xs font-bold">
                    {profile?.first_name?.[0] || 'U'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};