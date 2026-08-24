import Anthropic from "@anthropic-ai/sdk";

type Tool = Anthropic.Messages.Tool;
type MessageParam = Anthropic.Messages.MessageParam;

let client: Anthropic | null = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set.");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const AGENT_MODEL = process.env.ANTHROPIC_AGENT_MODEL || "claude-sonnet-5";

export type ToolHandler = (input: unknown) => Promise<unknown> | unknown;

/**
 * Runs a Claude tool-use loop until the model calls `terminalTool`, whose
 * input is returned as the structured result. This is how both agents
 * enforce a typed final output instead of parsing free-text JSON.
 */
export async function runToolLoop<T>(opts: {
  system: string;
  userMessage: string;
  tools: Tool[];
  handlers: Record<string, ToolHandler>;
  terminalTool: string;
  maxIterations?: number;
}): Promise<T> {
  const anthropic = getClient();
  const messages: MessageParam[] = [{ role: "user", content: opts.userMessage }];
  const maxIterations = opts.maxIterations ?? 8;

  for (let i = 0; i < maxIterations; i++) {
    const response = await anthropic.messages.create({
      model: AGENT_MODEL,
      max_tokens: 4096,
      system: opts.system,
      tools: opts.tools,
      messages,
    });

    const toolUses = response.content.filter(
      (block): block is Anthropic.Messages.ToolUseBlock => block.type === "tool_use",
    );

    const terminal = toolUses.find((t) => t.name === opts.terminalTool);
    if (terminal) {
      return terminal.input as T;
    }

    messages.push({ role: "assistant", content: response.content });

    if (toolUses.length === 0) {
      messages.push({
        role: "user",
        content: `Call the ${opts.terminalTool} tool now with your final structured result.`,
      });
      continue;
    }

    const toolResults = await Promise.all(
      toolUses.map(async (tu) => {
        const handler = opts.handlers[tu.name];
        let result: unknown;
        try {
          result = handler ? await handler(tu.input) : { error: `Unknown tool ${tu.name}` };
        } catch (err) {
          result = { error: err instanceof Error ? err.message : "Tool failed" };
        }
        return {
          type: "tool_result" as const,
          tool_use_id: tu.id,
          content: JSON.stringify(result),
        };
      }),
    );
    messages.push({ role: "user", content: toolResults });
  }

  throw new Error(`Agent did not call ${opts.terminalTool} within ${maxIterations} iterations.`);
}
