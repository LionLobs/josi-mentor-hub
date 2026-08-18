import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, GraduationCap, Wallet, Download } from "lucide-react";
import { AppShell, type NavItem } from "@/components/app-shell";

const items: NavItem[] = [
  { to: "/aluno", label: "Início", icon: LayoutDashboard },
  { to: "/aluno/cursos", label: "Meus cursos", icon: GraduationCap },
  { to: "/aluno/agenda", label: "Minha agenda", icon: CalendarDays },
  { to: "/aluno/pagamentos", label: "Pagamentos", icon: Wallet },
  { to: "/aluno/materiais", label: "Downloads", icon: Download },
];

export const Route = createFileRoute("/aluno")({
  head: () => ({
    meta: [
      { title: "Área do aluno — Josi Nascimento" },
      { name: "description", content: "Acesse suas mentorias, aulas, agenda e materiais." },
      { property: "og:title", content: "Área do aluno — Josi Nascimento" },
      { property: "og:description", content: "Sua jornada de mentoria em um só lugar." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <AppShell items={items} area="ÁREA DO ALUNO" />,
});
