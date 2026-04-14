import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import ProgressBar from "@/components/ProgressBar";
import { useScan } from "@/context/ScanContext";

const LOG_LINES = [
  { msg: "[INIT] EcoLens Vision Engine v2.1 loaded", color: "#4ade80" },
  { msg: "[INFO] Analyzing image pixels (3024×4032)…", color: "rgba(255,255,255,0.5)" },
  { msg: "[MATCH] Chassis detected: Aluminum (Space Gray)", color: "#34d399" },
  { msg: "[NLP] Cross-referencing eBay sold listings (n=452)…", color: "#60a5fa" },
  { msg: "[CALC] Market depreciation curve: −12% YoY", color: "#fbbf24" },
  { msg: "[MATCH] Brand logo confidence: 89.3%", color: "#34d399" },
  { msg: "[INFO] Screen condition: 94% pixels intact", color: "rgba(255,255,255,0.5)" },
  { msg: "[NLP] Querying comparable sales database…", color: "#60a5fa" },
  { msg: "[CALC] Depreciation adjusted for condition (−8%)", color: "#fbbf24" },
  { msg: "[MATCH] Model fingerprint: 97.1% confidence", color: "#34d399" },
  { msg: "[INFO] Generating price range estimate…", color: "rgba(255,255,255,0.5)" },
  { msg: "[DONE] 6 vision signals processed successfully", color: "#4ade80" },
];

function LiveAILogs() {
  const [visible, setVisible] = useState<{ msg: string; color: string; id: number }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    let i = 0;
    const add = () => {
      const line = LOG_LINES[i % LOG_LINES.length];
      setVisible(prev => [...prev.slice(-10), { ...line, id: counterRef.current++ }]);
      i++;
    };
    add();
    const id = setInterval(add, 900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visible]);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 rounded-xl overflow-hidden shadow-2xl"
      style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <span className="text-[10px] font-mono ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>ecolens-ai — live analysis</span>
        <span className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-mono text-green-400">LIVE</span>
        </span>
      </div>
      <div className="p-3 h-44 overflow-y-auto space-y-0.5" style={{ scrollbarWidth: "none" }}>
        {visible.map(line => (
          <motion.div key={line.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] font-mono leading-[1.8]"
            style={{ color: line.color }}>
            {line.msg}
          </motion.div>
        ))}
        <span className="inline-block w-1.5 h-3.5 bg-green-400 animate-pulse align-middle" />
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

const DiagnosticsPage = () => {
  const navigate = useNavigate();
  const { diagnostics, setDiagnostics } = useScan();
  const [form, setForm] = useState(diagnostics);

  const confident = Object.entries(form.aiConfidence).filter(([, v]) => v);
  const uncertain = Object.entries(form.aiConfidence).filter(([, v]) => !v);
  const allConfident = uncertain.length === 0;

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = () => { setDiagnostics(form); navigate("/loading"); };

  const fieldLabel = (key: string) => ({
    productName: "Product Name", brand: "Brand", modelNumber: "Model Number",
    yearOfPurchase: "Year of Purchase", powersOn: "Does the device power on?", screenCondition: "Screen Condition",
  }[key] || key);

  const isUncertain = (key: string) => form.aiConfidence[key] === false;

  const inputCls = "w-full border rounded-xl px-4 py-2.5 text-sm bg-card text-foreground placeholder:text-faintest focus:outline-none focus:ring-2 transition-all duration-200 font-sans";
  const uncertainInputCls = `${inputCls} border-orange-400/60 focus:ring-orange-400/30 animate-uncertain-pulse`;
  const normalInputCls = `${inputCls} border-border focus:ring-primary/30`;

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <LiveAILogs />
      <Navbar />
      <main className="container mx-auto px-4 max-w-2xl relative z-10 pt-8 pb-20 font-sans">
        <ProgressBar percent={35} />

        <button onClick={() => navigate("/upload")} className="flex items-center gap-1.5 text-sm text-subtle mt-6 mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <span className="text-[11px] font-bold uppercase tracking-[2px] text-primary mb-3 block">Step 2 of 4</span>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 gradient-border"
            style={{ background: "linear-gradient(135deg, hsl(153 70% 38% / 0.1), hsl(43 75% 50% / 0.05))" }}>
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-[36px] font-display font-bold mb-2">Device Diagnostics</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {allConfident ? (
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-6 gradient-border"
              style={{ background: "linear-gradient(135deg, hsl(153 70% 38% / 0.08), transparent)" }}>
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI identified all fields from your media</span>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl px-4 py-3 mb-6 gradient-border"
              style={{ background: "linear-gradient(135deg, hsl(153 70% 38% / 0.06), hsl(43 75% 50% / 0.04))" }}>
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="text-sm">
                <span className="text-primary font-medium">AI filled in {confident.length} field(s) automatically.</span>{" "}
                <span className="text-accent font-medium">{uncertain.length} field(s) couldn't be determined — please complete them below.</span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card"
        >
          <div className="space-y-5">
            {(["productName", "brand", "modelNumber", "yearOfPurchase"] as const).map(key => (
              <div key={key}>
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                  {fieldLabel(key)}
                  {key === "modelNumber" && <span className="text-faintest font-normal">(optional)</span>}
                  {isUncertain(key) && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
                  {isUncertain(key) && <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">Needs your input</span>}
                </label>
                <input
                  type={key === "yearOfPurchase" ? "number" : "text"}
                  value={(form as any)[key]}
                  onChange={e => update(key, key === "yearOfPurchase" ? parseInt(e.target.value) : e.target.value)}
                  placeholder={key === "productName" ? "e.g. iPhone 12" : key === "brand" ? "e.g. Apple" : key === "modelNumber" ? "e.g. A2172" : ""}
                  className={isUncertain(key) ? uncertainInputCls : normalInputCls}
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-2">
                {fieldLabel("powersOn")}
                {isUncertain("powersOn") && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
                {isUncertain("powersOn") && <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">Needs your input</span>}
              </label>
              <div className={`flex gap-3 ${isUncertain("powersOn") ? "rounded-xl ring-1 ring-orange-400/40 animate-uncertain-pulse p-0.5" : ""}`}>
                {[true, false].map(val => (
                  <button key={String(val)} onClick={() => update("powersOn", val)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      form.powersOn === val ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-subtle hover:border-primary/30"
                    }`}>
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                {fieldLabel("screenCondition")}
                {isUncertain("screenCondition") && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
                {isUncertain("screenCondition") && <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">Needs your input</span>}
              </label>
              <select value={form.screenCondition} onChange={e => update("screenCondition", e.target.value)} className={isUncertain("screenCondition") ? uncertainInputCls : normalInputCls}>
                <option value="">Select condition…</option>
                <option value="Flawless">Flawless</option>
                <option value="Minor Scratches">Minor Scratches</option>
                <option value="Cracked">Cracked</option>
                <option value="Screen is off/broken">Screen is off/broken</option>
              </select>
            </div>
          </div>

          <button onClick={handleSubmit}
            className="w-full mt-8 py-3.5 rounded-xl font-bold text-[15px] text-primary-foreground shadow-cta transition-all duration-300 hover:-translate-y-0.5 gradient-btn relative overflow-hidden">
            <span className="relative z-10">Run AI Analysis →</span>
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default DiagnosticsPage;
