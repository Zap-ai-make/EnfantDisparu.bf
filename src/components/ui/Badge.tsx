import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "red" | "orange" | "gray" | "green";
}

const variants = {
  red: "bg-red-100 text-red-700 border-red-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  gray: "bg-gray-100 text-gray-600 border-gray-200",
  green: "bg-green-100 text-green-700 border-green-200",
};

export function Badge({ children, className, variant = "gray" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
