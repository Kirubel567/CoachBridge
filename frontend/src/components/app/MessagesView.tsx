"use client";

import { useState } from "react";
import { MIcon } from "@/components/ui/MIcon";
import { mockConversations } from "@/lib/mock";
import { cn } from "@/lib/cn";

type Msg = { from: string; text: string; time: string };

export function MessagesView() {
  const [activeId, setActiveId] = useState(mockConversations[0].id);
  const [threads, setThreads] = useState<Record<string, Msg[]>>(() =>
    Object.fromEntries(mockConversations.map((c) => [c.id, c.messages]))
  );
  const [input, setInput] = useState("");
  const [mobileChat, setMobileChat] = useState(false);

  const active = mockConversations.find((c) => c.id === activeId)!;
  const msgs = threads[activeId];

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setThreads((p) => ({
      ...p,
      [activeId]: [...p[activeId], { from: "me", text: input, time: "now" }],
    }));
    setInput("");
  }

  return (
    <div className="mx-auto grid h-[calc(100vh-9rem)] max-w-[1200px] grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
      {/* Conversation list */}
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-[24px] bento-card",
          mobileChat && "hidden lg:flex"
        )}
      >
        <div className="border-b border-outline-variant p-4">
          <div className="relative">
            <MIcon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant"
            />
            <input
              placeholder="Search conversations…"
              className="w-full rounded-xl border-none bg-surface-container-high py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {mockConversations.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveId(c.id);
                setMobileChat(true);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors",
                activeId === c.id
                  ? "bg-primary/5"
                  : "hover:bg-surface-container-high"
              )}
            >
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-bold text-on-primary-container"
                style={{ background: c.accent }}
              >
                {c.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate font-medium text-on-surface">{c.name}</p>
                  <span className="text-xs text-on-surface-variant">{c.time}</span>
                </div>
                <p className="truncate text-sm text-on-surface-variant">
                  {c.messages[c.messages.length - 1]?.text}
                </p>
              </div>
              {c.unread > 0 && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-xs font-bold text-on-primary">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-[24px] bento-card",
          !mobileChat && "hidden lg:flex"
        )}
      >
        <div className="flex items-center gap-3 border-b border-outline-variant p-4">
          <button
            onClick={() => setMobileChat(false)}
            className="grid h-8 w-8 place-items-center rounded-lg text-on-surface-variant lg:hidden"
            aria-label="Back"
          >
            <MIcon name="arrow_back" className="text-[20px]" />
          </button>
          <span
            className="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-on-primary-container"
            style={{ background: active.accent }}
          >
            {active.initials}
          </span>
          <div className="flex-1">
            <p className="font-medium text-on-surface">{active.name}</p>
            <p className="flex items-center gap-1.5 text-xs text-secondary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
              Online now
            </p>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
            <MIcon name="videocam" className="text-[22px]" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed",
                  m.from === "me"
                    ? "rounded-br-none bg-gradient-to-br from-[#947dff] to-[#603ce2] text-white"
                    : "rounded-bl-none border border-outline-variant/30 bg-surface-container-high text-on-surface"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={send}
          className="flex items-center gap-2 border-t border-outline-variant p-4"
        >
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl text-on-surface-variant hover:bg-surface-container-high"
          >
            <MIcon name="attach_file" className="text-[20px]" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-full border border-outline-variant/40 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-on-primary"
            aria-label="Send"
          >
            <MIcon name="send" filled className="text-[20px]" />
          </button>
        </form>
      </div>
    </div>
  );
}
