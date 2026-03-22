import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suivi de candidature",
  description:
    "Suivez l'état de votre candidature ambassadeur EnfantDisparu.bf avec votre code de référence.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CandidatureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
