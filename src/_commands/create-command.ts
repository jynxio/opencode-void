import type { Plugin } from "@opencode-ai/plugin";
import type { Config } from "@opencode-ai/sdk";
import type { ValueOf } from "type-fest";

type Props = {
    name: string;
    /** @default {} */
    config?: ValueOf<NonNullable<Config["command"]>>;
};

function createCommand(props: Props) {
    const plugin: Plugin = async () => {
        return {
            config: async (input) => {
                if (!props.config) return;

                (input.command ||= {})[props.name] = props.config;
            },
        };
    };

    return plugin;
}

export { createCommand };
