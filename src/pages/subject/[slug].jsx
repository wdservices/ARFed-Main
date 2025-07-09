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
import { FaCrown, FaMicrophone, FaArrowLeft, FaSearch } from "react-icons/fa"; 
import { Modal } from 'antd'; // Import Modal from antd
import { useRef } from 'react';
import FloatingChat from "../../components/FloatingChat";
import { useIsMobile } from "../../hooks/use-mobile";
import { motion } from "framer-motion";

const SingleSubject = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizScore, setQuizScore] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentModel, setCurrentModel] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);

  const token = getCookie("token");
  const id = getCookie("id");

  const validPaidPlans = ["daily", "weekly", "monthly", "termly", "yearly", "premium"];

  // Device check: if not mobile and not admin, redirect to /UseMobile
  useEffect(() => {
    if (user && user.role !== "admin" && isMobile === false) {
      router.replace("/UseMobile");
    }
  }, [user, isMobile, router]);

  useEffect(() => {
    const url = router.query.slug;
    if (!url || typeof url !== 'string' || url.trim() === '') {
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
        if (error.response) {
          console.error("API response error:", error.response.data, error.response.status, error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
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

  // Add a click-away listener to close the search input when clicking outside
  useEffect(() => {
    if (!showSearch) return;
    function handleClick(e) {
      if (searchInputRef.current && !searchInputRef.current.parentNode.contains(e.target)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSearch]);

  return (
    // Re-wrapped with Layout component
    <Layout>
      {/* Applied gradient background to the main container */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] overflow-hidden">
        {(!loading && models.length === 0) ? (
          <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <Head>
              <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js"></script>
              <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js"></script>
              <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm"></script>
            </Head>
            <p className="text-white">No models found for this subject or an error occurred.</p>
          </div>
        ) : (
          <>
            {/* Decorative background elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-400 opacity-30 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-200 opacity-20 rounded-full blur-2xl animate-pulse" style={{transform: 'translate(-50%, -50%)'}} />
            
            <Head>
              <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js"></script>
              <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js"></script>
              <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm"></script>
            </Head>

            {/* Fixed Header: Back Button, Subject Title, and Microphone Icon */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white/10 backdrop-blur-lg border-b border-white/20">
              <button
                onClick={() => router.back()}
                className="flex items-center text-white font-semibold hover:text-white/80 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
              <div className="flex items-center gap-4">
                {/* Search Icon */}
                <button
                  onClick={() => {
                    setShowSearch((v) => !v);
                    setTimeout(() => {
                      if (searchInputRef.current) searchInputRef.current.focus();
                    }, 100);
                  }}
                  className="text-white hover:text-cyan-300 transition-colors text-xl"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </div>
              {/* Pop-out Search Input */}
              {showSearch && (
                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-full max-w-md px-4">
                  <div className="flex items-center bg-white/20 rounded-full px-4 py-2 shadow-lg animate-fade-in">
                    <FaSearch className="text-white/80 mr-2" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search models..."
                      className="bg-transparent outline-none text-white placeholder-white/60 flex-1"
                    />
                    <button onClick={() => setShowSearch(false)} className="ml-2 text-white/60 hover:text-white">✕</button>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area (starts below fixed header) */}
            <main className="pt-16 p-4 overflow-y-auto">
              <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Explore Models
                  </h2>
                  <p className="text-white/80 text-lg max-w-2xl mx-auto">
                    Discover interactive 3D models and AR experiences for this subject.
                  </p>
                </motion.div>

                {/* Models Grid */}
                <div className="max-w-6xl mx-auto">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {models.filter(model => model.title.toLowerCase().includes(search.toLowerCase())).map((model, index) => {
                        // Calculate margins for first and last card in each row
                        const isFirstInRow = (index % 2 === 0);
                        const isLastInRowMd = ((index + 1) % 2 === 0);
                        const isFirstInRowLg = (index % 3 === 0);
                        const isLastInRowLg = ((index + 1) % 3 === 0);
                        const isFirstInRowXl = (index % 4 === 0);
                        const isLastInRowXl = ((index + 1) % 4 === 0);
                        let marginClass = '';
                        if (isFirstInRow) marginClass += ' md:ml-4';
                        if (isLastInRowMd) marginClass += ' md:mr-4';
                        if (isFirstInRowLg) marginClass += ' lg:ml-4';
                        if (isLastInRowLg) marginClass += ' lg:mr-4';
                        if (isFirstInRowXl) marginClass += ' xl:ml-4';
                        if (isLastInRowXl) marginClass += ' xl:mr-4';
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ 
                              scale: 1.05,
                              y: -8,
                              transition: { duration: 0.2 }
                            }}
                            onClick={() => router.push(`/${model._id}`)}
                            className={`group cursor-pointer${marginClass}`}
                          >
                            <div className="relative bg-white/15 backdrop-blur-lg rounded-2xl p-3 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 hover:border-white/30">
                              {/* Premium Crown Badge */}
                              {model.isPremium && !validPaidPlans.includes(user?.plan) && (
                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg z-10">
                                  <FaCrown className="text-white" size={10} />
                                  Premium
                                </div>
                              )}
                              {/* Image Container with Bezel */}
                              <div className="relative mb-2">
                                <div className="w-full h-40 bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-1 shadow-inner">
                                  <div className="w-full h-full bg-white/10 rounded-lg flex items-center justify-center">
                                    <img
                                      src={model.image}
                                      alt={model.title}
                                      className="w-24 h-24 object-contain drop-shadow-lg"
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* Model Title */}
                              <div className="text-center">
                                <h3 className="font-bold text-xs text-white capitalize mb-2 group-hover:text-white/90 transition-colors line-clamp-2">
                                  {model.title}
                                </h3>
                                <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </main>

            {/* Quiz Modal */}
            <Modal
              title="Quiz"
              open={quizOpen}
              onCancel={handleQuizModalClose}
              footer={null}
              width={600}
            >
              {/* Quiz content here */}
            </Modal>

            <FloatingChat />
          </>
        )}
      </div>
    </Layout>
  );
};

export default SingleSubject;
