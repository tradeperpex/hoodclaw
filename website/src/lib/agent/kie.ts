/**
 * Kie.ai GPT-5-2 — direkte HTTP til api.kie.ai (ingen OpenAI SDK).
 * Alle agent-LLM kald går herfra.
 */

const KIE_BASE = "https://api.kie.ai/gpt-5-2/v1";

export type KieChatRole = "system" | "user" | "assistant";

export type KieChatMessage = { role: KieChatRole; content: string };

type KieResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
};

export type KieChatOptions = {
  max_tokens?: number;
  temperature?: number;
};

export function hasKieApiKey(): boolean {
  return Boolean(process.env.KIE_API_KEY?.trim());
}

/**
 * Nogle modeller (fx gpt-5-2 via Kie) pakker svaret ind i en markdown
 * container-directive som `:::writing{variant="standard" id="123"} ... :::`.
 * Det skal aldrig vises råt, så vi stripper directive-fences og evt.
 * code-fence wrappers fra modellens output.
 */
export function sanitizeModelText(text: string): string {
  return text
    // fjern container-directive åbnere: :::writing{...}, :::note, ::: osv.
    .replace(/:::+\s*[a-zA-Z][\w-]*\s*(\{[^}]*\})?/g, "")
    // fjern resterende ::: fences
    .replace(/:::+/g, "")
    // fjern omsluttende ``` code fences hvis modellen brugte dem
    .replace(/^\s*```[a-zA-Z]*\s*/g, "")
    .replace(/\s*```\s*$/g, "")
    .trim();
}

/**
 * POST /v1/chat/completions — returnerer assistant-tekst eller null hvis ingen key / tom svar.
 */
export async function kieChatCompletions(
  messages: KieChatMessage[],
  options: KieChatOptions = {},
): Promise<string | null> {
  const key = process.env.KIE_API_KEY;
  if (!key) return null;

  const res = await fetch(`${KIE_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-5-2",
      messages,
      max_tokens: options.max_tokens ?? 512,
      temperature: options.temperature ?? 0.8,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Kie.ai ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as KieResponse;
  if (data.error) {
    throw new Error(`Kie.ai error: ${data.error.message ?? "unknown"}`);
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) return null;
  const cleaned = sanitizeModelText(text);
  return cleaned || null;
}
