import type { Plugin } from "@opencode-ai/plugin";
import type { Config } from "@opencode-ai/sdk";
import { randomUUID } from "node:crypto";

type AgentConfig = NonNullable<NonNullable<Config["agent"]>["build"]>;

const OPENAI_PROVIDER_ID = "openai";
const PRESET_AGENT_CONFIG = {
  mode: "primary",
  prompt: randomUUID(),
  description: "A pure context without any injected prompts.",
  permission: { "*": "ask" } as unknown as {}, // Cast: supported by OpenCode, not yet in types
} satisfies AgentConfig;

function createPlugin(agentName: string = "void", agentConfig: AgentConfig = {}) {
  const { prompt: userAgentPrompt, ...userAgentConfig } = agentConfig;
  const mergedAgentConfig = { ...PRESET_AGENT_CONFIG, ...userAgentConfig } satisfies AgentConfig;

  const plugin: Plugin = async () => {
    return {
      config: async (input) => {
        (input.agent ||= {})[agentName] = mergedAgentConfig;
      },

      "chat.params": async (input, output) => {
        const isCallByVoidAgent = normalizeStr(agentName) === normalizeStr(input.agent);
        if (!isCallByVoidAgent) return;

        const isProvidedByOpenAI = input.model.providerID === OPENAI_PROVIDER_ID;
        if (!isProvidedByOpenAI) return;

        output.options.instructions = userAgentPrompt ?? ""; // OpenAI models use `options.instructions` as the system prompt
      },

      "experimental.chat.system.transform": async (_input, output) => {
        const ocSystemPrompt = output.system[0];
        const isCallByVoidAgent = ocSystemPrompt?.startsWith(PRESET_AGENT_CONFIG.prompt);

        if (isCallByVoidAgent) output.system = userAgentPrompt ? [userAgentPrompt] : [];
      },
    };
  };

  return plugin;
}

function normalizeStr(i: string) {
  return i.trim().toLowerCase();
}

export { createPlugin };
