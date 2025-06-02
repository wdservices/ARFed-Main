
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Atom, Globe, Microscope, Zap, Brain, Smartphone, Plus } from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      icon: <Brain className="text-pink-500" size={48} />,
      title: "AI Chat Tutor",
      description: "Ask our intelligent chatbot anything—get instant explanations, customized study tips, and deeper insights on any topic. Our AI adapts to your learning style and helps you master difficult concepts."
    },
    {
      icon: <Zap className="text-yellow-500" size={48} />,
      title: "3D AR Models",
      description: "Explore lifelike, interactive 3D models that bring abstract concepts to life. Rotate, zoom, and interact with detailed simulations that make learning tangible and memorable."
    },
    {
      icon: <Smartphone className="text-cyan-500" size={48} />,
      title: "Web & Mobile Access",
      description: "Access ARFed from any device with a browser or download our dedicated mobile app for an optimized experience. Learn seamlessly whether you're at home, school, or on the go."
    },
    {
      icon: <Microscope className="text-green-500" size={48} />,
      title: "Biology Exploration",
      description: "Dive into cells, systems, and organisms with incredible detail. Witness biological processes in action and understand complex interactions through intuitive visualizations."
    },
    {
      icon: <Atom className="text-blue-500" size={48} />,
      title: "Physics & Chemistry",
      description: "See atoms bond, forces interact, and chemical reactions unfold before your eyes. Manipulate variables and observe how changes affect outcomes in real-time simulations."
    },
    {
      icon: <Globe className="text-purple-500" size={48} />,
      title: "Geography & Earth Sciences",
      description: "Travel the world, explore geological formations, and understand climate systems through immersive 3D models. Witness geographical processes that normally take millions of years."
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Experience Learning in a New Dimension
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover all the powerful features that make ARFed the future of education
          </p>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-gradient-to-br from-gray-50 to-gray-100">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 p-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-center text-gray-800">
              And Many More Features
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto text-center">
              ARFed continues to expand its content library with new subjects, models, and interactive experiences.
              Our platform evolves with educational needs and technological advancements.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
