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
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-mentoria.jpg";
import logoAsset from "@/assets/logo-horiz.png.asset.json";
import josiHero from "@/assets/josi-42.jpg.asset.json";
import josiSobre from "@/assets/josi-10.jpg.asset.json";
import josiPremio from "@/assets/josi-25.jpg.asset.json";
import josiSorriso from "@/assets/josi-6.jpg.asset.json";
import josiHeroBg from "@/assets/josi-17.jpg.asset.json";
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="glass-ink sticky top-0 z-50 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0"
          >
            <img
              src={logoAsset.url}
              alt="Josi Nascimento — Massoterapia Avançada"
              className="h-8 w-auto sm:h-10"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex shrink-0 items-center gap-4"
          >
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-white hover:bg-white/10">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild size="sm" variant="gold" className="shadow-gold">
              <Link to="/auth">Quero entrar</Link>
            </Button>
          </motion.div>
        </div>
      </header>

      <section className="surface-ink relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.35, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            <img
              src={josiHeroBg.url}
              alt="Josi Nascimento — Massoterapia Avançada"
              className="h-full w-full object-cover object-[center_20%] mix-blend-luminosity filter brightness-110 contrast-125"
            />
          </motion.div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-ink/40 to-ink" />
          <div className="absolute top-1/4 -left-20 h-96 w-96 bg-gold/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 h-96 w-96 bg-primary/30 blur-[120px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left lg:max-w-3xl"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hairline-gold mb-8 inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2 text-[10px] font-medium tracking-[0.3em] text-gold uppercase"
            >
              <Sparkles className="h-3.5 w-3.5" /> Mentoria Exclusiva
            </motion.div>
            <h1 className="font-display text-5xl leading-[1.1] sm:text-7xl lg:text-9xl font-black tracking-tighter uppercase italic">
              Elevando a sua{" "}
              <span className="text-gradient-gold block mt-2 drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">Arte do Toque</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-white/70 leading-relaxed sm:text-2xl lg:mx-0">
              Transforme sua carreira com o método de <span className="text-white font-medium">Massoterapia Avançada</span>. 
              Domine técnicas exclusivas e conquiste o posicionamento que você merece.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-5 lg:justify-start">
              <Button asChild size="xl" variant="gold" className="h-14 px-10 text-base shadow-gold group">
                <Link to="/auth">
                  Começar minha mentoria 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="h-14 px-10 text-base border-white/20 text-white hover:bg-white/10">
                <Link to="/auth">Conhecer o método</Link>
              </Button>
            </div>
            
            {/* Certificação Badge - repositioned since portrait is gone */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 flex items-center gap-4 lg:justify-start justify-center"
            >
              <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Crown className="h-6 w-6 text-gold" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gold font-medium uppercase tracking-wider">Certificação</p>
                <p className="text-lg font-display text-white italic">Internacional Mar del Plata</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-32 relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] -z-10" />
        
        <motion.div 
          {...fadeInUp}
          className="text-center mb-20"
        >
          <p className="text-gold text-xs font-semibold tracking-[0.4em] uppercase mb-4">Experiência</p>
          <h2 className="font-display text-4xl sm:text-6xl font-black uppercase">
            Tudo o que você recebe por dentro
          </h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {pilares.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeInUp}
              className="group relative rounded-3xl border border-border/50 bg-card p-8 shadow-sm transition-all hover:shadow-elegant hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-24 w-24 bg-gold/5 rounded-bl-[100%] transition-all group-hover:scale-150" />
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center transition-colors group-hover:bg-gold/10 mb-6">
                  <p.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-2xl font-display mb-4">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="surface-ink py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--gold-soft)_0%,_transparent_100%)] opacity-5" />
        
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <p className="text-gold text-xs font-semibold tracking-[0.4em] uppercase mb-4">Cronograma</p>
            <h2 className="font-display text-4xl sm:text-6xl text-white">
              A jornada completa da mentoria
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {modulos.map((m, idx) => (
              <motion.div 
                key={m.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group glass-ink rounded-[2rem] p-8 border border-white/5 hover:border-gold/30 transition-all"
              >
                <p className="font-display text-5xl text-gradient-gold opacity-50 group-hover:opacity-100 transition-opacity">{m.n}</p>
                <div className="mt-8">
                  <h4 className="text-sm font-semibold tracking-[0.2em] text-white uppercase mb-3">{m.nome}</h4>
                  <p className="text-sm text-white/50 leading-relaxed">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="space-y-6">
              <img
                src={josiSorriso.url}
                alt="Josi Nascimento sorrindo"
                className="aspect-[3/4] w-full rounded-[2rem] object-cover shadow-2xl"
              />
              <img
                src={josiSobre.url}
                alt="Josi Nascimento no consultório"
                className="aspect-square w-full rounded-[2rem] object-cover shadow-2xl"
              />
            </div>
            <div className="pt-12">
              <img
                src={josiPremio.url}
                alt="Josi Nascimento com prêmio"
                className="aspect-[3/5] w-full rounded-[2rem] object-cover shadow-2xl border-2 border-gold/20"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold text-xs font-semibold tracking-[0.4em] uppercase mb-4">A Mentora</p>
            <h2 className="font-display text-4xl sm:text-6xl mb-8">Josi Nascimento</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Massoterapeuta premiada e reconhecida internacionalmente, Josi transformou anos de
                prática clínica em um método claro e replicável.
              </p>
              <p>
                Nesta mentoria, ela conduz você passo a passo — da excelência técnica ao posicionamento 
                de mercado que atrai clientes de alto valor.
              </p>
              <p>
                Uma plataforma exclusiva onde você recebe acompanhamento individual, aulas estratégicas e 
                todo o suporte necessário para sua transformação profissional.
              </p>
            </div>
            <div className="mt-12 flex items-center gap-6">
              <div className="h-px flex-1 bg-border" />
              <div className="font-display text-2xl italic">Josi Nascimento</div>
              <div className="h-px flex-1 bg-border" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="surface-ink relative overflow-hidden rounded-[3rem] p-12 sm:p-20 text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-display text-4xl sm:text-6xl text-white mb-6">Sua vaga na próxima turma</h2>
            <p className="text-white/60 text-lg mb-10 leading-relaxed">
              Tenha acesso imediato à plataforma exclusiva, cronograma de sessões individuais 
              e toda a biblioteca de conhecimentos do método.
            </p>
            <Button asChild size="xl" variant="gold" className="h-16 px-12 text-lg shadow-gold group">
              <Link to="/auth" className="flex items-center gap-3">
                Garantir meu acesso agora
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <p className="mt-8 text-white/40 text-sm tracking-widest uppercase">Vagas limitadas por turma</p>
          </div>
        </motion.div>
      </section>

      <footer className="surface-ink py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <img
            src={logoAsset.url}
            alt="Josi Nascimento — Massoterapia Avançada"
            className="mx-auto mb-8 h-12 w-auto opacity-80"
          />
          <div className="flex justify-center gap-8 mb-8 text-white/40 text-sm">
            <a href="#" className="hover:text-gold transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-gold transition-colors">Privacidade</a>
            <a href="#" className="hover:text-gold transition-colors">Suporte</a>
          </div>
          <p className="text-white/30 text-xs tracking-widest">
            © {new Date().getFullYear()} JOSI NASCIMENTO · DESIGNED FOR EXCELLENCE
          </p>
        </div>
      </footer>
    </div>
  );
}