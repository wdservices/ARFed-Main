import * as React from "react";

function isMobileOrTabletUA() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  // Debug log
  console.log("[useIsMobile] UA:", ua, "Width:", window.innerWidth);

  // iOS
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return true;
  // Android
  if (/android/i.test(ua)) return true;
  // iPadOS 13+ (iPad as Mac)
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
  // Other tablets (generic)
  if (/tablet|ipad|playbook|silk/i.test(ua)) return true;
  // Fallback: mobile
  if (/Mobile|Android|iP(hone|od|ad)|IEMobile|BlackBerry|Opera Mini|webOS|Windows Phone|Kindle|Silk-Accelerated|hpwOS|Fennec|Minimo|Opera Mobi|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(ua)) return true;
  // Touch support as a last resort
  if ('ontouchstart' in window && window.innerWidth < 1200) return true;
  return false;
}

const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const check = () => {
      const widthCheck = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(widthCheck || isMobileOrTabletUA());
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
