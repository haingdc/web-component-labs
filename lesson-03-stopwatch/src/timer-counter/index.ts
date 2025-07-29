import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./components/time-display/index.ts";
import {
  TimerSessionConsumer,
  TimerSessionProvider,
  type TimerSessionService,
} from "./services/timer-session/index.ts";
import WindowStage, {
  WINDOW_STATE_MANAGER_EVENT,
  WINDOW_UPDATE_EVENT,
  type WindowUpdateEvent,
} from "./services/window-stage.ts";
import {
  TIMER_UPDATE_EVENT,
  type TimerUpdateEvent,
} from "./utils/timer-utils.ts";

@customElement("timer-counter")
class Timer extends LitElement {
  @state()
  private _ms = NaN;
  @state()
  private _timer: TimerSessionService | null = null;

  @state()
  private _windowStage: WindowStage;

  #isMainWindow: boolean | null = null;

  constructor() {
    super();
    this._windowStage = WindowStage.getInstance();
  }

  override connectedCallback() {
    super.connectedCallback();
    this._windowStage.addEventListener(
      WINDOW_UPDATE_EVENT,
      this.handleWindowUpdate,
    );
    this._windowStage.addEventListener(
      WINDOW_STATE_MANAGER_EVENT.WINDOW_DEACTIVATE_EVENT,
      this.handleWindowDeactivate,
    );
  }

  private handleWindowDeactivate = () => {
    // UtilsWindowArray.dropWindowArray();
    // UtilsTimerSession.dropValue();
  };

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._windowStage.removeEventListener(
      WINDOW_UPDATE_EVENT,
      this.handleWindowUpdate,
    );
    this._windowStage.removeEventListener(
      WINDOW_STATE_MANAGER_EVENT.WINDOW_DEACTIVATE_EVENT,
      this.handleWindowDeactivate,
    );
    this.cleanUpTimer();
  }

  private handleWindowUpdate = (evt: WindowUpdateEvent) => {
    if (!this.shouldSetTimer(evt)) {
      return;
    }
    if (evt.isMainWindow) {
      this.setTimer(TimerSessionProvider.getInstance());
    } else {
      this.setTimer(TimerSessionConsumer.getInstance());
    }
    this.#isMainWindow = evt.isMainWindow;
  };

  // Nếu không cần thiết, không cần cập nhật timer
  private shouldSetTimer(event: WindowUpdateEvent) {
    return this.#isMainWindow === null ||
      this.#isMainWindow !== event.isMainWindow;
  }

  private setTimer(value: TimerSessionService | null) {
    this.cleanUpTimer();
    this._timer = value;
    if (this._timer) {
      this._timer.addEventListener(TIMER_UPDATE_EVENT, this.handleTimerUpdate);
    }
  }

  private cleanUpTimer() {
    if (this._timer) {
      this._timer.removeEventListener(
        TIMER_UPDATE_EVENT,
        this.handleTimerUpdate,
      );
    }
  }

  private handleTimerUpdate = (
    evt: TimerUpdateEvent<TimerSessionService>,
  ) => {
    this._ms = evt.value;
  };

  override render() {
    const error_nan = isNaN(this._ms);
    const error_supporting_zero = this._timer instanceof TimerSessionConsumer &&
      this._ms === 0;
    if ([error_nan, error_supporting_zero].includes(true)) {
      return html`

      `;
    }
    return html`
      <time-display .value="${this._ms}"></time-display>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "timer-counter": Timer;
  }
}

export default Timer;
