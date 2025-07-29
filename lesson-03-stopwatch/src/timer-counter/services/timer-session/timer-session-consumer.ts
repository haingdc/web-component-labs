import { LOCAL_STORAGE } from "../../utils/local-storage-const.ts";
import {
  TIMER_UPDATE_EVENT,
  type TimerUpdateEvent,
  UtilsTimerSession,
} from "../../utils/timer-utils.ts";
import { type TimerSession } from "./timer-session.ts";

/**
 * Hãy tưởng tượng TimerSessionConsumer như một chiếc đồng hồ thông minh trong máy tính!

  🎯 Nó làm gì?
  - Giống như một chiếc đồng hồ bấm giờ theo dõi thời gian chơi game
  - Khi thời gian thay đổi, nó sẽ báo cho tất cả mọi người biết
  - Ngay cả khi bạn mở nhiều tab trình duyệt, tất cả đều biết thời gian giống nhau!
 */
class TimerSessionConsumer implements TimerSession {
  static #instance: TimerSessionConsumer;
  #listeners: ((event: TimerUpdateEvent<this>) => void)[] = [];

  public static getInstance(): TimerSessionConsumer {
    if (!this.#instance) {
      this.#instance = new TimerSessionConsumer();
    }
    return this.#instance;
  }

  // Khi có bạn mới muốn nghe tin tức về thời gian
  public addEventListener(
    eventName: string,
    callback: (event: TimerUpdateEvent<this>) => void,
  ): void {
    if (eventName === TIMER_UPDATE_EVENT) {
      // Thêm bạn vào danh sách
      this.#listeners.push(callback);
      // Ngay lập tức báo tin mới nhất
      this.#emitEvent(TIMER_UPDATE_EVENT);
      // Bắt đầu lắng nghe từ nguồn tin tức
      if (this.#listeners.length > 0) {
        globalThis.addEventListener("storage", this.#onStorage);
      }
    }
  }

  // Khi có bạn không muốn nghe tin nữa
  removeEventListener(
    eventName: string,
    callback: (event: TimerUpdateEvent<this>) => void,
  ): void {
    if (eventName === TIMER_UPDATE_EVENT) {
      // Xóa bạn khỏi danh sách
      this.#listeners = this.#listeners.filter((listener) => listener !== callback);

      // Nếu không còn ai quan tâm, thôi lắng nghe
      if (this.#listeners.length === 0) {
        globalThis.removeEventListener("storage", this.#onStorage);
      }
    }
  }

  // Khi nguồn tin tức thay đổi, gửi tin tức cho tất cả bạn bè
  #onStorage = (e: StorageEvent): void => {
    if (e.key === LOCAL_STORAGE.session_last) {
      this.#emitEvent(TIMER_UPDATE_EVENT);
    }
  };

  // Gửi tin tức cho tất cả bạn bè
  #emitEvent(eventName: string): void {
    if (eventName === TIMER_UPDATE_EVENT) {
      // Chuẩn bị nội dung để gửi
      const event: TimerUpdateEvent<this> = {
        value: UtilsTimerSession.getValue(),
        target: this,
        targetName: this.constructor.name,
      };
      // Gọi điện cho từng người bạn
      this.#listeners.forEach((listener) => listener(event));
    }
  }
}

export default TimerSessionConsumer;
