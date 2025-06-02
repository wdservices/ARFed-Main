import "../styles/globals.css";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import Head from "next/head";
import ChatbotWrapper from "../components/ai-tutor-chatbot/ChatbotWrapper";

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <title>ARFed App</title>
      </Head>

      <AnimatePresence>
        <motion.div
          initial="pageInitial"
          key={router.route}
          animate="pageAnimate"
          exit="pageExit"
          variants={{
            pageInitial: {
              opacity: 0,
            },
            pageAnimate: {
              opacity: 1,
              transition: {
                delay: 0.4,
              },
            },
            pageExit: {
              filter: `invert()`,
              opacity: 0,
            },
          }}
        >
          <Component {...pageProps} />
          {router.route !== '/' && <ChatbotWrapper />}
          <Script
            type="module"
            src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          ></Script>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default MyApp;
