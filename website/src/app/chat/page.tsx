"use client";

import { useState, useRef, useEffect } from "react";
import { AGENTS, type AgentId } from "@/components/Home";

type Message = { role: "user" | "assistant"; agent: AgentId; content: string };

const AGENT_QUESTIONS: Record<AgentId, string[]> = {
  EXEC:    ["what's the current strategy this cycle?", "how do the agents coordinate?", "what's the long-term plan?"],
  CLAIM:   ["how much have you claimed lifetime?", "when will the next claim happen?", "what's the fee threshold?"],
  BUYBACK: ["how do you decide how much to buy back?", "what dex do you use?", "how large was the last buyback?"],
  BURN:    ["how many tokens have you burned total?", "why burn instead of hold?", "is there a burn schedule?"],
  LP:      ["when did you add liquidity last?", "what's the current pool depth?", "when do you deepen the pool?"],
};

const AGENT_PLACEHOLDER: Record<AgentId, string> = {
  EXEC:    "ask exec anything…",
  CLAIM:   "ask claim anything…",
  BUYBACK: "ask buyback anything…",
  BURN:    "ask burn anything…",
  LP:      "ask lp anything…",
};

export default function ChatPage() {
  const [activeAgent, setActiveAgent] = useState<AgentId>("EXEC");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  async function send(text: string, agentId: AgentId = activeAgent) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const next: Message[] = [...messages, { role: "user", agent: agentId, content: trimmed }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, agent: agentId }),
      });
      const data = await res.json();
      const reply = data?.reply ?? "something glitched. try again.";
      setMessages([...next, { role: "assistant", agent: agentId, content: reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", agent: agentId, content: "couldn't reach me. try again in a moment." },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  const samples = AGENT_QUESTIONS[activeAgent];

  return (
    <div className="page chat-page">
      <section>
        <div className="page-label">chat</div>
        <h1 className="page-title">talk to the company</h1>
        <p className="page-sub">
          each agent answers from its own context and role. select an agent below, then ask anything.
        </p>
      </section>

      <div className="chat-selector">
        {AGENTS.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`chat-selector-btn${activeAgent === a.id ? " active" : ""}`}
            onClick={() => setActiveAgent(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="chat-thread">
        {messages.length === 0 && (
          <div className="chat-samples">
            {samples.map((q) => (
              <button
                key={q}
                type="button"
                className="chat-sample"
                onClick={() => send(q)}
                disabled={sending}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "chat-line chat-line-user" : "chat-line chat-line-agent"}
          >
            {m.role === "assistant" && (
              <span className="who">{m.agent.toLowerCase()}:</span>
            )}
            {m.content}
          </div>
        ))}

        {sending && (
          <div className="chat-line chat-line-agent">
            <span className="who">{activeAgent.toLowerCase()}:</span>
            thinking…
          </div>
        )}

        <div ref={endRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={AGENT_PLACEHOLDER[activeAgent]}
          disabled={sending}
          maxLength={1000}
        />
        <button type="submit" disabled={sending || !input.trim()}>
          send
        </button>
      </form>
    </div>
  );
}
