import { LOCAL_STORAGE } from "./local-storage-const.ts";

/**
 * Retrieves a value from local storage and converts it to milliseconds.
 * If the value is not present in local storage, it is set to 0.
 */
const getValue = (): number => {
  const value = localStorage.getItem(LOCAL_STORAGE.session_last);
  const ms = Number(value);
  return ms;
};

const setValue = (ms: number): void => {
  localStorage.setItem(LOCAL_STORAGE.session_last, ms.toString());
};

const dropValue = (): void => {
  localStorage.removeItem(LOCAL_STORAGE.session_last);
};

const UtilsTimerSession = {
  getValue,
  setValue,
  dropValue,
};

const TIMER_UPDATE_EVENT = "timerupdate";

function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  // more than 60 days
  if (hours > 1440) {
    throw new Error("error.timeOverflow");
  }
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    throw new Error("error.title");
  }
  // Pad with leading zeros if required
  const hoursStr = hours < 10 ? "0" + hours : hours;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const secondsStr = seconds < 10 ? "0" + seconds : seconds;
  // Combine the hours, minutes, and seconds
  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

interface TimerUpdateEvent<T> {
  value: number;
  target: T;
  targetName: string;
}

export { formatTime, TIMER_UPDATE_EVENT, type TimerUpdateEvent, UtilsTimerSession };
