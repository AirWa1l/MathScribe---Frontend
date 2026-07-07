import { useEffect, useRef, useState } from "react";

interface Props {
  onCapture: (file: File) => void;
}

/**
 * Captura desde la cámara del dispositivo (PB-01).
 *
 * Solicita el stream con `navigator.mediaDevices.getUserMedia`, lo muestra en un
 * <video>, captura el frame actual en un <canvas> oculto y lo emite como File.
 */
export default function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Engancha el stream al <video> cuando ya está montado (tras el re-render).
  // Hacerlo aquí y no dentro de `abrir()` evita que `videoRef` sea null.
  useEffect(() => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Apaga la cámara si el componente se desmonta con el stream abierto.
  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  /** Corta todas las pistas del stream y apaga la cámara. */
  function detener() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  async function abrir() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este navegador no permite acceder a la cámara.");
      return;
    }
    try {
      setStream(await navigator.mediaDevices.getUserMedia({ video: true }));
    } catch {
      setError(
        "No se pudo acceder a la cámara. Revisa los permisos o usa «Subir una imagen».",
      );
    }
  }

  function tomarFoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        setError("No se pudo capturar la imagen. Inténtalo de nuevo.");
        return;
      }
      const file = new File([blob], `captura-${Date.now()}.png`, {
        type: "image/png",
      });
      onCapture(file);
      detener();
    }, "image/png");
  }

  if (stream) {
    return (
      <div className="flex flex-col gap-2 sm:col-span-2">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-xl border border-gray-300 bg-black"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={tomarFoto}
            className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Tomar foto
          </button>
          <button
            type="button"
            onClick={detener}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
          >
            Cancelar
          </button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={abrir}
        className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-8 text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8a2 2 0 0 1 2-2h1.5l1-1.5h5l1 1.5H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <circle cx="12" cy="12.5" r="3.5" />
        </svg>
        <span className="text-sm font-medium">Usar la cámara</span>
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
