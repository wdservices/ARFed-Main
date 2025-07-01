
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, Play, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Stay Ahead of the Curve
          </h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Subscribe for exclusive AR lesson drops, pro-tips from educators, and Play Store launch alerts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-pink-400"
            />
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 whitespace-nowrap">
              <Mail className="mr-2" size={16} />
              Subscribe
            </Button>
          </div>
        </div>

        {/* App Download */}
        <div className="text-center mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
            <Play className="mx-auto mb-4 text-green-400" size={48} />
            <h4 className="text-xl font-semibold mb-2">Download on Google Play</h4>
            <p className="text-purple-100 text-sm mb-4">Get the full ARFed experience on your mobile device</p>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 w-full">
              Download App
            </Button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-xl font-bold mb-4 text-pink-400">ARFed</h4>
            <p className="text-purple-100 text-sm leading-relaxed">
              Making education fun through immersive AR experiences and AI-powered learning.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4 text-cyan-400">Product</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">AR Models</a></li>
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">AI Tutor</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4 text-cyan-400">Education</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">For Teachers</a></li>
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">For Students</a></li>
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Lesson Plans</a></li>
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Research</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4 text-cyan-400">Support</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-purple-100 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-purple-100 text-sm mb-4 md:mb-0">
            © 2024 ARFed. All rights reserved. Making education fun, one AR experience at a time.
          </p>
          
          <div className="flex space-x-4">
            <a href="#" className="text-purple-100 hover:text-pink-400 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-purple-100 hover:text-pink-400 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-purple-100 hover:text-pink-400 transition-colors">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
