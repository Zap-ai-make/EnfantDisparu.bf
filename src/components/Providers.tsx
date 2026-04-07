'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Providers pour l'application
 * - React Query pour le cache et la gestion d'état serveur
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Les données sont considérées fraîches pendant 1 minute
            gcTime: 5 * 60 * 1000, // Les données en cache sont conservées pendant 5 minutes
            refetchOnWindowFocus: false, // Ne pas refetch au focus (économise requêtes)
            retry: 1, // 1 seule tentative de retry (économise temps)
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
