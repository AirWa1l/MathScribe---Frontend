interface Props {
  onCapture: (file: File) => void;
}

/**
 * Captura desde la cámara del dispositivo (PB-01).
 *
 * TODO: solicitar el stream con `navigator.mediaDevices.getUserMedia`, mostrarlo en un
 * <video>, capturar un frame en un <canvas> y emitirlo como File comprimido.
 */
export default function CameraCapture(_props: Props) {
  return (
    <button
      type="button"
      className="rounded-lg border border-dashed border-gray-400 px-4 py-6 text-gray-600 hover:border-gray-600"
    >
      Usar la cámara
    </button>
  );
}
