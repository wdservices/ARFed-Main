import "../styles/globals.css";
import "../index.css";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { ErrorBoundary } from 'react-error-boundary';
import { UserProvider } from "../context/UserContext";
import { Toaster } from '@/components/ui/toaster';

function ErrorFallback({ error }) {
  return (
    <div role="alert" className="p-4">
      <p className="text-red-500">Something went wrong:</p>
      <pre className="text-sm">{error.message}</pre>
    </div>
  );
}

function MyApp({ Component, pageProps, router }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UserProvider>
        <Toaster position="top-right" />
        {/* <AnimatePresence mode="wait"> */}
          {/* <motion.div
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
          > */}
            <Component {...pageProps} />
            <Script
              type="module"
              src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
              strategy="beforeInteractive"
            />
          {/* </motion.div> */}
        {/* </AnimatePresence> */}
      </UserProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
