import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retrouvailles",
  description:
    "Découvrez les enfants retrouvés grâce à EnfantDisparu.bf. Chaque retrouvaille est une victoire pour notre communauté au Burkina Faso.",
  openGraph: {
    title: "Retrouvailles | EnfantDisparu.bf",
    description:
      "Les enfants retrouvés grâce à la mobilisation de notre communauté.",
  },
};

export default function RetrouvaillesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
