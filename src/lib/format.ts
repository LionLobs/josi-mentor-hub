export const brl = (cents: number) =>
  ((cents ?? 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const dateBR = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("pt-BR") : "—";

export const dateTimeBR = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
