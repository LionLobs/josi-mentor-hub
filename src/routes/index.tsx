import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Crown,
  CalendarCheck,
  Wallet,
  GraduationCap,
  Download,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import heroImg from "@/assets/hero-mentoria.jpg";
import logoAsset from "@/assets/logo-horiz.png.asset.json";
import josiHero from "@/assets/josi-42.jpg.asset.json";
import josiSobre from "@/assets/josi-10.jpg.asset.json";
import josiPremio from "@/assets/josi-25.jpg.asset.json";
import josiSorriso from "@/assets/josi-6.jpg.asset.json";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Josi Nascimento — Mentoria de Alto Impacto" },
      {
        name: "description",
        content:
          "Mentoria exclusiva de Josi Nascimento: método guiado, aulas gravadas, agenda online e acompanhamento individual para você brilhar com técnica e confiança.",
      },
      { property: "og:title", content: "Josi Nascimento — Mentoria de Alto Impacto" },
      {
        property: "og:description",
        content:
          "Método guiado, aulas gravadas, agenda online e acompanhamento individual. Menos dúvidas, mais técnica, mais confiança.",
      },
    ],
  }),
  component: Landing,
});

const pilares = [
  { icon: Crown, title: "Método guiado", text: "Módulos em sequência, do fundamento ao palco." },
  { icon: CalendarCheck, title: "Agenda online", text: "Sessões individuais marcadas em segundos." },
  { icon: GraduationCap, title: "Área do aluno", text: "Aulas, materiais e evolução em um só lugar." },
  { icon: Wallet, title: "Financeiro claro", text: "Pagamentos, parcelas e recibos organizados." },
  { icon: Download, title: "Downloads", text: "Apostilas, checklists e bônus liberados." },
  { icon: ShieldCheck, title: "Acesso seguro", text: "Cada aluna vê apenas o conteúdo dela." },
];

const modulos = [
  { n: "01", nome: "PRESENÇA", desc: "Postura, respiração e domínio do próprio corpo." },
  { n: "02", nome: "ATITUDE", desc: "Marcação, ritmo e expressão em cada passo." },
  { n: "03", nome: "CONEXÃO", desc: "Olhar, storytelling e presença de palco." },
  { n: "04", nome: "TRIUNFO", desc: "Poses, finalização e performance completa." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="surface-ink sticky top-0 z-40 border-b border-white/10">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="font-display truncate text-lg leading-none tracking-wide">
              Josi Nascimento
            </p>
            <p className="text-[11px] tracking-[0.3em] text-gold-soft/80">MENTORIA</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild size="sm" variant="gold">
              <Link to="/auth">Quero entrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="surface-ink relative overflow-hidden">
        <img
          src={heroImg}
          alt="Fundo elegante em verde e dourado"
          width={1280}
          height={1024}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-center sm:py-32">
          <span className="hairline-gold inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-[0.2em] text-gold">
            <Sparkles className="h-3.5 w-3.5" /> MÉTODO IMPACTO
          </span>
          <h1 className="font-display mx-auto mt-7 max-w-3xl text-4xl leading-tight sm:text-6xl">
            Aulas guiadas pelo meu <span className="text-gradient-gold">método IMPACTO</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/75 sm:text-lg">
            Menos dúvidas. Mais técnica. Mais confiança para dominar cada passo, cada pose e cada
            palco.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="gold">
              <Link to="/auth">
                Começar minha mentoria <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-center text-3xl sm:text-4xl">
          Tudo o que você recebe por dentro
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pilares.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border bg-card p-6 shadow-elegant transition-transform hover:-translate-y-1"
            >
              <p.icon className="h-6 w-6 text-gold" />
              <h3 className="mt-4 text-xl">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-ink py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs tracking-[0.35em] text-gold">MÓDULOS</p>
          <h2 className="font-display mt-3 text-center text-3xl sm:text-4xl">
            A jornada completa da mentoria
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modulos.map((m) => (
              <div key={m.n} className="hairline-gold rounded-xl bg-white/5 p-6">
                <p className="font-display text-3xl text-gradient-gold">{m.n}</p>
                <p className="mt-3 text-sm tracking-[0.25em] text-white">{m.nome}</p>
                <p className="mt-2 text-sm text-white/60">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">Sua vaga na próxima turma</h2>
        <p className="mt-4 text-muted-foreground">
          Acesso à plataforma exclusiva, agenda de sessões individuais e todos os materiais do
          método.
        </p>
        <Button asChild size="lg" variant="gold" className="mt-8">
          <Link to="/auth">Garantir meu acesso</Link>
        </Button>
      </section>

      <footer className="surface-ink py-8 text-center text-sm text-white/60">
        © {new Date().getFullYear()} Josi Nascimento · Plataforma de Mentorias
      </footer>
    </div>
  );
}
