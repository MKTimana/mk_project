"use client";

import { useEffect, useState } from "react";

function shouldShowLoadingScreen() {
  if (typeof window === "undefined") {
    return false;
  }

  const [navigation] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];

  return navigation?.type !== "reload";
}

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (shouldShowLoadingScreen()) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const showMinimumTime = window.setTimeout(() => {
      setIsLeaving(true);
    }, 3000);

    return () => window.clearTimeout(showMinimumTime);
  }, [isVisible]);

  useEffect(() => {
    if (!isLeaving) {
      return;
    }

    const removeDelay = window.setTimeout(() => {
      setIsVisible(false);
    }, 420);

    return () => window.clearTimeout(removeDelay);
  }, [isLeaving]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`mk-loading-screen${isLeaving ? " mk-loading-screen-leaving" : ""}`} aria-label="A carregar">
      <div className="mk-loading-card">
        <img src="/assets/img/mklogo.png" alt="MKTECH" />
        <div className="mk-loading-bar" />
      </div>
    </div>
  );
}
