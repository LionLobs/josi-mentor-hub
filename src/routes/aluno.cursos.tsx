import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, PlayCircle, Star, Clock, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { COURSE_POSTERS } from "@/lib/course-art";

// Import new professional assets
import josiElite from "@/assets/josi_nascimento_40_anos-26.jpg";
import josiAvancada from "@/assets/josi_nascimento_40_anos-14.jpg";
import josiVitoria from "@/assets/josi_nascimento_40_anos-38-2.jpg";
import josiDestaque from "@/assets/josi_nascimento_40_anos-31.jpg";
import josiHero from "@/assets/josi_nascimento_40_anos-2.jpg";

export const Route = createFileRoute("/aluno/cursos")({
  component: StudentCourses,
});



function NetflixHero({ course }: { course: any }) {
  if (!course) return null;

  return (
    <div className="relative mb-12 h-[60vh] min-h-[400px] w-full overflow-hidden rounded-3xl">
      <img
        src={josiHero}
        alt="Featured Course"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:w-1/2">
        <div className="flex items-center gap-2 text-gold mb-4">
          <Flame className="h-5 w-5 fill-gold" />
          <span className="text-xs font-bold tracking-widest uppercase">Em Destaque</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 leading-tight">
          {course.title}
        </h1>
        <p className="text-lg text-white/80 mb-8 line-clamp-3 max-w-xl">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/aluno/cursos/$courseId"
            params={{ courseId: course.id }}
            className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gold transition-colors"
          >
            <PlayCircle className="h-5 w-5 fill-black" />
            Assistir Agora
          </Link>
          <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold hover:bg-white/30 transition-colors">
            Mais Informações
          </button>
        </div>
      </div>
    </div>
  );
}

function NetflixPoster({ course, progress }: { course: any; progress: number }) {
  const coverUrl = COURSE_POSTERS[course.title] || course.cover_url;

  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className="group relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 bg-card shadow-lux transition-all"
    >
      <Link to="/aluno/cursos/$courseId" params={{ courseId: course.id }}>
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted/40">
            <GraduationCap className="h-12 w-12 text-gold/20" />
          </div>
        )}
        
        {/* Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-gold">
                <Star className="h-3 w-3 fill-gold" />
                <span className="text-[10px] font-bold">TOP 10</span>
              </div>
              <div className="text-[10px] text-white/60 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.course_modules?.length || 0} aulas
              </div>
            </div>
            <h3 className="text-sm font-bold text-white mb-3 line-clamp-1">{course.title}</h3>
            
            {progress > 0 && (
              <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gold"
                />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StudentCourses() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["aluno-cursos", user?.id],
    queryFn: async () => {
      const [coursesRes, progressRes] = await Promise.all([
        supabase
          .from("courses")
          .select("id, title, description, cover_url, course_modules(id, title, position)")
          .eq("published", true)
          .order("created_at", { ascending: false }),
        supabase.from("lesson_progress").select("module_id").not("completed_at", "is", null),
      ]);
      if (coursesRes.error) throw coursesRes.error;
      return {
        courses: coursesRes.data ?? [],
        done: new Set((progressRes.data ?? []).map((p: any) => p.module_id)),
      };
    },
  });

  const courses = data?.courses ?? [];
  const featuredCourse = courses.find(c => c.title === "Mentoria Elite") || courses[0];

  return (
    <div className="pb-20">
      <NetflixHero course={featuredCourse} />

      <section className="mt-8">
        <h2 className="text-2xl font-serif text-white mb-6 px-1 flex items-center gap-2">
          Sua Jornada <span className="text-gold">Premium</span>
        </h2>
        
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && courses.length === 0 && (
          <div className="text-center py-20 rounded-3xl border border-dashed border-white/10">
            <GraduationCap className="h-12 w-12 text-gold/20 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum curso disponível na sua conta ainda.</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {courses.map((course: any) => {
            const modules = course.course_modules ?? [];
            const completed = modules.filter((m: any) => data?.done.has(m.id)).length;
            const pct = modules.length ? (completed / modules.length) * 100 : 0;
            
            return (
              <NetflixPoster 
                key={course.id} 
                course={course} 
                progress={pct}
              />
            );
          })}
        </div>
      </section>

      {/* Recommended Section (Visual Mockup) */}
      <section className="mt-16">
        <h2 className="text-2xl font-serif text-white mb-6 px-1">
          Materiais <span className="text-gold">Complementares</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="group relative h-48 rounded-2xl border border-white/10 overflow-hidden bg-card">
            <img src={josiAvancada} className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-30" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="font-bold text-white">E-book: A Arte do Toque</h3>
              <p className="text-xs text-white/60">PDF Interativo • 45 páginas</p>
            </div>
          </div>
          <div className="group relative h-48 rounded-2xl border border-white/10 overflow-hidden bg-card">
            <img src={josiVitoria} className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-30" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="font-bold text-white">Checklist da Vitória</h3>
              <p className="text-xs text-white/60">Material Prático • Excel</p>
            </div>
          </div>
          <div className="group relative h-48 rounded-2xl border border-white/10 overflow-hidden bg-card">
            <img src={josiElite} className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-30" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="font-bold text-white">Guia de Posicionamento</h3>
              <p className="text-xs text-white/60">Vídeo Complementar • 12min</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
