import { memo, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Line = {
  id: number;
  type: "prompt" | "command" | "response" | "success" | "muted" | "json-key" | "json-value" | "blank";
  text: string;
  indent?: number;
};

const SCRIPT: Line[] = [
  { id: 1, type: "prompt", text: "opensms send --to +639171234567 --from OpenSMS" },
  { id: 2, type: "muted", text: "POST /v1/messages/send" },
  { id: 3, type: "muted", text: "x-api-key: opensms-dev-key-****" },
  { id: 4, type: "blank", text: "" },
  { id: 5, type: "response", text: "{" },
  { id: 6, type: "json-key", text: '"status": "success",', indent: 1 },
  { id: 7, type: "json-key", text: '"data": {', indent: 1 },
  { id: 8, type: "json-key", text: '"id": "msg_8f3a21",', indent: 2 },
  { id: 9, type: "json-key", text: '"to": "+639171234567",', indent: 2 },
  { id: 10, type: "json-key", text: '"network": "Globe",', indent: 2 },
  { id: 11, type: "json-key", text: '"provider": "android_gateway",', indent: 2 },
  { id: 12, type: "json-key", text: '"status": "pending"', indent: 2 },
  { id: 13, type: "response", text: "  }", indent: 1 },
  { id: 14, type: "response", text: "}" },
  { id: 15, type: "blank", text: "" },
  { id: 16, type: "success", text: "message queued - assigned to Android gateway" },
  { id: 17, type: "blank", text: "" },
  { id: 18, type: "prompt", text: "opensms status msg_8f3a21" },
  { id: 19, type: "muted", text: "GET /v1/messages/msg_8f3a21" },
  { id: 20, type: "blank", text: "" },
  { id: 21, type: "response", text: "{" },
  { id: 22, type: "json-key", text: '"status": "success",', indent: 1 },
  { id: 23, type: "json-key", text: '"data": {', indent: 1 },
  { id: 24, type: "json-key", text: '"id": "msg_8f3a21",', indent: 2 },
  { id: 25, type: "json-key", text: '"status": "delivered",', indent: 2 },
  { id: 26, type: "json-key", text: '"network": "Globe",', indent: 2 },
  { id: 27, type: "json-value", text: '"attempts": [', indent: 2 },
  { id: 28, type: "json-value", text: '{ "provider": "android_gateway", "status": "delivered" }', indent: 3 },
  { id: 29, type: "json-value", text: "]", indent: 2 },
  { id: 30, type: "response", text: "  }", indent: 1 },
  { id: 31, type: "response", text: "}" },
  { id: 32, type: "blank", text: "" },
  { id: 33, type: "success", text: "delivered to +639171234567 - reported by phone" },
];

const COLORS: Record<Line["type"], string> = {
  prompt: "text-brand",
  command: "text-label",
  response: "text-muted-foreground",
  success: "text-success-emphasis",
  muted: "text-subtle-foreground",
  "json-key": "text-brand",
  "json-value": "text-chart-2",
  blank: "text-transparent",
};

function linePrefix(type: Line["type"]): string {
  if (type === "prompt") return "$ ";
  return "";
}

export const CliConsole = memo(function CliConsole() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typed, setTyped] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineIdx = useRef(0);
  const charIdx = useRef(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      const idx = lineIdx.current;
      if (idx >= SCRIPT.length) {
        timeout = setTimeout(() => {
          lineIdx.current = 0;
          charIdx.current = 0;
          setVisibleCount(0);
          setTyped("");
          tick();
        }, 4000);
        return;
      }

      const line = SCRIPT[idx];

      if (line.type === "prompt") {
        const full = line.text;
        if (charIdx.current < full.length) {
          charIdx.current++;
          setTyped(full.slice(0, charIdx.current));
          timeout = setTimeout(tick, 28);
        } else {
          setVisibleCount(idx + 1);
          lineIdx.current = idx + 1;
          charIdx.current = 0;
          setTyped("");
          timeout = setTimeout(tick, 400);
        }
      } else {
        setVisibleCount(idx + 1);
        lineIdx.current = idx + 1;
        timeout = setTimeout(tick, line.type === "blank" ? 80 : 120);
      }
    }

    tick();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount, typed]);

  const currentLine = SCRIPT[lineIdx.current];
  const isTyping = currentLine?.type === "prompt" && typed.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <div className="overflow-hidden rounded-[20px] border border-border bg-secondary shadow-[0_30px_80px_rgba(15,23,42,0.08),inset_0_4px_4px_rgba(255,255,255,0.5)] backdrop-blur-[50px]">
        <div className="flex items-center gap-2 bg-brand px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-3 text-[11px] font-medium text-white/90">opensms - bash - 80x24</span>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7CFFB0]" />
            api connected
          </span>
        </div>

        <div
          ref={scrollRef}
          className="h-[300px] overflow-y-auto px-5 py-4 font-mono text-[12.5px] leading-[1.7] sm:h-[360px] lg:h-[400px]"
          style={{ scrollbarWidth: "none" }}
        >
          {SCRIPT.slice(0, visibleCount).map((line) => (
            <div
              key={line.id}
              className={`whitespace-pre-wrap break-words ${COLORS[line.type]}`}
              style={{ paddingLeft: (line.indent ?? 0) * 14 }}
            >
              {linePrefix(line.type) + line.text}
            </div>
          ))}

          {isTyping && (
            <div className={`whitespace-pre-wrap ${COLORS.prompt}`}>
              $ {typed}
              <span className="ml-0.5 inline-block h-[12px] w-[6px] animate-pulse bg-brand/70 align-middle" />
            </div>
          )}

          {!isTyping && visibleCount < SCRIPT.length && (
            <div className="inline-block h-[12px] w-[6px] animate-pulse bg-brand/70 align-middle" />
          )}
        </div>
      </div>
    </motion.div>
  );
});
