import { useEffect } from "react";
import { Action } from "./reducer";

const useFigmaSelection = (
  dispatch: (action: Action) => void
) => {

  const getSelectionSvg = () => {
    parent.postMessage({
      pluginMessage: {
        type: "get-selection-svg"
      },
    }, "*");
  }

  useEffect(() => {
    getSelectionSvg();
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg?.type === "selection-svg") {
        dispatch({
          type: "SET_SVG",
          svg: msg.svg
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return { getSelectionSvg };
};

export default useFigmaSelection;