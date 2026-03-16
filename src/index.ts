import type { Plugin } from "@opencode-ai/plugin";

export const MyPlugin: Plugin = async () => {
  console.log("Plugin initialized!");

  return {
    "experimental.chat.system.transform": async (input, output) => {},
    "experimental.chat.messages.transform": async (input, output) => {},
  };
};
