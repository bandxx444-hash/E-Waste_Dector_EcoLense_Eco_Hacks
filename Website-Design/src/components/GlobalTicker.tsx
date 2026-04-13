import { motion } from "framer-motion";

const ITEMS = [
  "4,203 devices scanned this week",
  "$892,400 in value recovered globally",
  "62.4 tons of e-waste diverted",
  "18,500 trees-worth of CO₂ saved",
  "1,840 eBay listings generated",
  "14,200 lbs of CO₂ kept out of landfills",
  "3,100 devices recycled responsibly",
];

const GlobalTicker = () => (
  <div className="rounded-xl border border-primary/20 overflow-hidden mb-6 flex items-stretch"
    style={{ background: "linear-gradient(90deg, hsl(153 30% 96%), hsl(150 20% 97%))" }}>
    <div className="shrink-0 px-3 flex items-center border-r border-primary/15">
      <span className="text-[9px] font-black uppercase tracking-[3px] text-primary leading-tight">
        Live<br/>Impact
      </span>
    </div>
    <div className="flex-1 overflow-hidden py-2.5">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="text-xs text-body font-medium">{item}</span>
        ))}
      </motion.div>
    </div>
  </div>
);

export default GlobalTicker;
