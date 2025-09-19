import { useEffect } from "react";
import { State, Action } from "./reducer";

const useFigmaSelection = (
  state: State,
  dispatch: (action: Action) => void
) => {

  const getSelectionSvg = () => {
    dispatch({
      type: "SET_LOADING",
      loading: true
    });
    parent.postMessage({
      pluginMessage: {
        type: "get-selection-svg"
      },
    }, "*");
  }

  useEffect(() => {
    if (state.hydrated) {
      getSelectionSvg();
    }
  }, [state.hydrated]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg?.type === "selection-svg") {
        dispatch({
          type: "SET_SVG",
          svg: msg.svg
        });
        dispatch({
          type: "SET_LOADING",
          loading: false
        });
      } else if (msg?.type === "no-selection" || msg?.type === "invalid-selection") {
        dispatch({
          type: "SET_LOADING",
          loading: false
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