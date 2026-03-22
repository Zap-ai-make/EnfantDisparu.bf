import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { OneSignalInit } from "@/components/OneSignalInit";
import { AmbassadorRefTracker } from "@/components/AmbassadorRefTracker";

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
              <Link href="/admin/ambassadeurs" className="text-gray-300 hover:text-gray-500 text-[10px]">
                Admin
              </Link>
            </div>

            <p className="text-gray-300 pt-1">
              © {new Date().getFullYear()} EnfantDisparu.bf
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
