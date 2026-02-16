import { useEffect, useState } from "react";

interface VUMeterProps {
  level: number;
  label?: string;
}

const VUMeter = ({ level, label = "VU" }: VUMeterProps) => {
  const [displayLevel, setDisplayLevel] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayLevel(level), 50);
    return () => clearTimeout(timer);
  }, [level]);

  const needleAngle = -50 + (displayLevel / 100) * 90;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Outer housing - dark metal frame */}
      <div className="w-full bg-[hsl(0,0%,12%)] rounded-md p-[6px] border border-[hsl(0,0%,20%)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.05)]">
        <div className="bg-gradient-to-b from-[hsl(0,0%,28%)] to-[hsl(0,0%,18%)] rounded-sm p-[3px]">
          {/* Meter face - warm cream/beige like classic VU */}
          <div className="relative w-full aspect-[1.8/1] overflow-hidden rounded-sm"
            style={{
              background: "linear-gradient(180deg, hsl(40,35%,82%) 0%, hsl(38,30%,75%) 60%, hsl(35,25%,68%) 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="absolute top-[12%] left-[10%] font-display text-[hsl(0,0%,10%)] text-lg font-bold tracking-tight select-none">
              VU
            </div>

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 110" preserveAspectRatio="xMidYMax meet">
              <path d="M 25 100 A 85 85 0 0 1 148 100" fill="none" stroke="hsl(0,0%,15%)" strokeWidth="1.5" />
              <path d="M 148 100 A 85 85 0 0 1 185 100" fill="none" stroke="hsl(0,70%,45%)" strokeWidth="2" />

              {[
                { db: "20", pct: 0, red: false },
                { db: "10", pct: 15, red: false },
                { db: "7", pct: 25, red: false },
                { db: "5", pct: 33, red: false },
                { db: "3", pct: 45, red: false },
                { db: "2", pct: 53, red: false },
                { db: "1", pct: 62, red: false },
                { db: "0", pct: 72, red: false },
                { db: "1", pct: 80, red: true },
                { db: "2", pct: 88, red: true },
                { db: "3", pct: 96, red: true },
              ].map((mark, i) => {
                const angle = (-50 + mark.pct * 0.9) * (Math.PI / 180);
                const cx = 100, cy = 105, r = 85;
                const outerX = cx + Math.cos(angle - Math.PI / 2) * r;
                const outerY = cy + Math.sin(angle - Math.PI / 2) * r;
                const innerX = cx + Math.cos(angle - Math.PI / 2) * (r - 8);
                const innerY = cy + Math.sin(angle - Math.PI / 2) * (r - 8);
                const labelX = cx + Math.cos(angle - Math.PI / 2) * (r - 18);
                const labelY = cy + Math.sin(angle - Math.PI / 2) * (r - 18);
                const color = mark.red ? "#b33" : "#1a1a1a";
                return (
                  <g key={`db-${i}`}>
                    <line x1={outerX} y1={outerY} x2={innerX} y2={innerY} stroke={color} strokeWidth={i === 7 ? "1.5" : "1"} />
                    <text x={labelX} y={labelY} fill={color} fontSize="8" fontFamily="Oswald, sans-serif" fontWeight="700" textAnchor="middle" dominantBaseline="middle">{mark.db}</text>
                  </g>
                );
              })}

              {Array.from({ length: 20 }, (_, i) => {
                const pct = i * 5;
                const angle = (-50 + pct * 0.9) * (Math.PI / 180);
                const cx = 100, cy = 105, r = 85;
                const outerX = cx + Math.cos(angle - Math.PI / 2) * r;
                const outerY = cy + Math.sin(angle - Math.PI / 2) * r;
                const innerX = cx + Math.cos(angle - Math.PI / 2) * (r - 4);
                const innerY = cy + Math.sin(angle - Math.PI / 2) * (r - 4);
                return <line key={`tick-${i}`} x1={outerX} y1={outerY} x2={innerX} y2={innerY} stroke={pct > 72 ? "#b33" : "#333"} strokeWidth="0.5" />;
              })}

              <path d="M 38 100 A 72 72 0 0 1 175 100" fill="none" stroke="hsl(0,0%,25%)" strokeWidth="0.5" />
              {[
                { val: "20", pct: 5 }, { val: "40", pct: 25 }, { val: "60", pct: 45 }, { val: "80", pct: 62 }, { val: "100", pct: 72 },
              ].map((mark, i) => {
                const angle = (-50 + mark.pct * 0.9) * (Math.PI / 180);
                const cx = 100, cy = 105, r = 63;
                const labelX = cx + Math.cos(angle - Math.PI / 2) * r;
                const labelY = cy + Math.sin(angle - Math.PI / 2) * r;
                return <text key={`pct-${i}`} x={labelX} y={labelY} fill="#444" fontSize="6" fontFamily="Share Tech Mono, monospace" textAnchor="middle" dominantBaseline="middle">{mark.val}</text>;
              })}

              <text x="178" y="94" fill="#b33" fontSize="7" fontWeight="bold" fontFamily="Oswald">+</text>
              <text x="100" y="95" fill="hsl(0,0%,15%)" fontSize="7" fontFamily="Oswald, sans-serif" fontWeight="600" textAnchor="middle" letterSpacing="2">VUNOX</text>
            </svg>

            <div className="absolute bottom-[5%] left-1/2 h-[75%] w-[2px] origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${needleAngle}deg)`, transition: "transform 180ms cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              <div className="relative w-full h-full">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full"
                  style={{ width: "1.5px", background: "linear-gradient(to top, hsl(0,0%,10%), hsl(0,0%,20%))" }}
                />
              </div>
            </div>

            <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
              style={{ background: "radial-gradient(circle at 40% 35%, hsl(0,0%,50%), hsl(0,0%,20%))", boxShadow: "0 1px 3px rgba(0,0,0,0.5), inset 0 0.5px 0 rgba(255,255,255,0.2)" }}
            />

            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 60% 80%, hsl(40,40%,70%,0.15), transparent 60%)" }}
            />
          </div>
        </div>
      </div>

      {label && (
        <span className="text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground mt-1">{label}</span>
      )}
    </div>
  );
};

export default VUMeter;
