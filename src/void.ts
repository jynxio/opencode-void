import type { Plugin } from "@opencode-ai/plugin";
import type { Config } from "@opencode-ai/sdk";
import { nanoid } from "nanoid";

type AgentConfig = NonNullable<NonNullable<Config["agent"]>["build"]>;

const OPENAI_PROVIDER_ID = "openai";
const VOID_AGENT = {
  name: "void",
  mode: "primary",
  description: "A pure context without any injected prompts.",
  options: {},
  prompt: nanoid(),
  permission: { "*": "ask" } as unknown as {}, // OpenCode supports `permission: { "*": "ask" }`, but the type definition is wrong, so we need to cast it.
} as const satisfies AgentConfig;

function createPlugin() {
  const plugin: Plugin = async () => {
    return {
      config: async (input) => {
        (input.agent ||= {}).void = VOID_AGENT;
      },

      "chat.params": async (input, output) => {
        // The type of `input` is incorrect, so we manually correct it.
        const agent = input.agent as unknown as { name: string };
        const isCallByVoidAgent = VOID_AGENT.name === agent.name.trim().toLowerCase();
        const isProvidedByOpenAI = input.model.providerID === OPENAI_PROVIDER_ID;

        if (!isCallByVoidAgent) return;
        if (!isProvidedByOpenAI) return;

        // OpenAI Auth models have an `instructions` field; it works like the System Prompt, but has higher priority.
        output.options.instructions = "";
      },

      "experimental.chat.system.transform": async (input, output) => {
        const ocSystemPrompt = output.system[0];
        const isVoidModeChat = ocSystemPrompt?.startsWith(VOID_AGENT.prompt);

        if (isVoidModeChat) output.system = [];
      },
    };
  };

  return plugin;
}

export { createPlugin };
