import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { OneSignalInit } from "@/components/OneSignalInit";
import { AmbassadorRefTracker } from "@/components/AmbassadorRefTracker";
import { ChatBot } from "@/components/ChatBot";
import { LiveStatusBar } from "@/components/LiveStatusBar";

// Icônes SVG des réseaux sociaux
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export const metadata: Metadata = {
  title: {
    default: "EnfantDisparu.bf — Retrouvons-les ensemble",
    template: "%s | EnfantDisparu.bf",
  },
  description:
    "Signalez un enfant disparu ou retrouvé au Burkina Faso. Chaque annonce est diffusée instantanément sur Facebook, WhatsApp et auprès de la communauté.",
  keywords: ["enfant disparu", "Burkina Faso", "signalement", "alerte enlèvement", "enfant perdu", "retrouver enfant"],
  authors: [{ name: "EnfantDisparu.bf" }],
  creator: "EnfantDisparu.bf",
  metadataBase: new URL("https://enfentdisparu.bf"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    title: "EnfantDisparu.bf",
    description: "Signalez un enfant disparu. Touchez des milliers de personnes en quelques secondes.",
    url: "https://enfentdisparu.bf",
    siteName: "EnfantDisparu.bf",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "EnfantDisparu.bf - Nous protégeons et retrouvons nos enfants",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "EnfantDisparu.bf — Retrouvons-les ensemble",
    description: "Signalez un enfant disparu au Burkina Faso. Diffusion instantanée sur les réseaux sociaux.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Mobile viewport optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'text-sm',
            duration: 4000,
          }}
        />
        <OneSignalInit />
        <Suspense fallback={null}>
          <AmbassadorRefTracker />
        </Suspense>

        {/* Header - sticky pour accès rapide sur mobile */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-2xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 min-h-[44px]">
              <Image
                src="/logo.png"
                alt="EnfantDisparu.bf"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9"
                priority
              />
              <span className="font-extrabold text-gray-900 text-base sm:text-lg">
                EnfantDisparu<span className="text-red-600">.bf</span>
              </span>
            </Link>
            <Link
              href="/signaler"
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 rounded-xl transition-colors flex items-center"
            >
              🚨 Signaler
            </Link>
          </div>
        </header>

        {/* Live Status Bar - Impact global en temps réel */}
        <LiveStatusBar variant="compact" showInsight={true} refreshInterval={10000} />

        {/* Contenu - padding optimisé pour mobile */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
          {children}
        </main>

        {/* Footer - avec safe area pour téléphones à encoche */}
        <footer className="bg-white border-t border-gray-100 mt-6 sm:mt-8 pb-safe">
          <div className="max-w-2xl mx-auto px-3 sm:px-4 py-5 sm:py-6 text-center text-xs text-gray-400 space-y-3">
            <p className="font-medium text-gray-500">EnfantDisparu.bf</p>
            <p>Retrouvons les enfants disparus ensemble — Burkina Faso</p>

            {/* Section Contact & Réseaux sociaux */}
            <div className="space-y-3">
              <p className="font-semibold text-gray-600 text-sm">Nous contacter</p>

              {/* Email */}
              <a
                href="mailto:contact@enfentdisparu.bf"
                className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span>📧</span>
                <span>contact@enfentdisparu.bf</span>
              </a>

              {/* Réseaux sociaux */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61583711643429"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FacebookIcon />
                </a>

                <a
                  href="https://www.instagram.com/enfantdisparu.bf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-colors text-white"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <InstagramIcon />
                </a>

                <a
                  href="https://x.com/Enfantdisparubf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-black hover:bg-gray-900 rounded-lg transition-colors text-white"
                  aria-label="X (Twitter)"
                  title="X (Twitter)"
                >
                  <XIcon />
                </a>

                <a
                  href="https://www.tiktok.com/@enfantdisparu.bf?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-black hover:bg-gray-900 rounded-lg transition-colors text-white"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <TikTokIcon />
                </a>

                <a
                  href="https://www.linkedin.com/company/enfantdisparu-bf/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors text-white"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </div>

            {/* Liens footer - wrap sur petits écrans */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-1">
              <Link href="/retrouver-mon-annonce" className="hover:text-gray-600 underline py-1">
                Mon annonce
              </Link>
              <Link href="/retrouvailles" className="hover:text-gray-600 underline py-1">
                Retrouvailles
              </Link>
              <Link href="/devenir-ambassadeur" className="hover:text-gray-600 underline py-1">
                Devenir Ambassadeur
              </Link>
              <Link href="/ambassadeur/connexion" className="hover:text-gray-600 underline py-1">
                Connexion Ambassadeur
              </Link>
              <Link href="/candidature" className="hover:text-gray-600 underline py-1">
                Suivre ma candidature
              </Link>
            </div>

            {/* Lien admin discret */}
            <div className="pt-2">
              <Link href="/admin" className="text-gray-300 hover:text-gray-500 text-[10px]">
                Admin
              </Link>
            </div>

            <p className="text-gray-300 pt-1">
              © {new Date().getFullYear()} EnfantDisparu.bf
            </p>
          </div>
        </footer>

        {/* ChatBot flottant */}
        <ChatBot />
      </body>
    </html>
  );
}
