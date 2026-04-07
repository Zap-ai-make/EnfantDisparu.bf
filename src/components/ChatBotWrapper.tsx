'use client';

import dynamic from 'next/dynamic';

// Lazy load du ChatBot (composant lourd, non critique pour le premier rendu)
const ChatBot = dynamic(() => import('./ChatBot').then(mod => ({ default: mod.ChatBot })), {
  ssr: false,
  loading: () => null,
});

export function ChatBotWrapper() {
  return <ChatBot />;
}
