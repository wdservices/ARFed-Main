import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] animate-pulse"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                <span className="text-white">ARFed:</span> Making Education Fun
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                <span className="font-semibold text-pink-300">ARFed is revolutionizing learning—one playful moment at a time.</span> Our browser-based platform combines stunning 3D AR visuals with an AI-powered chatbot, so students can <span className="text-yellow-300 font-medium">see</span>, <span className="text-green-300 font-medium">touch</span>, and <span className="text-cyan-300 font-medium">ask questions</span> about any topic—right from their device.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
                <Play className="mr-2" size={20} />
                Download on Google Play
              </Button>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white font-semibold px-8 py-4 rounded-full transition-all duration-200"
                >
                  Sign Up for Web Access
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Video & AR Visualization */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="rounded-2xl shadow-2xl w-full overflow-hidden">
                <iframe 
                  src="https://youtube.com/shorts/28SYOEkB7J8" 
                  allowFullScreen
                  className="w-full aspect-video"
                  title="ARFed Introduction"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
              
              {/* Floating AR elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce">
                3D Biology Cell
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce delay-300">
                AI Tutor Ready
              </div>
            </div>
            
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-3xl blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
