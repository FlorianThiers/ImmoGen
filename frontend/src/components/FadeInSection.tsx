// FadeInSection.tsx
import React, { useRef, useEffect, useState } from "react";

const FadeInSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => setVisible(entry.isIntersecting));
      },
      { threshold: 0.15 }
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`statistic-fade-in${isVisible ? " visible" : ""}`}
    >
      {children}
    </div>
  );
};

export default FadeInSection;