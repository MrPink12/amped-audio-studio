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
      {/* Outer housing - heavy dark metal */}
      <div
        className="w-full rounded-md p-[6px] border border-[hsl(0,0%,22%)]"
        style={{
          background: "linear-gradient(135deg, hsl(0,0%,14%) 0%, hsl(0,0%,8%) 50%, hsl(0,0%,12%) 100%)",
          boxShadow: "inset 0 1px 4px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        {/* Inner bezel - brushed metal edge */}
        <div
          className="rounded-sm p-[3px]"
          style={{
            background: "linear-gradient(180deg, hsl(0,0%,25%) 0%, hsl(0,0%,15%) 50%, hsl(0,0%,20%) 100%)",
          }}
        >
          {/* Meter face - dark brushed metal */}
          <div
            className="relative w-full aspect-[1.8/1] overflow-hidden rounded-sm"
            style={{
              background: "linear-gradient(180deg, hsl(220,5%,16%) 0%, hsl(220,3%,10%) 60%, hsl(220,4%,8%) 100%)",
            }}
          >
            {/* Brushed metal texture */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)",
              }}
            />

            {/* Subtle top highlight */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 30%)",
              }}
            />

            {/* VU label */}
            <div className="absolute top-[12%] left-[10%] font-display text-lg font-bold tracking-tight select-none"
              style={{ color: "hsl(0,0%,70%)" }}
            >
              VU
            </div>

            {/* Scale arc - SVG */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 200 110"
              preserveAspectRatio="xMidYMax meet"
            >
              {/* Main arc - white/silver zone */}
              <path
                d="M 25 100 A 85 85 0 0 1 148 100"
                fill="none"
                stroke="hsl(0,0%,55%)"
                strokeWidth="1.5"
              />
              {/* Red zone arc */}
              <path
                d="M 148 100 A 85 85 0 0 1 185 100"
                fill="none"
                stroke="hsl(0,65%,50%)"
                strokeWidth="2"
              />

              {/* dB scale marks */}
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
                const color = mark.red ? "#cc3333" : "hsl(0,0%,65%)";

                return (
                  <g key={`db-${i}`}>
                    <line
                      x1={outerX} y1={outerY} x2={innerX} y2={innerY}
                      stroke={color} strokeWidth={i === 7 ? "1.5" : "1"}
                    />
                    <text
                      x={labelX} y={labelY} fill={color}
                      fontSize="8" fontFamily="Oswald, sans-serif" fontWeight="700"
                      textAnchor="middle" dominantBaseline="middle"
                    >
                      {mark.db}
                    </text>
                  </g>
                );
              })}

              {/* Small ticks */}
              {Array.from({ length: 20 }, (_, i) => {
                const pct = i * 5;
                const angle = (-50 + pct * 0.9) * (Math.PI / 180);
                const cx = 100, cy = 105, r = 85;
                const outerX = cx + Math.cos(angle - Math.PI / 2) * r;
                const outerY = cy + Math.sin(angle - Math.PI / 2) * r;
                const innerX = cx + Math.cos(angle - Math.PI / 2) * (r - 4);
                const innerY = cy + Math.sin(angle - Math.PI / 2) * (r - 4);
                return (
                  <line key={`tick-${i}`}
                    x1={outerX} y1={outerY} x2={innerX} y2={innerY}
                    stroke={pct > 72 ? "#cc3333" : "hsl(0,0%,40%)"} strokeWidth="0.5"
                  />
                );
              })}

              {/* Percentage scale */}
              <path d="M 38 100 A 72 72 0 0 1 175 100" fill="none" stroke="hsl(0,0%,30%)" strokeWidth="0.5" />
              {[
                { val: "20", pct: 5 },
                { val: "40", pct: 25 },
                { val: "60", pct: 45 },
                { val: "80", pct: 62 },
                { val: "100", pct: 72 },
              ].map((mark, i) => {
                const angle = (-50 + mark.pct * 0.9) * (Math.PI / 180);
                const cx = 100, cy = 105, r = 63;
                const labelX = cx + Math.cos(angle - Math.PI / 2) * r;
                const labelY = cy + Math.sin(angle - Math.PI / 2) * r;
                return (
                  <text key={`pct-${i}`}
                    x={labelX} y={labelY} fill="hsl(0,0%,35%)"
                    fontSize="6" fontFamily="Share Tech Mono, monospace"
                    textAnchor="middle" dominantBaseline="middle"
                  >
                    {mark.val}
                  </text>
                );
              })}

              <text x="178" y="94" fill="#cc3333" fontSize="7" fontWeight="bold" fontFamily="Oswald">+</text>

              {/* Vunox logo */}
              <text x="100" y="95" fill="hsl(43,80%,55%)" fontSize="7"
                fontFamily="Oswald, sans-serif" fontWeight="600" textAnchor="middle" letterSpacing="2"
              >
                VUNOX
              </text>
            </svg>

            {/* Needle - white/silver */}
            <div
              className="absolute bottom-[5%] left-1/2 h-[75%] w-[2px] origin-bottom"
              style={{
                transform: `translateX(-50%) rotate(${needleAngle}deg)`,
                transition: "transform 180ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full"
                  style={{
                    width: "1.5px",
                    background: "linear-gradient(to top, hsl(0,0%,80%), hsl(0,0%,60%))",
                    boxShadow: "0 0 4px rgba(255,255,255,0.15)",
                  }}
                />
              </div>
            </div>

            {/* Needle pivot - chrome */}
            <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
              style={{
                background: "radial-gradient(circle at 40% 35%, hsl(0,0%,45%), hsl(0,0%,12%))",
                boxShadow: "0 1px 3px rgba(0,0,0,0.6), inset 0 0.5px 0 rgba(255,255,255,0.15)",
              }}
            />

            {/* Subtle edge glow */}
            <div className="absolute inset-0 pointer-events-none rounded-sm"
              style={{
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.4)",
              }}
            />
          </div>
        </div>
      </div>

      {label && (
        <span className="text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground mt-1">
          {label}
        </span>
      )}
    </div>
  );
};

export default VUMeter;
