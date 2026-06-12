export type Service = {
  icon: string;
  title: string;
  description: string;
};

export type PortfolioProject = {
  image: string;
  images?: string[];
  logo: string;
  title: string;
  description: string;
  type: string;
  href: string;
  slug: string;
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
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    logo: "/assets/img/clients/Unib.png",
    title: "UNIBROKERS Correctores de Seguros Lda",
    description:
      "Suporte técnico contínuo, manutenção de Equipementos e acompanhamento da infraestrutura digital da empresa.",
    type: "Assistência Técnica",
    href: "https://unibrokers.co.mz",
    slug: "unibrokers"
  },
  {
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    logo: "/assets/img/clients/PCD.png",
    title: "Portos de Cabo Delgado",
    description:
      "Assistência técnica e suporte operacional para manter os serviços internos mais estáveis e organizados.",
    type: "Assistência Técnica",
    href: "https://www.pcd.co.mz/",
    slug: "portos-de-cabo-delgado"
  },
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    logo: "/assets/img/clients/3R.png",
    title: "3R Mozambique",
    description:
      "Website institucional responsivo para apresentar serviços, reforçar a credibilidade e facilitar o contacto com clientes.",
    type: "Website",
    href: "https://www.3rmozambique.com/",
    slug: "3r-mozambique"
  },
  {
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    logo: "/assets/img/clients/haps.png",
    title: "HAPS Soluções Lda",
    description:
      "Configuração e hospedagem de emails corporativos para comunicação profissional e maior confiança da marca.",
    type: "Hospedagem de E-mails",
    href: "https://haps.co.mz",
    slug: "haps-solucoes"
  },
  {
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    logo: "/assets/img/clients/SAS.png",
    title: "Surveyors Associate & Serviços",
    description:
      "Website de apresentação com estrutura clara para destacar áreas de actuação, contactos e posicionamento comercial.",
    type: "Website",
    href: "https://sas.co.mz",
    slug: "surveyors-associate-servicos"
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    logo: "/assets/img/clients/VENSSCO.png",
    title: "Venssco",
    description:
      "Website corporativo com foco em presença online, acesso rápido a informação e comunicação direta com potenciais clientes.",
    type: "Website",
    href: "https://venssco.co.mz",
    slug: "venssco"
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
    name: "Janairy Timane",
    role: "Directora Administrativa || Admnistrative Director",
    image: "/assets/img/team/jt.png",
    linkedin:"https://www.linkedin.com/company/mktechmz/",
    photoPosition: "center 35%"
  },
  {
    name: "Cesarino Nhabangue",
    role: "Desenvolvedor Web || Web Developer",
    image: "/assets/img/team/CN.png",
    linkedin: "https://www.linkedin.com/in/cesarino-teodoro-nhabangue-j%C3%BAnior/",
    photoPosition: "center 2%"
  }
];
