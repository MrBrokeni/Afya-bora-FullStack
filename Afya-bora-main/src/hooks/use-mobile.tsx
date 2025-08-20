import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Default to a consistent value for SSR and initial client render (e.g., false for desktop-first)
  // This helps prevent hydration mismatches.
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Signal that the component has mounted on the client

    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkDevice(); // Set the correct value on client mount
    window.addEventListener("resize", checkDevice); // Listen for resize events

    return () => window.removeEventListener("resize", checkDevice); // Cleanup listener
  }, []); // Empty dependency array ensures this runs once on mount

  // Return the default value (false) until mounted on the client, then the actual client-determined value.
  // This ensures the server-rendered output and the initial client render match.
  // A visual update might occur after mount if the actual state differs, but it avoids the hydration error.
  return hasMounted ? isMobile : false;
}
