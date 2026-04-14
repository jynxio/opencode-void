import { createAgent } from "./create-agent";

const voidAgent = createAgent({
    name: "void",
    needOpenCodeSystemPrompt: false,
    config: {
        permission: { "*": "ask", webfetch: "allow" },
    },
});

export { voidAgent };
