import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { OneSignalInit } from "@/components/OneSignalInit";
import { AmbassadorRefTracker } from "@/components/AmbassadorRefTracker";
import { ChatBot } from "@/components/ChatBot";

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
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61583711643429"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                  aria-label="Facebook"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </a>

                <a
                  href="https://www.instagram.com/enfantdisparu.bf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-pink-700 rounded-lg text-xs font-medium transition-colors"
                  aria-label="Instagram"
                >
                  <span>📸</span>
                  <span>Instagram</span>
                </a>

                <a
                  href="https://x.com/Enfantdisparubf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors"
                  aria-label="X (Twitter)"
                >
                  <span>𝕏</span>
                  <span>X</span>
                </a>

                <a
                  href="https://www.tiktok.com/@enfantdisparu.bf?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors"
                  aria-label="TikTok"
                >
                  <span>🎵</span>
                  <span>TikTok</span>
                </a>

                <a
                  href="https://www.linkedin.com/company/enfantdisparu-bf/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-medium transition-colors"
                  aria-label="LinkedIn"
                >
                  <span>💼</span>
                  <span>LinkedIn</span>
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
