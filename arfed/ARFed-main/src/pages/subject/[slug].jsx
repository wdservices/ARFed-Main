import React, { useEffect, useState } from "react";
// Removed Nav component
// import Nav from "../../components/MobileNav";
// Removed ModelCard import as it seems the card is built directly in this file
// import ModelCard from "../../components/modelCard";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/Layout"; 
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { FaCrown, FaMicrophone, FaArrowLeft, FaComment } from "react-icons/fa"; 
import { Modal } from 'antd'; // Import Modal from antd
import { useRef } from 'react';

const SingleSubject = () => {
  const token = getCookie("token");
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const id = getCookie("id");
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [currentModel, setCurrentModel] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const url = router.query.slug;
    if (!url) {
      setLoading(false);
      return;
    }

    // Fetch models for the subject
    axios
      .get(`https://arfed-api.onrender.com/api/subject/${url}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      })
      .then((response) => {
        const modelsData = response.data || [];
        setModels(modelsData);
        setLoading(false);
        
        if (modelsData.length > 0) {
          const modelData = modelsData[0];
          setCurrentModel(modelData);
          if (modelData.quizQuestions) {
            setQuizQuestions(modelData.quizQuestions);
          }
        }
      })
      .catch(error => {
        console.error("Error fetching models:", error);
        setLoading(false);
      });

    // Fetch user info
    if (id && token) {
      axios.get(`https://arfed-api.onrender.com/api/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      }).then((response) => {
        setUser(response.data[0]);
      }).catch(error => {
        console.error("Error fetching user info:", error);
      });
    }
  }, [router.query.slug, token, id]);

  // Handle quiz input change
  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answer });
  };

  // Calculate and submit quiz score
  const submitQuiz = async () => {
    let score = 0;
    // Basic scoring logic: +1 for each correct answer
    quizQuestions.forEach((question, index) => {
      // This scoring assumes a simple text match. Adjust based on actual quiz structure.
      if (userAnswers[index]?.toLowerCase() === question.correctAnswer.toLowerCase()) {
        score++;
      }
    });
    setQuizScore(score);

    // Placeholder for sending score to backend
    if (user && currentModel) {
      try {
        await axios.post('https://arfed-api.onrender.com/api/quiz-results', { // Hypothetical endpoint
          userId: user._id,
          modelId: currentModel._id,
          score: score,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });
        console.log('Quiz score submitted successfully');
        // Optionally show a success message
      } catch (error) {
        console.error('Error submitting quiz score:', error);
        // Optionally show an error message
      }
    }

    // Close quiz modal after submission (or keep open to show results)
    // For now, let's close it and maybe show a score summary in the modal or a toast.
    // setQuizOpen(false);
  };

  // Handle modal close
  const handleQuizModalClose = () => {
      // If quiz was submitted, navigate away. Otherwise, maybe confirm exit.
      if (quizScore !== null) {
           setQuizOpen(false);
           router.back(); // Navigate back after quiz is done
      } else {
          // User is closing the quiz without submitting. Ask for confirmation?
          // For now, just close the modal and don't navigate.
          setQuizOpen(false);
      }
  };

  // Handle case where models are not loaded or an error occurred
  if (!loading && models.length === 0) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] overflow-hidden flex flex-col items-center justify-center text-white">
         <Head>
           <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js"></script>
           <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js"></script>
           <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm"></script>
         </Head>
        <p className="text-black dark:text-white">No models found for this subject or an error occurred.</p> 
      </div>
    );
  }

  return (
    // Re-wrapped with Layout component
    <Layout>
      {/* Applied gradient background to the main container */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] overflow-hidden">
        <Head>
          <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js"></script>
          <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js"></script>
          <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm"></script>
        </Head>

        {/* Fixed Header: Back Button, Subject Title, and Microphone Icon */}
        <div className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-white/20 backdrop-blur-lg border-b border-white/30">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white font-semibold hover:text-gray-200 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        {/* Main Content Area (starts below fixed header) */}
        <main className="pt-16 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="flex justify-center mt-8">
                <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              models.map((model, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/${model._id}`)} // Link to the individual model page
                  className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center p-4 group border border-gray-200 dark:border-gray-700"
                >
                  {/* Premium Crown Badge */}
                  {/* Assuming model data has a property like isPremium */}
                  {/* You might need to adjust this condition based on your actual data structure and logic */}
                  {model.isPremium && user?.plan !== "premium" && (
                     <span className="absolute top-3 left-3 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow">
                       <FaCrown className="text-white" /> Premium
                     </span>
                  )}
                  <div className="pt-4 flex flex-col items-center">
                    <img
                      src={model.image}
                      alt={model.title}
                      className="w-20 h-20 object-contain mb-4 drop-shadow-lg"
                    />
                    <div className="font-bold text-lg capitalize text-gray-900 dark:text-gray-900 text-center mb-2">
                      {model.title}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Add some padding at the bottom to ensure content isn't hidden by the chathead */}
          <div className="h-20"></div>

        </main>

        {/* Chathead Button Fixed Bottom Right */}
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-4 right-4 p-4 bg-black border border-white rounded-full text-white hover:bg-gray-900 transition-colors shadow-lg z-50"
          aria-label="Open AI Chat"
        >
          <FaComment className="text-2xl" />
        </button>

        {/* Chat Modal */}
        <Modal
          title="AI Chatbot"
          centered
          open={chatOpen}
          onCancel={() => setChatOpen(false)}
          footer={[]}
        >
          <div className="p-4">
            <p className="text-gray-800">AI Chat Interface goes here...</p>
          </div>
        </Modal>

        {/* Quiz Modal (Placeholder) */}
        {/* This modal is a placeholder for the quiz functionality */}
        {/* The actual quiz UI and logic would need to be implemented here or in a separate component */}
         <Modal
          title="Quick Quiz!"
          centered
          open={quizOpen}
          onCancel={handleQuizModalClose} // Use the new handler
          footer={[]}
        >
           {/* Quiz content goes here */}
           {quizScore !== null ? (
               <div>
                   <h2 className="text-xl font-bold mb-4">Your Score: {quizScore} / {quizQuestions.length}</h2>
                   {/* Display results or feedback */}
               </div>
           ) : (
               <div>
                   {quizQuestions.map((question, index) => (
                       <div key={index} className="mb-4">
                           <p className="font-semibold text-gray-800 mb-2">{question.question}</p>
                           {/* Assuming answer options are provided, render them as radio buttons or similar */}
                           {/* For simplicity, using a text input for now. Adapt based on actual question structure. */}
                           <input
                              type="text"
                              value={userAnswers[index] || ''}
                              onChange={(e) => handleAnswerChange(index, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white" // Ensure input fields are visible
                           />
                           {/* Add feedback based on userAnswers and correctAnswers after submission */}
                       </div>
                   ))}
                   <button
                       onClick={submitQuiz}
                       className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                   >
                       Submit Quiz
                   </button>
               </div>
           )}
        </Modal>

      </div>
    </Layout>
  );
};

export default SingleSubject;
