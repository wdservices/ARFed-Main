import React, { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { FaRobot } from "react-icons/fa";
import router from "next/router";
import Image from "next/image";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-purple-900/80 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/arfed.png" alt="ARFed Logo" width={40} height={40} className="rounded-lg" />
            <span className="text-white font-bold text-2xl">ARFed</span>
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a onClick={() => scrollToSection('home')} className="text-white hover:text-cyan-300 transition-colors cursor-pointer">Home</a>
            <a onClick={() => scrollToSection('features')} className="text-white hover:text-cyan-300 transition-colors cursor-pointer">Features</a>
            <a onClick={() => scrollToSection('pricing')} className="text-white hover:text-cyan-300 transition-colors cursor-pointer">Pricing</a>
            <a onClick={() => scrollToSection('education')} className="text-white hover:text-cyan-300 transition-colors cursor-pointer">About Us</a>
            <a onClick={() => scrollToSection('contact')} className="text-white hover:text-cyan-300 transition-colors cursor-pointer">Contact Us</a>
            <a onClick={() => scrollToSection('pricing')} className="text-white hover:text-cyan-300 transition-colors cursor-pointer">Book a Demo</a>
            <Button 
              variant="ghost" 
              className="w-10 h-10 rounded-full bg-[#39F9CD] hover:bg-[#2EE6B8] text-white flex items-center justify-center"
              onClick={() => {
                const chatButton = document.querySelector('.floating-chat-button');
                if (chatButton) {
                  (chatButton as HTMLElement).click();
                }
              }}
            >
              <FaRobot className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => router.push('/login')} className="hidden md:flex border border-white text-purple-900 bg-white hover:bg-white/80">
            Login
          </Button>
        </div>
        
        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-purple-800/95 backdrop-blur-sm mt-4 py-4 px-2 rounded-lg">
            <div className="flex flex-col space-y-3">
              <a onClick={() => scrollToSection('home')} className="text-white hover:text-cyan-300 transition-colors px-3 py-2 cursor-pointer">Home</a>
              <a onClick={() => scrollToSection('features')} className="text-white hover:text-cyan-300 transition-colors px-3 py-2 cursor-pointer">Features</a>
              <a onClick={() => scrollToSection('pricing')} className="text-white hover:text-cyan-300 transition-colors px-3 py-2 cursor-pointer">Pricing</a>
              <a onClick={() => scrollToSection('education')} className="text-white hover:text-cyan-300 transition-colors px-3 py-2 cursor-pointer">About Us</a>
              <a onClick={() => scrollToSection('contact')} className="text-white hover:text-cyan-300 transition-colors px-3 py-2 cursor-pointer">Contact Us</a>
              <a onClick={() => scrollToSection('pricing')} className="text-white hover:text-cyan-300 transition-colors px-3 py-2 cursor-pointer">Book a Demo</a>
              <Button 
                variant="ghost" 
                className="w-10 h-10 rounded-full bg-[#39F9CD] hover:bg-[#2EE6B8] text-white flex items-center justify-center mx-auto"
                onClick={() => {
                  const chatButton = document.querySelector('.floating-chat-button');
                  if (chatButton) {
                    (chatButton as HTMLElement).click();
                  }
                }}
              >
                <FaRobot className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={() => router.push('/login')} className="border border-white text-purple-900 bg-white hover:bg-white/80 w-full">
                Login
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
