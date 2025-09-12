import { useRef, useState } from "react";

export type Recorder = {
  recording: boolean;
  time: number;
  start: () => void;
  stop: () => void;
  snapshot: () => void;
  videoUrl: string | null;
};

const useRecorder = (
  canvasRef: React.RefObject<HTMLCanvasElement>
): Recorder => {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const stillImageDataUrl = useRef<string>("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const start = () => {
    if (!canvasRef.current) return;
    setRecording(true);
    recordedChunksRef.current = [];
    stillImageDataUrl.current = canvasRef.current.toDataURL("image/png");

    const stream = canvasRef.current.captureStream(60);
    recorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });

    recorderRef.current.ondataavailable = (e) => e.data.size && recordedChunksRef.current.push(e.data);
    recorderRef.current.start();

    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };

  const stop = () =>
    new Promise<void>((resolve) => {
      if (!recorderRef.current) return resolve();
      recorderRef.current.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });

        // console.log("Video size in MB:", videoBlob.size / (1024 * 1024));

        // // Dev preview
        // const url = URL.createObjectURL(videoBlob);
        // setVideoUrl(url);

        const reader = new FileReader();
        reader.onload = () => {
          parent.postMessage({
            pluginMessage: {
              type: "add-3d-text-video",
              video: reader.result,
              image: stillImageDataUrl.current
            },
          }, "*");
          setRecording(false);
          setTime(0);
          timerRef.current && clearInterval(timerRef.current);
          resolve();
        };
        reader.readAsDataURL(videoBlob);
        recorderRef.current = null;
      };
      recorderRef.current.stop();
    });

  const snapshot = async () => {
    if (!canvasRef.current) return;
    const img = canvasRef.current.toDataURL("image/png");
    parent.postMessage({ pluginMessage: { 
      type: "add-3d-text-image", 
      image: img
    } }, "*");
  };

  return { recording, time, start, stop, snapshot, videoUrl };
};

export default useRecorder;