import { type TimerUpdateEvent } from "../../utils/timer-utils.ts";

type TimerEventCallback<T> = (event: TimerUpdateEvent<T>) => void;

interface TimerSession {
  addEventListener(
    eventName: string,
    callback: TimerEventCallback<this>,
  ): void;

  removeEventListener(
    eventName: string,
    callback: (event: TimerUpdateEvent<this>) => void,
  ): void;
}

export { type TimerSession };
