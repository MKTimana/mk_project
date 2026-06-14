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
  services?: string[];
  href?: string;
  slug: string;
};

export type ClientLogo = {
  name: string;
  logo: string;
  href?: string;
  slug: string;
};

export type PortfolioCategory = {
  name: string;
  description?: string;
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
    title: "Criação de Websites",
    description:
      "Desenvolvemos websites modernos, responsivos e optimizados para apresentar a sua marca, atrair clientes e fortalecer a sua presença digital."
  },
  {
    icon: "bi bi-code-slash",
    title: "Sistemas & Aplicações",
    description:
      "Criamos sistemas web e aplicações à medida para automatizar processos, organizar operações e melhorar a experiência dos utilizadores."
  },
  {
    icon: "bi bi-cloud-check",
    title: "Hospedagem, Domínio e Emails",
    description:
      "Disponibilizamos registo de domínios, alojamento web, emails corporativos, VPS e soluções cloud seguras para garantir uma presença online estável e profissional."
  },
  {
    icon: "bi bi-diagram-3",
    title: "Redes de Computadores",
    description:
      "Planeamos, instalamos e administramos redes cabeadas e wireless para empresas, escritórios e instituições que precisam de conectividade estável e segura."
  },
  {
    icon: "bi bi-shield-check",
    title: "Segurança e Backup",
    description:
      "Implementamos soluções de backup, protecção de dados e boas práticas de segurança para reduzir riscos e proteger a informação da sua empresa."
  },
  {
    icon: "bi bi-tools",
    title: "Assistência Técnica",
    description:
      "Prestamos suporte técnico, manutenção preventiva, consultoria de TI e resolução de problemas para manter a sua operação funcional e segura."
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
    services: ["Assistência Técnica"],
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
    services: ["Website", "Assistência Técnica", "Emails Corporativos"],
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
    services: ["Website"],
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
    services: ["Emails Corporativos", "Hospedagem"],
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
    services: ["Website"],
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
    services: ["Website"],
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
    role: "Secretária Administrativa || Administrative Secretary",
    image: "/assets/img/team/Janairy.png",
    linkedin:"https://www.linkedin.com/company/mktechmz/",
    photoPosition: "center 45%"
  },
  {
    name: "Cesarino Nhabangue",
    role: "Desenvolvedor Web || Web Developer",
    image: "/assets/img/team/CN.png",
    linkedin: "https://www.linkedin.com/in/cesarino-teodoro-nhabangue-j%C3%BAnior/",
    photoPosition: "center 2%"
  }
];
