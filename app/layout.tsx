// app/layout.tsx (SERVER COMPONENT — DO NOT add "use client")
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import ClientLayout from "./components/ClientLayout";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agaram Foundation | Educate. Empower. Elevate.",
  description:
    "Support Agaram Foundation's mission to educate and empower underprivileged children across Tamil Nadu. Every contribution makes a difference.",
  applicationName: "Agaram Foundation",
  authors: [{ name: "Antcorp Tecnologies Private Limited", url: "https://www.agaram.in" }],
  keywords: [
    "Agaram Foundation",
    "Education",
    "Non-profit",
    "Tamil Nadu",
    "Donate",
    "Child Education",
    "Empowerment",
    "Charity",
    "Sponsor a child",
  ],
  generator: "Next.js",
  creator: "Agaram Foundation",
  publisher: "Agaram Foundation",
  metadataBase: new URL("https://www.agaram.in"),
  alternates: { canonical: "https://www.agaram.in" },
  openGraph: {
    title: "Agaram Foundation | Educate. Empower. Elevate.",
    description:
      "Support Agaram Foundation's mission to educate and empower underprivileged children across Tamil Nadu. Every contribution makes a difference.",
    url: "https://www.agaram.in",
    siteName: "Agaram Foundation",
    images: [
      {
        url: "https://www.agaram.in/assets/images/mission/mission_banner.png",
        width: 1200,
        height: 630,
        alt: "Agaram Foundation - Educate Empower Elevate",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agaram Foundation | Educate. Empower. Elevate.",
    description:
      "Support Agaram Foundation's mission to educate and empower underprivileged children across Tamil Nadu. Every contribution makes a difference.",
    creator: "@agaramfoundation",
    images: ["https://www.agaram.in/assets/images/web-app-banner.png"],
  },
  icons: {
    icon: "/assets/images/web-app-manifest-512x512.png",
    shortcut: "/assets/images/web-app-manifest-512x512.png",
    apple: "/assets/images/web-app-manifest-512x512.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Zoho SalesIQ must exist before the widget loads */}
        <Script id="zoho-salesiq-init" strategy="beforeInteractive">
          {`
            window.$zoho = window.$zoho || {};
            $zoho.salesiq = $zoho.salesiq || { ready: function() {} };
          `}
        </Script>
      </head>

      <body
        className={`${inter.variable} antialiased bg-white text-secondary-900 font-sans flex flex-col min-h-screen`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V4H1YFD8LN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V4H1YFD8LN');
          `}
        </Script>

        {/* Hotjar */}
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:6489222,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>

        <Script
          src="https://cdn.pagesense.io/js/agaramfoundation/85ea77e724a44772a37074b03d1b0206.js"
          strategy="lazyOnload"
        />

        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
