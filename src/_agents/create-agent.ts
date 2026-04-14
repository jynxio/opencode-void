import type { Plugin } from "@opencode-ai/plugin";
import type { Config } from "@opencode-ai/sdk";
import { randomUUID } from "node:crypto";

const OPENAI_PROVIDER_ID = "openai";

type AgentConfig = NonNullable<NonNullable<Config["agent"]>["build"]>;
type Props = {
    name: string;
    /** @default true */
    needOpenCodeSystemPrompt?: boolean;
    /** @default {} */
    config?: AgentConfig & { permission?: { "*": "ask" | "allow" | "deny" } };
};

function createAgent(props: Props) {
    const flag = randomUUID();
    const agentName = props.name;
    const userConfig = props.config ?? {};
    const needOCPrompt = props.needOpenCodeSystemPrompt ?? true;
    const resolvedConfig: Props["config"] = { ...userConfig, prompt: flag };

    const plugin: Plugin = async () => {
        return {
            config: async (input) => {
                (input.agent ||= {})[agentName] = resolvedConfig;
            },

            "chat.params": async (input, output) => {
                const isCallByMe = normalizeStr(agentName) === normalizeStr(input.agent);
                if (!isCallByMe) return;

                const isUsingGPT = input.model.providerID === OPENAI_PROVIDER_ID;
                if (!isUsingGPT) return;

                /**
                 * GPT use `options.instructions` as the system prompt
                 */
                if (!needOCPrompt) output.options.instructions = "";
                if (!userConfig.prompt) return;

                output.options.instructions += `\n${userConfig.prompt}`;
            },

            "experimental.chat.system.transform": async (_input, output) => {
                const ocPrompt = output.system[0];
                const isCallByMe = ocPrompt?.startsWith(flag);

                if (!isCallByMe) return;

                if (!needOCPrompt) output.system = [];
                if (!userConfig.prompt) return;

                output.system = [...output.system, userConfig.prompt];
            },
        };
    };

    return plugin;
}

function normalizeStr(i: string) {
    return i.trim().toLowerCase();
}

export { createAgent };
