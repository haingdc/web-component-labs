import { LOCAL_STORAGE } from "../utils/local-storage-const.ts";

const WINDOW_UPDATE_EVENT = "windowupdate";
const WINDOW_DEACTIVATE_EVENT = "windowdeactivate";
const WINDOW_STATE_MANAGER_EVENT = {
  WINDOW_UPDATE_EVENT: "windowupdate",
  WINDOW_DEACTIVATE_EVENT: "windowdeactivate",
} as const;

interface WindowUpdateEvent {
  isMainWindow: boolean;
  activeWindowCount: number;
}

interface WindowInfo {
  id: string;
  heartbeat: number;
}

// 🗂️ LocalStorage - Cuốn sổ ghi chép chung
const UtilsWindowArray = {
  getWindowArray() {
    return JSON.parse(
      localStorage.getItem(LOCAL_STORAGE.window_manager) || "[]",
    );
  },
  setWindowArray(windowArray: WindowInfo[]) {
    localStorage.setItem(
      LOCAL_STORAGE.window_manager,
      JSON.stringify(windowArray),
    );
  },
  dropWindowArray() {
    localStorage.removeItem(LOCAL_STORAGE.window_manager);
  },
};

/**
 * WindowStateManager - Như một trò chơi "Ai làm thủ lĩnh?"
 * Hãy tưởng tượng bạn và bạn bè đang chơi một trò chơi trên nhiều máy tính khác nhau, nhưng các bạn cần có 1 người làm "thủ lĩnh" để điều khiển trò chơi.
 */
class WindowStage {
  // The field for storing the singleton instance should be
  // declared static.
  static #instance: WindowStage;
  #isMainWindow = false;
  #unloaded = false;
  #windowArray: WindowInfo[] = [];
  readonly #windowId: string;
  #listeners: ((event: WindowUpdateEvent) => void)[] = [];

