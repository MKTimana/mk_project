import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MKTECH",
  description:
    "Trazemos as melhores soluções na construção de aplicativos móveis, websites, softwares, hosting e emails.",
  keywords: ["WEBSITES", "SOFTWARES", "HOSTING", "EMAILS"],
  icons: {
    icon: "/assets/img/MKTECH_White.png",
    apple: "/assets/img/mklogo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Jost:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i"
          rel="stylesheet"
        />
        <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
        <link href="/assets/vendor/remixicon/remixicon.css" rel="stylesheet" />
        <link href="/assets/css/style.css" rel="stylesheet" />
        <link href="/assets/css/next-overrides.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
