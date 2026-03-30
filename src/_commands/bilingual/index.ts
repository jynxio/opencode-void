import type { Plugin } from "@opencode-ai/plugin";
import type { Config } from "@opencode-ai/sdk";
import type { ValueOf } from "type-fest";

import prompt from "./_prompt";

type CommandConfig = ValueOf<NonNullable<Config["command"]>>;

const BILINGUAL_COMMAND = {
  description: "Response refinement",
  template: prompt,
} as const satisfies CommandConfig;

function createPlugin() {
  const plugin: Plugin = async () => {
    return {
      config: async (input) => {
        (input.command ||= {}).bilingual = BILINGUAL_COMMAND;
      },
    };
  };

  return plugin;
}

export { createPlugin };
