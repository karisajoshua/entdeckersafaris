import { useEffect } from "react";

type LightboxProps = {
  photos: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function Lightbox({ photos, index, onClose, onChange }: LightboxProps) {
  const photo = photos[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [index, photos.length, onChange, onClose]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-twilight-ink/90 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label="Close gallery"
        onClick={onClose}
        className="absolute right-4 top-4 p-3 text-horizon-sand transition-colors hover:text-savannah-gold"
      >
        <span className="material-symbols-outlined text-[28px]">close</span>
      </button>

      <button
        type="button"
        aria-label="Previous photo"
        onClick={(e) => {
          e.stopPropagation();
          onChange((index - 1 + photos.length) % photos.length);
        }}
        className="absolute left-2 p-3 text-horizon-sand transition-colors hover:text-savannah-gold md:left-8"
      >
        <span className="material-symbols-outlined text-[32px]">chevron_left</span>
      </button>

      <figure className="max-h-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.src}
          alt={photo.alt}
          className="mx-auto max-h-[78vh] w-auto rounded-lg object-contain shadow-editorial-lg"
        />
        <figcaption className="mx-auto mt-4 max-w-2xl text-center text-body-md text-horizon-sand/80">
          {photo.alt}
          <span className="label mt-2 block text-horizon-sand/50">
            {index + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>

      <button
        type="button"
        aria-label="Next photo"
        onClick={(e) => {
          e.stopPropagation();
          onChange((index + 1) % photos.length);
        }}
        className="absolute right-2 p-3 text-horizon-sand transition-colors hover:text-savannah-gold md:right-8"
      >
        <span className="material-symbols-outlined text-[32px]">chevron_right</span>
      </button>
    </div>
  );
}
