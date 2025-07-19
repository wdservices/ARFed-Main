import "../styles/globals.css";
import "../index.css";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { ErrorBoundary } from 'react-error-boundary';
import { UserProvider } from "../context/UserContext";
import { Toaster } from '@/components/ui/toaster';
import { useIsMobile } from "../hooks/use-mobile";
import { useRouter } from "next/router";
import React from "react";
import { useUser } from "../context/UserContext";

function ErrorFallback({ error }) {
  return (
    <div role="alert" className="p-4">
      <p className="text-red-500">Something went wrong:</p>
      <pre className="text-sm">{error.message}</pre>
    </div>
  );
}

function DeviceCheckWrapper({ children }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user, loading } = useUser();
  const PUBLIC_ROUTES = ["/", "/UseMobile", "/login", "/signup"];

  // Device check temporarily disabled for testing
  // React.useEffect(() => {
  //   if (loading || isMobile === undefined) return; // Wait until both are loaded
  //   if (!PUBLIC_ROUTES.includes(router.pathname) && isMobile === false && (!user || user.role !== "admin")) {
  //     router.replace("/UseMobile");
  //   }
  // }, [isMobile, router.pathname, user, loading]);

  return children;
}

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UserProvider>
        <DeviceCheckWrapper>
          <Toaster position="top-right" />
          <Component {...pageProps} />
          <Script
            type="module"
            src="https://unpkg.com/@google/model-viewer@^3.4.0/dist/model-viewer.min.js"
            strategy="beforeInteractive"
          />
          <Script
            src="https://unpkg.com/@google/model-viewer@^3.4.0/dist/model-viewer-legacy.js"
            strategy="beforeInteractive"
          />
        </DeviceCheckWrapper>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default MyApp;    