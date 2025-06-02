
import { Brain, Eye, Smartphone, Zap, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: <Eye className="text-purple-500" size={32} />,
      title: "Immersive 3D AR Models",
      description: "Explore Biology, Chemistry, Physics, Geography and more through lifelike, pinch-to-zoom simulations that spark curiosity."
    },
    {
      icon: <Brain className="text-pink-500" size={32} />,
      title: "AI Chat Tutor",
      description: "Ask our intelligent chatbot anything—get instant explanations, customized study tips, and deeper insights."
    },
    {
      icon: <Smartphone className="text-cyan-500" size={32} />,
      title: "Seamless Web & Mobile",
      description: "Launch in your browser today; download our Android app from Google Play tomorrow—perfect for students on the move."
    }
  ];

  const benefits = [
    {
      icon: <Zap className="text-yellow-500" size={24} />,
      title: "Boosts Comprehension",
      stat: "75%",
      description: "Interactive AR lessons increase concept mastery by up to 75%."
    },
    {
      icon: <BookOpen className="text-green-500" size={24} />,
      title: "Improves Retention",
      stat: "90%",
      description: "Experiential learning helps students retain far more than passive reading—up to 90%."
    },
    {
      icon: <Users className="text-blue-500" size={24} />,
      title: "Inspires Engagement",
      stat: "∞",
      description: "Gamified AR challenges and instant AI Q&A keep learners motivated and on track."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Key Features */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Key Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of education with our revolutionary AR and AI-powered learning platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why ARFed Works */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why ARFed Works</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Backed by cognitive science research, our approach delivers measurable results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                    {benefit.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {benefit.stat}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-purple-100 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
