import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Pagination, Scrollbar, Autoplay } from "swiper";
import { useRouter } from "next/router";
import Payment from "../components/Payment";
import FloatingChat from "../components/FloatingChat";
import Head from "next/head";
import { FaBars, FaMoon, FaSun, FaCrown } from "react-icons/fa";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";

const Subjects = () => {
  const { user } = useUser();
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [cookiesLoaded, setCookiesLoaded] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, openModal] = useState(false);
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    document.cookie = "id=; Max-Age=0; path=/";
    router.push("/");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenValue = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const idValue = document.cookie.split('; ').find(row => row.startsWith('id='))?.split('=')[1];
      setToken(tokenValue);
      setId(idValue);
      setCookiesLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!cookiesLoaded) return;
    const fetchSubjectsAndAds = async () => {
      try {
        const [adsRes, subjectsRes] = await Promise.all([
          axios.get("https://arfed-api.onrender.com/api/ads", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "auth-token": token,
            },
          }),
          axios.get("https://arfed-api.onrender.com/api/subject", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "auth-token": token,
            },
          })
        ]);
        setAds(adsRes.data);
        setSubjects(subjectsRes.data);
      } catch (error) {
        console.error("Error fetching subjects or ads:", error);
        toast({
          title: "Error",
          description: "Failed to fetch subjects or ads.",
          variant: "destructive",
        });
      }
    };

    if (token && id) {
      fetchSubjectsAndAds().finally(() => setLoading(false));
    } else {
      setLoading(false);
      toast({
        title: "Authentication Required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
    }
  }, [token, id, cookiesLoaded]);

  const single = (subjectId) => {
    if (user && (subjectId === "63dace7d1b0974f12c03d419" || user.plan === "premium")) {
      router.push(`/subject/${subjectId}`);
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
              <p>Plan: {user?.plan || "N/A"}</p>
            </div>
            {/* Subjects Section */}
            <div className="text-lg font-bold text-white mt-4">Subjects</div>
            <div className="flex flex-col gap-2 mb-6 pb-4 border-b border-white/20">
              {subjects.map((subject, index) => (
                <Link key={subject._id} href={`/subject/${subject._id}`} className={`text-base text-white/80 hover:text-white transition-colors py-2 ${index < subjects.length - 1 ? 'border-b border-white/10' : ''}`} onClick={() => setMenuOpen(false)}>
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
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-8"
            >
              {ads.map((ad, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-48 object-cover rounded-xl mb-4 shadow-lg"
                    />
                    <h4 className="text-lg font-semibold text-white mb-2">{ad.title}</h4>
                    <p className="text-white/80 text-sm">{ad.description}</p>
                  </div>
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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
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
                    onClick={() => single(subject._id)}
                    className={`group cursor-pointer${marginClass}`}
                  >
                    <div className="relative bg-white/15 backdrop-blur-lg rounded-2xl p-3 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 hover:border-white/30">
                      {/* Premium Badge */}
                      {user && subject._id !== "63dace7d1b0974f12c03d419" && user.plan === "free" && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg z-10">
                          <FaCrown className="text-white" size={10} />
                          Premium
                        </div>
                      )}
                      
                      {/* Image Container with Bezel */}
                      <div className="relative mb-2">
                        <div className="w-full aspect-[3/4] bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-1 shadow-inner flex items-center justify-center">
                          <img
                            src={subject.image}
                            alt={subject.title}
                            className="w-full h-full object-cover rounded-lg drop-shadow-lg"
                          />
                        </div>
                      </div>
                      
                      {/* Subject Title */}
                      <div className="text-center">
                        <h3 className="font-bold text-xs text-white capitalize mb-2 group-hover:text-white/90 transition-colors subject-title">
                          {subject.title}
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

      <Payment user={user} closeModal={() => openModal(!open)} open={open} />
      <FloatingChat />
    </div>
  );
};

export default Subjects;
