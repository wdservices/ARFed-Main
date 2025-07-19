import React, { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Pagination, Scrollbar, Autoplay } from "swiper";
import { useRouter } from "next/router";
import Payment from "../components/Payment";
import FloatingChat from "../components/FloatingChat";
import PaymentStatusCheck from "../components/PaymentStatusCheck";
import Head from "next/head";
import { FaBars, FaMoon, FaSun, FaCrown, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import app from "../lib/firebaseClient";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

const db = getFirestore(app);

const Subjects = () => {
  const { user, loading, logoutUser } = useUser();
  const [subjects, setSubjects] = useState([]);
  const [ads, setAds] = useState([]);
  const [open, openModal] = useState(false);
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const [error, setError] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const logout = () => {
    // Use the logoutUser function from UserContext
    logoutUser();
    router.push("/");
  };

  useEffect(() => {
    if (user) {
      // Show post-login payment message if needed
      if (typeof window !== "undefined" && localStorage.getItem('showPostLoginPaymentMsg') === 'true') {
        toast({
          title: 'Continue to Premium',
          description: 'Now click any premium card below to subscribe.',
          variant: 'premium',
        });
        localStorage.removeItem('showPostLoginPaymentMsg');
      }
    }
  }, [user]);

  useEffect(() => {
    if (loading) return; // Wait for user to load
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      return;
    }
    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subjects"));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubjects(docs);
      } catch (error) {
        setError("Failed to fetch subjects");
        console.error("Firestore fetch error:", error);
      } finally {
      }
    };
    fetchSubjects();
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    const fetchAds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ads"));
        setAds(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Failed to fetch ads", error);
      }
    };
    fetchAds();
  }, [user]);

  const validPaidPlans = ["daily", "weekly", "monthly", "termly", "yearly", "premium"];

  const single = (subject) => {
    if (user && (subject.title === "Free Demo" || validPaidPlans.includes(user.plan))) {
      router.push(`/subject/${subject.id}`);
    } else if (user) {
      openModal(true);
    } else {
      toast({
        title: "Login Required",
        description: "Please log in to access this feature.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] relative overflow-x-hidden overflow-y-auto">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-400 opacity-30 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-200 opacity-20 rounded-full blur-2xl animate-pulse" style={{transform: 'translate(-50%, -50%)'}} />
      
      <Head>
        <title>ARFed - Subjects</title>
        <meta name="description" content="Explore ARFed subjects and start your learning journey" />
        <style jsx global>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            hyphens: auto;
          }
          .subject-title {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            hyphens: auto;
            max-height: 3rem;
            line-height: 1.5;
          }
        `}</style>
      </Head>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMenuOpen(true)}
                className="text-white hover:text-white/80 transition-colors"
              >
                <FaBars size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">ARFed</h1>
                <p className="text-white/60 text-sm">Subjects</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-white hover:text-white/80 transition-colors"
              >
                {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
              {user && (
                <div className="text-white">
                  <p className="font-medium">{getGreeting()}, {user?.accountType === "group" ? user?.organizationName : user?.name || "Guest"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setMenuOpen(false)}></div>
          <nav className="relative w-72 max-w-full h-full bg-white/10 backdrop-blur-lg shadow-2xl border-l border-white/20 p-8 flex flex-col gap-4 animate-slide-in-right z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-white text-xl font-bold">×</button>
            {/* User Profile Info */}
            <div className="text-xl font-bold text-white mb-2">
               Hello {user?.accountType === "group" ? user?.organizationName : user?.name || "Guest"}
            </div>
            <div className="text-sm text-white/60 mb-4 pb-4 border-b border-white/20">
              <p>Email: {user?.email || "N/A"}</p>
              <p>Plan: {user?.plan ? (user.plan === 'free' ? 'Free' : user.plan) : 'Free'}</p>
            </div>
            {/* Subjects Section */}
            <div className="text-lg font-bold text-white mt-4">Subjects</div>
            <div className="flex flex-col gap-2 mb-6 pb-4 border-b border-white/20">
              {subjects.map((subject, index) => (
                <Link key={subject.id} href={`/subject/${subject.id}`} className={`text-base text-white/80 hover:text-white transition-colors py-2 ${index < subjects.length - 1 ? 'border-b border-white/10' : ''}`} onClick={() => setMenuOpen(false)}>
                  {subject.title}
                </Link>
              ))}
            </div>
            {/* Navigation Links */}
            <Link href="/" className="text-white/80 hover:text-white transition-colors py-2">
              Home
            </Link>
            <Link href="/product/ar-models" className="text-white/80 hover:text-white transition-colors py-2">
              AR Models
            </Link>
            <Link href="/product/ai-tutor" className="text-white/80 hover:text-white transition-colors py-2">
              AI Tutor
            </Link>
            <Link href="/games" className="text-white/80 hover:text-white transition-colors py-2">
              Games
            </Link>
            <Link href="/faq" className="text-white/80 hover:text-white transition-colors py-2">
              FAQ
            </Link>
            <Link href="/how-to-use" className="text-white/80 hover:text-white transition-colors py-2">
              How to Use
            </Link>
            {/* Logout Button at the bottom of the menu */}
            <button onClick={logout} className="mt-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition w-full">Logout</button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ads Section - Slider at the top */}
        {ads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <Swiper
              modules={[Pagination, Scrollbar, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              allowTouchMove={true}
              touchRatio={1}
              touchAngle={45}
              shortSwipes={true}
              longSwipes={true}
              longSwipesRatio={0.5}
              longSwipesMs={300}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
              }}
              className="pb-8"
            >
              {ads.map((ad, index) => (
                <SwiperSlide key={index}>
                  <AdCard ad={ad} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}

        {/* Welcome Section - Text below slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Explore Our Subjects
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover interactive learning experiences across various subjects with our AR-powered educational content.
          </p>
        </motion.div>

        {/* Subjects Grid */}
        <div className="max-w-6xl mx-auto">
          {loading || subjects.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center my-8">{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subjects.map((subject, index) => {
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
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    index={index}
                    user={user}
                    single={single}
                    marginClass={marginClass}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Payment user={user} closeModal={() => openModal(!open)} open={open} />
      <FloatingChat />
      <PaymentStatusCheck />
    </div>
  );
};

// Memoized Subject Card (keep simplified glassmorphism)
const SubjectCard = React.memo(function SubjectCard({ subject, index, user, single, marginClass }) {
  return (
    <motion.div
      key={subject.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index < 4 ? index * 0.1 : 0 }}
      whileHover={{ scale: 1.05, y: -8, transition: { duration: 0.2 } }}
      onClick={() => single(subject)}
      className={`group cursor-pointer${marginClass}`}
    >
      <div className="relative bg-white/30 rounded-2xl p-3 border border-white/20" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {user && (!user.plan || user.plan === "free") && subject.title !== "Free Demo" && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg z-10">
            <FaCrown className="text-white" size={10} />
            Premium
          </div>
        )}
        <div className="relative mb-2">
          <div className="w-full aspect-[3/4] bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-1 flex items-center justify-center">
            <img
              src={subject.image}
              alt={subject.title}
              className="w-full h-full object-cover rounded-lg drop-shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-bold text-xs text-white capitalize mb-2 group-hover:text-white/90 transition-colors subject-title">
            {subject.title}
          </h3>
          <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </motion.div>
  );
});

// Memoized Ad Card
const AdCard = React.memo(function AdCard({ ad, index }) {
  return ad.link ? (
    <a
      href={ad.link.startsWith('http') ? ad.link : `https://${ad.link}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-white/15 backdrop-blur-lg rounded-2xl p-3 shadow-2xl border border-white/20 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-3xl text-left"
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="relative mb-3">
        <div className="w-full h-40 bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-1 shadow-inner overflow-hidden">
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-full object-cover rounded-lg"
            style={{ pointerEvents: 'none' }}
            loading="lazy"
          />
        </div>
        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1">
          <FaExternalLinkAlt className="text-white text-xs" />
        </div>
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">{ad.title}</h4>
      <p className="text-white/80 text-sm mb-3">{ad.description}</p>
      <div className="mb-2 text-xs text-white/60 flex items-center justify-center">
        <FaExternalLinkAlt className="mr-1" />
        Click to view
      </div>
    </a>
  ) : (
    <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-3 shadow-2xl border border-white/20">
      <div className="relative mb-3">
        <div className="w-full h-40 bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-1 shadow-inner overflow-hidden">
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">{ad.title}</h4>
      <p className="text-white/80 text-sm mb-3">{ad.description}</p>
    </div>
  );
});

export default Subjects;
