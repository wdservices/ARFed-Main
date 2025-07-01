import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
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
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";

const Subjects = () => {
  const { user } = useUser();
  const token = getCookie("token");
  const [subjects, setSubjects] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, openModal] = useState(false);
  const router = useRouter();
  const id = getCookie("id");
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
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
        toast.error("Failed to fetch subjects or ads.");
      }
    };

    if (token && id) {
      Promise.all([
        fetchSubjectsAndAds()
      ])
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.warn("Authentication required. Please log in.");
    }

  }, [token, id]);

  const single = (subjectId) => {
    if (user && (subjectId === "63dace7d1b0974f12c03d419" || user.plan === "premium")) {
      router.push(`/subject/${subjectId}`);
    } else if (user) {
      openModal(true);
    } else {
      toast.warn("Please log in to access this feature.");
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-white text-lg">Loading ARFed...</p>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <Head>
        <title>ARFed || Subjects</title>
        <meta name="description" content="ARFED is a web-based augmented reality application, created to help both students and teachers visualize topics/subject taught in the classroom in 3D." />
      </Head>
      <div className="relative min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] overflow-hidden transition-colors duration-300">
        <header className="flex items-center justify-between px-4 py-4 shadow-md bg-white/80 dark:bg-[#181f2a]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="text-gray-700 dark:text-gray-200 font-medium">
            {user ? (
              <span>
                {getGreeting()}, {user?.accountType === "group" ? user?.organizationName : user?.name}
              </span>
            ) : (
              "Welcome to ARFed"
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode((d) => !d)}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-yellow-400 transition-colors"
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen((m) => !m)}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition-colors"
            >
              <FaBars size={22} />
            </button>
          </div>
        </header>
        {menuOpen && user && (
          <div className="fixed inset-0 z-40 flex justify-end">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setMenuOpen(false)}></div>
            <nav className="relative w-72 max-w-full h-full bg-white/90 dark:bg-[#181f2a]/90 backdrop-blur-lg shadow-2xl border-l border-white/30 dark:border-[#232946]/30 p-8 flex flex-col gap-4 animate-slide-in-right z-50">
              <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 text-xl font-bold">×</button>
              
              {/* User Profile Info */}
              <div className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                 Hello {user?.accountType === "group" ? user?.organizationName : user?.name || "Guest"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-300 dark:border-gray-700">
                <p>Email: {user?.email || "N/A"}</p>
                <p>Plan: {user?.plan || "N/A"}</p>
              </div>

              {/* Subjects Section */}
              <div className="text-lg font-bold text-gray-800 dark:text-white mt-4">Subjects</div>
              <div className="flex flex-col gap-2 mb-6 pb-4 border-b border-gray-300 dark:border-gray-700">
                {subjects.map((subject, index) => (
                  <Link key={subject._id} href={`/subject/${subject._id}`} className={`text-base text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition-colors py-2 ${index < subjects.length - 1 ? 'border-b border-gray-300 dark:border-gray-700' : ''}`} onClick={() => setMenuOpen(false)}>
                    {subject.title}
                  </Link>
                ))}
              </div>

              {/* Logout Link */}
              <div className="pt-4">
                <Link href="/logout" className="text-lg font-semibold text-red-500 hover:text-red-700 transition-colors py-2">Logout</Link>
              </div>
            </nav>
          </div>
        )}
        <div className="max-w-2xl mx-auto mt-8 rounded-2xl overflow-hidden shadow-lg bg-white/30 dark:bg-[#181f2a]/30 backdrop-blur-lg border border-white/30 dark:border-[#232946]/30">
          <Swiper
            modules={[Pagination, Scrollbar, Autoplay]}
            autoplay
            slidesPerView={1}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            loop
            className="rounded-2xl"
          >
            {ads.map((ad, index) => (
              <SwiperSlide key={index}>
                <img
                  className="w-full h-48 object-cover rounded-2xl"
                  src={ad.image}
                  alt="Ad"
                  style={{ cursor: ad.link ? 'pointer' : 'default' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="max-w-4xl mx-auto py-8 px-2 grid grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-32">
              <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            subjects.map((subject, index) => (
              <div
                key={index}
                onClick={() => single(subject._id)}
                className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center p-4 group border border-gray-200 dark:border-gray-700"
              >
                {user && subject._id !== "63dace7d1b0974f12c03d419" && user.plan === "free" && (
                  <span className="absolute top-3 left-3 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow">
                    <FaCrown className="text-white" /> Premium
                  </span>
                )}
                <div className="pt-4 flex flex-col items-center">
                  <img
                    src={subject.image}
                    alt={subject.title}
                    className="w-20 h-20 object-contain mb-4 drop-shadow-lg"
                  />
                  <div className="font-bold text-lg capitalize text-gray-900 dark:text-gray-900 text-center mb-2">
                    {subject.title}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <Payment user={user} closeModal={() => openModal(!open)} open={open} />
        <FloatingChat />
      </div>
    </div>
  );
};

export default Subjects;
