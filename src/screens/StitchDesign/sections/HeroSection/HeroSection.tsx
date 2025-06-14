import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../components/ui/navigation-menu";
import { useAuth } from "../../../../contexts/AuthContext";

export const HeroSection = (): JSX.Element => {
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items data
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-10 py-3 bg-[#0f1419] border-b border-[#1e282d] w-full relative">
      {/* Logo section */}
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href = '/'}>
        <div className="flex items-start">
          <div className="w-4 h-4 bg-[url(/vector---0.svg)] bg-[100%_100%]" />
        </div>
        <div className="flex items-start">
          <h1 className="font-bold text-white text-lg leading-[23px] font-['Lexend',Helvetica]">
            EduGenius
          </h1>
        </div>
      </div>

      {/* Desktop Navigation and CTA section */}
      <div className="hidden lg:flex items-center justify-end gap-8 flex-1">
        <NavigationMenu>
          <NavigationMenuList className="gap-9">
            {navItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  className="font-medium text-white text-sm leading-[21px] font-['Lexend',Helvetica] hover:text-[#3f8cbf] transition-colors"
                  href={item.href}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Auth Buttons */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#3f8cbf] border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-['Lexend',Helvetica] hidden xl:block">
                Welcome back!
              </span>
              <Button 
                className="min-w-[70px] h-10 px-4 py-0 bg-transparent border border-[#3f8cbf] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white rounded-[20px] font-bold text-sm font-['Lexend',Helvetica] transition-colors"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button 
                className="min-w-[70px] h-10 px-4 py-0 bg-transparent border border-[#3f8cbf] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white rounded-[20px] font-bold text-sm font-['Lexend',Helvetica] transition-colors"
                onClick={() => window.location.href = '/login'}
              >
                Login
              </Button>
              <Button 
                className="min-w-[84px] h-10 px-4 py-0 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-[20px] font-bold text-white text-sm font-['Lexend',Helvetica] transition-colors"
                onClick={() => window.location.href = '/signup'}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center gap-3">
        {/* Mobile Auth Buttons - Compact */}
        {!loading && !user && (
          <Button 
            className="h-8 px-3 py-0 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-[16px] font-bold text-white text-xs font-['Lexend',Helvetica] transition-colors"
            onClick={() => window.location.href = '/signup'}
          >
            Sign Up
          </Button>
        )}
        
        <button
          onClick={toggleMobileMenu}
          className="flex flex-col justify-center items-center w-8 h-8 space-y-1"
          aria-label="Toggle mobile menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0f1419] border-b border-[#1e282d] z-50">
          <div className="flex flex-col p-4 space-y-4">
            {/* Mobile Navigation */}
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="font-medium text-white text-base leading-6 font-['Lexend',Helvetica] hover:text-[#3f8cbf] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-[#1e282d]">
              {loading ? (
                <div className="flex justify-center">
                  <div className="w-4 h-4 border-2 border-[#3f8cbf] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="flex flex-col gap-3">
                  <span className="text-white text-sm font-['Lexend',Helvetica] text-center">
                    Welcome back!
                  </span>
                  <Button 
                    className="w-full h-10 bg-transparent border border-[#3f8cbf] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white rounded-[20px] font-bold text-sm font-['Lexend',Helvetica] transition-colors"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full h-10 bg-transparent border border-[#3f8cbf] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white rounded-[20px] font-bold text-sm font-['Lexend',Helvetica] transition-colors"
                    onClick={() => {
                      window.location.href = '/login';
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    className="w-full h-10 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-[20px] font-bold text-white text-sm font-['Lexend',Helvetica] transition-colors"
                    onClick={() => {
                      window.location.href = '/signup';
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};