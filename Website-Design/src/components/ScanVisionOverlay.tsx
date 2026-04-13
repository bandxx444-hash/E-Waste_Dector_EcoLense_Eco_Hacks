import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const FEATURES = [
  { label: "Device Frame",          confidence: 97, color: "hsl(153 70% 38%)" },
  { label: "Screen: Good Condition", confidence: 93, color: "hsl(43 75% 45%)"  },
  { label: "Brand Logo Detected",   confidence: 89, color: "hsl(153 55% 42%)" },
];

export function ScanVisionOverlay({ imageUrl }: { imageUrl: string }) {
  const [phase, setPhase] = useState<"scan" | "done">("scan");
  const [chips, setChips] = useState<number[]>([]);

  useEffect(() => {
    setPhase("scan");
    setChips([]);
    const t1 = setTimeout(() => setPhase("done"), 1300);
    const t2 = setTimeout(() => setChips([0]), 1400);
    const t3 = setTimeout(() => setChips([0, 1]), 1700);
    const t4 = setTimeout(() => setChips([0, 1, 2]), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [imageUrl]);

  return (
    <div className="rounded-2xl overflow-hidden border border-border" style={{ background: "#0a0a0a" }}>
      {/* Image */}
      <div className="relative flex items-center justify-center" style={{ minHeight: 200 }}>
        <img
          src={imageUrl}
          alt="Device scan"
          className="w-full object-contain"
          style={{ maxHeight: 340, opacity: phase === "scan" ? 0.75 : 0.88, transition: "opacity 0.4s" }}
        />

        {/* Corner brackets */}
        {(["tl","tr","bl","br"] as const).map(c => (
          <div key={c} className="absolute w-6 h-6 pointer-events-none"
            style={{
              top:    c.startsWith("t") ? 10 : undefined,
              bottom: c.startsWith("b") ? 10 : undefined,
              left:   c.endsWith("l")   ? 10 : undefined,
              right:  c.endsWith("r")   ? 10 : undefined,
              borderTop:    c.startsWith("t") ? "2.5px solid hsl(153 70% 52%)" : undefined,
              borderBottom: c.startsWith("b") ? "2.5px solid hsl(153 70% 52%)" : undefined,
              borderLeft:   c.endsWith("l")   ? "2.5px solid hsl(153 70% 52%)" : undefined,
              borderRight:  c.endsWith("r")   ? "2.5px solid hsl(153 70% 52%)" : undefined,
            }} />
        ))}

        {/* Scan sweep line — only during scan phase */}
        <AnimatePresence>
          {phase === "scan" && (
            <motion.div
              className="absolute left-0 right-0 h-px pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 0%, hsl(153 70% 60%) 40%, hsl(43 85% 65%) 60%, transparent 100%)",
                boxShadow: "0 0 10px 2px hsl(153 70% 55% / 0.5)",
              }}
              initial={{ top: 0, opacity: 0.9 }}
              animate={{ top: "100%", opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "linear" }}
            />
          )}
        </AnimatePresence>

        {/* "AI Vision" badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold"
          style={{ background: "hsl(0 0% 0% / 0.65)", color: "hsl(153 70% 58%)", backdropFilter: "blur(4px)" }}>
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${phase === "scan" ? "bg-green-400 animate-pulse" : "bg-green-400"}`} />
          {phase === "scan" ? "Scanning…" : "AI Vision Complete"}
        </div>
      </div>

      {/* Feature chips row — appear after scan */}
      <div className="flex flex-wrap gap-2 px-3 py-2.5 border-t border-white/5" style={{ minHeight: 44 }}>
        {FEATURES.map((f, i) => (
          <AnimatePresence key={f.label}>
            {chips.includes(i) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}40`, color: f.color }}
              >
                <Check className="w-3 h-3" />
                {f.label}
                <span className="opacity-70 font-normal">{f.confidence}%</span>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
        {chips.length === 0 && (
          <div className="shimmer-block w-48 h-6 rounded-full" />
        )}
      </div>
    </div>
  );
}