  #listenersDeactivate: ((event: WindowUpdateEvent) => void)[] = [];
  #heartbeatInterval: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.#windowId = Date.now().toString();
    this.#bindUnload();
    this.#promoteMainWindow();
  }

  public static getInstance(): WindowStage {
    if (!this.#instance) {
      this.#instance = new WindowStage();
    }
    return this.#instance;
  }

  /*
   * 👑 Main Window - Chọn thủ lĩnh

   * 🎯 Quy tắc chọn thủ lĩnh:
   * ⋅ Nếu chỉ có 1 người → Người đó làm thủ lĩnh
   * ⋅ Nếu có nhiều người → Người cuối cùng trong danh sách làm thủ lĩnh
   */
  #promoteMainWindow() {
    const previousState = this.#isMainWindow;
    this.#windowArray = UtilsWindowArray.getWindowArray();

    if (
      this.#windowArray.length <= 1 ||
      this.#windowArray[this.#windowArray.length - 1].id === this.#windowId
    ) {
      this.#isMainWindow = true;
    } else {
      this.#isMainWindow = false;
    }

    if (previousState !== this.#isMainWindow) {
      this.#emitEvent(WINDOW_UPDATE_EVENT);
    }
  }

  #removeWindow() {
    this.#windowArray = UtilsWindowArray.getWindowArray();
    const len = this.#windowArray.length;
    this.#windowArray = this.#windowArray.filter((window) =>
      window.id !== this.#windowId
    );
    if (len !== this.#windowArray.length) {
      UtilsWindowArray.setWindowArray(this.#windowArray);
    }
    this.#unloaded = true;
  }

  /**
   * 🚪 Unload - Ra về
   * Khi ai đó đóng cửa sổ (về nhà), họ sẽ xóa tên mình khỏi cuốn sổ chung.
   */

  #bindUnload() {
    globalThis.addEventListener("beforeunload", () => {
      if (!this.#unloaded) {
        this.#removeWindow();
      }
    });
    globalThis.addEventListener("unload", () => {
      if (!this.#unloaded) {
        this.#removeWindow();
      }
    });
  }

  /** 💓 Heartbeat - Báo hiệu "Tôi còn sống"
   * Mỗi giây, mỗi cửa sổ sẽ hét lên: "Tôi còn đây! Tôi còn hoạt động!" - giống như trò chơi điểm danh.
   */
  #runHeartbeat(): void {
    // Bước 1: Cập nhật nhịp tim của mình
    // Lấy danh sách tất cả cửa sổ từ "sổ ghi chép chung" (localStorage)
    this.#windowArray = UtilsWindowArray.getWindowArray();
    // Tìm mình trong danh sách và cập nhật "nhịp tim"
    const now = Date.now();
    const index = this.#windowArray.findIndex((window) =>
      window.id === this.#windowId
    );
    if (index !== -1) {
      this.#windowArray[index].heartbeat = now;
    } else {
      this.#windowArray.push({ id: this.#windowId, heartbeat: now });
    }

    // Bước 2: Loại bỏ những cửa sổ đã "chết" (không báo hiệu quá 5 giây)
    // Nếu ai không báo hiệu quá 5 giây → Coi như "chết" và xóa khỏi danh sách.
    this.#windowArray = this.#windowArray.filter((window) =>
      now - window.heartbeat < 5000
    );

    // Chỉ ghi vào localStorage một lần sau khi đã cập nhật tất cả
    UtilsWindowArray.setWindowArray(this.#windowArray);

    // Bước 3: Quyết định cửa sổ nào làm "thủ lĩnh"
    this.#promoteMainWindow();
    // Bước 4: Lặp lại mỗi giây
    this.#heartbeatInterval = setTimeout(() => {
      this.#runHeartbeat();
    }, 1000);
  }

  #stopHeartbeat() {
    if (this.#heartbeatInterval) {
      clearInterval(this.#heartbeatInterval);
      this.#heartbeatInterval = null;
    }
  }

  public addEventListener(
    eventName: string,
    callback: (event: WindowUpdateEvent) => void,
  ): void {
    if (eventName === WINDOW_UPDATE_EVENT) {
      this.#listeners.push(callback);
      this.#emitEvent(WINDOW_UPDATE_EVENT);
      if (this.#listeners.length === 1) {
        this.#runHeartbeat();
      }
    } else if (eventName === WINDOW_DEACTIVATE_EVENT) {
      this.#listenersDeactivate.push(callback);
    }
  }

  public removeEventListener(
    eventName: string,
    callback: (event: WindowUpdateEvent) => void,
  ): void {
    if (eventName === WINDOW_UPDATE_EVENT) {
      // Bước 1: Xóa callback khỏi danh sách "người đăng ký nghe tin"
      this.#listeners = this.#listeners.filter((listener) =>
        listener !== callback
      );
      if (this.#listeners.length === 0) {
        // Bước 2: Nếu không còn ai nghe nữa → Tắt heartbeat (ngừng hoạt động)
        this.#stopHeartbeat();
        // Bước 3: Nếu chỉ còn 1 cửa sổ + không còn ai nghe nữa → Xóa luôn cuốn sổ chung
        this.#emitEvent(WINDOW_DEACTIVATE_EVENT);
      }
    } else if (eventName === WINDOW_DEACTIVATE_EVENT) {
      this.#listenersDeactivate = this.#listenersDeactivate.filter((listener) =>
        listener !== callback
      );
    }
  }

  #emitEvent(eventName: string) {
    if (eventName === WINDOW_UPDATE_EVENT) {
      const event: WindowUpdateEvent = {
        isMainWindow: this.#checkMainWindow(),
        activeWindowCount: this.#getActiveWindowCount(),
      };
      this.#listeners.forEach((listener) => listener(event));
    }
    if (eventName === WINDOW_DEACTIVATE_EVENT) {
      const event: WindowUpdateEvent = {
        isMainWindow: this.#checkMainWindow(),
        activeWindowCount: this.#getActiveWindowCount(),
      };
      this.#listenersDeactivate.forEach((listener) => listener(event));
    }
  }

  #checkMainWindow() {
    return this.#isMainWindow;
  }

  #getActiveWindowCount() {
    return this.#windowArray.length;
  }
}

export default WindowStage;
export {
  UtilsWindowArray,
  WINDOW_STATE_MANAGER_EVENT,
  WINDOW_UPDATE_EVENT,
  type WindowUpdateEvent,
};
