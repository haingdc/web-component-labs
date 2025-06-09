import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./my-element.ts";

const meta = {
  title: "UI/MyElement",
  argTypes: {
    docsHint: { control: "text" },
    count: { control: "number" },
    slot: { control: "text" },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    slot: html`
      <h1>Vite + Lit</h1>
    `,
  },
  render: (args) =>
    html`
      <my-element> ${args.slot} </my-element>
    `,
};

export const CustomHint: Story = {
  args: {
    docsHint: "This is a custom hint message",
    slot: html`
      <h1>Custom Message</h1>
    `,
  },
  render: (args) =>
    html`
      <my-element .docsHint="${args.docsHint}">
        ${args.slot}
      </my-element>
    `,
};

export const PresetCount: Story = {
  args: {
    count: 42,
    slot: html`
      <h1>Pre-set Counter</h1>
    `,
  },
  render: (args) =>
    html`
      <my-element .count="${args.count}">
        ${args.slot}
      </my-element>
    `,
};

export const CustomContent: Story = {
  args: {
    slot: html`
      <h1>Custom Content</h1>
      <p>This is a paragraph inside the slot</p>
    `,
  },
  render: (args) =>
    html`
      <my-element>
        ${args.slot}
      </my-element>
    `,
};
