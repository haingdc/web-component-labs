import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { formatTime } from "../../utils/timer-utils.ts";

@customElement("time-display")
export class TimeDisplay extends LitElement {
  @property({ type: Number })
  value = 0;

  static override styles = css`
    :host {
      display: block;
    }

    .container-stop-watch {
      color: #ff6b35;
      display: flex;
      align-items: center;
      padding: 12px 0 0 12px;
      font-size: 14px;
      text-transform: lowercase;
      font-weight: 600;
    }

    .clock-icon {
      width: 16px;
      height: 16px;
      margin-right: 4px;
      fill: currentColor;
    }
  `;

  private formatDisplayTime(): string {
    try {
      return formatTime(this.value);
    } catch (error) {
      if (error instanceof Error) {
        return error.message === "error.timeOverflow"
          ? "Time overflow"
          : "Error";
      }
      return "Error";
    }
  }

  override render() {
    return html`
      <div class="container-stop-watch">
        <svg class="clock-icon" viewBox="0 0 24 24">
          <path
            d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"
          />
        </svg>
        <div>${this.formatDisplayTime()}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "time-display": TimeDisplay;
  }
}
