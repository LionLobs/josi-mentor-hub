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
          { name: "cover_url", label: "URL da capa" },
          { name: "price_cents", label: "Preço (R$)", type: "money", defaultValue: 0 },
          { name: "published", label: "Publicado", type: "checkbox", defaultValue: false },
        ]}
      />

      <CrudPage
        table="course_modules"
        title="Módulos"
        description="Aulas e módulos vinculados a cada curso."
        select="*, courses(title)"
        orderBy={{ column: "position", ascending: true }}
        columns={[
          { key: "position", label: "#" },
          { key: "title", label: "Módulo" },
          { key: "course", label: "Curso", render: (r) => r["courses"]?.title ?? "—" },
        ]}
        fields={[
          {
            name: "course_id",
            label: "Curso",
            type: "select",
            required: true,
            optionsFrom: { table: "courses", labelKey: "title" },
          },
          { name: "title", label: "Título do módulo", required: true },
          { name: "description", label: "Descrição", type: "textarea" },
          { name: "video_url", label: "URL do vídeo" },
          { name: "cover_url", label: "URL da capa" },
          { name: "position", label: "Ordem", type: "number", defaultValue: 1 },
        ]}
      />
    </div>
  );
}
