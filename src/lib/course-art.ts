import josiElite from "@/assets/josi_nascimento_40_anos-26.jpg";
import josiAvancada from "@/assets/josi_nascimento_40_anos-14.jpg";
import josiVitoria from "@/assets/josi_nascimento_40_anos-38-2.jpg";
import josiDestaque from "@/assets/josi_nascimento_40_anos-31.jpg";
import josiMesa from "@/assets/josi_nascimento_40_anos-21.jpg";
import josiRetrato from "@/assets/josi_nascimento_40_anos-2.jpg";
import josiVermelho from "@/assets/josi_nascimento_40_anos-42-2.jpg";

/** Capa por curso (fallback quando não há cover_url no banco). */
export const COURSE_POSTERS: Record<string, string> = {
  "Mentoria Elite": josiElite,
  "Massoterapia Avançada": josiAvancada,
  "Protocolo da Vitória": josiVitoria,
  "Destaque-se no Mercado": josiDestaque,
  "Destaque-se — Mentoria Josi Nascimento": josiVermelho,
};

/** Capa temática de cada videoaula da mentoria (por número da aula). */
export const LESSON_COVERS: Record<number, string> = {
  1: josiRetrato,
  2: josiMesa,
  3: josiElite,
  4: josiDestaque,
  5: josiAvancada,
  6: josiVitoria,
};

export function lessonCover(module: { title?: string | null; position?: number | null; cover_url?: string | null }) {
  if (module.cover_url) return module.cover_url;
  const fromTitle = module.title?.match(/Aula\s*0?(\d+)/i)?.[1];
  const n = fromTitle ? Number(fromTitle) : (module.position ?? 0);
  return LESSON_COVERS[n] ?? josiRetrato;
}
