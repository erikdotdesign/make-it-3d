import { useEffect } from "react";
import { Action } from "./reducer";

const useTextSelection = (
  dispatch: (action: Action) => void
) => {

  const getTextSelection = () => {
    parent.postMessage({
      pluginMessage: {
        type: "get-text-selection"
      },
    }, "*");
  }

  useEffect(() => {
    getTextSelection();
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg?.type === "text-selection") {
        const byteArray = new Uint8Array(msg.svgBytes);
        const svgString = new TextDecoder().decode(byteArray);
        dispatch({
          type: "SET_TEXT",
          text: svgString
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return { getTextSelection };
};

export default useTextSelection;