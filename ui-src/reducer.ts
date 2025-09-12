
export type State = {
  playing: boolean;
  zoom: number;
  text: string;
  hydrated: boolean;
};

export type Action = 
  | { type: "HYDRATE_STATE"; state: State } 
  | { type: "SET_PLAYING", playing: boolean } 
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_TEXT"; text: string }
  

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "HYDRATE_STATE": return { ...state, ...action.state, hydrated: true };
    case "SET_PLAYING": return { ...state, playing: action.playing };
    case "SET_ZOOM": return { ...state, zoom: action.zoom };
    case "SET_TEXT": return { 
      ...state, 
      text: action.text
    };
    default: return state;
  }
};

export default reducer;