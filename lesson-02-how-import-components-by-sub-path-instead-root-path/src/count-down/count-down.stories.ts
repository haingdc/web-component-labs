import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "./count-down.ts";

interface CountDownProps {
  name?: string;
  count?: number;
}

type Story = StoryObj<CountDownProps>;

const meta: Meta<CountDownProps> = {
  title: "Components/CountDown",
  component: "count-down",
  argTypes: {
    name: {
      control: "text",
      description: "Name to display in greeting",
    },
    count: {
      control: "number",
      description: "Counter value",
    },
  },
  args: {
    name: "Somebody",
    count: 0,
  },
  render: (args) => {
    const element = document.createElement("count-down");
    element.name = args.name || "Somebody";
    element.count = args.count || 0;

    element.addEventListener("Decrease", () => {
      element.count -= 1;
    });

    return element;
  },
};

export default meta;

export const Default: Story = {
  args: {
    count: 0,
  },
};

export const WithCustomName: Story = {
  args: {
    name: "John",
    count: 0,
  },
};

export const WithHigherCount: Story = {
  args: {
    name: "Alice",
    count: 42,
  },
};
