import React, { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { FaArrowLeft, FaMicrophone, FaComment } from "react-icons/fa";
import { Modal } from 'antd';
import { useRef } from 'react';

function Single() {
  const token = getCookie("token");
  const router = useRouter();
  const [model, setModel] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const modelViewerRef = useRef(null);

  useEffect(() => {
    const url = router.query.slug;
    try {
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
    } catch (e) {
      console.log(e);
    }
  }, [router.query.slug, token]);

  useEffect(() => {
    const onEnd = () => {
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };
    speechSynthesis.addEventListener('end', onEnd);
    return () => {
      speechSynthesis.removeEventListener('end', onEnd);
      speechSynthesis.cancel();
      if (modelViewerRef.current) {
        const audioElement = modelViewerRef.current.querySelector('audio');
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
      }
    };
  }, [modelViewerRef]);

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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] overflow-hidden">
      <Head>
        <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js"></script>
        <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js"></script>
        <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm"></script>
      </Head>

      {/* Fixed Header: Back Button, Subject Title, and Microphone Icon */}
      <div className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-white/20 backdrop-blur-lg border-b border-white/30">
        {/* Back Button and Subject Title */}
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white font-semibold hover:text-gray-200 transition-colors mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <span className="text-white text-lg font-semibold">
            {model.title}
          </span>
        </div>

        {/* Microphone Icon */}
        <div>
          {isSpeaking ? (
            <div className="p-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full cursor-pointer text-white" onClick={() => pause()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pause-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
              </svg>
            </div>
          ) : (
            <div className="p-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full cursor-pointer text-white" onClick={() => { speak(model.description) }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area (starts below fixed header) */}
      <main className="pt-16 p-4 overflow-y-auto">
        {/* Model Viewer */}
        <div className="w-full h-[55vh] mb-4">
          <div className={styles.single}>
            <model-viewer
              ref={modelViewerRef}
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
            >
              <button id="ar-failure">AR is not tracking the floor!</button>
              <div id="ar-prompt">
                <img src="https://cdn.glitch.global/529f750b-7ad0-41f0-95f4-66cd14b039de/hand.png?v=1681597153624" />
              </div>
              {/* AR Button - Positioned as in the image */}
              <div
                slot="ar-button"
                id="ar-button"
                className="p-3 absolute bottom-4 left-1/2 transform -translate-x-1/2"
              >
                <img
                  className="cursor-pointer w-32 md:w-40"
                  src="/images/space.png"
                  alt="View in your space"
                />
              </div>
              <audio slot="audio" src={model.audio} loop></audio>
            </model-viewer>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl text-white my-4 text-center">{model.title}</h1>

        {/* Description */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg p-4 text-white mb-4">
          {model.description}
        </div>

        {/* Add some padding at the bottom to ensure content isn't hidden by the chathead */}
        <div className="h-20"></div>

      </main>

      {/* Chathead Button Fixed Bottom Right */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full text-white hover:bg-white/30 transition-colors shadow-lg z-50"
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
    </div>
  );
}

export default Single;
