import { State, Action } from "./reducer";
import { Recorder } from './useRecorder';
import PlayerControls from './PlayerControls';
import Sidebar from "./Sidebar";

const RightControls = ({
  state,
  dispatch,
  recorderRef
}: {
  state: State;
  dispatch: (action: Action) => void;
  recorderRef: Recorder;
}) => {
  return (
    <Sidebar
      modifier={"fixed-bottom"}>
      <div className="c-sidebar__scroll">
        <div className="c-sidebar__group">
          
        </div>
      </div>
      <div className="c-sidebar__bottom">
        <div className="c-sidebar__group c-sidebar__group--row">
          <PlayerControls
            playing={state.playing}
            setPlaying={(playing: boolean) => {
              dispatch({
                type: "SET_PLAYING",
                playing
              })
            }}
            recorderRef={recorderRef} />
        </div>
      </div>
    </Sidebar>
  );
};

export default RightControls;