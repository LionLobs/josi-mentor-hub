import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/admin/mentorias")({
  component: () => (
    <CrudPage
      table="mentorships"
      title="Mentorias"
      description="Programas de mentoria oferecidos."
      orderBy={{ column: "created_at" }}
      columns={[
        { key: "title", label: "Mentoria" },
        { key: "price_cents", label: "Investimento", render: (r) => brl(r["price_cents"]) },
        { key: "duration_weeks", label: "Semanas" },
        { key: "status", label: "Situação" },
      ]}
      fields={[
        { name: "title", label: "Título", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "price_cents", label: "Investimento (R$)", type: "money", defaultValue: 0 },
        { name: "duration_weeks", label: "Duração (semanas)", type: "number", defaultValue: 8 },
        {
          name: "external_id",
          label: "ID do produto na Kiwify",
          hint: "Cole o Product ID da Kiwify para liberar o acesso automaticamente após a compra.",
        },
        {
          name: "status",
          label: "Situação",
          type: "select",
          defaultValue: "ativa",
          options: [
            { value: "ativa", label: "Ativa" },
            { value: "encerrada", label: "Encerrada" },
          ],
        },
      ]}
    />
  ),
});
