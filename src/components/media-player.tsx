import { useEffect, useState } from "react";
import { ExternalLink, Loader2, VideoOff } from "lucide-react";
import { getSignedUrl, resolveEmbed } from "@/lib/storage";

type Props = {
  /** External link (YouTube, Vimeo, MP4 or any URL) */
  videoUrl?: string | null;
  /** Path inside the private content bucket (uploaded video) */
  storagePath?: string | null;
  title?: string;
};

export function MediaPlayer({ videoUrl, storagePath, title }: Props) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(storagePath));

  useEffect(() => {
    let active = true;
    if (!storagePath) {
      setUploadedUrl(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    void getSignedUrl(storagePath).then((url) => {
      if (!active) return;
      setUploadedUrl(url);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [storagePath]);

  if (loading) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border bg-muted/40">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (uploadedUrl) {
    return (
      <video
        controls
        controlsList="nodownload"
        className="aspect-video w-full rounded-xl border bg-black shadow-elegant"
        src={uploadedUrl}
      />
    );
  }

  const embed = resolveEmbed(videoUrl);

  if (embed.kind === "youtube" || embed.kind === "vimeo") {
    return (
      <iframe
        title={title ?? "Aula"}
        src={embed.src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full rounded-xl border bg-black shadow-elegant"
      />
    );
  }

  if (embed.kind === "file") {
    return (
      <video
        controls
        className="aspect-video w-full rounded-xl border bg-black shadow-elegant"
        src={embed.src}
      />
    );
  }

  if (embed.kind === "link") {
    return (
      <a
        href={embed.src}
        target="_blank"
        rel="noreferrer"
        className="flex aspect-video items-center justify-center gap-2 rounded-xl border bg-muted/30 text-sm hover:bg-accent"
      >
        <ExternalLink className="h-4 w-4 text-gold" /> Abrir conteúdo externo
      </a>
    );
  }

  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border bg-muted/30 text-sm text-muted-foreground">
      <VideoOff className="h-5 w-5" />
      Conteúdo em breve.
    </div>
  );
}
