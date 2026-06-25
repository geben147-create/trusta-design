/* TRUSTA — DesignCanvas: Figma-like pan/zoom artboard viewer */
(function () {
  const { useState, useRef, useEffect, useCallback } = React;

  /* ─── CSS injected once ─────────────────────────────────────── */
  const CSS = `
:root { --dc-bg: #e8eaed; --dc-line: rgba(0,0,0,.06); }
.dc-shell { width: 100vw; height: 100vh; display: flex; flex-direction: column; background: #f0f1f3; overflow: hidden; }
.dc-toolbar { height: 50px; background: #fff; border-bottom: 1px solid var(--dc-line); display: flex; align-items: center; gap: 14px; padding: 0 20px; flex: none; }
.dc-title { font: 700 15px/1 var(--w-font-sans,sans-serif); color: #111; letter-spacing: -0.03em; flex: 1; }
.dc-sub { font: 500 12px/1.5 var(--w-font-sans,sans-serif); color: #888; margin-top: 2px; }
.dc-badge { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 11px; border-radius: 999px; background: #f3f4f6; border: 1px solid #e2e4e8; font: 600 12px/1 var(--w-font-sans,sans-serif); color: #555; cursor: pointer; }
.dc-badge:hover { background: #e8eaed; }
.dc-badge.active { background: #0066ff; color: #fff; border-color: transparent; }
.dc-sep { width: 1px; height: 22px; background: #e2e4e8; }
.dc-zoom { display: flex; align-items: center; gap: 6px; }
.dc-zoom-btn { width: 26px; height: 26px; border-radius: 7px; background: #f3f4f6; border: 1px solid #e2e4e8; display: grid; place-items: center; cursor: pointer; font-size: 14px; color: #555; }
.dc-zoom-btn:hover { background: #e0e2e6; }
.dc-zoom-val { width: 46px; text-align: center; font: 600 12.5px/1 var(--mono,monospace); color: #333; }

.dc-workspace { flex: 1; overflow: hidden; position: relative; cursor: grab; }
.dc-workspace.panning { cursor: grabbing; }
.dc-viewport { position: absolute; transform-origin: 0 0; }

.dc-section { padding: 60px 0; }
.dc-section-head { padding: 0 60px 32px; }
.dc-section-head h2 { font: 800 26px/1.2 var(--w-font-sans,sans-serif); color: #111; letter-spacing: -0.04em; margin: 0; }
.dc-section-head p { font: 500 14px/1.7 var(--w-font-sans,sans-serif); color: #777; margin: 8px 0 0; }

.dc-boards { display: flex; gap: 48px; flex-wrap: wrap; padding: 0 60px 60px; }

.dc-artboard { flex: none; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,.10), 0 1px 4px rgba(0,0,0,.04); position: relative; }
.dc-artboard-header { position: absolute; top: -36px; left: 0; right: 0; display: flex; align-items: center; gap: 8px; }
.dc-artboard-label { font: 700 13px/1 var(--w-font-sans,sans-serif); color: #555; letter-spacing: -0.01em; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dc-artboard-label-input { font: 700 13px/1 var(--w-font-sans,sans-serif); color: #222; background: rgba(0,0,0,.06); border: 1px solid #bbb; border-radius: 5px; padding: 1px 6px; outline: none; width: 280px; }
.dc-artboard-dim { font: 500 11.5px/1 var(--mono,monospace); color: #aaa; }
.dc-artboard-actions { display: flex; gap: 5px; opacity: 0; transition: opacity .15s; }
.dc-artboard:hover .dc-artboard-actions { opacity: 1; }
.dc-artboard-btn { width: 24px; height: 24px; border-radius: 6px; background: #fff; border: 1px solid #ddd; display: grid; place-items: center; cursor: pointer; color: #666; }
.dc-artboard-btn:hover { background: #f3f4f6; color: #111; }

.dc-focus-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.82); z-index: 100; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.dc-focus-close { position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18); display: grid; place-items: center; cursor: pointer; color: #fff; font-size: 19px; }
.dc-focus-close:hover { background: rgba(255,255,255,.22); }
.dc-focus-label { font: 700 15px/1 var(--w-font-sans,sans-serif); color: rgba(255,255,255,.6); margin-bottom: 16px; letter-spacing: -0.02em; max-width: 1360px; width: 100%; }
.dc-focus-inner { border-radius: 14px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,.5); }
.dc-focus-nav { display: flex; gap: 10px; margin-top: 18px; }
.dc-focus-nav-btn { height: 32px; padding: 0 16px; border-radius: 8px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.14); color: #fff; font: 600 13px/1 var(--w-font-sans,sans-serif); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
.dc-focus-nav-btn:hover { background: rgba(255,255,255,.2); }

.dc-postit { position: absolute; width: 200px; min-height: 120px; padding: 14px 15px; border-radius: 4px; box-shadow: 2px 4px 12px rgba(0,0,0,.15); cursor: move; user-select: none; font-family: var(--w-font-sans,sans-serif); }
.dc-postit h4 { font-size: 12.5px; font-weight: 700; margin: 0 0 8px; opacity: .85; }
.dc-postit p { font-size: 11.5px; line-height: 1.55; margin: 0; opacity: .80; }

/* toast */
.dc-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #222; color: #fff; font: 600 13px/1 var(--w-font-sans,sans-serif); padding: 11px 20px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,.3); z-index: 200; pointer-events: none; opacity: 0; transition: opacity .3s; }
.dc-toast.show { opacity: 1; }
  `;
  if (!document.getElementById("dc-css")) {
    const s = document.createElement("style"); s.id = "dc-css"; s.textContent = CSS; document.head.appendChild(s);
  }

  /* ─── SVG icons (subset) ────────────────────────────────────── */
  const SVGI = {
    maximize: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    "chevron-left": '<polyline points="15 18 9 12 15 6"/>',
    "chevron-right": '<polyline points="9 18 15 12 9 6"/>',
    edit2: '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    sticky: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><polyline points="14 2 14 8 20 8"/>',
  };
  function Si({ name, size = 15 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: SVGI[name] || "" }} />
    );
  }

  /* ─── Toast ─────────────────────────────────────────────────── */
  let toastTimer;
  function showToast(msg) {
    let el = document.getElementById("dc-toast");
    if (!el) { el = document.createElement("div"); el.id = "dc-toast"; el.className = "dc-toast"; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ─── DCPostIt ───────────────────────────────────────────────── */
  function DCPostIt({ children, color = "#fef08a", x = 40, y = 40 }) {
    const [pos, setPos] = useState({ x, y });
    const dragging = useRef(null);
    function onDown(e) {
      e.stopPropagation();
      dragging.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
      window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    }
    function onMove(e) { if (!dragging.current) return; setPos({ x: e.clientX - dragging.current.ox, y: e.clientY - dragging.current.oy }); }
    function onUp() { dragging.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); }
    return <div className="dc-postit" style={{ background: color, left: pos.x, top: pos.y }} onMouseDown={onDown}>{children}</div>;
  }

  /* ─── DCArtboard ─────────────────────────────────────────────── */
  function DCArtboard({ id, label, width = 1360, height = 860, children, onFocus }) {
    const [name, setName] = useState(label);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

    function startEdit(e) { e.stopPropagation(); setEditing(true); }
    function commitEdit(e) { if (e.key === "Enter" || e.type === "blur") { setEditing(false); } }

    return (
      <div className="dc-artboard" style={{ width, height }} id={"ab-" + id}>
        <div className="dc-artboard-header">
          {editing
            ? <input ref={inputRef} className="dc-artboard-label-input" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={commitEdit} onBlur={commitEdit} onClick={(e) => e.stopPropagation()} />
            : <span className="dc-artboard-label" onDoubleClick={startEdit}>{name}</span>
          }
          <span className="dc-artboard-dim">{width}×{height}</span>
          <div className="dc-artboard-actions">
            <div className="dc-artboard-btn" title="이름 변경" onClick={startEdit}><Si name="edit2" /></div>
            <div className="dc-artboard-btn" title="전체화면" onClick={() => onFocus && onFocus(id)}><Si name="maximize" /></div>
            <div className="dc-artboard-btn" title="PNG 저장" onClick={() => showToast("PNG 저장 (캔버스 외부 실행 필요)")}><Si name="download" /></div>
          </div>
        </div>
        <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>{children}</div>
      </div>
    );
  }

  /* ─── DCSection ──────────────────────────────────────────────── */
  function DCSection({ id, title, subtitle, children }) {
    return (
      <div className="dc-section" id={"s-" + id}>
        <div className="dc-section-head"><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        <div className="dc-boards">{children}</div>
      </div>
    );
  }

  /* ─── DesignCanvas ────────────────────────────────────────────── */
  function DesignCanvas({ children }) {
    const [zoom, setZoom] = useState(0.5);
    const [pan, setPan] = useState({ x: 60, y: 20 });
    const [panning, setPanning] = useState(false);
    const [focusId, setFocusId] = useState(null);
    const [showPostIt, setShowPostIt] = useState(false);
    const panStart = useRef(null);
    const workspaceRef = useRef();

    // collect artboard ids from children for focus nav
    const artboardIds = useRef([]);
    function collectIds(node, out) {
      if (!node) return;
      if (node.props && node.props.id && node.type === DCArtboard) out.push(node.props.id);
      if (node.props && node.props.children) React.Children.forEach(node.props.children, (c) => collectIds(c, out));
    }
    React.Children.forEach(children, (c) => collectIds(c, artboardIds.current = artboardIds.current.length ? artboardIds.current : []));
    // rebuild on each render
    const ids = [];
    React.Children.forEach(children, (c) => collectIds(c, ids));

    // inject onFocus into DCArtboard descendants
    function injectFocus(node) {
      if (!node) return node;
      if (node.type === DCArtboard) return React.cloneElement(node, { onFocus: setFocusId });
      if (node.props && node.props.children) {
        const kids = React.Children.map(node.props.children, injectFocus);
        return React.cloneElement(node, {}, kids);
      }
      return node;
    }
    const injected = React.Children.map(children, injectFocus);

    // find label for focused artboard
    function findLabel(node, id) {
      if (!node) return null;
      if (node.type === DCArtboard && node.props.id === id) return node.props.label;
      if (node.props && node.props.children) {
        let found = null;
        React.Children.forEach(node.props.children, (c) => { if (!found) found = findLabel(c, id); });
        return found;
      }
      return null;
    }
    function findChild(node, id) {
      if (!node) return null;
      if (node.type === DCArtboard && node.props.id === id) return node.props.children;
      if (node.props && node.props.children) {
        let found = null;
        React.Children.forEach(node.props.children, (c) => { if (!found) found = findChild(c, id); });
        return found;
      }
      return null;
    }
    const focusLabel = focusId ? (function() { let l = null; React.Children.forEach(children, (c) => { if (!l) l = findLabel(c, focusId); }); return l; })() : null;
    const focusContent = focusId ? (function() { let c = null; React.Children.forEach(children, (c2) => { if (!c) c = findChild(c2, focusId); }); return c; })() : null;
    const focusIdx = ids.indexOf(focusId);

    // pan
    function onMouseDown(e) {
      if (e.button !== 0) return;
      setPanning(true);
      panStart.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
    }
    useEffect(() => {
      function onMove(e) {
        if (!panStart.current) return;
        setPan({ x: panStart.current.px + e.clientX - panStart.current.mx, y: panStart.current.py + e.clientY - panStart.current.my });
      }
      function onUp() { setPanning(false); panStart.current = null; }
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    }, []);

    // wheel zoom
    function onWheel(e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.06 : 0.06;
      setZoom((z) => Math.min(2, Math.max(0.15, z + delta)));
    }
    useEffect(() => {
      const el = workspaceRef.current;
      if (!el) return;
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }, []);

    const zoomSteps = [0.25, 0.33, 0.5, 0.67, 0.75, 1];
    function zoomIn() { const next = zoomSteps.find((z) => z > zoom); setZoom(next || Math.min(2, zoom + 0.1)); }
    function zoomOut() { const prev = [...zoomSteps].reverse().find((z) => z < zoom); setZoom(prev || Math.max(0.15, zoom - 0.1)); }

    return (
      <div className="dc-shell">
        {/* toolbar */}
        <div className="dc-toolbar">
          <div style={{ flex: 1 }}>
            <div className="dc-title">TRUSTA 콘솔 · 디자인 방향</div>
            <div className="dc-sub">디자인 탐색 캔버스 · 더블클릭→전체화면, 스크롤→줌</div>
          </div>
          <div className="dc-sep" />
          <div className="dc-zoom">
            <div className="dc-zoom-btn" onClick={zoomOut}>−</div>
            <div className="dc-zoom-val">{Math.round(zoom * 100)}%</div>
            <div className="dc-zoom-btn" onClick={zoomIn}>+</div>
          </div>
          <div className="dc-sep" />
          <div className="dc-badge" onClick={() => setShowPostIt((v) => !v)}><Si name="sticky" size={13} />포스트잇 {showPostIt ? "끄기" : "켜기"}</div>
          <div className="dc-badge" onClick={() => { setZoom(0.5); setPan({ x: 60, y: 20 }); }}>초기화</div>
        </div>
        {/* workspace */}
        <div ref={workspaceRef} className={"dc-workspace" + (panning ? " panning" : "")} onMouseDown={onMouseDown}>
          <div className="dc-viewport" style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})` }}>
            {injected}
            {showPostIt && (
              <DCPostIt color="#fef08a" x={80} y={80}>
                <h4>💡 노트</h4>
                <p>이 캔버스를 드래그하거나 스크롤로 확대/축소할 수 있습니다. 각 아트보드를 더블클릭하면 전체화면으로 비교됩니다.</p>
              </DCPostIt>
            )}
          </div>
        </div>
        {/* focus overlay */}
        {focusId && (
          <div className="dc-focus-overlay" onClick={() => setFocusId(null)}>
            <div className="dc-focus-close" onClick={() => setFocusId(null)}><Si name="x" size={18} /></div>
            {focusLabel && <div className="dc-focus-label">{focusLabel}</div>}
            <div className="dc-focus-inner" style={{ width: 1360, height: 860 }} onClick={(e) => e.stopPropagation()}>
              <div style={{ width: 1360, height: 860, position: "relative", overflow: "hidden", background: "#fff" }}>{focusContent}</div>
            </div>
            <div className="dc-focus-nav">
              <div className="dc-focus-nav-btn" onClick={(e) => { e.stopPropagation(); if (focusIdx > 0) setFocusId(ids[focusIdx - 1]); }}><Si name="chevron-left" size={14} />이전</div>
              <div className="dc-focus-nav-btn" style={{ background: "rgba(255,255,255,.06)", cursor: "default" }}>{focusIdx + 1} / {ids.length}</div>
              <div className="dc-focus-nav-btn" onClick={(e) => { e.stopPropagation(); if (focusIdx < ids.length - 1) setFocusId(ids[focusIdx + 1]); }}>다음<Si name="chevron-right" size={14} /></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  window.DesignCanvas = DesignCanvas;
  window.DCSection = DCSection;
  window.DCArtboard = DCArtboard;
  window.DCPostIt = DCPostIt;
})();
