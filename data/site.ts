export type Service = {
  icon: string;
  title: string;
  description: string;
};

export type PortfolioProject = {
  image: string;
  title: string;
  type: string;
  href: string;
};

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  linkedinIcon?: string;
  photoPosition?: string;
};

export const services: Service[] = [
  {
    icon: "bi bi-globe2",
    title: "Construção de Websites",
    description:
      "Websites institucionais, comerciais e landing pages com design responsivo, performance e presença profissional."
  },
  {
    icon: "bi bi-code-slash",
    title: "Sistemas & Aplicações",
    description:
      "Aplicações web e mobile para automatizar processos, gerir operações e melhorar a experiência dos utilizadores."
  },
  {
    icon: "bi bi-cloud-check",
    title: "Hospedagem e Domínio",
    description: "Registo de domínios, alojamento web, VPS e soluções cloud seguras para empresas em crescimento."
  },
  {
    icon: "bi bi-diagram-3",
    title: "Redes de Computadores",
    description:
      "Planeamento, instalação e administração de redes cabeadas e wireless para escritórios e organizações."
  },
  {
    icon: "bi bi-at",
    title: "Emails Corporativos",
    description: "Criação e configuração de emails profissionais para reforçar a credibilidade da sua marca."
  },
  {
    icon: "bi bi-tools",
    title: "Assistência Técnica",
    description: "Consultoria de TI, helpdesk, troubleshooting e manutenção preventiva ou correctiva."
  }
];

export const portfolioProjects: PortfolioProject[] = [
  {
    image: "/assets/img/clients/Unib.png",
    title: "UNIBROKERS Correctores de Seguros Lda",
    type: "Assistência Técnica",
    href: "https://unibrokers.co.mz"
  },
  {
    image: "/assets/img/clients/PCD.png",
    title: "Portos de Cabo Delgado",
    type: "Assistência Técnica",
    href: "https://www.pcd.co.mz/"
  },
  {
    image: "/assets/img/clients/3R.png",
    title: "3R Mozambique",
    type: "Website",
    href: "https://www.3rmozambique.com/"
  },
  {
    image: "/assets/img/clients/haps.png",
    title: "HAPS Soluções Lda",
    type: "Hospedagem de E-mails",
    href: "https://haps.co.mz"
  }
];

export const team: TeamMember[] = [
  {
    name: "Milton Timana",
    role: "Director Geral || General Manager",
    image: "/assets/img/team/milton.jpg",
    linkedin: "https://www.linkedin.com/in/milton-kevin-timana-830651137/",
    photoPosition: "center 6%"
  },
  {
    name: "Elton Jorge",
    role: "Gestor de Projecto || Project Manager",
    image: "/assets/img/team/EV.jpg",
    linkedin: "https://www.linkedin.com/in/elton-vilanculo-0a9b66195/",
    photoPosition: "center 20%"
  },
  {
    name: "Emmerson Lázaro",
    role: "Gestor de Vendas || Sales Manager",
    image: "/assets/img/team/E.png",
    linkedin:
      "https://www.linkedin.com/in/emmerson-nativo-b68323212?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B6R83uvQyRDeri7Wyf8aoKg%3D%3D",
    photoPosition: "center 40%"
  },
  {
    name: "Cesarino Nhabangue",
    role: "Desenvolvedor Web || Web Developer",
    image: "/assets/img/team/CN.png",
    linkedin: "https://www.linkedin.com/in/cesarino-teodoro-nhabangue-j%C3%BAnior/",
    photoPosition: "center 2%"
  }
];
