import React, { useEffect, useState } from "react";
import Nav from "../../components/MobileNav";
import ModelCard from "../../components/modelCard";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/Layout";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import ChatbotWrapper from "../../components/ai-tutor-chatbot/ChatbotWrapper";

const SingleSubject = () => {
  const token = getCookie("token");
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [subjectTitle, setSubjectTitle] = useState("");

  useEffect(() => {
    const url = router.query.slug;
    const token = getCookie("token");
    const id = getCookie("id");
    axios.get(`https://arfed-api.onrender.com/api/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "auth-token": token,
      },
    }).then((response) => setUser(response.data[0]));
    axios
      .get(`https://arfed-api.onrender.com/api/subject/${url}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      })
      .then((response) => {
        setModels(response.data);
        setLoading(false);
        if (response.data.length > 0 && response.data[0].subjectTitle) {
          setSubjectTitle(response.data[0].subjectTitle);
        } else if (response.data.length > 0 && response.data[0].subject) {
          setSubjectTitle(response.data[0].subject);
        }
      });
  }, []);
  return (
    <div>
      <Head>
        <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js"></script>
        <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js"></script>
        <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm"></script>
      </Head>
      <Layout>
        <header className="flex items-center justify-between px-4 py-4 shadow-md bg-[#181f2a]/90 backdrop-blur-lg sticky top-0 z-20 rounded-b-xl border-b border-white/30">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-[#39F9CD]">{subjectTitle || "Subject"}</div>
          </div>
        </header>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-4 border-[#39F9CD] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {models.map((model, index) => (
              <Link key={index} href={`/${model._id}`}>
                <div className="relative bg-white/30 bg-clip-padding backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow cursor-pointer flex flex-col items-center p-6 border border-white/40 group" style={{ minHeight: '220px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                  <img src={model.image} className="w-20 h-20 object-contain mb-4 drop-shadow-lg rounded-xl border-2 border-[#39F9CD] bg-white/40" alt="" />
                  <div className="font-bold text-lg capitalize text-[#232946] dark:text-white text-center mb-2 tracking-wide">
                    {model.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <ChatbotWrapper />
      </Layout>
    </div>
  );
};

export default SingleSubject;
