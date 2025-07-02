import React from "react";

const faqs = [
  {
    question: "What is ARFed?",
    answer:
      "ARFed is an educational platform that uses Augmented Reality (AR) and AI to make learning interactive, immersive, and fun for students and teachers.",
  },
  {
    question: "What is Augmented Reality (AR) in education?",
    answer:
      "Augmented Reality overlays digital content onto the real world using your device's camera, allowing students to explore 3D models, interactive lessons, and immersive experiences that make learning more engaging.",
  },
  {
    question: "What devices do I need to use ARFed?",
    answer:
      "You can use ARFed on most modern smartphones, tablets, and desktops. For AR features, use a device and browser that supports WebXR or AR Quick Look (iOS/Safari). No special headsets are required for most experiences.",
  },
  {
    question: "Do I need to download an app to use ARFed?",
    answer:
      "No, ARFed works directly in your web browser. For the best AR experience, use the latest version of Chrome, Safari, or Firefox on a compatible device.",
  },
  {
    question: "Is ARFed free to use?",
    answer:
      "ARFed offers both free and premium content. Many core features are free, while some advanced AR models or lessons may require a subscription or one-time purchase.",
  },
  {
    question: "What subjects are available on ARFed?",
    answer:
      "ARFed covers a wide range of subjects including Science, Mathematics, History, Geography, and more. New content is added regularly to support diverse learning needs.",
  },
  {
    question: "Is my data safe with ARFed?",
    answer:
      "Yes, ARFed follows strict privacy policies and uses secure methods to protect your data. We do not sell your information to third parties. See our Privacy Policy for details.",
  },
  {
    question: "How do I get help if I have a problem?",
    answer:
      "If you need assistance, visit our Help Center or contact us at hello.arfed@gmail.com. Our support team is happy to help!",
  },
  {
    question: "Do I need an internet connection to use ARFed?",
    answer:
      "An internet connection is required to access new content and AR features. Some resources may be available offline after initial loading.",
  },
  {
    question: "What should I do if AR features are not working?",
    answer:
      "Make sure your device and browser support AR, and that camera permissions are enabled. Try restarting your browser or device. If issues persist, contact our support team for help.",
  },
];

const FAQ = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-8">
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg max-w-2xl w-full p-8">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx}>
            <h2 className="text-lg font-semibold text-indigo-100 mb-2">{faq.question}</h2>
            <p className="text-indigo-100">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FAQ; 