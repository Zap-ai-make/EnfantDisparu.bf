import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signaler un enfant disparu",
  description:
    "Signalez la disparition d'un enfant au Burkina Faso. Votre annonce sera diffusée instantanément sur Facebook, WhatsApp et auprès de milliers de personnes.",
  openGraph: {
    title: "Signaler un enfant disparu | EnfantDisparu.bf",
    description:
      "Signalez rapidement un enfant disparu. Diffusion instantanée sur les réseaux sociaux.",
  },
};

export default function SignalerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
