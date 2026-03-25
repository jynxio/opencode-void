<h2>
  <samp>Summary</samp>
</h2>

<samp>Jynxio's OpenCode Plugin Collection:</samp>

1. <samp>Void Agents: An agent that provides a session context with no preset system prompt.</samp>
2. <samp>...</samp>

<br />
<br />
<br />

<h2>
  <samp>Getting Started</samp>
</h2>

<samp>Step 1: Install</samp>

```
pnpm i @jynxio/opencode-plugin
```

<br />

<samp>Step 2: Configure</samp>

```ts
// .config/opencode/plugins/void.ts
import { createVoidPlugin } from "@jynxio/opencode-plugin";

const voidPlugin = createVoidPlugin();

export { voidPlugin };
```
