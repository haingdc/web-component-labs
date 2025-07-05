import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("count-display")
class CountDisplay extends LitElement {
  static override properties = {
    count: { type: Number },
  };
  declare count: number;
  constructor() {
    super();
  }

  override render() {
    return html`
      <p>Count: ${this.count}</p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "count-display": CountDisplay;
  }

  namespace JSX {
    interface IntrinsicElements {
      "count-display":
        | React.DetailedHTMLProps<
          React.HTMLAttributes<CountDisplay>,
          CountDisplay
        >
        | Partial<CountDisplay>;
    }
  }
}

export default CountDisplay;
