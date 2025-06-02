import React, { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import ChatbotWrapper from "../components/ai-tutor-chatbot/ChatbotWrapper";

function Single() {
  const router = useRouter();
  const [model, setModel] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [user, setUser] = useState({});

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
      .get(`https://arfed-api.onrender.com/api/models/${url}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      })
      .then((response) => {
        setModel(response.data);
      });
  }, []);

  useEffect(() => {
    const onEnd = () => {
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };
    speechSynthesis.addEventListener('end', onEnd);
    return () => {
      speechSynthesis.removeEventListener('end', onEnd);
      // Stop speech synthesis and audio when navigating away
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentUtterance(null);
      const audio = document.getElementById('model-audio');
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const speak = (text) => {
    if (currentUtterance) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    setCurrentUtterance(utterance);
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      // Wait for the `speechSynthesis` object to become ready before speaking.
      const intervalId = setInterval(() => {
        if (speechSynthesis.speaking || speechSynthesis.pending) {
          return;
        }
        clearInterval(intervalId);
        setIsSpeaking(true);
        speechSynthesis.speak(utterance);
      }, 100);
    } else {
      setIsSpeaking(true);
      speechSynthesis.speak(utterance);
    }
  }

  const pause = () => {
    if (isSpeaking) {
      speechSynthesis.pause();
      setIsSpeaking(false);
    }
  };

  // const resume = () => {
  //   if (!isSpeaking && currentUtterance) {
  //     speechSynthesis.resume();
  //     setIsSpeaking(true);
  //   }
  // };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{model.title ? `${model.title} | ARFed` : 'Model | ARFed'}</title>
      </Head>
      <Layout>
        {/* Custom Header/Menu */}
        <header className="flex items-center justify-between px-4 py-4 shadow-md bg-[#181f2a]/90 backdrop-blur-lg sticky top-0 z-20 rounded-b-xl border-b border-white/30">
          <div className="text-lg font-bold text-[#39F9CD]">{model.title || "Model"}</div>
          <div className="flex items-center">
            {isSpeaking ? (
              <button className="ml-2 bg-white rounded-full shadow-lg cursor-pointer p-1" style={{zIndex: 10}} onClick={() => pause()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#FF0000" className="bi bi-pause-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
                </svg>
              </button>
            ) : (
              <button className="ml-2 bg-white rounded-full shadow-lg cursor-pointer p-1" style={{zIndex: 10}} onClick={() => { speak(model.description) }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#151843" className="bi bi-mic-fill" viewBox="0 0 16 16">
                  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
                  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                </svg>
              </button>
            )}
          </div>
        </header>
        <main className="flex flex-col items-center justify-start w-full px-2 pt-4 pb-8">
          <div className="w-full max-w-xs mx-auto flex flex-col items-center">
            {/* Responsive square for model-viewer */}
            <div className="w-full" style={{ aspectRatio: '1 / 1', maxWidth: '350px', position: 'relative', background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px 0 rgba(31,38,135,0.07)' }}>
              <model-viewer
                src={model.model}
                auto-rotate
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                poster={model.image}
                environment-imag={model?.iosModel}
                shadow-intensity="1"
                autoplay
                alt={model.description}
                touch-action="pan-y"
                style={{ width: '100%', height: '100%', borderRadius: '1rem', background: '#fff', minHeight: '0', minWidth: '0' }}
              >
                <button id="ar-failure">
                  AR is not tracking the floor!
                </button>
                <div id="ar-prompt">
                  <img src="https://cdn.glitch.global/529f750b-7ad0-41f0-95f4-66cd14b039de/hand.png?v=1681597153624" />
                </div>
                <div
                  slot="ar-button"
                  id="ar-button"
                  className="p-2 absolute right-2 bottom-2 bg-gradient-to-r from-[#39F9CD] to-[#2563EB] rounded-lg shadow text-white font-bold text-sm border border-white/60 hover:scale-105 transition-transform duration-200"
                  style={{zIndex: 30, minWidth: '120px', minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.17)'}}
                >
                  View in 3D / Your Space
                </div>
                <audio id="model-audio" slot="audio" src={model.audio} autoPlay loop></audio>
              </model-viewer>
            </div>
            <h1 className="text-lg text-[#232946] my-3 text-center font-bold w-full truncate">
              {model.title}
            </h1>
            <div className="text-[#232946] bg-[#F3F4F6] p-3 rounded-lg shadow text-base my-2 text-center w-full">
              {model.description}
            </div>
            <ChatbotWrapper />
          </div>
        </main>
      </Layout>
    </div>
  );
}

export default Single;
