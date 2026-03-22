import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir Ambassadeur",
  description:
    "Rejoignez notre réseau d'ambassadeurs au Burkina Faso. Recevez les alertes en temps réel et aidez à retrouver les enfants disparus dans votre zone.",
  openGraph: {
    title: "Devenir Ambassadeur | EnfantDisparu.bf",
    description:
      "Rejoignez le réseau et aidez à retrouver les enfants disparus au Burkina Faso.",
  },
};

export default function DevenirAmbassadeurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
