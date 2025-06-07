import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHashElement = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const yOffset = -80; // adjust to navbar height + desired gap
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [hash]);

  return null;
};

export default ScrollToHashElement;
