/* TRUSTA 운영 콘솔 — shell + shared atoms */
const { useState, useMemo } = React;
const T = window.TRUSTA;

/* ── Icon (Lucide-style inline SVG) ─────────────────────────────────────── */
const ICONS = {
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  "layout-grid": '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  calendar: '<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  sparkles: '<path d="M9.94 14.34A2 2 0 0 0 8.66 13L4.6 11.71a.4.4 0 0 1 0-.76L8.66 9.6a2 2 0 0 0 1.28-1.28L11.24 4.3a.4.4 0 0 1 .76 0l1.3 4.02a2 2 0 0 0 1.28 1.28l4.06 1.35a.4.4 0 0 1 0 .76l-4.06 1.28a2 2 0 0 0-1.28 1.28l-1.3 4.06a.4.4 0 0 1-.76 0z"/><path d="M19 4v3M20.5 5.5h-3"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "chevron-left": '<path d="m15 18-6-6 6-6"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7"/>',
  "arrow-down": '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  "alert-triangle": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4M12 17h.01"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  filter: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="7" x2="17" y1="12" y2="12"/><line x1="10" x2="14" y1="18" y2="18"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  "more-horizontal": '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  pencil: '<path d="M21.17 6.83a2.82 2.82 0 0 0-4-4L4 16v4h4z"/><path d="m15 5 4 4"/>',
  "refresh-cw": '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  "trending-up": '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  "trending-down": '<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  video: '<path d="m16 13 5.2 3.1a.5.5 0 0 0 .8-.4V8.3a.5.5 0 0 0-.8-.4L16 11"/><rect width="14" height="12" x="2" y="6" rx="2"/>',
  "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M10 9H8M16 13H8M16 17H8"/>',
  smartphone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
  type: '<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
  newspaper: '<path d="M15 18h-9a2 2 0 0 1-2-2V5a1 1 0 0 0-1-1 1 1 0 0 0-1 1v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/><path d="M18 14h-7M18 10h-7M11 6h7v4h-7z"/>',
  film: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18M17 3v18M3 7.5h4M17 7.5h4M3 12h18M3 16.5h4M17 16.5h4"/>',
  "circle-dashed": '<path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0M5.5 4.32A10 10 0 0 0 4.32 5.5M2.18 10.1a9.93 9.93 0 0 0 0 3.8M4.32 18.5A10 10 0 0 0 5.5 19.68M10.1 21.82a9.93 9.93 0 0 0 3.8 0M18.5 19.68a10 10 0 0 0 1.18-1.18M21.82 13.9a9.93 9.93 0 0 0 0-3.8M19.68 5.5A10 10 0 0 0 18.5 4.32"/>',
  "scroll-text": '<path d="M15 12h-5M15 8h-5M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
  send: '<path d="M14.54 2.46 21.54 9.46a1 1 0 0 1 0 1.41l-9.9 9.9a1 1 0 0 1-1.7-.71V14H4a1 1 0 0 1-1-1V9"/><path d="m22 2-11 11"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  workflow: '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  "user-plus": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  "external-link": '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
};

function Icon({ name, size = 18, color, className, strokeWidth = 2 }) {
  return React.createElement("svg", {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color || "currentColor", strokeWidth, strokeLinecap: "round",
    strokeLinejoin: "round", className,
    dangerouslySetInnerHTML: { __html: ICONS[name] || "" },
  });
}

/* ── Badges & chips ─────────────────────────────────────────────────────── */
function StatusBadge({ s }) {
  return <span className={"badge bg-" + s}><span className="pip" style={{ background: "currentColor" }} />{T.statusLabel[s]}</span>;
}
function SourceBadge({ s, showLabel = true }) {
  const meta = T.sourceTypes[s];
  return <span className={"src " + s} title={meta.label}><Icon name={meta.icon} size={13} />{showLabel && meta.label}</span>;
}
function ChannelChip({ c }) {
  const meta = T.channels[c];
  return <span className="chip"><span className="ch-dot" style={{ background: meta.color }} />{meta.label}</span>;
}
function CTChip({ ct }) {
  const meta = T.contentTypes[ct];
  return <span className="chip ct"><Icon name={meta.icon} size={13} />{meta.label}</span>;
}
function Confidence({ v }) {
  const low = v < 75;
  return <span className={"conf" + (low ? " low" : "")}>{low ? <Icon name="alert-triangle" size={11} /> : <Icon name="sparkles" size={11} />}AI {v}%</span>;
}

/* ── Thumbnail ───────────────────────────────────────────────────────────── */
function Thumb({ ct, dur, size = 56, radius = 9, full }) {
  const meta = T.contentTypes[ct] || { hue: 220, icon: "image", label: "" };
  const bg = `linear-gradient(140deg, hsl(${meta.hue} 62% 52%), hsl(${meta.hue + 24} 58% 40%))`;
  const style = full ? { background: bg, borderRadius: radius } : { width: size, height: size, background: bg, borderRadius: radius };
  const isVid = ["video", "shorts", "reels", "story"].includes(ct);
  return (
    <div className="thumb" style={style}>
      {isVid ? <div className="play"><Icon name="play" size={14} /></div> : <Icon name={meta.icon} size={size > 80 ? 30 : 20} />}
      <span className="tlabel">{meta.label}</span>
      {dur && <span className="tdur">{dur}</span>}
    </div>
  );
}

/* ── Callout ────────────────────────────────────────────────────────────── */
function Callout({ title, desc, amber }) {
  return (
    <div className={"callout-red" + (amber ? " amber" : "")}>
      <span className="ico"><Icon name="alert-triangle" size={17} /></span>
      <div><div className="ttl">🔴 {title}</div>{desc && <div className="desc">{desc}</div>}</div>
    </div>
  );
}

/* ── Card / Button ──────────────────────────────────────────────────────── */
function Card({ title, sub, right, children, flush, className }) {
  return (
    <div className={"card " + (className || "")}>
      {(title || right) && (
        <div className="card-h">
          {title && <h3>{title}</h3>}{sub && <span className="sub">{sub}</span>}
          {right && <div className="right">{right}</div>}
        </div>
      )}
      <div className={"card-b" + (flush ? " flush" : "")}>{children}</div>
    </div>
  );
}

/* ── Right panel — Make.com miniflow ────────────────────────────────────── */
function FlowNode({ icon, title, meta, state, badge }) {
  return (
    <div className={"flow-node " + state}>
      <div className="nico">{state === "done" ? <Icon name="check" size={16} /> : state === "fail" ? <Icon name="alert-triangle" size={15} /> : <Icon name={icon} size={16} />}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="ntitle">{title}</div>
        {meta && <div className="nmeta">{meta}</div>}
      </div>
      {badge}
      {state === "active" && <span className="live-dot" />}
    </div>
  );
}
function Conn({ on, loop }) {
  return <div className={"flow-conn" + (on ? " on" : "") + (loop ? " loop" : "")}><Icon name={loop ? "refresh-cw" : "arrow-down"} size={16} /></div>;
}

Object.assign(window, {
  Icon, StatusBadge, SourceBadge, ChannelChip, CTChip, Confidence, Thumb,
  Callout, Card, FlowNode, Conn,
});
