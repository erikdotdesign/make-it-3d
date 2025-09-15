import { useRef, useEffect } from "react";

const useThrottled = (
  func: () => void,
  deps: any[],
  interval = 100
) => {
  const lastCall = useRef(0);
  useEffect(() => {
    const now = Date.now();
    if (now - lastCall.current >= interval) {
      func();
      lastCall.current = now;
    }
  }, [...deps]);
};

export default useThrottled;