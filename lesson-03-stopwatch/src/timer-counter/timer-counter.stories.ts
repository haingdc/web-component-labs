import { html } from "lit";
import { type Meta, type StoryObj } from "@storybook/web-components-vite";
import "./index.ts";
import type { Component } from "../types/storybook.ts";
import { UtilsTimerSession } from "./utils/timer-utils.ts";
import { UtilsWindowArray } from "./services/window-state-manager-service.ts";

const StoryContainer = (story: Component) => {
  return html`
    <div style="padding: 20px; background: #f5f5f5; border-radius: 8px;">
      ${story()}
    </div>
  `;
};

const meta: Meta = {
  title: "Components/TimerCounter",
  component: "timer-counter",
  render: () =>
    html`
      <timer-counter></timer-counter>
    `,
  decorators: [StoryContainer],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () =>
    html`
      <timer-counter></timer-counter>
    `,
};

export const Multiple: Story = {
  render: () => {
    return html`
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <h3>Synchronized Timer Sessions</h3>
        <p>All timers below should show the same time and update synchronously:</p>
        <timer-counter id="timer-counter-1"></timer-counter>
        <timer-counter id="timer-counter-2"></timer-counter>
        <timer-counter id="timer-counter-3"></timer-counter>
        <timer-counter id="timer-counter-4"></timer-counter>
        <timer-counter id="timer-counter-5"></timer-counter>
      </div>
    `;
  },
};

export const UnstableControls: Story = {
  render: () => {
    let count = 0;
    const container = document.createElement("div");
    const addButton = document.createElement("button");
    addButton.textContent = "Add Timer Session";
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove Timer Session";
    const timersWrapper = document.createElement("div");
    timersWrapper.style.marginTop = "10px";
    const emptyButton = document.createElement("button");
    emptyButton.textContent = "Empty Timers";
    const dropLocalStorageButton = document.createElement("button");
    dropLocalStorageButton.textContent = "Drop Local Storage";

    function renderTimers() {
      timersWrapper.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const timer = document.createElement("timer-counter");
        timer.setAttribute("id", `timer-counter-${i + 1}`);
        timersWrapper.appendChild(timer);
      }
    }

    addButton.onclick = () => {
      count++;
      renderTimers();
    };
    removeButton.onclick = () => {
      if (count > 0) {
        count--;
        renderTimers();
      }
    };

    emptyButton.onclick = () => {
      count = 0;
      renderTimers();
    };

    dropLocalStorageButton.onclick = () => {
      UtilsTimerSession.dropValue();
      UtilsWindowArray.dropWindowArray();
    };

    container.appendChild(addButton);
    container.appendChild(removeButton);
    container.appendChild(emptyButton);
    container.appendChild(dropLocalStorageButton);
    container.appendChild(timersWrapper);
    renderTimers();

    return container;
  },
};
