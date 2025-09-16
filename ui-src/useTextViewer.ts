import { useEffect, useRef } from "react";
import { TextViewer } from "./viewer";
import { State, Action } from "./reducer";
// import useThrottled from "./useThrottled";

const useTextViewer = (
  canvasRef: React.RefObject<HTMLCanvasElement>, 
  state: State,
  dispatch: (action: Action) => void
) => {
  const viewerRef = useRef<TextViewer | null>(null);

  useEffect(() => {
    if (!state.hydrated) return;
    if (!canvasRef.current) return;

    const viewer = new TextViewer(canvasRef.current, { 
      width: 1200,
      height: 1200,
      onZoomChange: (zoom: number) => dispatch({ type: "SET_CAMERA", camera: { zoom } })
    });

    viewer.setScene(state);
    viewer.startLoop();

    viewerRef.current = viewer;

    return () => {
      viewer.stopLoop(true);
    };
  }, [state.hydrated]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.setPlaying(state.playing);
  }, [state.playing]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.setText(state);
  }, [state.text, state.material]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.setCamera(state);
  }, [state.camera]);

  // useThrottled(() => {
  //   if (!viewerRef.current) return;
  //   viewerRef.current.setTextExtrusion(state.extrusion, state.geometryScale);
  // }, [state.extrusion], 100);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.setTextExtrusion(state);
  }, [state.extrusion]);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.setLights(state);
  }, [state.lighting]);

  return viewerRef;
};

export default useTextViewer;