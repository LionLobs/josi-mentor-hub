import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/admin/cursos")({
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <div className="space-y-12">
      <CrudPage
        table="courses"
        title="Cursos online"
        description="Produtos digitais disponíveis para venda e para a área do aluno."
        orderBy={{ column: "created_at" }}
        columns={[
          { key: "title", label: "Curso" },
          { key: "price_cents", label: "Preço", render: (r) => brl(r["price_cents"]) },
          { key: "published", label: "Publicado", render: (r) => (r["published"] ? "Sim" : "Não") },
        ]}
        fields={[
          { name: "title", label: "Título", required: true },
          { name: "description", label: "Descrição", type: "textarea" },
          {
            name: "cover_url",
            label: "Capa do Curso (Mockup)",
            type: "file",
            folder: "cursos",
            accept: "image/*",
            hint: "Dê preferência a imagens 2:3 estilo Netflix para melhor visual."
          },
          { name: "price_cents", label: "Preço (R$)", type: "money", defaultValue: 0 },
          { name: "published", label: "Publicado", type: "checkbox", defaultValue: false },
        ]}
      />

      <CrudPage
        table="course_modules"
        title="Videoaulas e Módulos"
        description="Envie o vídeo direto para a plataforma ou cole um link do YouTube/Vimeo."
        select="*, courses(title)"
        orderBy={{ column: "position", ascending: true }}
        columns={[
          { key: "position", label: "#" },
          { key: "title", label: "Título da Aula" },
          { key: "course", label: "Curso", render: (r) => r["courses"]?.title ?? "—" },
          {
            key: "origem",
            label: "Origem",
            render: (r) => (r["storage_path"] ? "Upload" : r["video_url"] ? "Link externo" : "—"),
          },
        ]}
        fields={[
          {
            name: "course_id",
            label: "Curso",
            type: "select",
            required: true,
            optionsFrom: { table: "courses", labelKey: "title" },
          },
          { name: "title", label: "Título da aula/módulo", required: true },
          { name: "description", label: "Descrição", type: "textarea" },
          {
            name: "storage_path",
            label: "Vídeo da plataforma (upload)",
            type: "file",
            folder: "aulas",
            accept: "video/*",
            hint: "MP4, WebM ou MOV. Fica hospedado com acesso restrito às alunas.",
          },
          { name: "video_url", label: "Ou link externo (YouTube, Vimeo, MP4)" },
          { name: "cover_url", label: "URL da capa" },
          { name: "duration_min", label: "Duração (min)", type: "number" },
          { name: "position", label: "Ordem", type: "number", defaultValue: 1 },
        ]}
      />
    </div>
  );
}
