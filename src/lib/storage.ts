import { supabase } from "@/integrations/supabase/client";

export const CONTENT_BUCKET = "conteudos";

function slugify(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .toLowerCase();
}

/** Uploads a file to the private content bucket and returns its storage path. */
export async function uploadContentFile(file: File, folder: string): Promise<string> {
  const path = `${folder}/${Date.now()}-${slugify(file.name)}`;
  const { error } = await supabase.storage
    .from(CONTENT_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return path;
}

export async function removeContentFile(path: string) {
  await supabase.storage.from(CONTENT_BUCKET).remove([path]);
}

/** Creates a temporary signed URL (default 2h) for a private file. */
export async function getSignedUrl(path: string, expiresIn = 60 * 60 * 2): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(CONTENT_BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export type EmbedKind = "youtube" | "vimeo" | "file" | "link" | "none";

/** Normalizes any supported video link into an embeddable source. */
export function resolveEmbed(url?: string | null): { kind: EmbedKind; src: string } {
  if (!url) return { kind: "none", src: "" };
  const value = url.trim();

  const yt = value.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i,
  );
  if (yt) return { kind: "youtube", src: `https://www.youtube.com/embed/${yt[1]}?rel=0` };

  const vimeo = value.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) return { kind: "vimeo", src: `https://player.vimeo.com/video/${vimeo[1]}` };

  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(value)) return { kind: "file", src: value };

  return { kind: "link", src: value };
}
