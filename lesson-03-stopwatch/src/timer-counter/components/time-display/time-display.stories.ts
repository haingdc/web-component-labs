import { html } from "lit";
import { type Meta, type StoryObj } from "@storybook/web-components-vite";
import "./index.ts";
import type { Component } from "../../../types/storybook.ts";

let intervalId = 0;

const StoryContainer = (story: Component) => {
  return html`
    <div style="padding: 20px; background: #f5f5f5; border-radius: 8px;">
      ${story()}
    </div>
  `;
};

const meta: Meta = {
  title: "Components/TimerCounter/components/TimeDisplay",
  component: "time-display",
  render: (args) =>
    html`
      <time-display value="${args.value}"> </time-display>
    `,
  argTypes: {
    value: {
      control: "number",
      description: "Time value in milliseconds",
    },
  },
  decorators: [StoryContainer],
  beforeEach: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = 0;
    }
  },
  afterEach: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = 0;
    }
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    value: 0,
  },
};

export const OneMinute: Story = {
  args: {
    value: 60 * 1000, // 1 minute in milliseconds
  },
};

export const FiveMinutes: Story = {
  args: {
    value: 5 * 60 * 1000, // 5 minutes in milliseconds
  },
};

export const LongSession: Story = {
  args: {
    value: 2 * 60 * 60 * 1000 + 30 * 60 * 1000 + 45 * 1000, // 2 hours, 30 minutes, 45 seconds
  },
};

export const Interactive: Story = {
  args: {
    value: 0,
  },
  render: (args) => {
    const state = {
      currentValue: args.value || 0,
      isRunning: false,
      intervalId: null as number | null,
      startTime: 0,
    };

    const startTimer = () => {
      if (state.isRunning) return;

      state.isRunning = true;
      state.startTime = Date.now() - state.currentValue;

      state.intervalId = setInterval(() => {
        state.currentValue = Date.now() - state.startTime;
        const stopWatch = document.querySelector("stop-watch");
        if (stopWatch) {
          stopWatch.value = state.currentValue;
        }
      }, 100);

      intervalId = state.intervalId;
      updateButtons();
    };

    const stopTimer = () => {
      if (!state.isRunning) return;

      state.isRunning = false;
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
        intervalId = 0;
      }

      updateButtons();
    };

    const resetTimer = () => {
      stopTimer();
      state.currentValue = 0;
      const stopWatch = document.querySelector("stop-watch");
      if (stopWatch) {
        stopWatch.value = 0;
      }
      updateButtons();
    };

    const updateButtons = () => {
      const startBtn = document.querySelector(
        ".start-btn",
      ) as HTMLButtonElement;
      const stopBtn = document.querySelector(".stop-btn") as HTMLButtonElement;

      if (startBtn) startBtn.disabled = state.isRunning;
      if (stopBtn) stopBtn.disabled = !state.isRunning;
    };

    return html`
      <div
        style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;"
      >
        <stop-watch .value="${state.currentValue}"></stop-watch>

        <div style="display: flex; gap: 8px;">
          <button
            class="start-btn"
            @click="${startTimer}"
            style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            Start
          </button>

          <button
            class="stop-btn"
            @click="${stopTimer}"
            style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;"
            disabled
          >
            Stop
          </button>

          <button
            @click="${resetTimer}"
            style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            Reset
          </button>
        </div>

        <small style="color: #666;">
          Click Start to begin the timer, Stop to pause, and Reset to clear.
        </small>
      </div>
    `;
  },
};

export const ErrorStates: Story = {
  render: () => {
    return html`
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <h4 style="margin: 0 0 8px 0;">
            Normal Time (1 hour, 30 minutes, 45 seconds):
          </h4>
          <stop-watch value="${1 * 60 * 60 * 1000 + 30 * 60 * 1000 +
            45 * 1000}"></stop-watch>
        </div>

        <div>
          <h4 style="margin: 0 0 8px 0;">Time Overflow (More than 60 days):</h4>
          <stop-watch value="${61 * 24 * 60 * 60 * 1000}"></stop-watch>
        </div>

        <div>
          <h4 style="margin: 0 0 8px 0;">Invalid Value (NaN):</h4>
          <stop-watch value="${NaN}"></stop-watch>
        </div>
      </div>
    `;
  },
};
