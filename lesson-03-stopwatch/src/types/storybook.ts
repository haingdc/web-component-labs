import { type WebComponentsRenderer } from "@storybook/web-components-vite";
import type { PartialStoryFn } from "storybook/internal/types";

export type Component = PartialStoryFn<WebComponentsRenderer, {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
}>;
