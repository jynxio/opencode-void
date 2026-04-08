import type { Plugin } from "@opencode-ai/plugin";
import type { Config } from "@opencode-ai/sdk";
import type { ValueOf } from "type-fest";

import prompt from "./_prompt";

type CommandConfig = ValueOf<NonNullable<Config["command"]>>;

const PRESET_COMMAND_CONFIG = {
  description: "Response refinement",
  template: prompt,
} satisfies CommandConfig;

function createPlugin(
  commandName: string = "bilingual",
  commandConfig: CommandConfig = { template: "" },
) {
  const mergedCommandConfig = {
    ...PRESET_COMMAND_CONFIG,
    ...commandConfig,
  } satisfies CommandConfig;

  const plugin: Plugin = async () => {
    return {
      config: async (input) => {
        (input.command ||= {})[commandName] = mergedCommandConfig;
      },
    };
  };

  return plugin;
}

export { createPlugin };
