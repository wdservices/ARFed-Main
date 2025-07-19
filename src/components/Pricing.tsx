import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, Star, Smartphone, Users, Calendar } from "lucide-react";
import { useState } from "react";
import Payment from "./Payment";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";

// Type for the user context
// Place this at the top of the file

type UserContextType = {
  user: any;
  loading: boolean;
  logoutUser: () => void;
  setUser: (user: any) => void;
  fetchUser: (firebaseUser: any) => Promise<void>;
};

const Pricing = () => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const router = useRouter();
  const userContext = useUser() as UserContextType;
  const user = userContext.user;

  const handlePlanSelect = (plan) => {
    if (!user) {
      router.push("/login?from=landing-payment");
      return;
    }
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  const plans = [
    // Daily Plan for NGN only
    {
      id: "daily",
      name: "Daily Plan",
      price: "₦250",
      usdPrice: "$1",
      period: "/day",
      description: "All access to premium AR lessons & AI tutoring for one day.",
      features: [
        "Unlimited AR lessons",
        "Advanced AI chat tutor",
        "Progress tracking"
      ],
      icon: <Smartphone className="text-purple-500" size={24} />,
      popular: false,
      cta: "Choose Daily Plan",
      amount: 250,
      planId: 142602
    },
    {
      id: "weekly",
      name: "Weekly Plan",
      price: "₦1,255",
      usdPrice: "$2.99",
      period: "/week",
      description: "All access to premium AR lessons & AI tutoring for one week.",
      features: [
        "Unlimited AR lessons",
        "Advanced AI chat tutor",
        "Progress tracking",
        "Priority support"
      ],
      icon: <Smartphone className="text-purple-500" size={24} />,
      popular: false,
      cta: "Choose Weekly Plan",
      amount: 1255,
      planId: 143776
    },
    {
      id: "monthly",
      name: "Monthly Plan",
      price: "₦10,500",
      usdPrice: "$7.99",
      period: "/month",
      description: "Unlimited AR, AI-chat help for monthly access.",
      features: [
        "Unlimited AR lessons",
        "Advanced AI chat tutor",
        "Progress tracking",
        "Priority support",
        "Custom lesson plans"
      ],
      icon: <Smartphone className="text-purple-500" size={24} />,
      popular: true,
      cta: "Choose Monthly Plan",
      discount: "Most popular choice!",
      amount: 10500,
      planId: 142599
    },
    {
      id: "termly",
      name: "Termly Plan",
      price: "₦31,000",
      usdPrice: "$20.99",
      period: "/3 months",
      description: "Complete access for a full school term with great value.",
      features: [
        "Unlimited AR lessons",
        "Advanced AI chat tutor",
        "Progress tracking",
        "Priority support",
        "Custom lesson plans",
        "Advanced analytics"
      ],
      icon: <Calendar className="text-purple-500" size={24} />,
      popular: false,
      cta: "Choose Termly Plan",
      amount: 31000,
      planId: 142601
    },
    {
      id: "yearly",
      name: "Yearly Plan",
      price: "₦126,000", 
      usdPrice: "$95",
      period: "/year",
      description: "All-access for a full year with significant savings.",
      features: [
        "Everything in Monthly Plan",
        "2 months free (save 17%)",
        "Custom lesson plans",
        "Advanced analytics",
        "Dedicated support",
        "Early access to new features"
      ],
      icon: <Users className="text-cyan-500" size={24} />,
      popular: false,
      cta: "Choose Yearly Plan",
      amount: 126000,
      planId: 142600
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Learning Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select a plan that works for you. Special launch pricing available now!
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative overflow-hidden ${plan.popular ? 'ring-2 ring-purple-500 shadow-2xl scale-105' : 'shadow-lg'} transition-all duration-300 hover:shadow-xl`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-2">
                  {plan.price}
                  <span className="text-lg font-medium text-gray-500 ml-1">{plan.period}</span>
                </div>
                <div className="text-lg font-medium text-gray-600">
                  {plan.usdPrice}
                </div>
                <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                {plan.discount && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium px-3 py-1 rounded-full mt-2 inline-block">
                    {plan.discount}
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-4">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full ${plan.popular 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                    : 'bg-gray-900 hover:bg-gray-800'
                  } text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ready to transform your classroom? Contact us for custom enterprise solutions.
          </p>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
            onClick={() => router.push('/book-demo')}
          >
            Book a Demo
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <Payment 
        open={isPaymentOpen} 
        closeModal={() => setIsPaymentOpen(false)} 
        user={selectedPlan}
        refreshUser={() => {}}
      />
    </section>
  );
};

export default Pricing;
