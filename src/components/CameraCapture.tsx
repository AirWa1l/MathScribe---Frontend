import { useCallback, useEffect, useRef, useState } from "react";

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
  const [activa, setActiva] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Corta todas las pistas del stream y apaga la cámara. */
  const detener = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActiva(false);
  }, []);

  async function abrir() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este navegador no permite acceder a la cámara.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setActiva(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError(
        "No se pudo acceder a la cámara. Revisa los permisos o usa «Subir una imagen».",
      );
      setActiva(false);
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

  // Apaga la cámara si el componente se desmonta con el stream abierto.
  useEffect(() => detener, [detener]);

  if (activa) {
    return (
      <div className="flex flex-col gap-2">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-lg border border-gray-300 bg-black"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={tomarFoto}
            className="flex-1 rounded bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
          >
            Tomar foto
          </button>
          <button
            type="button"
            onClick={detener}
            className="rounded border border-gray-400 px-3 py-2 text-sm text-gray-600 hover:border-gray-600"
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
        className="rounded-lg border border-dashed border-gray-400 px-4 py-6 text-gray-600 hover:border-gray-600"
      >
        Usar la cámara
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
