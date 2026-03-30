import type { Plugin } from "@opencode-ai/plugin";
import * as d from "./debug";

function createPlugin() {
  const plugin: Plugin = async () => {
    return {
      "chat.params": async (input, output) => {
        d.log({ "chat.params": { input, output } });
      },

      "experimental.chat.system.transform": async (input, output) => {
        d.log({ "experimental.chat.system.transform": { input, output } });
      },
    };
  };

  return plugin;
}

export { createPlugin };
