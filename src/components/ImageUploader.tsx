import { useRef } from "react";

interface Props {
  onSelect: (file: File) => void;
}

/** Carga de imágenes desde el dispositivo (PB-02). */
export default function ImageUploader({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-dashed border-gray-400 px-4 py-6 text-gray-600 hover:border-gray-600"
      >
        Subir una imagen
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
