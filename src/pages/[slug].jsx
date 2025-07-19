import React, { useEffect, useState } from "react";
import Head from "next/head";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../lib/firebaseClient";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { FaArrowLeft, FaMicrophone, FaMapPin } from "react-icons/fa";
import { message } from 'antd';
import { useRef } from 'react';
import FloatingChat from "../components/FloatingChat";
import { motion } from "framer-motion";

function Single() {
  const token = null; // No longer needed for axios
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
  const [isPaused, setIsPaused] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [error, setError] = useState(null);
  const modelViewerRef = useRef(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [isSpeechSynthesisAvailable, setIsSpeechSynthesisAvailable] = useState(false);
  // Remove modelLoaded state

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setIsSpeechSynthesisAvailable(true);
    }
  }, []);

  const db = getFirestore(app);

  useEffect(() => {
    const url = router.query.slug;
    if (!url) return;

    const fetchModel = async () => {
      try {
        const modelDoc = await getDoc(doc(db, "models", url));
        if (modelDoc.exists()) {
          setModel(modelDoc.data());
          setError(null);
        } else {
          setError("Model not found");
        }
      } catch (error) {
        setError("Failed to fetch model");
      }
    };
    fetchModel();
  }, [router.query.slug]);

  // Handle model loading and sizing
    useEffect(() => {
    if (!modelViewerRef.current || !model.model) return;

    const modelViewer = modelViewerRef.current;

    const handleLoad = () => {
      // Reset camera to a good viewing position
      modelViewer.cameraOrbit = '0deg 75deg 5m';
      modelViewer.fieldOfView = '30deg';

      // Ensure model is properly scaled
      modelViewer.scale = '1 1 1';

      console.log('Model loaded and positioned');
    };

    const handleARStatus = (event) => {
      console.log('AR status:', event.detail.status);
      if (event.detail.status === 'failed') {
        alert('AR failed to start. Please ensure you have good lighting and a flat surface.');
      }
    };

    const handleARTracking = (event) => {
      console.log('AR tracking:', event.detail.status);
    };

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('ar-status', handleARStatus);
    modelViewer.addEventListener('ar-tracking', handleARTracking);

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('ar-status', handleARStatus);
      modelViewer.removeEventListener('ar-tracking', handleARTracking);
    };
  }, [model.model]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const onEnd = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };
    
    const onError = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };
    
    window.speechSynthesis.addEventListener('end', onEnd);
    window.speechSynthesis.addEventListener('error', onError);
    
    // Preload voices for better performance
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        console.log('Available voices:', window.speechSynthesis.getVoices().map(v => v.name));
      }, { once: true });
    }
    
    return () => {
      window.speechSynthesis.removeEventListener('end', onEnd);
      window.speechSynthesis.removeEventListener('error', onError);
      window.speechSynthesis.cancel();
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
    // Check if we're on the client side and speech synthesis is available
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not available');
      return;
    }

    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Enhanced voice configuration for a softer, more natural sound
    utterance.rate = 0.85; // Slower rate for a calmer, more soothing feel
    utterance.pitch = 0.7; // Lower pitch for a softer, warmer tone
    utterance.volume = 0.75; // Lower volume for gentleness
    
    // Wait for voices to load if they haven't already
    const configureVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Priority list for soft, natural-sounding voices
      const voicePriority = [
        'Samantha', // macOS - very natural
        'Victoria', // macOS - soft and clear
        'Karen', // macOS - gentle
        'Google UK English Female', // Chrome - natural
        'Google US English Female', // Chrome - clear
        'Microsoft Zira', // Windows - soft
        'Microsoft Eva', // Windows - natural
        'Alex', // macOS - clear
        'Google UK English Male', // Chrome - warm
        'Google US English Male' // Chrome - natural
      ];
      
      // Find the best available voice
      let selectedVoice = null;
      
      // First, try to find voices from our priority list
      for (const voiceName of voicePriority) {
        const voice = voices.find(v => 
          v.name.includes(voiceName) && 
          (v.lang.includes('en-US') || v.lang.includes('en-GB') || v.lang.includes('en'))
        );
        if (voice) {
          selectedVoice = voice;
          break;
        }
      }
      
      // If no priority voice found, look for any natural-sounding English voice
      if (!selectedVoice) {
        const naturalVoices = voices.filter(voice => 
          (voice.lang.includes('en-US') || voice.lang.includes('en-GB') || voice.lang.includes('en')) &&
          !voice.name.toLowerCase().includes('robot') &&
          !voice.name.toLowerCase().includes('monotone')
        );
        
        if (naturalVoices.length > 0) {
          // Prefer female voices for softer sound
          const femaleVoices = naturalVoices.filter(voice => 
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('victoria') ||
            voice.name.toLowerCase().includes('karen')
          );
          
          selectedVoice = femaleVoices.length > 0 ? femaleVoices[0] : naturalVoices[0];
        }
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name);
      }
      
      setCurrentUtterance(utterance);
      
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        // Wait for the `speechSynthesis` object to become ready before speaking.
        const intervalId = setInterval(() => {
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            return;
          }
          clearInterval(intervalId);
          setIsSpeaking(true);
          setIsPaused(false);
          window.speechSynthesis.speak(utterance);
        }, 100);
      } else {
        setIsSpeaking(true);
        setIsPaused(false);
        window.speechSynthesis.speak(utterance);
      }
    };
    
    // Handle voice loading
    if (window.speechSynthesis.getVoices().length > 0) {
      configureVoice();
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', configureVoice, { once: true });
    }
  }

  const pause = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentUtterance(null);
  };

  // Handle AR session events to control audio and annotations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleARStart = () => {
      // Audio will be started by the button click
      console.log('AR session started');
    };

    const handleAREnd = () => {
      // Stop audio when AR session ends
      stop();
      console.log('AR session ended, audio stopped');
    };

    // Listen for AR session events
    const modelViewer = modelViewerRef.current;
    if (modelViewer) {
      modelViewer.addEventListener('ar-status', (event) => {
        if (event.detail.status === 'failed') {
          // AR failed to start, stop audio
          stop();
        }
      });

      // Listen for AR session end (when user exits AR)
      modelViewer.addEventListener('ar-tracking', (event) => {
        if (event.detail.status === 'not-tracking') {
          // AR tracking lost, might indicate session end
          setTimeout(() => {
            if (!modelViewer.arSession) {
              stop();
            }
          }, 2000);
        }
      });

      // Handle annotation visibility
      modelViewer.addEventListener('load', () => {
        // Ensure annotations are visible when model loads
        if (model.annotations) {
          model.annotations.forEach((annotation, index) => {
            const hotspot = modelViewer.querySelector(`[slot="hotspot-${index}"]`);
            const annotationElement = modelViewer.querySelector(`[slot="annotation-${index}"]`);
            
            if (hotspot && annotationElement) {
              // Show annotation on hotspot click
              hotspot.addEventListener('click', () => {
                const isVisible = annotationElement.style.display !== 'none';
                annotationElement.style.display = isVisible ? 'none' : 'block';
              });
            }
          });
        }
      });
    }

    return () => {
      if (modelViewer) {
        modelViewer.removeEventListener('ar-status', handleARStart);
        modelViewer.removeEventListener('ar-tracking', handleAREnd);
      }
    };
  }, [model.annotations]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-400 opacity-30 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-200 opacity-20 rounded-full blur-2xl animate-pulse" style={{transform: 'translate(-50%, -50%)'}} />
      
      <Head>
        <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js"></script>
        <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js"></script>
        <script src="https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm"></script>
        <style jsx global>{`
          .hotspot {
            display: block;
            width: 24px;
            height: 24px;
            border-radius: 12px;
            border: 2px solid white;
            background-color: #3B82F6;
            box-sizing: border-box;
            pointer-events: auto;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
          }
          .hotspot:hover {
            background-color: #2563EB;
            transform: scale(1.1);
          }
          .annotation {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95));
            backdrop-filter: blur(10px);
            position: absolute;
            transform: translate(12px, 12px);
            border-radius: 12px;
            padding: 12px 16px;
            color: white;
            z-index: 1000;
            min-width: 140px;
            max-width: 200px;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.4;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translate(12px, 12px) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translate(12px, 12px) scale(1);
            }
          }
          :not(:defined)>* {
            display: none;
          }

        `}</style>
      </Head>

      {/* Fixed Header: Back Button, Subject Title, and Microphone Icon */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white/10 backdrop-blur-lg border-b border-white/20">
        {/* Back Button and Subject Title */}
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white font-semibold hover:text-white/80 transition-colors mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <span className="text-white text-lg font-semibold">
            {model.title}
          </span>
        </div>

        {/* Microphone Icon for Audio Description */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (modelViewerRef.current) {
                modelViewerRef.current.cameraOrbit = '0deg 75deg 5m';
                modelViewerRef.current.fieldOfView = '30deg';
              }
            }}
            title="Reset Camera View"
            className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/40 text-green-200 border border-green-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
          </button>
          <button
            onClick={() => speak(model.description)}
            title="Listen to Description"
            className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 border border-blue-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <FaMicrophone size={22} />
          </button>
        </div>
      </div>

      {/* Main Content Area (starts below fixed header) */}
      <main className="pt-16 overflow-y-auto">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Model Viewer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 relative">
              <model-viewer
                ref={modelViewerRef}
                src={model.model}
                alt={model.title}
                camera-controls
                auto-rotate
                shadow-intensity="1"
                environment-image="neutral"
                exposure="1"
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="auto"
                ar-placement="floor"
                ar-button
                camera-orbit="0deg 75deg 5m"
                min-camera-orbit="auto auto 2m"
                max-camera-orbit="auto auto 15m"
                field-of-view="30deg"
                camera-target="0m 0m 0m"
                min-field-of-view="15deg"
                max-field-of-view="45deg"
                scale="1 1 1"
                bounds="tight"
                interaction-prompt="auto"
                interaction-policy="allow-when-focused"
                style={{ width: '100%', height: '100%' }}
              >
                {/* Hidden AR button for programmatic triggering */}
                <button slot="ar-button" style={{ display: 'none' }} />
                {model.annotations && model.annotations.map((annotation, index) => (
                  <button
                    key={annotation.id || index}
                    className="hotspot"
                    slot={`hotspot-${index}`}
                    data-position={annotation.position}
                    data-normal={annotation.normal}
                    data-visibility-attribute="visible"
                  >
                    <div className="annotation" slot={`annotation-${index}`}>{annotation.title}</div>
                  </button>
                ))}
              </model-viewer>
            </div>
          </motion.div>

          {/* Annotations List Section */}
          {model.annotations && model.annotations.length > 0 && (
            <div className="mb-8 bg-white/10 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-2">Annotations</h3>
              <ul className="space-y-2">
                {model.annotations.map((annotation, idx) => (
                  <li key={annotation.id || idx} className="bg-white/20 rounded p-3">
                    <div className="font-semibold text-blue-200">{annotation.title}</div>
                    <div className="text-white/80 text-sm mb-1">{annotation.content}</div>
                    <div className="text-xs text-white/60">Position: x={annotation.position?.x}, y={annotation.position?.y}, z={annotation.position?.z}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AR Button Section - Between Model and Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-full px-6 py-3 transition-all duration-300 shadow-xl flex items-center gap-2 border-2 border-white/30 backdrop-blur-sm transform hover:scale-105"
              onClick={() => {
                // Start audio automatically when AR is activated
                speak(model.description);
                
                // Simple AR activation - let model-viewer handle everything
                if (modelViewerRef.current) {
                  // Try to trigger AR directly
                  try {
                    modelViewerRef.current.activateAR();
                  } catch (error) {
                    // Fallback to button click
                    const arButton = modelViewerRef.current.querySelector('[slot="ar-button"]');
                    if (arButton) {
                      arButton.click();
                    } else {
                      alert('AR functionality requires a compatible device and browser. Please try on a mobile device with AR support.');
                    }
                  }
                } else {
                  alert('AR functionality requires a compatible device and browser. Please try on a mobile device with AR support.');
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.582 0 0 3.582 0 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM7 12.5c0 .276-.224.5-.5.5s-.5-.224-.5-.5.224-.5.5-.5.5.224.5.5zm3.5-6.5c0 .276-.224.5-.5.5h-6c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h6c.276 0 .5.224.5.5z"/>
              </svg>
              View in your space
            </button>
          </motion.div>

          {/* Model Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            {/* Model Details */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="space-y-4">
                <div>
                  <p className="text-white/80">{model.description}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-red-500/30"
            >
              <h3 className="text-xl font-bold text-red-200 mb-2">Error</h3>
              <p className="text-red-100">{error}</p>
            </motion.div>
          )}
        </div>
      </main>

      <FloatingChat />
    </div>
  );
}

export default Single;
