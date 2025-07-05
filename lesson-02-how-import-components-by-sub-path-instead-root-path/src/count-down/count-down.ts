import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "./count-display.ts";

@customElement("count-down")
class CountDown extends LitElement {
  static override styles = css`
    div {
      border: 1px solid black;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    @media (prefers-color-scheme: dark) {
      div {
        border-color: white;
      }
    }

    span {
      color: rebeccapurple;
    }

    p {
      font-family: sans-serif;
    }
  `;

  static override properties = {
    name: { type: String },
    count: { type: Number },
  };
  declare name: string;
  declare count: number;
  constructor() {
    super();

    this.count = 0;
    this.name = "Somebody";
  }

  private handleClick() {
    this.dispatchEvent(
      new CustomEvent("Decrease", {
        bubbles: true,
        composed: true,
        detail: {
          current_count: this.count,
        },
      }),
    );
  }

  override render() {
    return html`
      <div>
        <p>Hello, ${this.name}!</p>
        <button @click="${this.handleClick}">Count down</button>
        <count-display .count="${this.count}"></count-display>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "count-down": CountDown;
  }

  namespace JSX {
    interface IntrinsicElements {
      "count-down":
        | React.DetailedHTMLProps<
          React.HTMLAttributes<CountDown>,
          CountDown
        >
        | Partial<CountDown>;
    }
  }
}

export default CountDown;
