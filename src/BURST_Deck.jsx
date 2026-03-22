import { useState, useEffect, useCallback, useMemo, useRef } from "react";

function useIsMobile(breakpoint = 768) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.innerWidth < breakpoint);
  useEffect(() => {
    const h = () => setM(window.innerWidth < breakpoint);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [breakpoint]);
  return m;
}

const B = {
  bg: "#05070b",
  bg2: "#0a0d14",
  s: "#12162080",
  s2: "#181e2c",
  green: "#25C2A0",
  greenDark: "#1a8f75",
  orange: "#E8793A",
  blue: "#3B82F6",
  red: "#EF4444",
  rd: "#991b1b",
  white: "#f0f4f8",
  text: "#c8d1dc",
  gray: "#94a3b8",
  muted: "#64748b",
  dim: "#3b4963",
  gold: "#fbbf24",
  purple: "#a78bfa",
};

/* --- Helpers --- */
function FI({ children, d = 0, dy = 24 }) {
  return (
    <div
      style={{
        animation: `sIn 800ms ${d}ms both cubic-bezier(.16,1,.3,1)`,
        "--dy": dy + "px",
      }}
    >
      {children}
    </div>
  );
}

function CountUp({ end, suf = "", dur = 1600, active, dec = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) { setV(0); return; }
    let cur = 0;
    const step = end / (dur / 16);
    const id = setInterval(() => {
      cur = Math.min(cur + step, end);
      setV(cur);
      if (cur >= end) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [end, dur, active]);
  return (
    <span>
      {dec ? v.toFixed(dec) : Math.round(v).toLocaleString()}
      {suf}
    </span>
  );
}

function Tag({ children, color }) {
  return (
    <span
      style={{
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: 5,
        color: color || B.green,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        display: "inline-block",
        marginBottom: 16,
        padding: "4px 0",
        borderBottom: `1px solid ${(color || B.green)}33`,
      }}
    >
      {children}
    </span>
  );
}

function GlassCard({ children, style = {}, accent, glow }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(18,22,32,0.7), rgba(12,15,22,0.85))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 18,
        border: `1px solid ${accent || B.dim}22`,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {glow && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${accent || B.green}66, transparent)`,
        }} />
      )}
      {children}
    </div>
  );
}

/* --- Floating particles --- */
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      dur: 20 + Math.random() * 40,
      delay: Math.random() * -30,
      opacity: 0.08 + Math.random() * 0.15,
    })), []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x + "%",
            top: p.y + "%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: i % 3 === 0 ? B.green : i % 3 === 1 ? B.orange : B.blue,
            opacity: p.opacity,
            animation: `drift ${p.dur}s ${p.delay}s infinite linear`,
          }}
        />
      ))}
    </div>
  );
}

/* --- Birth Lottery --- */
function BirthLottery({ active, mobile }) {
  const [rolled, setRolled] = useState(false);
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!active) { setRolled(false); setResult(null); setSpinning(false); }
  }, [active]);

  const outcomes = [
    { weight: 0.07, pct: "7%", label: "Born high-income", desc: "More than €46 a day. €1,400 a month. That's it. That's the best possible outcome on this planet and 93% of humans will never see it. In most of Europe this is part-time retail wage. You could afford a studio flat, transport, and food — but not all three comfortably. This is the ceiling. The global ceiling. Now look at the other four outcomes and ask yourself if the system is working.", color: B.gold, wealth: "> €46/day", emoji: "⚖️", src: "Pew Research Center — 7% of world population is high income (> $50/day, 2011 PPP)", srcUrl: "https://www.pewresearch.org/global-migration-and-demography/feature/global-population-by-income/" },
    { weight: 0.15, pct: "15%", label: "Born upper-middle", desc: "€18 to €46 a day. €550 to €1,400 a month. You're a schoolteacher in Turkey, a nurse in Brazil, a factory supervisor in Vietnam. You can cover rent and food most months. When your child gets sick, you borrow. When the car breaks, you stop eating out for six months. There is no emergency fund. There is no plan B. You are richer than 78% of all humans and you are one bad month from debt you will never repay.", color: "#86efac", wealth: "€18–€46/day", emoji: "🪟", src: "Pew Research Center — 15% of world population is upper-middle income ($20–$50/day, 2011 PPP)", srcUrl: "https://www.pewresearch.org/global-migration-and-demography/feature/global-population-by-income/" },
    { weight: 0.17, pct: "17%", label: "Born middle income", desc: "€9 to €18 a day. €270 to €550 a month. You're a garment worker in Bangladesh, a tuk-tuk driver in Cambodia, a cleaner in Nairobi. You eat rice and lentils because you can't afford meat. Your kids share one pair of shoes. The school is free but the uniform costs a month's wages. When you get a toothache, you pull it yourself or let it rot — a dentist costs three weeks of food.", color: B.blue, wealth: "€9–€18/day", emoji: "🪢", src: "Pew Research Center — 17% of world population is middle income ($10–$20/day, 2011 PPP)", srcUrl: "https://www.pewresearch.org/global-migration-and-demography/feature/global-population-by-income/" },
    { weight: 0.51, pct: "51%", label: "Born low-income", desc: "€1.80 to €9 a day. €55 to €270 a month. This is more than half of all living humans. You're a brick kiln worker in India, a smallholder farmer in Malawi, a street vendor in Bolivia. You skip meals so your children don't have to. Your drinking water gives you diarrhea but it's the only water there is. You will work until your body breaks and then your eldest child will replace you. There is no retirement. There is no safety net. There is just tomorrow, and it looks exactly like today.", color: B.orange, wealth: "€1.80–€9/day", emoji: "🫸", src: "Pew Research Center — 51% of world population is low income ($2–$10/day, 2011 PPP)", srcUrl: "https://www.pewresearch.org/global-migration-and-demography/feature/global-population-by-income/" },
    { weight: 0.10, pct: "10%", label: "Born into poverty", desc: "Less than €1.80 a day. €54 a month. 800 million people. You're a subsistence farmer in the DRC, a displaced mother in South Sudan, a child mining cobalt in a hole in the ground. You don't have an address. You don't have documents. Hospitals exist but not for you. Your infant has a 1-in-13 chance of dying before age five. You are not a statistic the world is trying to fix. You are a statistic the world has agreed to live with.", color: B.red, wealth: "< €1.80/day", emoji: "🕛", src: "Pew Research Center — 10% of world population lives in poverty (≤ $2/day, 2011 PPP)", srcUrl: "https://www.pewresearch.org/global-migration-and-demography/feature/global-population-by-income/" },
  ];

  const roll = (e) => {
    e.stopPropagation();
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setRolled(true);
      let r = Math.random(), cumulative = 0;
      for (const o of outcomes) {
        cumulative += o.weight;
        if (r < cumulative) { setResult(o); return; }
      }
      setResult(outcomes[outcomes.length - 1]);
    }, 1600);
  };

  if (!active) return null;

  return (
    <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto", padding: mobile ? "0 4px" : 0 }}>
      {!rolled && !spinning && (
        <FI d={400}>
          <button
            onClick={roll}
            style={{
              background: `linear-gradient(135deg, ${B.green}15, ${B.green}08)`,
              border: `2px solid ${B.green}55`,
              color: B.green,
              padding: mobile ? "16px 40px" : "20px 56px",
              borderRadius: 50,
              fontSize: 17,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: 1.5,
              transition: "all .4s cubic-bezier(.16,1,.3,1)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = `linear-gradient(135deg, ${B.green}25, ${B.green}15)`;
              e.target.style.transform = "scale(1.05)";
              e.target.style.borderColor = B.green;
              e.target.style.boxShadow = `0 0 40px ${B.green}22`;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = `linear-gradient(135deg, ${B.green}15, ${B.green}08)`;
              e.target.style.transform = "scale(1)";
              e.target.style.borderColor = `${B.green}55`;
              e.target.style.boxShadow = "none";
            }}
          >
            Roll the birth lottery
          </button>
          <div style={{ fontSize: 12, color: B.gray, marginTop: 18, lineHeight: 1.7 }}>
            If you were born today, randomly, anywhere on Earth
            <br />
            <span style={{ color: B.muted, fontSize: 10 }}>
              Weighted to Pew Research Center global income distribution data
            </span>
          </div>
        </FI>
      )}
      {spinning && (
        <div style={{ animation: "fadeIn .3s both" }}>
          <div style={{ fontSize: 80, animation: "float .5s infinite ease-in-out" }}>{"🎲"}</div>
          <div style={{ fontSize: 13, color: B.gray, marginTop: 14 }}>Assigning you a life...</div>
        </div>
      )}
      {rolled && result && (
        <div style={{ animation: "sIn .8s both", maxHeight: "80vh", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: mobile ? "0 2px" : 0 }}>
          <div style={{ fontSize: mobile ? 28 : 36, marginBottom: 4 }}>{result.emoji}</div>
          <div style={{
            fontSize: mobile ? "clamp(32px, 10vw, 48px)" : "clamp(40px, 7vw, 64px)", fontWeight: 800, color: result.color,
            fontFamily: "'Sora', sans-serif", lineHeight: 1,
            textShadow: `0 0 60px ${result.color}33`,
          }}>
            {result.pct}
          </div>
          <div style={{ fontSize: mobile ? 9 : 10, textTransform: "uppercase", letterSpacing: mobile ? 3 : 6, color: B.gray, margin: "6px 0 8px" }}>
            of all humans born into this
          </div>
          <div style={{ fontSize: mobile ? 16 : 20, fontWeight: 800, color: result.color, marginBottom: 8 }}>
            {result.label}
          </div>
          <div style={{ fontSize: mobile ? 12 : 13, color: B.text, lineHeight: 1.7, maxWidth: 420, margin: "0 auto 12px", textAlign: "left" }}>
            {result.desc}
          </div>
          <GlassCard accent={result.color} style={{ display: "inline-flex", gap: 10, alignItems: "center", padding: "10px 20px" }}>
            <span style={{ fontSize: 11, color: B.gray }}>Income:</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: result.color, fontFamily: "'JetBrains Mono', monospace" }}>
              {result.wealth}
            </span>
          </GlassCard>
          <a
            href={result.srcUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: mobile ? 9 : 10, color: B.muted, textDecoration: "none", marginTop: 8,
              borderBottom: `1px dotted ${B.muted}55`, transition: "color .2s",
              maxWidth: mobile ? "90vw" : "auto", wordBreak: "break-word", textAlign: "center",
            }}
            onMouseEnter={(e) => { e.target.style.color = B.gray; }}
            onMouseLeave={(e) => { e.target.style.color = B.muted; }}
          >
            {mobile ? "Source: Pew Research Center ↗" : `Source: ${result.src} ↗`}
          </a>
          <button
            onClick={(e) => { e.stopPropagation(); setRolled(false); setResult(null); roll(e); }}
            style={{
              marginTop: 14, background: `linear-gradient(135deg, ${B.green}15, ${B.green}08)`,
              border: `2px solid ${B.green}55`, color: B.green, flexShrink: 0,
              padding: mobile ? "14px 40px" : "16px 48px", borderRadius: 50, fontSize: mobile ? 14 : 16, fontWeight: 700, letterSpacing: 1.5,
              cursor: "pointer", fontFamily: "inherit", transition: "all .3s",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = B.green; e.target.style.color = B.green; }}
            onMouseLeave={(e) => { e.target.style.borderColor = B.dim + "44"; e.target.style.color = B.gray; }}
          >
            Roll again
          </button>
        </div>
      )}
    </div>
  );
}

/* --- Spectrum --- */
function Spectrum({ active, mobile }) {
  const [r, setR] = useState(0);
  const [e, setE] = useState(100);

  useEffect(() => { if (!active) { setR(0); setE(100); } }, [active]);

  const model = useMemo(() => {
    if (r < 8 && e > 85) return { name: "Normal money", desc: "This is where we are. No universal income. No expiry. You start at zero. Wealth compounds at the top. The bottom stays empty.", color: B.muted, emoji: "💰", tag: "THE STATUS QUO" };
    if (r < 8) return { name: "Deflationary currency", desc: "Wealth decays but nobody gets income. Punishes hoarding without helping anyone.", color: B.blue, emoji: "📉", tag: "THEORETICAL" };
    if (e > 80) return { name: "Capitalism + UBI", desc: "Markets still work. Innovation still rewarded. But everyone has a floor. Failure no longer means starvation.", color: B.green, emoji: "🌱", tag: "THE SWEET SPOT" };
    if (e > 55) return { name: "Balanced economy", desc: "Universal income with moderate wealth cycling. Long-term saving works but extreme hoarding naturally decays.", color: "#4ecdc4", emoji: "⚖️", tag: "SELF-CORRECTING" };
    if (e > 25) return { name: "Accountability economy", desc: "Currency becomes reputation. Your wealth reflects what you've contributed recently — not what you accumulated decades ago.", color: B.orange, emoji: "🔥", tag: "MERITOCRATIC" };
    return { name: "Pure equality", desc: "TRST expires almost instantly. No transferable wealth. Pure contribution tracking.", color: B.purple, emoji: "🟰", tag: "RADICAL" };
  }, [r, e]);

  const bars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const p = i / 60;
      const base = Math.pow(p, 2 + (1 - r / 100) * 4);
      const decay = e < 90 ? Math.max(0.08, 1 - (1 - e / 100) * p * 2.5) : 1;
      const ubi = (r / 100) * 0.35;
      return Math.min(1, base * decay + ubi);
    });
  }, [r, e]);

  if (!active) return null;

  const eLabel = e > 90 ? "Forever" : e > 70 ? "~" + e + " years" : e > 5 ? e + " years" : "Near-instant";

  return (
    <div style={{ maxWidth: 660, width: "100%", textAlign: "left" }}>
      {/* Bars */}
      <div style={{ position: "relative", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "flex-end", height: 120, gap: 1, padding: "0 4px" }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: Math.max(h * 100, 1) + "%",
                background: `linear-gradient(to top, ${model.color}44, ${model.color}cc)`,
                borderRadius: "2px 2px 0 0",
                transition: "all .4s cubic-bezier(.16,1,.3,1)",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: B.muted, marginTop: 8 }}>
          <span>Poorest</span>
          <span style={{ color: B.gray, fontWeight: 600, fontSize: 11 }}>Wealth distribution</span>
          <span>Richest</span>
        </div>
        <GlassCard accent={model.color} glow style={{
          position: "absolute", top: 8, right: 8, padding: "8px 14px",
        }}>
          <div style={{ fontSize: 9, color: model.color, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>
            {model.tag}
          </div>
        </GlassCard>
      </div>

      {/* Sliders */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 18 : 28, marginBottom: 24 }}>
        {[
          { label: "Universal Income (r)", value: r, set: setR, color: B.orange, lo: "No income", hi: "Maximum UBI", display: r + "%" },
          { label: "Wealth Permanence (e)", value: e, set: setE, color: B.green, lo: "Expires fast", hi: "Lasts forever", display: eLabel },
        ].map((slider, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: B.text, fontWeight: 600 }}>{slider.label}</span>
              <span style={{ fontSize: 14, color: slider.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                {slider.display}
              </span>
            </div>
            <input
              type="range" min="0" max="100" value={slider.value}
              onChange={(ev) => { ev.stopPropagation(); slider.set(+ev.target.value); }}
              onClick={(ev) => ev.stopPropagation()}
              style={{ width: "100%", accentColor: slider.color }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: B.muted, marginTop: 6 }}>
              <span>{slider.lo}</span><span>{slider.hi}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Result */}
      <GlassCard accent={model.color} glow style={{ padding: "24px 28px", transition: "all .4s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <span style={{ fontSize: 34 }}>{model.emoji}</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: model.color, transition: "color .3s" }}>
            {model.name}
          </span>
        </div>
        <div style={{ fontSize: 14, color: B.text, lineHeight: 1.8 }}>{model.desc}</div>
      </GlassCard>
      {/* Real-world anchor */}
      <div style={{ textAlign: "center", marginTop: 16, padding: "12px 16px", background: `${B.dim}08`, borderRadius: 10, transition: "all .4s" }}>
        <div style={{ fontSize: 12, color: B.text, lineHeight: 1.7 }}>
          {r > 0 ? (
            <>At <span style={{ color: B.orange, fontWeight: 700 }}>r={r}%</span>{e <= 90 ? <>, <span style={{ color: B.green, fontWeight: 700 }}>e={eLabel}</span></> : null}:&nbsp;
            {r >= 50 ? "A garment worker in Bangladesh gets a floor of " : r >= 20 ? "A subsistence farmer in the DRC gets a floor of " : "A brick kiln worker in India gets a floor of "}
            <span style={{ color: B.orange, fontWeight: 700 }}>€{(r * 0.46).toFixed(0)}/day</span>.
            {e <= 70 ? <> A billionaire's TRST decays <span style={{ color: B.blue, fontWeight: 700 }}>{(100 / Math.max(e, 1)).toFixed(1)}%/year</span>.</> : null}
            </>
          ) : (
            <span style={{ color: B.muted }}>This is the world today. No floor. No ceiling. Drag the income knob to change it.</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Live BRN --- */
function LiveBRN({ active }) {
  const [brn, setBrn] = useState(0);
  useEffect(() => {
    if (!active) { setBrn(0); return; }
    const id = setInterval(() => setBrn((p) => +(p + 0.0007).toFixed(4)), 30);
    return () => clearInterval(id);
  }, [active]);

  return (
    <GlassCard accent={B.orange} glow style={{
      display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 28px", marginTop: 24,
    }}>
      <div style={{
        width: 10, height: 10, borderRadius: "50%", background: B.orange,
        animation: "pulse 1.5s infinite", boxShadow: `0 0 16px ${B.orange}66`,
      }} />
      <div>
        <div style={{ fontSize: 10, color: B.gray, textTransform: "uppercase", letterSpacing: 3, marginBottom: 3 }}>
          Your BRN (accruing live)
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: B.orange, fontFamily: "'JetBrains Mono', monospace" }}>
          {brn.toFixed(4)}
        </div>
      </div>
    </GlassCard>
  );
}

/* --- Fraud Viz --- */
function FraudViz({ active, mobile }) {
  // Steps: 0=appear, 1=fraud detected, 2=trace origins, 3=show taint bars,
  // 4=revoke Carol, 5=resolve Alice, 6=resolve Bob, 7=healed
  const [step, setStep] = useState(-1);
  useEffect(() => {
    if (!active) { setStep(-1); return; }
    const delays = [600, 2200, 4000, 5800, 7400, 8200, 9000, 10600];
    const timers = delays.map((d, i) => setTimeout(() => setStep(i), d));
    return () => timers.forEach(clearTimeout);
  }, [active]);

  const bg = "rgba(12,15,22,0.85)";
  const tr = "all 1.2s cubic-bezier(.25,.46,.45,.94)";

  const Wallet = ({ label, amount, tainted, clean, revoked, lit, resolveAt, delay = 0 }) => {
    const resolved = step >= resolveAt;
    const tainted_ = step >= lit;
    const nc = resolved && revoked === "full" ? B.dim
      : resolved ? B.green
      : tainted_ ? B.orange
      : B.dim;
    const showBar = step >= 3;
    return (
      <div style={{
        background: bg, borderRadius: 12, padding: mobile ? "10px 12px" : "12px 16px",
        border: `1px solid ${nc}33`,
        minWidth: mobile ? 90 : 110, textAlign: "center",
        boxShadow: resolved && revoked !== "full" ? `0 0 24px ${B.green}18` : resolved && revoked === "full" ? `0 0 24px ${B.red}12` : `0 0 12px ${nc}08`,
        transition: tr, transitionDelay: `${delay}ms`,
        opacity: step >= 0 ? 1 : 0, transform: step >= 0 ? "translateY(0)" : "translateY(8px)",
      }}>
        <div style={{ fontSize: mobile ? 10 : 11, color: B.gray, fontWeight: 600, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: mobile ? 14 : 17, fontWeight: 800, color: nc, transition: tr, transitionDelay: `${delay}ms`, fontFamily: "'JetBrains Mono', monospace" }}>{amount}</div>
        {tainted != null && (
          <div style={{ marginTop: 8, overflow: "hidden", maxHeight: showBar ? 28 : 0, opacity: showBar ? 1 : 0, transition: "max-height 1s, opacity 1s", transitionDelay: `${delay + 200}ms` }}>
            <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", gap: 1 }}>
              {clean > 0 && <div style={{ flex: clean, background: resolved ? B.green : B.blue + "66", transition: tr, borderRadius: 3 }} />}
              <div style={{
                flex: tainted, borderRadius: 3, transition: tr,
                background: resolved ? B.red + "22" : B.red + "88",
                opacity: resolved ? 0.3 : 1,
              }} />
            </div>
            <div style={{ fontSize: 9, marginTop: 4, color: resolved ? (revoked === "full" ? B.red : B.green) : B.red, fontWeight: 600, transition: "color 1s", fontFamily: "'JetBrains Mono', monospace" }}>
              {resolved ? (revoked === "full" ? "revoked" : `keeps ${clean}`) : `−${tainted} tainted`}
            </div>
          </div>
        )}
      </div>
    );
  };

  const Arrow = ({ lit, resolveAt, delay = 0, label }) => {
    const resolved = step >= resolveAt;
    const ac = resolved ? B.green : step >= lit ? B.orange : B.dim;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0", transition: tr, transitionDelay: `${delay}ms`, opacity: step >= 0 ? 1 : 0 }}>
        <div style={{ width: 1, height: mobile ? 12 : 18, background: `linear-gradient(to bottom, ${ac}88, ${ac}33)`, transition: tr, transitionDelay: `${delay}ms` }} />
        <div style={{ fontSize: 8, color: ac + "aa", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", transition: tr, transitionDelay: `${delay}ms`, opacity: step >= lit ? 1 : 0, transform: step >= lit ? "scale(1)" : "scale(0.8)" }}>{label}</div>
        <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: `5px solid ${ac}88`, transition: "border-color 1.2s", transitionDelay: `${delay}ms` }} />
      </div>
    );
  };

  // Status messages keyed to steps 0-7
  const msgs = [
    { from: 0, to: 0, t: "Challenge submitted — someone stakes BRN to accuse Wallet X", c: B.muted },
    { from: 1, to: 1, t: "VRF-selected verifiers vote. Fraud confirmed. X unverified.", c: B.red },
    { from: 2, to: 2, t: "revoke_by_origin() walks the merger graph forward…", c: B.orange },
    { from: 3, to: 3, t: "Proportional split — tainted fractions identified", c: B.orange },
    { from: 4, to: 4, t: "Carol: 30/30 tainted → fully revoked", c: B.red },
    { from: 5, to: 5, t: "Alice: 50/100 tainted → keeps 50 clean", c: B.green },
    { from: 6, to: 6, t: "Bob: 30/100 tainted → keeps 70 clean. One pass, O(k).", c: B.green },
    { from: 7, to: 7, t: "Challenger rewarded 2× stake. Network healed.", c: B.green },
  ];

  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      {/* Wallet X */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
        <div style={{
          background: step >= 1 ? B.red + "12" : bg,
          borderRadius: 14, padding: mobile ? "10px 20px" : "12px 28px",
          border: `1px solid ${step >= 1 ? B.red + "44" : B.dim + "22"}`,
          textAlign: "center",
          boxShadow: step >= 1 && step < 4 ? `0 0 30px ${B.red}20` : step >= 7 ? "none" : `0 0 15px ${B.red}10`,
          transition: tr,
          opacity: step >= 0 ? 1 : 0, transform: step >= 0 ? "translateY(0)" : "translateY(8px)",
        }}>
          <div style={{ fontSize: mobile ? 10 : 11, color: B.gray, fontWeight: 600, marginBottom: 2 }}>Wallet X</div>
          <div style={{ fontSize: mobile ? 13 : 15, fontWeight: 800, color: step >= 1 ? B.red : B.muted, transition: "color 1s" }}>
            {step >= 1 ? "FRAUD" : "verified"}
          </div>
        </div>
      </div>

      {/* Arrows to origins */}
      <div style={{ display: "flex", justifyContent: "center", gap: mobile ? 60 : 100 }}>
        <Arrow lit={2} resolveAt={5} delay={0} label="origin" />
        <Arrow lit={2} resolveAt={4} delay={150} label="origin" />
      </div>

      {/* Origins */}
      <div style={{ display: "flex", justifyContent: "center", gap: mobile ? 16 : 32, marginBottom: 0 }}>
        <Wallet label="Origin O1" amount="50" lit={2} resolveAt={5} delay={0} />
        <Wallet label="Origin O2" amount="30" lit={2} resolveAt={4} delay={150} />
      </div>

      {/* Arrows to holders */}
      <div style={{ display: "flex", justifyContent: "center", gap: mobile ? 16 : 32 }}>
        <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
          <Arrow lit={2} resolveAt={5} delay={300} label="merge" />
        </div>
        <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
          <Arrow lit={2} resolveAt={4} delay={400} label="direct" />
        </div>
      </div>

      {/* Alice + Carol — Carol resolves at 4, Alice at 5 */}
      <div style={{ display: "flex", justifyContent: "center", gap: mobile ? 16 : 32, marginBottom: 0 }}>
        <Wallet label="Alice" amount="100" lit={2} resolveAt={5} delay={300} tainted={50} clean={50} revoked="partial" />
        <Wallet label="Carol" amount="30" lit={2} resolveAt={4} delay={400} tainted={30} clean={0} revoked="full" />
      </div>

      {/* Arrow to Bob */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ marginLeft: mobile ? -40 : -60 }}>
          <Arrow lit={2} resolveAt={6} delay={500} label="merge" />
        </div>
      </div>

      {/* Bob — resolves at 6 */}
      <div style={{ display: "flex", justifyContent: "center", marginLeft: mobile ? -40 : -60 }}>
        <Wallet label="Bob" amount="100" lit={2} resolveAt={6} delay={500} tainted={30} clean={70} revoked="partial" />
      </div>

      {/* Status — crossfade */}
      <div style={{ position: "relative", minHeight: 36, marginTop: 12 }}>
        {msgs.map((msg, i) => (
          <div key={i} style={{
            position: i === 0 ? "relative" : "absolute", top: 0, left: 0, right: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: mobile ? 10 : 11, fontWeight: 600, color: msg.c,
            textAlign: "center", lineHeight: 1.5,
            opacity: step >= msg.from && step <= msg.to ? 1 : 0,
            transition: "opacity 1s",
          }}>
            {msg.t}
          </div>
        ))}
      </div>

      {/* "So what" comparison — appears after animation */}
      <div style={{
        marginTop: 12, display: "flex", gap: mobile ? 6 : 10, justifyContent: "center", flexWrap: "wrap",
        opacity: step >= 7 ? 1 : 0, transform: step >= 7 ? "translateY(0)" : "translateY(8px)",
        transition: "all 1.2s cubic-bezier(.25,.46,.45,.94)", transitionDelay: "400ms",
      }}>
        {[
          { chain: "Bitcoin", verdict: "Can trace. Can't revoke.", color: B.orange },
          { chain: "Ethereum", verdict: "Can freeze. Can't split.", color: B.blue },
          { chain: "BURST", verdict: "Surgical. Proportional. O(k).", color: B.green },
        ].map((c, i) => (
          <div key={i} style={{
            padding: "6px 12px", borderRadius: 8, fontSize: mobile ? 9 : 10, fontWeight: 700,
            background: `${c.color}10`, border: `1px solid ${c.color}22`, color: c.color,
          }}>
            <span style={{ color: B.gray }}>{c.chain}:</span> {c.verdict}
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Transaction Flow --- */
function TxFlow({ active, mobile }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) { setStep(0); return; }
    const id = setInterval(() => setStep(p => (p + 1) % 4), 2000);
    return () => clearInterval(id);
  }, [active]);

  const steps = [
    { label: "You have BRN", sub: "Accruing since verification", color: B.orange },
    { label: "You buy coffee", sub: "Your BRN is burned", color: B.red },
    { label: "Vendor gets TRST", sub: "Created 1:1 from your spend", color: B.blue },
    { label: "TRST = money", sub: "Transferable, tradeable, earned", color: B.green },
  ];

  return (
    <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 6 : 4, alignItems: "center", marginTop: 20 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: mobile ? "column" : "row", alignItems: "center", gap: mobile ? 6 : 4 }}>
          <div style={{
            padding: mobile ? "8px 14px" : "10px 16px", borderRadius: 12,
            background: step === i ? `${s.color}18` : B.s,
            border: `1px solid ${step === i ? s.color + "44" : B.dim + "22"}`,
            transition: "all .5s",
            transform: step === i ? "scale(1.05)" : "scale(1)",
            width: mobile ? "100%" : "auto", textAlign: mobile ? "center" : "left",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: step === i ? s.color : B.gray, transition: "color .3s" }}>{s.label}</div>
            <div style={{ fontSize: 9, color: B.muted, marginTop: 2 }}>{s.sub}</div>
          </div>
          {i < 3 && <span style={{ color: step > i ? B.green : B.dim, fontSize: 16, transition: "color .3s" }}>{mobile ? "↓" : "→"}</span>}
        </div>
      ))}
    </div>
  );
}

/* --- Year 1 Simulation --- */
function Year1Sim({ active, mobile }) {
  const [month, setMonth] = useState(0);
  useEffect(() => {
    if (!active) { setMonth(0); return; }
    let m = 0;
    const id = setInterval(() => { m++; setMonth(m); if (m >= 12) clearInterval(id); }, 800);
    return () => clearInterval(id);
  }, [active]);

  const data = useMemo(() => {
    // 1000 people, 1 BRN/hr, gradually spending, economy bootstrapping
    const months = [];
    let users = 0, totalBrn = 0, totalTrst = 0, txCount = 0;
    for (let i = 0; i <= 12; i++) {
      // Staggered joins: ~80/month first 6 months, then word spreads
      users = Math.min(1000, Math.round(i < 6 ? i * 83 : 500 + (i - 6) * 83));
      // Each user accrues 720 BRN/month (1/hr × 24 × 30)
      totalBrn = users * 720 * (i + 1) * 0.5; // average half-month accrual
      // Spending increases as economy develops: 5% month 1 → 40% month 12
      const spendRate = Math.min(0.4, 0.05 + i * 0.03);
      totalTrst += users * 720 * spendRate;
      txCount += Math.round(users * spendRate * 30);
      months.push({ users, brn: Math.round(totalBrn), trst: Math.round(totalTrst), tx: txCount });
    }
    return months;
  }, []);

  if (!active) return null;
  const d = data[Math.min(month, 12)];
  const pct = month / 12;

  const fmt = (n) => n >= 1000000 ? (n / 1000000).toFixed(1) + "M" : n >= 1000 ? (n / 1000).toFixed(0) + "K" : String(n);

  const Bar = ({ label, value, max, color }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
        <span style={{ color: B.gray, fontWeight: 600 }}>{label}</span>
        <span style={{ color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(value)}</span>
      </div>
      <div style={{ height: 8, background: `${B.dim}22`, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(100, (value / max) * 100)}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 4, transition: "width .6s cubic-bezier(.16,1,.3,1)" }} />
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 520, width: "100%", textAlign: "left" }}>
      {/* Month indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ fontSize: mobile ? 28 : 36, fontWeight: 800, color: B.green, fontFamily: "'JetBrains Mono', monospace" }}>
          Month {Math.min(month, 12)}
        </div>
        <div style={{ flex: 1, height: 4, background: `${B.dim}22`, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct * 100}%`, background: B.green, borderRadius: 2, transition: "width .6s" }} />
        </div>
      </div>

      <Bar label="Verified users" value={d.users} max={1000} color={B.green} />
      <Bar label="BRN accrued (total)" value={d.brn} max={data[12].brn} color={B.orange} />
      <Bar label="TRST in circulation" value={d.trst} max={data[12].trst} color={B.blue} />
      <Bar label="Transactions" value={d.tx} max={data[12].tx} color={B.green} />

      {/* Milestone callouts */}
      <div style={{ marginTop: 16, minHeight: 44 }}>
        {[
          { at: 0, text: "Network launches. First wallets verify each other.", color: B.muted },
          { at: 2, text: "200 users. First real purchases. TRST begins circulating.", color: B.blue },
          { at: 5, text: "500 users. Local businesses start accepting TRST.", color: B.orange },
          { at: 8, text: "800 users. Governance proposals appear. Community sets parameters.", color: B.green },
          { at: 12, text: "1,000 users. Self-sustaining economy. The floor is real.", color: B.green },
        ].map((m, i) => (
          <div key={i} style={{
            position: i === 0 ? "relative" : "absolute",
            opacity: month >= m.at && (i === 4 || month < ([ 2, 5, 8, 12, 99 ][i + 1] || 99)) ? 1 : 0,
            transition: "opacity .6s",
            fontSize: 12, color: m.color, fontWeight: 600, lineHeight: 1.5,
          }}>
            {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====== MAIN DECK ====== */
const SLIDE_TITLES = [
  "Birth lottery", "BURST", "The assumption", "The scale", "Previous attempts",
  "Two-knob machine", "Try it yourself", "Architecture", "How money flows", "Year one",
  "Why it works", "Adoption strategy", "Identity", "Fraud detection",
  "Governance", "Consensus", "Infrastructure", "Roadmap", "Team", "Join the build", "Closing",
];

export default function Deck() {
  const [s, setS] = useState(0);
  const [hp, setHp] = useState(0);
  const [menu, setMenu] = useState(false);
  const m = useIsMobile();
  const TOTAL = 21;
  const touchRef = useRef(null);

  const next = useCallback(() => {
    if (s === 2 && hp < 1) { setHp((p) => p + 1); return; }
    setS((p) => Math.min(p + 1, TOTAL - 1));
    setHp(0);
  }, [s, hp]);

  const prev = useCallback(() => {
    setS((p) => Math.max(p - 1, 0));
    setHp(0);
  }, []);

  useEffect(() => {
    const handler = (ev) => {
      if (ev.key === "?" || ev.key === "Escape") { ev.preventDefault(); setMenu((p) => !p); return; }
      if (menu) return;
      if (["ArrowRight", " ", "Enter"].includes(ev.key)) { ev.preventDefault(); next(); }
      if (["ArrowLeft", "Backspace"].includes(ev.key)) { ev.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  /* Swipe support */
  const onTouchStart = useCallback((e) => {
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "BUTTON" || tag === "A") { touchRef.current = null; return; }
    touchRef.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchRef.current;
    if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
    touchRef.current = null;
  }, [next, prev]);

  const Sl = ({ i, children }) => {
    const active = s === i;
    return (
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 40,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: m ? "24px 16px 16px" : "clamp(24px, 5vw, 80px)",
        textAlign: "center",
        opacity: active ? 1 : 0,
        transform: active ? "none" : `translateY(20px) scale(0.98)`,
        transition: "opacity .5s, transform .7s cubic-bezier(.16,1,.3,1)",
        pointerEvents: active ? "auto" : "none",
        zIndex: active ? 1 : 0,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}>
        {active && children}
      </div>
    );
  };

  const H = (sz) => ({
    fontSize: m ? `${Math.max(sz * 0.45, 20)}px` : `clamp(${sz * 0.48}px, ${sz / 12}vw, ${sz}px)`,
    fontWeight: 800, lineHeight: 1.08, letterSpacing: -0.5,
    fontFamily: "'Sora', 'Space Grotesk', sans-serif", margin: 0,
  });

  const P = {
    fontSize: m ? 13 : "clamp(13px, 1.1vw, 16px)",
    color: B.text, lineHeight: 1.85, maxWidth: 560, margin: 0,
  };

  const handleClick = (e) => {
    if (m) return; /* on mobile, use swipe instead */
    if (["INPUT", "BUTTON", "A"].includes(e.target.tagName)) return;
    if (e.clientX / window.innerWidth > 0.2) next(); else prev();
  };

  return (
    <div
      style={{
        width: "100%", height: "100vh", background: B.bg, color: B.white,
        overflow: "hidden", position: "relative",
        fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
      }}
      onClick={handleClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${B.green}44; }
        @keyframes sIn { from { opacity: 0; transform: translateY(var(--dy, 24px)); } to { opacity: 1; transform: none; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: .25; } 50% { opacity: 1; } }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: .03; } 50% { transform: scale(1.15); opacity: .08; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes expandBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 20px ${B.green}00; } 50% { box-shadow: 0 0 40px ${B.green}33; } }
        @keyframes drift { 0% { transform: translate(0, 0); } 25% { transform: translate(10px, -20px); } 50% { transform: translate(-5px, -40px); } 75% { transform: translate(15px, -20px); } 100% { transform: translate(0, 0); } }
        @keyframes slideProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        input[type="range"] { -webkit-appearance: none; appearance: none; background: ${B.dim}22; border-radius: 8px; height: 6px; outline: none; transition: background .3s; }
        input[type="range"]:hover { background: ${B.dim}44; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; background: ${B.white}; border-radius: 50%; cursor: grab; box-shadow: 0 0 20px ${B.green}44, 0 2px 8px rgba(0,0,0,.3); transition: transform .2s; }
        input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); }
        input[type="range"]:active::-webkit-slider-thumb { cursor: grabbing; }
      `}</style>

      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "80vmax", height: "80vmax", borderRadius: "50%", background: `radial-gradient(circle, ${B.green}05 0%, transparent 55%)`, top: "-35%", right: "-25%", animation: "breathe 16s infinite ease-in-out" }} />
        <div style={{ position: "absolute", width: "60vmax", height: "60vmax", borderRadius: "50%", background: `radial-gradient(circle, ${B.orange}03 0%, transparent 55%)`, bottom: "-25%", left: "-20%", animation: "breathe 20s 5s infinite ease-in-out" }} />
        <div style={{ position: "absolute", width: "40vmax", height: "40vmax", borderRadius: "50%", background: `radial-gradient(circle, ${B.blue}03 0%, transparent 55%)`, top: "40%", left: "60%", animation: "breathe 22s 10s infinite ease-in-out" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${B.dim}05 1px, transparent 1px), linear-gradient(90deg, ${B.dim}05 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.4 }} />
        <Particles />
      </div>

      {/* 0: BIRTH LOTTERY — the hook */}
      <Sl i={0}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
          <FI><h2 style={{ ...H(42), color: B.white, marginBottom: 14 }}>Where you're born decides everything</h2></FI>
          <FI d={150}><p style={{ ...P, textAlign: "center", margin: "0 auto 40px", maxWidth: 440 }}>
            Your economic life was determined by a dice roll you never made.
          </p></FI>
          <BirthLottery active={s === 0} mobile={m} />
        </div>
      </Sl>

      {/* 1: TITLE */}
      <Sl i={1}>
        <FI d={0}><Tag>Protocol Whitepaper</Tag></FI>
        <FI d={200}><h1 style={{ ...H(90), color: B.green, textShadow: `0 0 80px ${B.green}22` }}>BURST</h1></FI>
        <FI d={400}><h2 style={{ ...H(30), color: B.white, fontWeight: 600, marginTop: 10 }}>The General Form of Money</h2></FI>
        <FI d={600}><p style={{ ...P, marginTop: 22, maxWidth: 520, color: B.gray }}>Two parameters. Every economic model from capitalism to UBI as a democratic configuration.</p></FI>
        <FI d={900}><div style={{ display: "flex", gap: 8, marginTop: 36, flexWrap: "wrap", justifyContent: "center" }}>
          {["MIT License", "No token sale", "No pre-mine", "No founder allocation", "Open source Rust"].map((t, i) => (
            <span key={i} style={{
              fontSize: 10, color: B.gray, padding: "7px 16px", borderRadius: 20,
              background: "linear-gradient(135deg, rgba(18,22,32,0.6), rgba(12,15,22,0.8))",
              border: `1px solid ${B.dim}22`, backdropFilter: "blur(10px)",
            }}>{t}</span>
          ))}
        </div></FI>
      </Sl>

      {/* 2: HOOK */}
      <Sl i={2}>
        <div style={{ textAlign: "center", maxWidth: 740, margin: "0 auto" }}>
          <FI><p style={{ fontSize: "clamp(18px, 2.5vw, 32px)", color: B.text, fontWeight: 400, lineHeight: 1.65, fontFamily: "'Sora', sans-serif" }}>
            Gold. Fiat. Bitcoin. Ethereum. Every currency ever created.
            <br />
            <span style={{ color: B.gray }}>They all share one invisible assumption.</span>
          </p></FI>
          {hp >= 1 && (
            <div style={{ animation: "sIn 1s both", marginTop: 40 }}>
              <p style={{
                fontSize: "clamp(34px, 5.5vw, 68px)", fontWeight: 800, color: B.green,
                lineHeight: 1.08, fontFamily: "'Sora', sans-serif",
                textShadow: `0 0 60px ${B.green}22`,
              }}>
                You start with nothing.
              </p>
              <div style={{
                width: 80, height: 3, borderRadius: 2, margin: "30px auto 0",
                background: `linear-gradient(90deg, transparent, ${B.green}, transparent)`,
                animation: "expandBar .8s .3s both", transformOrigin: "center",
              }} />
              <p style={{ fontSize: "clamp(15px, 1.6vw, 21px)", color: B.text, marginTop: 30, fontWeight: 500 }}>
                What if that's not a law of nature
              </p>
              <p style={{ fontSize: "clamp(15px, 1.6vw, 21px)", color: B.gray, marginTop: 6 }}>
                but just a <span style={{ color: B.green, fontWeight: 800, textShadow: `0 0 30px ${B.green}33` }}>parameter</span> someone forgot to set?
              </p>
            </div>
          )}
          {hp < 1 && <div style={{ marginTop: 60, animation: "pulse 2.5s infinite", fontSize: 16, color: B.muted }}>{"▸"}</div>}
        </div>
      </Sl>

      {/* 3: STATS */}
      <Sl i={3}>
        <FI><Tag color={B.red}>The scale</Tag></FI>
        <FI d={100}><h2 style={{ ...H(44), color: B.white, marginBottom: 6 }}>The problem isn't policy.</h2></FI>
        <FI d={200}><h2 style={{ ...H(44), color: B.orange }}>It's the base layer of money itself.</h2></FI>
        <FI d={350}><p style={{ ...P, margin: "18px 0 32px" }}>Every fix — taxation, welfare, charity — is a patch on a foundation never designed to be fair.</p></FI>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, maxWidth: 720, width: "100%" }}>
          {[
            { val: 61, su: "%", l: "of humanity earns less than €9/day (Pew Research)", c: B.red, d: 0 },
            { val: 7, su: "%", l: "of humans qualify as 'high income' — above €46/day", c: B.orange, d: 0 },
            { val: 4.4, su: "B", l: "adults have under $10K total wealth (UBS 2024)", c: B.gold, d: 1 },
          ].map((item, i) => (
            <FI key={i} d={450 + i * 100}>
              <GlassCard accent={item.c} glow style={{ padding: "24px 20px", borderBottom: `3px solid ${item.c}` }}>
                <div style={{ fontSize: 38, fontWeight: 800, color: item.c, fontFamily: "'Sora', sans-serif", textShadow: `0 0 30px ${item.c}22` }}>
                  {item.val === 0 ? "0" : <CountUp end={item.val} suf={item.su} active={s === 3} dec={item.d} />}
                </div>
                <div style={{ fontSize: 11, color: B.gray, marginTop: 8, lineHeight: 1.6 }}>{item.l}</div>
              </GlassCard>
            </FI>
          ))}
        </div>
      </Sl>

      {/* 4: COMPETITORS */}
      <Sl i={4}>
        <FI><Tag>Why previous attempts failed</Tag></FI>
        <FI d={100}><h2 style={{ ...H(38), color: B.white, marginBottom: 24 }}>They solved one problem and created another.</h2></FI>
        <FI d={200}><div style={{ maxWidth: 700, width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: m ? 11 : 12 }}>
            <thead>
              <tr>
                {["", "Approach", "What broke", "BURST answer"].map((h, i) => (
                  <th key={i} style={{ textAlign: "left", padding: "10px 12px", color: i === 3 ? B.green : B.gray, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${B.dim}22` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { n: "Worldcoin", approach: "Iris scan → identity", broke: "Biometric data harvested for a token that may fail", burst: "Identity is modular — biometrics, trust graphs, gov ID. Method is replaceable." },
                { n: "GoodDollar", approach: "DeFi yield → fund UBI", broke: "Yields collapsed 2022. Income vanished.", burst: "BRN accrues from time, not yields. No external dependency." },
                { n: "Circles UBI", approach: "Personal currencies in trust circles", broke: "Move cities, lose your wealth. Not fungible.", burst: "One universal currency. TRST is transferable anywhere." },
                { n: "Gov. UBI", approach: "Tax revenue → direct payments", broke: "One election and it disappears.", burst: "Protocol-level. No politician can turn it off." },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "rgba(12,15,22,0.5)" : "transparent" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: B.white, whiteSpace: "nowrap" }}>{row.n}</td>
                  <td style={{ padding: "10px 12px", color: B.gray }}>{row.approach}</td>
                  <td style={{ padding: "10px 12px", color: B.red, fontWeight: 600 }}>{row.broke}</td>
                  <td style={{ padding: "10px 12px", color: B.green }}>{row.burst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></FI>
      </Sl>

      {/* 5: TWO-KNOB INSIGHT */}
      <Sl i={5}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <FI><Tag>The breakthrough</Tag></FI>
          <FI d={200}><h2 style={{ ...H(46), color: B.white, marginBottom: 14 }}>What if money is just a<br /><span style={{ color: B.green, textShadow: `0 0 40px ${B.green}22` }}>two-knob machine</span>?</h2></FI>
          <FI d={450}><p style={{ ...P, textAlign: "center", margin: "0 auto 24px", maxWidth: 500 }}>
            One knob controls how much everyone gets. The other controls how long wealth lasts. Turn both to zero — you get Bitcoin. Turn them up — you get UBI.
          </p></FI>
          <FI d={650}><div style={{ display: "flex", justifyContent: "center", gap: m ? 14 : 36, flexWrap: "wrap", marginTop: 24, alignItems: "center" }}>
            <GlassCard accent={B.orange} style={{ padding: m ? "16px 24px" : "24px 36px", textAlign: "center" }}>
              <div style={{ fontSize: m ? 36 : 54, fontWeight: 800, color: B.orange, fontFamily: "'JetBrains Mono', monospace" }}>r</div>
              <div style={{ fontSize: m ? 10 : 11, color: B.gray, marginTop: 4 }}>income rate</div>
            </GlassCard>
            <div style={{ fontSize: m ? 24 : 38, color: B.dim }}>{"×"}</div>
            <GlassCard accent={B.blue} style={{ padding: m ? "16px 24px" : "24px 36px", textAlign: "center" }}>
              <div style={{ fontSize: m ? 36 : 54, fontWeight: 800, color: B.blue, fontFamily: "'JetBrains Mono', monospace" }}>e</div>
              <div style={{ fontSize: m ? 10 : 11, color: B.gray, marginTop: 4 }}>expiry period</div>
            </GlassCard>
            <div style={{ fontSize: m ? 24 : 38, color: B.dim }}>=</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: m ? 24 : 38, fontWeight: 800, color: B.green, textShadow: `0 0 40px ${B.green}33` }}>every economy</div>
            </div>
          </div></FI>
        </div>
      </Sl>

      {/* 6: INTERACTIVE SPECTRUM */}
      <Sl i={6}>
        <FI><Tag>Try it yourself</Tag></FI>
        <FI d={100}><h2 style={{ ...H(36), color: B.white, marginBottom: 8 }}>Drag the knobs. Watch inequality reshape.</h2></FI>
        <FI d={200}><p style={{ ...P, marginBottom: 28 }}>Start at r=0, e=Forever. That's normal money. Now slowly increase the income rate...</p></FI>
        <FI d={400}><Spectrum active={s === 6} mobile={m} /></FI>
      </Sl>

      {/* 7: TWO TOKENS */}
      <Sl i={7}>
        <FI><Tag>The architecture</Tag></FI>
        <FI d={100}><h2 style={{ ...H(40), color: B.white, marginBottom: 24 }}>Two tokens. One insight.</h2></FI>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 18, maxWidth: 680, width: "100%", textAlign: "left" }}>
          <FI d={200}>
            <GlassCard accent={B.orange} style={{ padding: "30px 26px", borderTop: `4px solid ${B.orange}` }}>
              <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 4, color: B.orange, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8, fontWeight: 700 }}>BRN</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: B.white, marginBottom: 6 }}>The Birthright</div>
              <div style={{ fontSize: 12, color: B.gray, marginBottom: 18, lineHeight: 1.65 }}>What you're given for being human. Not earned. Simply yours.</div>
              {["Accrues continuously, equal rate for every person", "A computed counter — never minted or sent", "Non-transferable — only spent to pay others", "Never decays. You are never penalized for existing."].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 12, color: B.text, lineHeight: 1.6 }}>
                  <span style={{ color: B.orange, flexShrink: 0, fontWeight: 700, fontSize: 14 }}>{"›"}</span>{t}
                </div>
              ))}
            </GlassCard>
          </FI>
          <FI d={350}>
            <GlassCard accent={B.blue} style={{ padding: "30px 26px", borderTop: `4px solid ${B.blue}` }}>
              <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 4, color: B.blue, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8, fontWeight: 700 }}>TRST</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: B.white, marginBottom: 6 }}>The Reward</div>
              <div style={{ fontSize: 12, color: B.gray, marginBottom: 18, lineHeight: 1.65 }}>Proof you contributed something real. Earned, not given.</div>
              {["Created 1:1 when you spend BRN", "Fully transferable — this is the actual money", "Expires after period e, set by community vote", "Expired TRST stays visible forever as reputation"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 12, color: B.text, lineHeight: 1.6 }}>
                  <span style={{ color: B.blue, flexShrink: 0, fontWeight: 700, fontSize: 14 }}>{"›"}</span>{t}
                </div>
              ))}
            </GlassCard>
          </FI>
        </div>
        <FI d={550}><LiveBRN active={s === 7} /></FI>
      </Sl>

      {/* 8: TOKENOMICS — flow diagram */}
      <Sl i={8}>
        <FI><Tag>How the money flows</Tag></FI>
        <FI d={100}><h2 style={{ ...H(36), color: B.white, marginBottom: m ? 16 : 28 }}>Follow one hour of being human.</h2></FI>
        <FI d={200}><div style={{ maxWidth: 500, width: "100%", position: "relative" }}>
          {/* Flow steps */}
          {[
            { icon: "⏱️", label: "You exist for 1 hour", sub: "The protocol sees you're verified", color: B.muted, arrow: true },
            { icon: "➕", label: "+1 BRN appears in your wallet", sub: "Not minted. A counter that ticked up. Equal for every human on earth.", color: B.orange, arrow: true },
            { icon: "🛒", label: "You buy coffee for 1 BRN", sub: "Your BRN is destroyed. Gone forever.", color: B.orange, arrow: true },
            { icon: "☕", label: "The café receives 1 TRST", sub: "Created at the moment of your spend. Proof someone paid them for something real.", color: B.blue, arrow: true },
            { icon: "🔄", label: "TRST slowly decays over 100 years", sub: "Loses value linearly. Can't hoard forever. Wealth circulates back.", color: B.blue, arrow: true },
            { icon: "📊", label: "Total money supply = total real spending", sub: "No printing. No inflation. The economy measures itself.", color: B.green, arrow: false },
          ].map((step, i) => (
            <FI key={i} d={250 + i * 120}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                {/* Vertical line + dot */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 32 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, background: `${step.color}15`, border: `1px solid ${step.color}33`,
                  }}>{step.icon}</div>
                  {step.arrow && <div style={{ width: 1, height: 20, background: `linear-gradient(to bottom, ${step.color}44, transparent)`, margin: "2px 0" }} />}
                </div>
                {/* Text */}
                <div style={{ paddingTop: 4, paddingBottom: step.arrow ? 4 : 0, textAlign: "left" }}>
                  <div style={{ fontSize: m ? 14 : 16, fontWeight: 700, color: step.color, lineHeight: 1.3 }}>{step.label}</div>
                  <div style={{ fontSize: m ? 11 : 12, color: B.gray, lineHeight: 1.5, marginTop: 3 }}>{step.sub}</div>
                </div>
              </div>
            </FI>
          ))}
        </div></FI>
        {/* Key numbers row at bottom */}
        <FI d={1000}><div style={{ display: "flex", gap: m ? 12 : 24, justifyContent: "center", marginTop: m ? 12 : 20, flexWrap: "wrap" }}>
          {[
            { n: "1 BRN/hr", l: "accrual rate", c: B.orange },
            { n: "1:1", l: "BRN → TRST", c: B.blue },
            { n: "100 yr", l: "TRST expiry", c: B.blue },
            { n: "0%", l: "inflation", c: B.green },
          ].map((k, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: m ? 16 : 20, fontWeight: 800, color: k.c, fontFamily: "'JetBrains Mono', monospace" }}>{k.n}</div>
              <div style={{ fontSize: 9, color: B.muted, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{k.l}</div>
            </div>
          ))}
        </div></FI>
      </Sl>

      {/* 9: YEAR 1 SIMULATION */}
      <Sl i={9}>
        <FI><Tag>Year one</Tag></FI>
        <FI d={100}><h2 style={{ ...H(36), color: B.white, marginBottom: m ? 12 : 24 }}>1,000 people join. Here's what happens.</h2></FI>
        <FI d={250}><Year1Sim active={s === 9} mobile={m} /></FI>
      </Sl>

      {/* 10: WHY SEPARATION */}
      <Sl i={10}>
        <FI><Tag>Why it works</Tag></FI>
        <FI d={100}><h2 style={{ ...H(38), color: B.white, marginBottom: 28 }}>Three walls kill every UBI. Two tokens break all of them.</h2></FI>
        {[
          { q: "UBI inflates its own currency", bad: "GoodDollar mints tokens to fund income. More tokens, same goods, prices rise. You're diluting the thing you're distributing.", good: "BRN is never minted — it's a counter that ticks up with time. When spent, BRN is destroyed and TRST is created 1:1 in the vendor's wallet. Total supply = total real activity.", icon: "📉" },
          { q: "Free money is indistinguishable from earned money", bad: "Once it's in your wallet, a dollar from work looks identical to a dollar from a handout. Markets can't price the difference.", good: "BRN can only be spent, never sent. TRST can only be received from a spend. If you hold TRST, someone paid you for something. Unforgeable proof of contribution.", icon: "🔍" },
          { q: "Hoarding recreates the inequality", bad: "Every currency without expiry trends toward concentration. Demurrage tried expiring everything — but that punishes the poor for saving.", good: "Only TRST expires (period set by vote). Your BRN floor never decays. Hoarded TRST cycles back into circulation. Wealth becomes a flow, not a dam.", icon: "⚖️" },
        ].map((c, i) => (
          <FI key={i} d={200 + i * 130}>
            <GlassCard accent={B.green} style={{ padding: "18px 22px", marginBottom: 12, maxWidth: 680, width: "100%", textAlign: "left" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.white, marginBottom: 12 }}>{c.icon} {c.q}</div>
              <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 8 : 12 }}>
                <div style={{ fontSize: 11, color: B.gray, padding: "12px 16px", background: `${B.red}08`, borderRadius: 12, borderLeft: `2px solid ${B.red}44`, lineHeight: 1.7 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: B.red, marginBottom: 6, textTransform: "uppercase", letterSpacing: 2 }}>The problem</div>{c.bad}
                </div>
                <div style={{ fontSize: 11, color: B.text, padding: "12px 16px", background: `${B.green}08`, borderRadius: 12, borderLeft: `2px solid ${B.green}`, lineHeight: 1.7 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: B.green, marginBottom: 6, textTransform: "uppercase", letterSpacing: 2 }}>BURST</div>{c.good}
                </div>
              </div>
            </GlassCard>
          </FI>
        ))}
      </Sl>

      {/* 11: ADOPTION */}
      <Sl i={11}>
        <FI><Tag>The strategy</Tag></FI>
        <FI d={100}><h2 style={{ ...H(40), color: B.white, marginBottom: 6 }}>It doesn't launch as UBI.</h2></FI>
        <FI d={200}><p style={{ fontSize: "clamp(15px, 1.3vw, 18px)", color: B.orange, fontWeight: 600, marginBottom: 28 }}>That's the entire trick.</p></FI>
        <div style={{ maxWidth: 580, width: "100%", textAlign: "left" }}>
          {[
            { n: "01", t: "Launch as normal money", d: "r=0, e=forever. A fast, feeless crypto. Nothing alien. Just better money.", c: B.muted },
            { n: "02", t: "Community activates income", d: "Universal BRN accrual turns on. Every verified human starts earning. The floor appears.", c: B.green },
            { n: "03", t: "Community sets wealth cycling", d: "TRST expiry activates. The economy begins to self-balance.", c: B.blue },
            { n: "04", t: "Evolve forever", d: "Any config reachable. Any choice reversible. Democracy decides.", c: B.green },
          ].map((p, i) => (
            <FI key={i} d={300 + i * 120}>
              <div style={{ display: "flex", gap: 20, marginBottom: i < 3 ? 8 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 40 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
                    color: B.bg, background: `linear-gradient(135deg, ${p.c}, ${p.c}cc)`,
                    boxShadow: `0 0 20px ${p.c}33`,
                  }}>{p.n}</div>
                  {i < 3 && <div style={{ flex: 1, width: 1, background: `linear-gradient(to bottom, ${p.c}44, transparent)`, margin: "6px 0", minHeight: 14 }} />}
                </div>
                <div style={{ paddingBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: p.c }}>{p.t}</div>
                  <div style={{ fontSize: 13, color: B.gray, lineHeight: 1.65, marginTop: 4 }}>{p.d}</div>
                </div>
              </div>
            </FI>
          ))}
        </div>
        <FI d={900}><p style={{ fontSize: 14, color: B.green, fontWeight: 600, fontStyle: "italic", marginTop: 16 }}>No one gives up what they have. They get what they have — plus the option for more.</p></FI>
      </Sl>

      {/* 12: SECURITY */}
      <Sl i={12}>
        <FI><Tag>Unbreakable identity</Tag></FI>
        <FI d={100}><h2 style={{ ...H(40), color: B.white, marginBottom: 24 }}>One person. One wallet. Enforced by math.</h2></FI>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 14, maxWidth: 620, width: "100%", marginBottom: 20, textAlign: "left" }}>
          {[
            { t: "Endorsers", d: "People who know you burn their own BRN to vouch. Lie about someone's identity and you lose your own income.", c: B.green, icon: "🤝" },
            { t: "Verifiers", d: "Randomly selected via VRF. Can't predict or bribe them. They assess independently and vote.", c: B.blue, icon: "🔍" },
          ].map((c, i) => (
            <FI key={i} d={200 + i * 120}>
              <GlassCard accent={c.c} style={{ padding: "22px", borderTop: `3px solid ${c.c}` }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: c.c, marginBottom: 10 }}>{c.t}</div>
                <div style={{ fontSize: 12, color: B.text, lineHeight: 1.7 }}>{c.d}</div>
              </GlassCard>
            </FI>
          ))}
        </div>
        <FI d={500}><GlassCard accent={B.green} glow style={{ padding: "20px 24px", maxWidth: 620 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: B.green, marginBottom: 10 }}>The self-reinforcing loop</div>
          <div style={{ fontSize: 12, color: B.text, lineHeight: 1.8 }}>
            Verification determines who gets BRN. BRN powers verification through staking. Fair verification keeps BRN fair. Fair BRN keeps verification decentralized. <span style={{ color: B.green, fontWeight: 600 }}>Stronger forever.</span>
          </div>
          <div style={{ fontSize: 11, color: B.muted, marginTop: 12, fontStyle: "italic" }}>Method is modular: biometrics, trust graphs, gov ID, or things not invented yet.</div>
        </GlassCard></FI>
      </Sl>

      {/* 13: FRAUD */}
      <Sl i={13}>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 20 : 40, maxWidth: 760, width: "100%", alignItems: "center", textAlign: "left" }}>
          <div>
            <FI><Tag>Protocol-level justice</Tag></FI>
            <FI d={100}><h2 style={{ ...H(38), color: B.white, marginBottom: 6 }}>Fraud is caught</h2></FI>
            <FI d={200}><h2 style={{ ...H(38), color: B.green, marginBottom: 20, textShadow: `0 0 40px ${B.green}22` }}>and surgically removed</h2></FI>
            <FI d={350}><p style={{ ...P, marginBottom: 16 }}>
              Anyone can challenge a wallet by staking BRN. VRF-selected verifiers vote independently. If fraud is confirmed, the protocol walks a forward-indexed merger graph from every TRST origin that wallet created.
            </p></FI>
            <FI d={450}><p style={{ ...P, marginBottom: 16 }}>
              Tokens that were merged with clean money get proportionally split — only the tainted fraction is revoked. Alice mixed 50 fraudulent with 50 clean? She keeps her 50. Bob received part of Alice's merge? Only the tainted portion of his share is removed.
            </p></FI>
            <FI d={550}><div style={{ fontSize: 12, color: B.text, lineHeight: 2 }}>
              <span style={{ color: B.orange, fontWeight: 700 }}>Bitcoin</span> can trace but can't revoke — stolen coins stay spent.<br />
              <span style={{ color: B.blue, fontWeight: 700 }}>Ethereum</span> can freeze addresses but can't split mixed balances.<br />
              <span style={{ color: B.green, fontWeight: 800 }}>BURST</span> revokes exactly the tainted fraction, O(k) forward, in one pass.
            </div></FI>
          </div>
          <FI d={500}><FraudViz active={s === 13} mobile={m} /></FI>
        </div>
      </Sl>

      {/* 14: GOVERNANCE */}
      <Sl i={14}>
        <FI><Tag>Self-amending democracy</Tag></FI>
        <FI d={100}><h2 style={{ ...H(38), color: B.white, marginBottom: 24 }}>Every parameter is voted on. Including the voting rules.</h2></FI>
        <div style={{ maxWidth: 640, width: "100%", textAlign: "left" }}>
          <FI d={200}>
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { phase: "Propose", detail: "Burn 336 BRN to submit. Compete for endorsements over 7 days.", color: B.orange },
                { phase: "Explore", detail: "First vote: should we consider this? Yea / Nay / Abstain.", color: B.blue },
                { phase: "Cooldown", detail: "Community discussion. No voting. Just thinking.", color: B.muted },
                { phase: "Promote", detail: "Second vote: should we activate? 80% supermajority required.", color: B.green },
              ].map((p, i) => (
                <div key={i} style={{ padding: "14px 16px", background: "rgba(12,15,22,0.85)", borderRadius: 10, borderLeft: `3px solid ${p.color}` }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: p.color, marginBottom: 4 }}>{p.phase}</div>
                  <div style={{ fontSize: 11, color: B.text, lineHeight: 1.6 }}>{p.detail}</div>
                </div>
              ))}
            </div>
          </FI>
          <FI d={400}>
            <GlassCard accent={B.green} style={{ padding: "16px 20px", marginBottom: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: 12, fontSize: 11, color: B.text }}>
                <div><span style={{ color: B.green, fontWeight: 700 }}>One wallet = one vote</span><br />Not stake-weighted. Every human equal.</div>
                <div><span style={{ color: B.blue, fontWeight: 700 }}>Transitive delegation</span><br />Delegate your vote globally or per-proposal.</div>
                <div><span style={{ color: B.orange, fontWeight: 700 }}>Adaptive quorum</span><br />Tracks participation EMA. Can't game low turnout.</div>
              </div>
            </GlassCard>
          </FI>
          <FI d={500}><p style={{ fontSize: 11, color: B.muted, textAlign: "center", lineHeight: 1.6 }}>
            Constitutional amendments require 90% supermajority. Emergency proposals: 95% + 24h fast-track.<br />
            Changing the threshold itself requires the current threshold or 85%, whichever is higher.
          </p></FI>
        </div>
      </Sl>

      {/* 15: CONSENSUS */}
      <Sl i={15}>
        <FI><Tag>How blocks confirm</Tag></FI>
        <FI d={100}><h2 style={{ ...H(38), color: B.white, marginBottom: 24 }}>Open Representative Voting. No mining. No staking lottery.</h2></FI>
        <div style={{ maxWidth: 600, width: "100%", textAlign: "left" }}>
          <FI d={200}><div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 16 }}>
            {[
              { n: "Block lattice", d: "Each account is its own blockchain. Send and receive are separate blocks. No global bottleneck.", color: B.green },
              { n: "Representatives", d: "Delegate your voting weight to trusted reps. They vote on your behalf, asynchronously.", color: B.blue },
              { n: "67% quorum", d: "A block is confirmed when representatives holding 67% of online weight agree.", color: B.orange },
              { n: "< 1 second", d: "No block interval. No mempool. Transaction publishes, reps vote, done.", color: B.green },
            ].map((c, i) => (
              <div key={i} style={{ padding: "16px 18px", background: "rgba(12,15,22,0.85)", borderRadius: 10, borderTop: `3px solid ${c.color}` }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: c.color, marginBottom: 6 }}>{c.n}</div>
                <div style={{ fontSize: 11, color: B.text, lineHeight: 1.65 }}>{c.d}</div>
              </div>
            ))}
          </div></FI>
          <FI d={400}><p style={{ fontSize: 11, color: B.muted, textAlign: "center", lineHeight: 1.6 }}>
            Minimum online weight floor: 60M TRST (prevents quorum collapse). Principal reps: ≥ 0.1% of online weight.<br />
            Weight tracked via EMA with 95% decay — temporary dips don't break consensus.
          </p></FI>
        </div>
      </Sl>

      {/* 16: INFRASTRUCTURE */}
      <Sl i={16}>
        <FI><Tag>The machine</Tag></FI>
        <FI d={100}><h2 style={{ ...H(40), color: B.white, marginBottom: 28 }}>Block lattice. Zero fees. Sub-second.</h2></FI>
        <FI d={250}><div style={{ maxWidth: 720, width: "100%", textAlign: "left" }}>
          {[
            { metric: "Transaction fee", b: "Zero. Forever.", btc: "$1–50 depending on congestion", eth: "$0.50–50+ gas fees", why: "Each account is its own blockchain. No miners to pay, no block space to bid on." },
            { metric: "Confirmation time", b: "< 1 second", btc: "~10 minutes (6 confirmations = 1 hour)", eth: "~12 seconds (finality ~15 min)", why: "No global block. Sender and receiver update their own chains. Representatives vote asynchronously." },
            { metric: "Energy per tx", b: "0.0001 kWh", btc: "703 kWh (one household for 24 days)", eth: "0.03 kWh", why: "No proof of work. No proof of stake lottery. Consensus is lightweight representative voting." },
            { metric: "Throughput", b: "1000+ TPS", btc: "7 TPS", eth: "~30 TPS (L1)", why: "Block lattice parallelizes by design. Every account transacts independently — no global bottleneck." },
            { metric: "Built-in income", b: "Yes (BRN)", btc: "No", eth: "No", why: "BRN accrues to every verified human as a protocol primitive. Not a token, not a smart contract — a core accounting rule." },
            { metric: "Wealth cycling", b: "Yes (TRST expiry)", btc: "No", eth: "No", why: "TRST expires after a community-voted period. Prevents permanent concentration without punishing the floor." },
          ].map((row, i) => (
            <FI key={i} d={300 + i * 80}>
              <GlassCard accent={i < 4 ? B.dim : B.green} style={{
                padding: m ? "14px 16px" : "16px 20px", marginBottom: 10,
                borderLeft: `3px solid ${i >= 4 ? B.green : B.dim}44`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: m ? 12 : 14, fontWeight: 700, color: B.white }}>{row.metric}</span>
                  <div style={{ display: "flex", gap: m ? 10 : 16, fontSize: m ? 10 : 11 }}>
                    <span style={{ color: B.green, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{row.b}</span>
                    <span style={{ color: B.muted }}>{row.btc}</span>
                    <span style={{ color: B.muted }}>{row.eth}</span>
                  </div>
                </div>
                <div style={{ fontSize: m ? 10 : 11, color: B.gray, lineHeight: 1.65 }}>{row.why}</div>
              </GlassCard>
            </FI>
          ))}
          {/* Legend */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8, fontSize: 10, color: B.muted }}>
            <span><span style={{ color: B.green, fontWeight: 700 }}>■</span> BURST</span>
            <span><span style={{ color: B.muted }}>■</span> Bitcoin / Ethereum</span>
          </div>
        </div></FI>
      </Sl>

      {/* 17: ROADMAP */}
      <Sl i={17}>
        <FI><Tag>Where we are</Tag></FI>
        <FI d={100}><h2 style={{ ...H(38), color: B.white, marginBottom: 28 }}>Built, running, open.</h2></FI>
        <div style={{ maxWidth: 540, width: "100%", textAlign: "left" }}>
          {[
            { phase: "Protocol", status: "Complete", detail: "Full Rust implementation. Block lattice, BRN/TRST engine, merger graph, governance, verification.", color: B.green, done: true },
            { phase: "Testnet", status: "Live", detail: "5+ nodes running. Faucet enabled. Governance cycles tested with shortened parameters.", color: B.green, done: true },
            { phase: "Wallet & CLI", status: "In progress", detail: "JSON-RPC, WebSocket subscriptions, cross-platform node installer (Linux, macOS, Windows).", color: B.orange, done: false },
            { phase: "Community pilots", status: "Next", detail: "Small groups choosing their own r and e. Real economic activity. Real feedback loop.", color: B.blue, done: false },
            { phase: "Mainnet", status: "After pilots", detail: "Bootstrap threshold: 50 verified wallets. Then the network is self-sustaining.", color: B.muted, done: false },
          ].map((p, i) => (
            <FI key={i} d={200 + i * 100}>
              <div style={{ display: "flex", gap: 16, marginBottom: i < 4 ? 4 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 32 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: "50%", marginTop: 4,
                    background: p.done ? p.color : "transparent",
                    border: p.done ? "none" : `2px solid ${p.color}`,
                    boxShadow: p.done ? `0 0 12px ${p.color}44` : "none",
                  }} />
                  {i < 4 && <div style={{ flex: 1, width: 1, background: `linear-gradient(to bottom, ${p.color}44, transparent)`, margin: "4px 0", minHeight: 16 }} />}
                </div>
                <div style={{ paddingBottom: 14 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: p.color }}>{p.phase}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: p.done ? B.green : B.muted, textTransform: "uppercase", letterSpacing: 1 }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: B.gray, lineHeight: 1.6, marginTop: 4 }}>{p.detail}</div>
                </div>
              </div>
            </FI>
          ))}
        </div>
      </Sl>

      {/* 18: TEAM */}
      <Sl i={18}>
        <FI><Tag>Who's building this</Tag></FI>
        <FI d={100}><h2 style={{ ...H(38), color: B.white, marginBottom: 24 }}>One builder. Open-source. MIT license.</h2></FI>
        <FI d={200}><div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
          <GlassCard accent={B.green} style={{ padding: "28px 24px", marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: B.white, marginBottom: 6 }}>Nitesh</div>
            <div style={{ fontSize: 12, color: B.green, fontWeight: 600, marginBottom: 14 }}>Protocol designer & sole developer</div>
            <div style={{ fontSize: 12, color: B.text, lineHeight: 1.7 }}>
              Full-stack Rust implementation: consensus, block lattice, BRN/TRST economics, merger graph, governance engine, verification orchestrator, node infrastructure, deploy tooling.
            </div>
          </GlassCard>
        </div></FI>
        <FI d={350}><div style={{ maxWidth: 500, width: "100%", textAlign: "left" }}>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12 }}>
            {[
              { label: "No token sale", detail: "No ICO. No pre-mine. No founder allocation.", color: B.green },
              { label: "No VC funding", detail: "No cap table. No board. No one to answer to except the protocol.", color: B.orange },
              { label: "Fully open source", detail: "Every line of code. MIT licensed. Fork it if you want.", color: B.blue },
              { label: "Looking for", detail: "Co-builders who believe money can be redesigned from first principles.", color: B.green },
            ].map((c, i) => (
              <div key={i} style={{ padding: "12px 14px", background: "rgba(12,15,22,0.85)", borderRadius: 10, borderLeft: `2px solid ${c.color}44` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.color, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: B.text, lineHeight: 1.5 }}>{c.detail}</div>
              </div>
            ))}
          </div>
        </div></FI>
      </Sl>

      {/* 19: THE ASK */}
      <Sl i={19}>
        <FI><Tag>Join the build</Tag></FI>
        <FI d={100}><h2 style={{ ...H(40), color: B.white, marginBottom: 28 }}>What BURST needs</h2></FI>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, maxWidth: 680, width: "100%", textAlign: "left" }}>
          {[
            { icon: "🖥️", title: "Node operators", desc: "A modest VPS is enough. You're powering the economic floor for 8 billion people.", color: B.green },
            { icon: "🛠️", title: "Developers", desc: "Open-source Rust, MIT. DAG engine, wallet UX, verification modules to build.", color: B.blue },
            { icon: "🌍", title: "Communities", desc: "Groups willing to pilot BURST locally. Choose your own parameters.", color: B.orange },
            { icon: "📣", title: "Voices", desc: "People who get it and can explain it. The hardest part is the assumption.", color: B.green },
          ].map((a, i) => (
            <FI key={i} d={200 + i * 100}>
              <GlassCard accent={a.color} style={{
                padding: "24px 22px", borderLeft: `3px solid ${a.color}`,
                height: "100%", display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{a.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: a.color, marginBottom: 8 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: B.text, lineHeight: 1.7, flex: 1 }}>{a.desc}</div>
              </GlassCard>
            </FI>
          ))}
        </div>
      </Sl>

      {/* 20: CLOSING */}
      <Sl i={20}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
          <FI d={0}><p style={{ fontSize: "clamp(14px, 1.4vw, 19px)", color: B.gray, lineHeight: 1.85, marginBottom: 28 }}>
            Every monetary system in human history has made the same invisible choice.
          </p></FI>
          <FI d={300}><h2 style={{ ...H(60), color: B.green, marginBottom: 28, textShadow: `0 0 80px ${B.green}22` }}>What if that's<br />a parameter?</h2></FI>
          <FI d={600}><p style={{ fontSize: "clamp(14px, 1.3vw, 17px)", color: B.text, lineHeight: 1.85, fontStyle: "italic", maxWidth: 500, margin: "0 auto 44px" }}>
            BURST doesn't pick an answer. It builds the infrastructure where humanity can answer that question for itself.
          </p></FI>
          <FI d={850}><div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", fontSize: 12, marginBottom: 28 }}>
            <span style={{
              color: B.green, fontWeight: 700, padding: "12px 24px", borderRadius: 24,
              background: `linear-gradient(135deg, ${B.green}12, ${B.green}08)`,
              border: `1px solid ${B.green}33`, animation: "glowPulse 3s infinite",
            }}>github.com/BURST-UBI</span>
            <span style={{ color: B.gray, background: B.s, padding: "12px 24px", borderRadius: 24, border: `1px solid ${B.dim}22` }}>brst.cc</span>
            <span style={{ color: B.gray, background: B.s, padding: "12px 24px", borderRadius: 24, border: `1px solid ${B.dim}22` }}>Discord</span>
          </div></FI>
          <FI d={1050}><div>
            <p style={{ fontSize: 11, color: B.muted }}>MIT License. No token sale. No pre-mine. No founder allocation.</p>
            <p style={{ fontSize: 12, color: B.gray, marginTop: 8, fontWeight: 600 }}>One person, one wallet, one vote.</p>
            <p style={{ fontSize: 11, color: B.muted, marginTop: 20, fontStyle: "italic" }}>For Eliesh.</p>
          </div></FI>
        </div>
      </Sl>

      {/* NAV - Progress bar + dots */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        {/* Progress bar */}
        <div style={{ height: 2, background: `${B.dim}15` }}>
          <div style={{
            height: "100%", background: `linear-gradient(90deg, ${B.green}, ${B.green}cc)`,
            width: ((s / (TOTAL - 1)) * 100) + "%",
            transition: "width .5s cubic-bezier(.16,1,.3,1)",
            boxShadow: `0 0 10px ${B.green}44`,
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: m ? "8px 0 10px" : "10px 0 12px", gap: m ? 4 : 6 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setS(i); setHp(0); }}
              style={{
                width: s === i ? (m ? 16 : 24) : (m ? 5 : 6), height: m ? 5 : 6, borderRadius: 3, border: "none",
                background: s === i ? B.green : i < s ? `${B.green}44` : `${B.dim}44`,
                transition: "all .4s cubic-bezier(.16,1,.3,1)", cursor: "pointer", padding: 0,
              }} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 16, right: m ? 16 : 24, fontSize: 10, color: `${B.muted}77`, fontFamily: "'JetBrains Mono', monospace", zIndex: 10 }}>
        {String(s + 1).padStart(2, "0")}/{TOTAL}
      </div>
      <div style={{ position: "absolute", bottom: 16, left: m ? 16 : 24, fontSize: 10, color: `${B.muted}44`, zIndex: 10 }}>
        {m ? "swipe to navigate" : "← → or click · ? for menu"}
      </div>

      {/* Hamburger / menu button */}
      <button
        onClick={(e) => { e.stopPropagation(); setMenu((p) => !p); }}
        style={{
          position: "absolute", top: m ? 12 : 16, right: m ? 12 : 20, zIndex: 30,
          width: 36, height: 36, borderRadius: 10, border: `1px solid ${B.dim}33`,
          background: menu ? B.green + "15" : "rgba(12,15,22,0.8)", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
          backdropFilter: "blur(10px)", transition: "all .3s", padding: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 14, height: 1.5, borderRadius: 1, transition: "all .3s",
            background: menu ? B.green : B.gray,
            transform: menu ? (i === 0 ? "rotate(45deg) translate(3px, 3px)" : i === 2 ? "rotate(-45deg) translate(3px, -3px)" : "scale(0)") : "none",
          }} />
        ))}
      </button>

      {/* Slide picker overlay */}
      {menu && (
        <div
          onClick={(e) => { e.stopPropagation(); setMenu(false); }}
          style={{
            position: "absolute", inset: 0, zIndex: 20,
            background: "rgba(5,7,11,0.92)", backdropFilter: "blur(20px)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            animation: "fadeIn .25s both",
          }}
        >
          <div style={{ fontSize: 10, color: B.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Jump to slide</div>
          <div style={{
            display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 6,
            maxWidth: 500, width: "100%", padding: "0 24px",
            maxHeight: "70vh", overflowY: "auto",
          }}>
            {SLIDE_TITLES.map((title, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setS(i); setHp(0); setMenu(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: s === i ? `${B.green}18` : "rgba(12,15,22,0.6)",
                  transition: "all .2s", textAlign: "left",
                }}
                onMouseEnter={(e) => { if (s !== i) e.currentTarget.style.background = `${B.dim}22`; }}
                onMouseLeave={(e) => { if (s !== i) e.currentTarget.style.background = "rgba(12,15,22,0.6)"; }}
              >
                <span style={{
                  fontSize: 10, fontWeight: 700, color: s === i ? B.green : B.muted,
                  fontFamily: "'JetBrains Mono', monospace", width: 20, flexShrink: 0,
                }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 12, fontWeight: s === i ? 700 : 500, color: s === i ? B.green : B.text }}>{title}</span>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 10, color: B.muted, marginTop: 16 }}>{m ? "Tap a slide" : "Press ? or Esc to close"}</div>
        </div>
      )}
    </div>
  );
}
