import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

/**
 * Composant Field pour les formulaires
 * Affiche un label, le champ et un message d'erreur optionnel
 */
export function Field({ label, required, error, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

type InputVariant = "red" | "emerald";

/**
 * Génère les classes CSS pour un input de formulaire
 * @param hasError - Si le champ a une erreur
 * @param variant - Couleur du focus ring ("red" ou "emerald")
 */
export function inputClass(hasError: boolean, variant: InputVariant = "red"): string {
  const focusColors = {
    red: "focus:ring-red-500 focus:border-red-400",
    emerald: "focus:ring-emerald-500 focus:border-emerald-400",
  };

  return cn(
    "w-full border rounded-xl px-3 sm:px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 transition-colors",
    hasError ? "border-red-300 focus:ring-red-500" : `border-gray-200 ${focusColors[variant]}`
  );
}
