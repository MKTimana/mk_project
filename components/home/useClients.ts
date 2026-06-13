"use client";

import { useEffect, useState } from "react";
import type { ClientLogo } from "@/data/site";

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

    fetch("/api/clients")
      .then((response) => (response.ok ? response.json() : fallbackClients))
      .then((data: ClientLogo[]) => {
        if (isMounted) {
          setClients(data);
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
