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
  permission: { "*": "ask" } as unknown as {}, // OpenCode 支持 permission: { "*": "ask" }，但类型定义不对，因此需要扭转一下
} as const satisfies AgentConfig;

function createPlugin() {
  const plugin: Plugin = async () => {
    return {
      config: async (input) => {
        (input.agent ||= {}).void = VOID_AGENT;
      },

      "chat.params": async (input, output) => {
        // input 的类型有误，故人工校正
        const agent = input.agent as unknown as { name: string };
        const isCallByVoidAgent = VOID_AGENT.name === agent.name.trim().toLowerCase();
        const isProvidedByOpenAI = input.model.providerID === OPENAI_PROVIDER_ID;

        if (!isCallByVoidAgent) return;
        if (!isProvidedByOpenAI) return;

        // OpenAI Auth 模型有 `instructions` 字段，作用同 System Prompt，但优先级更高
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
