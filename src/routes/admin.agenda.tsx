import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";
import { dateTimeBR } from "@/lib/format";

export const Route = createFileRoute("/admin/agenda")({
  component: () => (
    <CrudPage
      table="sessions"
      title="Agenda online"
      description="Sessões de mentoria agendadas."
      select="*, students(full_name), mentorships(title)"
      orderBy={{ column: "scheduled_at", ascending: true }}
      columns={[
        { key: "title", label: "Sessão" },
        { key: "student", label: "Aluno", render: (r) => r["students"]?.full_name ?? "—" },
        { key: "scheduled_at", label: "Data", render: (r) => dateTimeBR(r["scheduled_at"]) },
        { key: "duration_min", label: "Min." },
        { key: "status", label: "Situação" },
      ]}
      fields={[
        { name: "title", label: "Título da sessão", required: true },
        {
          name: "student_id",
          label: "Aluno",
          type: "select",
          optionsFrom: { table: "students", labelKey: "full_name" },
        },
        {
          name: "mentorship_id",
          label: "Mentoria",
          type: "select",
          optionsFrom: { table: "mentorships", labelKey: "title" },
        },
        { name: "scheduled_at", label: "Data e hora", type: "datetime", required: true },
        { name: "duration_min", label: "Duração (min)", type: "number", defaultValue: 60 },
        { name: "meeting_url", label: "Link da reunião" },
        {
          name: "status",
          label: "Situação",
          type: "select",
          defaultValue: "agendada",
          options: [
            { value: "agendada", label: "Agendada" },
            { value: "realizada", label: "Realizada" },
            { value: "cancelada", label: "Cancelada" },
          ],
        },
        { name: "notes", label: "Anotações", type: "textarea" },
      ]}
    />
  ),
});
