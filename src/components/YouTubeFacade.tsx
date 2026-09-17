import { useState } from "react";

interface YouTubeFacadeProps {
  /** YouTube video id, ví dụ "wtxXklOBhgE" (không phải URL đầy đủ) */
  videoId: string;
  title: string;
}

/**
 * "Facade" cho video YouTube: chỉ hiện ảnh thumbnail + nút play, KHÔNG render
 * <iframe> cho tới khi người dùng bấm — tránh tải JS/network nặng của YouTube
 * cho những video không ai xem tới.
 */
export default function YouTubeFacade({ videoId, title }: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (playing) {
    return (
      <div className="youtube-facade">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="youtube-facade"
      onClick={() => setPlaying(true)}
      aria-label={`Phát video: ${title}`}
    >
      <img
        src={thumbnailUrl}
        alt={title}
        loading="lazy"
        width={480}
        height={360}
        className="youtube-facade-thumb"
      />
      <span className="youtube-facade-play" aria-hidden="true">▶</span>
    </button>
  );
}
