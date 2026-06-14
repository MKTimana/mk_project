"use client";

import { useEffect, useState } from "react";
import type { ClientLogo, PortfolioProject } from "@/data/site";

const fallbackClients: ClientLogo[] = [
  { name: "UNIBROKERS Correctores de Seguros Lda", logo: "/assets/img/clients/Unib.png", href: "https://unibrokers.co.mz", slug: "unibrokers" },
  { name: "Portos de Cabo Delgado", logo: "/assets/img/clients/PCD.png", href: "https://www.pcd.co.mz/", slug: "portos-de-cabo-delgado" },
  { name: "3R Mozambique", logo: "/assets/img/clients/3R.png", href: "https://www.3rmozambique.com/", slug: "3r-mozambique" },
  { name: "HAPS Soluções Lda", logo: "/assets/img/clients/haps.png", href: "https://haps.co.mz", slug: "haps-solucoes" },
  { name: "Surveyors Associate & Serviços", logo: "/assets/img/clients/SAS.png", href: "https://sas.co.mz", slug: "surveyors-associate-servicos" },
  { name: "Venssco", logo: "/assets/img/clients/VENSSCO.png", href: "https://venssco.co.mz", slug: "venssco" }
];

export function useClients() {
  const [clients, setClients] = useState<ClientLogo[]>(fallbackClients);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetch("/api/clients").then((response) => (response.ok ? response.json() : fallbackClients)),
      fetch("/api/portfolio").then((response) => (response.ok ? response.json() : []))
    ])
      .then(([clientData, portfolioData]: [ClientLogo[], PortfolioProject[]]) => {
        if (isMounted) {
          setClients(mergePortfolioClients(clientData, portfolioData));
        }
      })
      .catch(() => {
        if (isMounted) {
          setClients(fallbackClients);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return clients;
}

function mergePortfolioClients(clients: ClientLogo[], projects: PortfolioProject[]) {
  const used = new Set(clients.map((client) => client.slug || client.name.toLowerCase()));
  const portfolioClients = projects
    .filter((project) => project.logo?.trim())
    .map((project) => ({
      name: project.title,
      logo: project.logo,
      href: project.href || "",
      slug: project.slug
    }))
    .filter((client) => {
      const key = client.slug || client.name.toLowerCase();

      if (used.has(key)) {
        return false;
      }

      used.add(key);
      return true;
    });

  return [...clients, ...portfolioClients];
}
