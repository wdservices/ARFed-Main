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
import Head from "next/head";
import { FaBars, FaMoon, FaSun, FaCrown } from "react-icons/fa";

const Subjects = () => {
  const token = getCookie("token");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);
  const [open, openModal] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState([]);
  const id = getCookie("id");
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    axios.get("https://arfed-api.onrender.com/api/ads", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "auth-token": token,
      },
    }).then((response) => setAds(response.data));
    axios.get(`https://arfed-api.onrender.com/api/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "auth-token": token,
      },
    }).then((response) => {
      setUser(response.data[0]);
      setLoading(false);
    });
    axios.get("https://arfed-api.onrender.com/api/subject", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "auth-token": token,
      },
    }).then((response) => {
      setLoading(false);
      setSubjects(response.data);
    });
  }, []);

  const single = (id) => {
    if (id === "63dace7d1b0974f12c03d419" || user.plan === "premium") {
      router.push(`/subject/${id}`);
    } else {
      openModal(true);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <Head>
        <title>ARFed || Subjects</title>
        <meta name="description" content="ARFED is a web-based augmented reality application, created to help both students and teachers visualize topics/subject taught in the classroom in 3D." />
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-[#10172a] transition-colors duration-300">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 shadow-md bg-white/20 backdrop-blur-lg sticky top-0 z-20 rounded-b-xl border-b border-white/30">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-[#39F9CD]">Subjects</div>
            <span className="text-lg text-[#232946] dark:text-white/80 font-semibold ml-4">{user?.name && `Hi, ${user.name}`}</span>
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
        {/* Burger Menu Drawer */}
        {menuOpen && (
          <div className="fixed top-0 right-0 w-64 h-full bg-white/30 backdrop-blur-lg shadow-2xl z-30 p-6 flex flex-col gap-6 animate-slide-in rounded-l-xl border-l border-white/30">
            <button onClick={() => setMenuOpen(false)} className="self-end text-gray-500 dark:text-gray-300">Close</button>
            <div className="text-lg font-bold text-[#39F9CD] mb-2">{user?.name}</div>
            <a href="/profile" className="text-lg font-medium text-[#232946] dark:text-white hover:text-[#39F9CD]">Profile</a>
            <a href="/settings" className="text-lg font-medium text-[#232946] dark:text-white hover:text-[#39F9CD]">Settings</a>
            <a href="/logout" className="text-lg font-medium text-red-500 hover:text-red-700">Logout</a>
            <div className="mt-4">
              <div className="text-[#39F9CD] font-semibold mb-2">Subjects</div>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
                {subjects.map((subject, idx) => (
                  <a key={idx} href={`/subject/${subject._id}`} className="text-[#232946] dark:text-white/80 hover:text-[#39F9CD] text-base px-2 py-1 rounded transition-all">
                    {subject.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Carousel */}
        <div className="max-w-2xl mx-auto mt-6 rounded-2xl overflow-hidden shadow-lg bg-white/20 backdrop-blur-lg border border-white/30">
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
        {/* Subjects Grid */}
        <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-32">
              <div className="w-8 h-8 border-4 border-[#39F9CD] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            subjects.map((subject, index) => (
              <div
                key={index}
                onClick={() => single(subject._id)}
                className="relative bg-white/30 bg-clip-padding backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow cursor-pointer flex flex-col items-center p-6 border border-white/40 group"
                style={{ minHeight: '220px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
              >
                {/* Premium badge */}
                {subject._id !== "63dace7d1b0974f12c03d419" && user.plan === "free" && (
                  <span className="absolute top-3 left-3 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow">
                    <FaCrown className="text-white" /> Premium
                  </span>
                )}
                <img
                  src={subject.image}
                  alt={subject.title}
                  className="w-20 h-20 object-contain mb-4 drop-shadow-lg rounded-xl border-2 border-[#39F9CD] bg-white/40"
                />
                <div className="font-bold text-lg capitalize text-[#232946] dark:text-white text-center mb-2 tracking-wide">
                  {subject.title}
                </div>
              </div>
            ))
          )}
        </div>
        <Payment closeModal={() => openModal(!open)} open={open} />
      </div>
    </div>
  );
};

export default Subjects;
