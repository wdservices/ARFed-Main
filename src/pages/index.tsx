import Hero from "../components/Hero";
import Features from "../components/Features";
import EducationAR from "../components/EducationAR";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import FloatingChat from "../components/FloatingChat";
import React from "react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div id="home">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="education">
        <EducationAR />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="contact">
        <Footer />
      </div>
      <FloatingChat />
    </div>
  );
};

export default Index;
