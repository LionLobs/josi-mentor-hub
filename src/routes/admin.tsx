import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Crown,
  CalendarDays,
  Wallet,
  GraduationCap,
  Download,
  BarChart3,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/app-shell";
import { useAuth } from "@/lib/auth";
import { redirect } from "@tanstack/react-router";

const items: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/alunos", label: "Alunos", icon: Users },
  { to: "/admin/mentorias", label: "Mentorias", icon: Crown },
  { to: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/admin/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/admin/cursos", label: "Cursos", icon: GraduationCap },
  { to: "/admin/materiais", label: "Materiais", icon: Download },
  { to: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
];

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Redirection logic handled in AppShell component for better UX during hydration
    // But we can add a basic check here if needed for server-side
  },
  head: () => ({
    meta: [
      { title: "Painel administrativo — Josi Nascimento" },
      { name: "description", content: "Gestão de mentorias, alunos, agenda e financeiro." },
      { property: "og:title", content: "Painel administrativo — Josi Nascimento" },
      { property: "og:description", content: "Gestão completa do negócio de mentorias." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <AppShell items={items} area="ADMINISTRAÇÃO" />,
});
