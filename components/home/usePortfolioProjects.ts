"use client";

import { useEffect, useState } from "react";
import { portfolioProjects as fallbackProjects, type PortfolioProject } from "@/data/site";

export function usePortfolioProjects() {
  const [projects, setProjects] = useState<PortfolioProject[]>(fallbackProjects);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/portfolio")
      .then((response) => (response.ok ? response.json() : fallbackProjects))
      .then((data: PortfolioProject[]) => {
        if (isMounted) {
          setProjects(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProjects(fallbackProjects);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return projects;
}
