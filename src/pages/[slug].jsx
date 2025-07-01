import React, { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { FaArrowLeft, FaMicrophone, FaMapPin } from "react-icons/fa";
import { message } from 'antd';
import { useRef } from 'react';
import FloatingChat from "../components/FloatingChat";

function Single() {
  const token = getCookie("token");
  const router = useRouter();
  const [model, setModel] = useState({
    title: "Loading...",
    description: "Please wait while we load the model...",
    model: "",
    image: "",
    audio: "",
    annotations: [],
    modelColor: "#ffffff",
    modelCustomizations: {}
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [error, setError] = useState(null);
  const modelViewerRef = useRef(null);
  const [showAnnotations, setShowAnnotations] = useState(true);

  useEffect(() => {
    const url = router.query.slug;
    if (!url) return;

    const fetchModel = async () => {
      try {
        const response = await axios.get(`https://arfed-api.onrender.com/api/models/${url}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        });
        setModel(response.data);
        setError(null);

        // Apply model color when model is loaded
        if (modelViewerRef.current) {
          const modelViewer = modelViewerRef.current;
          modelViewer.addEventListener('load', () => {
            // Apply model color
            if (response.data.modelColor) {
              const material = modelViewer.model.materials[0];
              if (material) {
                material.pbrMetallicRoughness.setBaseColorFactor(response.data.modelColor);
              }
            }
          });
        }
      } catch (e) {
        console.error("Error fetching model:", e);
        setError("Failed to load model. Please try again later.");
        message.error("Failed to load model. Please try again later.");

        // Set fallback data
        setModel({
          title: "Error Loading Model",
          description: "We're having trouble loading this model. Please try again later.",
          model: "",
          image: "/images/error.png", // Make sure to add an error image
          audio: "",
          annotations: [],
          modelColor: "#ffffff",
          modelCustomizations: {}
        });
      }
    };

    fetchModel();
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
        <style jsx global>{`
          .hotspot {
            display: block;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            border: none;
            background-color: blue;
            box-sizing: border-box;
            pointer-events: auto;
          }
          .annotation {
            background-color: #888888;
            position: absolute;
            transform: translate(10px, 10px);
            border-radius: 10px;
            padding: 10px;
            color: #fff;
            z-index: 1000;
            min-width: 120px;
            font-size: 13px;
          }
          :not(:defined)>* {
            display: none;
          }
        `}</style>
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
        <div className="flex items-center gap-4">
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
      <main className=" overflow-y-auto">
        {/* Model Viewer */}
        <div className="w-full h-[90vh] mb-4">
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
              style={{
                '--model-color': model.modelColor || '#ffffff',
                width: '100%',
                height: '100%'
              }}
              id="model-viewer"
            >
              {/* Add custom styles for model color */}
              <style jsx global>{`
                #model-viewer {
                  --exposure: 0.5;
                }
                #model-viewer model-viewer::part(default) {
                  background-color: transparent;
                }
                #model-viewer::part(model) {
                  color: ${model.modelColor || '#ffffff'};
                }
              `}</style>

              <button id="ar-failure">AR is not tracking the floor!</button>
              <div id="ar-prompt">
                <img src="https://cdn.glitch.global/529f750b-7ad0-41f0-95f4-66cd14b039de/hand.png?v=1681597153624" />
              </div>
              
              {/* Annotation Hotspots */}
              {showAnnotations && model.annotations && model.annotations.map((annotation, index) => (
                <button
                  key={annotation.id || index}
                  className="hotspot"
                  slot={`hotspot-annotation-${index}`}
                  data-position={`${annotation.position?.x || 0} ${annotation.position?.y || 0} ${annotation.position?.z || 0}`}
                  data-normal="0 0 1"
                >
                  <div className="annotation">
                    <div className="font-semibold">{annotation.title}</div>
                    <div className="text-xs">{annotation.content}</div>
                  </div>
                </button>
              ))}
              
              {/* AR Button - Positioned as in the image */}
              <div
                slot="ar-button"
                id="ar-button"
                className="p-3 absolute bottom-10 left-1/2 transform -translate-x-1/2"
              >
                <img
                  className="cursor-pointer w-32 md:w-40"
                  src="/images/space.png"
                  alt="View in your space"
                />
              </div>
              <audio slot="audio" src={model.audio} loop></audio>
            </model-viewer>
            
            {/* Annotation Toggle Button */}
            {model.annotations && model.annotations.length > 0 && (
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full p-2 text-white hover:bg-white/30 transition-colors z-10"
                title={showAnnotations ? "Hide Annotations" : "Show Annotations"}
              >
                <FaMapPin size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg p-4">
          <h1 className="text-2xl text-white my-4 text-center">{model.title}</h1>

          {/* Description */}
          <div className="text-white mb-4">
            {model.description}
          </div>

          {/* Customization Info - Only show if there are customizations */}
          {model.annotations && model.annotations.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-300/20 rounded-lg p-3 mt-4">
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <FaMapPin size={14} />
                <span>{model.annotations.length} annotation{model.annotations.length !== 1 ? 's' : ''} available</span>
                {model.modelColor && model.modelColor !== "#ffffff" && (
                  <span>• Custom color applied</span>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Add some padding at the bottom to ensure content isn't hidden by the chathead */}
        {/* <div className="h-20"></div> */}

      </main>

      {/* Add the FloatingChat component */}
      <FloatingChat />
    </div>
  );
}

export default Single;
