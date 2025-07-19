import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { FaCrown, FaMicrophone, FaArrowLeft, FaSearch } from "react-icons/fa";
import { Modal } from 'antd';
import FloatingChat from "../../components/FloatingChat";
import { useIsMobile } from "../../hooks/use-mobile";
import { motion } from "framer-motion";
import { FixedSizeGrid as Grid } from 'react-window';
import app from "../../lib/firebaseClient";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { useUser } from "../../context/UserContext";

const db = getFirestore(app);

const ModelCard = React.memo(function ModelCard({ model, index, user, validPaidPlans, onClick, marginClass }) {
  return (
    <motion.div
      key={model.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index < 4 ? index * 0.1 : 0 }}
      whileHover={{ scale: 1.05, y: -8, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group cursor-pointer${marginClass}`}
    >
      <div className="relative bg-white/30 rounded-2xl p-3 border border-white/20" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {model.isPremium && !validPaidPlans.includes(user?.plan) && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg z-10">
            <FaCrown className="text-white" size={10} />
            Premium
          </div>
        )}
        <div className="relative mb-2">
          <div className="w-full h-40 bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-1 flex items-center justify-center">
            <div className="w-full h-full bg-white/10 rounded-lg flex items-center justify-center">
              <img
                src={model.image}
                alt={model.title}
                className="w-24 h-24 object-contain drop-shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-bold text-xs text-white capitalize mb-2 group-hover:text-white/90 transition-colors line-clamp-2">
            {model.title}
          </h3>
          <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </motion.div>
  );
});

function SingleSubject() {
  const router = useRouter();
  const { user: currentUser, loading: userLoading } = useUser();
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
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState(null);
  const validPaidPlans = ["daily", "weekly", "monthly", "termly", "yearly", "premium"];

  // Device check temporarily disabled for testing
  // useEffect(() => {
  //   if (userLoading || isMobile === undefined || !subject) return; // Wait for everything to load
  //   if (
  //     currentUser &&
  //     currentUser.role !== "admin" &&
  //     isMobile === false &&
  //     subject.title !== "Free Demo"
  //   ) {
  //     router.replace("/UseMobile");
  //   }
  // }, [currentUser, isMobile, router, userLoading, subject]);

  useEffect(() => {
    const url = router.query.slug;
    console.log('[DEBUG] Subject slug:', url);
    if (!url) return;

    const fetchSubject = async () => {
      try {
        const subjectDocRef = doc(db, "subjects", url);
        console.log('[DEBUG] Fetching subject with ID:', url);
        const subjectDoc = await getDoc(subjectDocRef);
        if (subjectDoc.exists()) {
          console.log('[DEBUG] Subject found:', subjectDoc.data());
          setSubject(subjectDoc.data());
          setError(null);
        } else {
          setError("Subject not found");
          console.error('[DEBUG] Subject not found for ID:', url);
          if (typeof window !== "undefined") {
            alert("Subject not found in Firestore");
          }
        }
      } catch (error) {
        setError("Failed to fetch subject");
        console.error("Firestore fetch error:", error);
        if (typeof window !== "undefined") {
          alert("Firestore fetch error: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [router.query.slug]);

  useEffect(() => {
    const url = router.query.slug;
    if (!url) return;

    const fetchModels = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "models"), where("subjectId", "==", url));
        const querySnapshot = await getDocs(q);
        const modelsArr = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("[DEBUG] Models fetched for subject:", modelsArr);
        console.log("[DEBUG] Model titles for subject:", modelsArr.map(m => m.title));
        setModels(modelsArr);
      } catch (error) {
        setError("Failed to fetch models for this subject");
        console.error("Firestore fetch error (models):", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, [router.query.slug]);

  // Handle quiz input change
  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answer });
  };

  // Calculate and submit quiz score
  const submitQuiz = async () => {
    let score = 0;
    quizQuestions.forEach((question, index) => {
      if (userAnswers[index]?.toLowerCase() === question.correctAnswer.toLowerCase()) {
        score++;
      }
    });
    setQuizScore(score);
    // Store quiz result in Firestore
    if (currentUser && currentModel) {
      try {
        await addDoc(collection(db, "quiz-results"), {
          userId: currentUser.uid || currentUser.id,
          modelId: currentModel.id,
          score: score,
          timestamp: new Date().toISOString(),
        });
        console.log('Quiz score submitted successfully');
      } catch (error) {
        console.error('Error submitting quiz score:', error);
      }
    }
  };

  // Handle modal close
  const handleQuizModalClose = () => {
    if (quizScore !== null) {
      setQuizOpen(false);
      router.back();
    } else {
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

  // Show loading while user context is loading
  if (userLoading || isMobile === undefined) {
    return (
      <Layout>
        <div className="relative min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] overflow-hidden">
          <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show message if user is not logged in
  if (!currentUser) {
    return (
      <Layout>
        <div className="relative min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] overflow-hidden">
          <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <p className="text-xl mb-4">You are not logged in.</p>
            <button 
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
                          <ModelCard
                            key={model.id}
                            model={model}
                            index={index}
                            user={currentUser}
                            validPaidPlans={validPaidPlans}
                            onClick={() => router.push(`/${model.id}`)}
                            marginClass={marginClass}
                          />
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
