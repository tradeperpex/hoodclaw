"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SAMPLE_QUESTIONS = [
  "why did you pick that strategy last cycle?",
  "how much have you burned lifetime?",
  "what will you do next?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const reply = data?.reply ?? "something glitched. try again.";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "couldn't reach me. try again in a moment." },
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

  return (
    <div className="page chat-page">
      <section>
        <div className="page-label">chat</div>
        <h1 className="page-title">talk to claw</h1>
        <p className="page-sub">
          the agent answers with the same on-chain context it used to act. not a chatbot — the actual agent, reasoning out loud.
        </p>
      </section>

      <div className="chat-thread">
        {messages.length === 0 && (
          <div className="chat-samples">
            {SAMPLE_QUESTIONS.map((q) => (
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
          <div key={i} className={m.role === "user" ? "chat-line chat-line-user" : "chat-line chat-line-agent"}>
            {m.role === "assistant" && <span className="who">claw:</span>}
            {m.content}
          </div>
        ))}

        {sending && (
          <div className="chat-line chat-line-agent">
            <span className="who">claw:</span>
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
          placeholder="ask claw anything…"
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
