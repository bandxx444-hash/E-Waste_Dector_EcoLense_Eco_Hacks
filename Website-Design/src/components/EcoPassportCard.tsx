import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface EcoPassportProps {
  deviceName: string;
  co2Saved: number;
  estimatedValue: number;
}

const EcoPassportCard = ({ deviceName, co2Saved, estimatedValue }: EcoPassportProps) => {
  const [copied, setCopied] = useState(false);
  const trees = Math.max(1, Math.round(co2Saved / 48));
  const miles = Math.max(1, Math.round(co2Saved / 0.89));

  const handleCopy = () => {
    const text = `Just saved ${co2Saved} lbs of CO₂ by selling my ${deviceName} with EcoLens AI — equivalent to ${trees} trees breathing for a year.\n\nRecovered $${estimatedValue} from my old tech.\n\n#EcoLens #Sustainability #CircularEconomy`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Just saved ${co2Saved} lbs of CO₂ by selling my ${deviceName} with EcoLens AI — = ${trees} trees breathing for a year.\n\nRecovered $${estimatedValue} from my old tech.\n\n#EcoLens #Sustainability #CircularEconomy`
  )}`;

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg"
      style={{ background: "linear-gradient(145deg, hsl(153 60% 20%), hsl(160 55% 14%))" }}>
      <div className="px-6 pt-6 pb-5 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "hsl(153 70% 38% / 0.2)", border: "1px solid hsl(153 70% 52% / 0.3)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z"
              fill="hsl(153 70% 52% / 0.18)" stroke="hsl(153 70% 65%)" strokeWidth="1.5" />
            <path d="M9 12l2 2 4-4" stroke="hsl(153 70% 70%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[3px] mb-2" style={{ color: "hsl(153 70% 55%)" }}>Eco-Passport</p>
        <h2 className="text-2xl font-display font-bold text-white leading-tight">
          You just saved {co2Saved} lbs of CO₂
        </h2>
        <p className="text-sm mt-2" style={{ color: "hsl(153 60% 65%)" }}>
          = {trees} trees breathing for a year
        </p>
      </div>

      <div className="grid grid-cols-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {[
          { label: "CO₂ Saved", val: `${co2Saved} lbs` },
          { label: "Value Recovered", val: `$${estimatedValue.toLocaleString()}` },
          { label: "Miles Offset", val: miles.toLocaleString() },
        ].map((s, i) => (
          <div key={s.label} className="text-center py-3"
            style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : undefined }}>
            <p className="text-base font-display font-bold text-white">{s.val}</p>
            <p className="text-[9px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-colors"
          style={{ background: "hsl(153 70% 38% / 0.25)", color: "hsl(153 70% 72%)" }}>
          {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy for LinkedIn</>}
        </button>
        <a href={tweetUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold"
          style={{ background: "rgba(29,161,242,0.18)", color: "rgba(29,161,242,0.9)" }}>
          Share on X/Twitter
        </a>
      </div>
    </div>
  );
};

export default EcoPassportCard;
