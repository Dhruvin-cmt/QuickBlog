import {
  Cpu,
  Code2,
  Globe,
  Smartphone,
  Brain,
  Database,
  Palette,
  Server,
  Shield,
  Rocket,
  Briefcase,
  Heart,
  Wallet,
  GraduationCap,
  Zap,
} from "lucide-react";

export const Category = [
    "TECHNOLOGY",
    "PROGRAMMING",
    "WEB_DEVELOPMENT",
    "MOBILE_DEVELOPMENT",
    "AI_ML",
    "DATA_SCIENCE",
    "DESIGN",
    "DEVOPS",
    "SECURITY",
    "STARTUPS",
    "CAREER",
    "LIFESTYLE",
    "FINANCE",
    "EDUCATION",
    "PRODUCTIVITY",
  ] as const;
  
  export type CategoryType = (typeof Category)[number];

  export const CategoryMeta: Record<
  CategoryType,
  {
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
  }
> = {
  TECHNOLOGY: {
    icon: Cpu,
    color: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.1)",
    border: "rgba(56, 189, 248, 0.25)",
  },

  PROGRAMMING: {
    icon: Code2,
    color: "#34d399",
    bg: "rgba(52, 211, 153, 0.1)",
    border: "rgba(52, 211, 153, 0.25)",
  },

  WEB_DEVELOPMENT: {
    icon: Globe,
    color: "#22d3ee",
    bg: "rgba(34, 211, 238, 0.1)",
    border: "rgba(34, 211, 238, 0.25)",
  },

  MOBILE_DEVELOPMENT: {
    icon: Smartphone,
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.1)",
    border: "rgba(167, 139, 250, 0.25)",
  },

  AI_ML: {
    icon: Brain,
    color: "#f472b6",
    bg: "rgba(244, 114, 182, 0.1)",
    border: "rgba(244, 114, 182, 0.25)",
  },

  DATA_SCIENCE: {
    icon: Database,
    color: "#fbbf24",
    bg: "rgba(251, 191, 36, 0.1)",
    border: "rgba(251, 191, 36, 0.25)",
  },

  DESIGN: {
    icon: Palette,
    color: "#fb7185",
    bg: "rgba(251, 113, 133, 0.1)",
    border: "rgba(251, 113, 133, 0.25)",
  },

  DEVOPS: {
    icon: Server,
    color: "#fb923c",
    bg: "rgba(251, 146, 60, 0.1)",
    border: "rgba(251, 146, 60, 0.25)",
  },

  SECURITY: {
    icon: Shield,
    color: "#f87171",
    bg: "rgba(248, 113, 113, 0.1)",
    border: "rgba(248, 113, 113, 0.25)",
  },

  STARTUPS: {
    icon: Rocket,
    color: "#e879f9",
    bg: "rgba(232, 121, 249, 0.1)",
    border: "rgba(232, 121, 249, 0.25)",
  },

  CAREER: {
    icon: Briefcase,
    color: "#60a5fa",
    bg: "rgba(96, 165, 250, 0.1)",
    border: "rgba(96, 165, 250, 0.25)",
  },

  LIFESTYLE: {
    icon: Heart,
    color: "#f9a8d4",
    bg: "rgba(249, 168, 212, 0.1)",
    border: "rgba(249, 168, 212, 0.25)",
  },

  FINANCE: {
    icon: Wallet,
    color: "#4ade80",
    bg: "rgba(74, 222, 128, 0.1)",
    border: "rgba(74, 222, 128, 0.25)",
  },

  EDUCATION: {
    icon: GraduationCap,
    color: "#818cf8",
    bg: "rgba(129, 140, 248, 0.1)",
    border: "rgba(129, 140, 248, 0.25)",
  },

  PRODUCTIVITY: {
    icon: Zap,
    color: "#facc15",
    bg: "rgba(250, 204, 21, 0.1)",
    border: "rgba(250, 204, 21, 0.25)",
  },
};