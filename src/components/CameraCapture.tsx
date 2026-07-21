import { useEffect, useRef, useState } from "react";

interface Props {
  onCapture: (file: File) => void;
}

/** Motivo por el que no se pudo abrir la cámara, para dar un mensaje útil. */
type MotivoError = "permiso" | "sin-camara" | "no-soportado" | "captura";

const MENSAJES: Record<MotivoError, string> = {
  permiso:
    "Bloqueaste el acceso a la cámara. Permítelo desde el icono junto a la dirección del navegador, o sube una imagen desde tu dispositivo.",
  "sin-camara":
    "No encontramos ninguna cámara conectada. Puedes subir una imagen desde tu dispositivo.",
  "no-soportado":
    "Este navegador no permite acceder a la cámara. Prueba con Chrome o Firefox, o sube una imagen.",
  captura: "No se pudo capturar la imagen. Inténtalo de nuevo.",
};

/**
 * Captura desde la cámara del dispositivo (PB-01).
 *
 * Solicita el stream con `navigator.mediaDevices.getUserMedia`, lo muestra en un
 * <video>, captura el frame actual en un <canvas> oculto y lo emite como File.
 * Distingue el motivo del fallo porque la acción que debe tomar la persona es
 * distinta según se le haya denegado el permiso o no tenga cámara conectada.
 */
export default function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<MotivoError | null>(null);

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

  /** Traduce el error del navegador al motivo que se le explica al usuario. */
  function clasificar(err: unknown): MotivoError {
    const nombre =
      err instanceof DOMException || (err instanceof Error && "name" in err) ? err.name : "";
    if (nombre === "NotAllowedError" || nombre === "SecurityError") return "permiso";
    if (nombre === "NotFoundError" || nombre === "OverconstrainedError") return "sin-camara";
    return "no-soportado";
  }

  async function abrir() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("no-soportado");
      return;
    }
    try {
      setStream(await navigator.mediaDevices.getUserMedia({ video: true }));
    } catch (err) {
      setError(clasificar(err));
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
        setError("captura");
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
          aria-label="Vista previa de la cámara"
          className="w-full rounded-xl border border-gray-300 bg-black"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={tomarFoto}
            className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Tomar foto
          </button>
          <button
            type="button"
            onClick={detener}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
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
        aria-label="Abrir la cámara para capturar una expresión matemática"
        className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-8 text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
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

      {error && (
        <div role="alert" className="flex flex-col gap-2 text-sm text-red-700">
          <p>{MENSAJES[error]}</p>
          {error !== "no-soportado" && (
            <button
              type="button"
              onClick={abrir}
              className="self-start rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Reintentar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
