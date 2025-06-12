
import { Atom, Globe, Microscope, Plus } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import React from "react";

const EducationAR = () => {
  const subjects = [
    {
      icon: <Microscope className="text-green-500" size={32} />,
      title: "Cell Biology",
      description: "Zoom inside a living cell, turn organelles in your hand, and watch processes unfold in real time.",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <Atom className="text-blue-500" size={32} />,
      title: "Physics & Chemistry",
      description: "Visualize force vectors, molecular bonds, and chemical reactions in 3D—no textbooks required.",
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <Globe className="text-purple-500" size={32} />,
      title: "Geography & Planetary Science",
      description: "Fly over realistic terrain models, inspect volcano interiors, and journey across the solar system.",
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <Plus className="text-pink-500" size={32} />,
      title: "And More",
      description: "Explore mathematics, history, architecture, and countless other subjects in immersive AR.",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            The Future of Learning Is Here
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Augmented Reality transforms abstract ideas into <span className="font-semibold text-purple-600">tangible experiences</span>. 
            Backed by cognitive-science research, ARFed's immersive approach accelerates concept mastery, 
            fosters critical thinking, and makes lifelong learning genuinely <span className="font-semibold text-pink-600">fun</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {subjects.map((subject, index) => (
            <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={subject.image} 
                  alt={subject.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4 p-3 rounded-full bg-white/90 backdrop-blur-sm">
                  {subject.icon}
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">{subject.title}</h3>
                <p className="text-gray-600 leading-relaxed">{subject.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-12 text-white text-center">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">10M+</div>
              <div className="text-cyan-100">AR Interactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-cyan-100">3D Models</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-cyan-100">Student Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-cyan-100">AI Tutor Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationAR;
