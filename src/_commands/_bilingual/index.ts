import type { Plugin } from "@opencode-ai/plugin";
import type { Config } from "@opencode-ai/sdk";
import type { ValueOf } from "type-fest";

import { readFileSync } from "fs-extra";
import { cwd } from "node:process";
import path from "node:path";

type CommandConfig = ValueOf<NonNullable<Config["command"]>>;

const COMMAND = {
  description: "Bilingual",
  template: readFileSync(path.resolve(cwd(), "./_prompt.md"), { encoding: "utf-8" }),
} as const satisfies CommandConfig;

function createPlugin() {
  const plugin: Plugin = async () => {
    return {
      config: async (input) => {
        (input.command ||= {}).bilingual = COMMAND;
      },
    };
  };

  return plugin;
}

export { createPlugin };
