/* TRUSTA — 4 design directions, shown on a design canvas */
(function () {
  const { useState } = React;
  const T = window.TRUSTA;
  const I = window.Icon;

  /* ════════ A · HubSpot Stable ════════════════════════════════════════ */
  const aNav = [
    ["inbox", "Import Inbox", 1], ["layout-grid", "Asset Library", 2, true], ["layers", "Asset Group", 3],
    ["calendar", "Calendar Planner", 4], ["shield-check", "Review · Approval", 5], ["activity", "Operations", 6],
  ];
  function DirA() {
    const cards = T.assets.slice(0, 6);
    return (
      <div className="dir dA">
        <div className="dA-sb">
          <div className="dA-brand"><div className="dA-logo">T</div><span className="dA-word">TRUSTA</span><span className="dA-env">Staging</span></div>
          <div className="dA-nav">
            {aNav.map(([ic, lb, n, on]) => (
              <div key={lb} className={"dA-item" + (on ? " on" : "")}><I name={ic} size={18} /><span>{lb}</span><span className="ord">{n}</span></div>
            ))}
          </div>
        </div>
        <div className="dA-main">
          <div className="dA-top">
            {["Import", "Library", "Group", "Calendar", "Review", "Ops"].map((s, i) => (
              <React.Fragment key={s}>
                <div className={"dA-step " + (i < 1 ? "done" : i === 1 ? "cur" : "")}><span className="dot">{i < 1 ? <I name="check" size={10} /> : i + 1}</span>{s}</div>
                {i < 5 && <I name="chevron-right" size={13} color="var(--w-neutral-70)" />}
              </React.Fragment>
            ))}
            <div style={{ marginLeft: "auto" }}><button className="btn btn-primary sm">다음 단계 · Group <I name="arrow-right" size={14} /></button></div>
          </div>
          <div className="dA-body">
            <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 16 }}>
              <div><div className="t-title" style={{ fontSize: 22 }}>Asset Library</div>
                <div style={{ fontSize: 13, color: "var(--ink2)", marginTop: 5 }}>분류된 자산 16건 · 출처·규격·그룹으로 탐색</div></div>
              <div style={{ marginLeft: "auto" }}><button className="btn btn-primary sm"><I name="plus" size={14} />그룹 만들기</button></div>
            </div>
            <div className="filterbar" style={{ marginBottom: 16 }}>
              {["채널", "규격 (11)", "출처 (4)", "그룹"].map((f) => <span key={f} className="select" style={{ height: 32 }}><I name="filter" size={13} />{f}</span>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {cards.map((a) => (
                <div key={a.id} className="card" style={{ overflow: "hidden", boxShadow: "var(--shadow-soft)" }}>
                  <div style={{ aspectRatio: "16/9", position: "relative" }}><Thumb ct={a.content_type} dur={a.duration} full /></div>
                  <div style={{ padding: "11px 12px 13px" }}>
                    <div style={{ font: "600 13px/1.3 var(--w-font-sans)", color: "var(--navy)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    <div style={{ display: "flex", gap: 5, marginTop: 9, alignItems: "center" }}><CTChip ct={a.content_type} /><SourceBadge s={a.source_type} showLabel={false} /></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 9, alignItems: "center" }}><Confidence v={a.confidence} /><StatusBadge s={a.status} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rpanel" style={{ width: 280 }}>
          <div className="rp-head"><div className="lab"><I name="workflow" size={16} />자동화 흐름</div><div className="rp-status"><span className="blip" />라이브러리 · 16 assets</div></div>
          <div className="rp-flow">
            <FlowNode icon="sparkles" title="AI Classify" meta="16 분류완료" state="done" />
            <Conn on />
            <FlowNode icon="layout-grid" title="Library store" meta="현재 위치" state="active" />
            <Conn />
            <FlowNode icon="layers" title="Group" meta="대기" state="wait" />
            <Conn />
            <FlowNode icon="calendar" title="Calendar" meta="대기" state="wait" />
          </div>
        </div>
      </div>
    );
  }

  /* ════════ B · Make.com Scenario Canvas ══════════════════════════════ */
  const bNodes = [
    { x: 28, y: 130, st: "done", ic: "inbox", nm: "Import", ct: "수신", cnt: 7 },
    { x: 243, y: 130, st: "done", ic: "layout-grid", nm: "Library", ct: "저장소", cnt: 16 },
    { x: 458, y: 130, st: "active", ic: "layers", nm: "Group", ct: "조립중", cnt: 6 },
    { x: 673, y: 130, st: "sched", ic: "calendar", nm: "Calendar", ct: "scheduled", cnt: 6 },
    { x: 673, y: 420, st: "wait", ic: "shield-check", nm: "Review", ct: "검수 대기", cnt: 3 },
    { x: 458, y: 420, st: "lock", ic: "lock", nm: "Publish", ct: "잠금", cnt: 11 },
  ];
  const C = (n) => ({ x: n.x + 48, y: n.y + 38 });
  function wire(a, b, opts = {}) {
    const p1 = C(bNodes[a]), p2 = C(bNodes[b]);
    let d;
    if (opts.vert) d = `M${p1.x},${p1.y} C${p1.x + 80},${p1.y + 90} ${p2.x + 80},${p2.y - 90} ${p2.x},${p2.y}`;
    else if (opts.loop) d = `M${p1.x},${p1.y} C${p1.x - 230},${p1.y + 150} ${p2.x - 40},${p2.y + 240} ${p2.x},${p2.y}`;
    else d = `M${p1.x},${p1.y} C${p1.x + 70},${p1.y} ${p2.x - 70},${p2.y} ${p2.x},${p2.y}`;
    return <path d={d} fill="none" stroke={opts.color || "var(--blue)"} strokeWidth={opts.loop ? 2 : 2.5} strokeDasharray={opts.loop ? "7 7" : undefined} markerEnd="url(#arr)" />;
  }
  function DirB() {
    const g = T.groupById("g_launch_q3");
    const members = T.assetsOf("g_launch_q3");
    return (
      <div className="dir dB">
        <div className="dB-rail">
          <div className="logo">T</div>
          {["workflow", "inbox", "layout-grid", "calendar", "activity"].map((ic, i) => <div key={ic} className={"dB-rt" + (i === 0 ? " on" : "")}><I name={ic} size={19} /></div>)}
        </div>
        <div className="dB-top">
          <span className="dB-pill"><I name="workflow" size={15} color="var(--blue)" />시나리오 · TRUSTA 발행 파이프라인</span>
          <span className="dB-pill" style={{ color: "var(--amber-strong)" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--amber)" }} />scheduled · 검수 2</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <span className="dB-pill"><I name="zap" size={14} />자동배치</span>
            <span className="dB-pill dB-run"><I name="play" size={13} />흐름 실행</span>
          </div>
        </div>
        <div className="dB-canvas">
          <svg className="dB-wires" viewBox="0 0 964 810" preserveAspectRatio="none">
            <defs><marker id="arr" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="context-stroke" strokeWidth="1.4" /></marker></defs>
            {wire(0, 1, { color: "var(--blue)" })}
            {wire(1, 2, { color: "var(--blue)" })}
            {wire(2, 3, { color: "var(--violet)" })}
            {wire(3, 4, { vert: true, color: "var(--w-neutral-70)" })}
            {wire(4, 5, { color: "var(--w-neutral-70)" })}
            {wire(5, 0, { loop: true, color: "var(--w-neutral-60)" })}
          </svg>
          {bNodes.map((n, i) => (
            <div key={i} className="dB-node" style={{ left: n.x, top: n.y }}>
              <div className={"dB-circ " + n.st}>
                <span className="ic"><I name={n.ic} size={28} /></span>
                <span className="dB-count" style={{ background: n.st === "active" ? "var(--violet)" : n.st === "sched" ? "var(--amber)" : "var(--navy)" }}>{n.cnt}</span>
              </div>
              <div className="nm">{i + 1}. {n.nm}</div><div className="ct">{n.ct}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 28, bottom: 26, display: "flex", gap: 14, fontSize: 11.5, color: "var(--ink2)" }}>
            {[["done","완료","var(--blue)"],["active","처리중","var(--violet)"],["sched","예약","var(--amber)"],["wait","대기","var(--w-neutral-70)"],["lock","잠금","var(--navy)"]].map(([k,l,c]) =>
              <span key={k} style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><span style={{ width: 11, height: 11, borderRadius: 4, background: c }} />{l}</span>)}
          </div>
        </div>
        <div className="dB-panel">
          <span className="dB-tag"><I name="layers" size={13} />3. Group · 단계 상세</span>
          <div className="t-title" style={{ fontSize: 17, marginTop: 13 }}>{g.name}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 9 }}><ChannelChip c={g.channel} /><StatusBadge s={g.status} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 15 }}>
            {members.map((m) => (
              <div key={m.id}><div style={{ aspectRatio: "16/10", borderRadius: 9, overflow: "hidden" }}><Thumb ct={m.content_type} dur={m.duration} full /></div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--navy)", marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</div></div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 13, borderRadius: 11, background: "var(--blue-99)", border: "1px solid var(--sky-line)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)" }}>다음 모듈 · Calendar</div>
            <div style={{ fontSize: 12, color: "var(--ink2)", marginTop: 4 }}>체크리스트 충족 시 scheduled 슬롯 자동 생성</div>
            <button className="btn btn-primary sm" style={{ width: "100%", marginTop: 11 }}><I name="arrow-right" size={14} />캘린더 모듈로 연결</button>
          </div>
        </div>
      </div>
    );
  }

  /* ════════ C · Ops Command Dashboard ═════════════════════════════════ */
  const cFunnel = [
    { k: "draft", l: "초안", n: 4, c: "var(--slate)" }, { k: "scheduled", l: "예약됨", n: 24, c: "var(--amber)" },
    { k: "in_review", l: "검수중", n: 3, c: "var(--blue)" }, { k: "approved", l: "승인됨", n: 18, c: "var(--green)" },
    { k: "published", l: "발행됨", n: 11, c: "var(--navy)" },
  ];
  function DirC() {
    return (
      <div className="dir dC">
        <div className="dC-top">
          <div className="dC-brand"><div className="dC-logo">T</div><span style={{ fontWeight: 800, fontSize: 16, color: "var(--navy)", letterSpacing: "-0.04em" }}>TRUSTA</span></div>
          <div className="dC-tabs">
            {[["inbox","Inbox"],["layout-grid","Library"],["layers","Groups"],["calendar","Calendar"],["shield-check","Review"],["activity","Ops",true]].map(([ic,l,on]) =>
              <div key={l} className={"dC-tab" + (on ? " on" : "")}><I name={ic} size={15} />{l}</div>)}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <span className="select" style={{ height: 32 }}><I name="calendar" size={13} />최근 7일</span>
            <button className="btn btn-primary sm"><I name="download" size={14} />리포트</button>
          </div>
        </div>
        <div className="dC-body">
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink2)", marginBottom: 9 }}>파이프라인 현황</div>
          <div className="dC-funnel" style={{ marginBottom: 18 }}>
            {cFunnel.map((s) => (
              <div key={s.k} className="dC-stage">
                <div className="n">{s.n}</div>
                <div className="l"><span style={{ color: s.c, fontWeight: 700 }}>{s.l}</span></div>
                <div className="bar" style={{ background: s.c, width: (40 + s.n * 2.2) + "%" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 18 }}>
            {T.kpis.map((k) => (
              <div key={k.id} className="dC-kpi">
                <div className="l">{k.label}</div>
                <div className="v">{k.value}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <span style={{ font: "600 12px/1 var(--w-font-sans)", color: k.dir === "up" ? "var(--green)" : "var(--red)", display: "inline-flex", gap: 3, alignItems: "center" }}>
                    <I name={k.delta >= 0 ? "trending-up" : "trending-down"} size={13} />{k.delta >= 0 ? "+" : ""}{k.delta}</span>
                  <span style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 20 }}>{k.spark.map((v, i) => <i key={i} style={{ width: 4, height: v + 6, borderRadius: 2, background: i === k.spark.length - 1 ? "var(--blue)" : "var(--sky-line)" }} />)}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
            <div className="card" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="card-h"><h3>운영 상태판</h3><span className="sub">채널별 사이클</span></div>
              <div className="card-b flush"><table className="dt">
                <thead><tr><th>채널</th><th>사이클</th><th>상태</th><th>다음 실행</th></tr></thead>
                <tbody>{T.opsRows.map((o, i) => (
                  <tr key={i}><td><ChannelChip c={o.ch} /></td><td style={{ fontSize: 13 }}>{o.cycle}</td><td><StatusBadge s={o.status} /></td>
                    <td className="mono" style={{ color: o.next.includes("재시도") ? "var(--red)" : "var(--ink2)" }}>{o.next}</td></tr>
                ))}</tbody>
              </table></div>
            </div>
            <div className="card" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="card-h"><h3>publishing_enabled</h3></div>
              <div className="card-b">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="switch"><span className="knob" /></span>
                  <div><div style={{ fontWeight: 700, color: "var(--navy)" }}>OFF · 발행 차단</div><div style={{ fontSize: 12, color: "var(--muted)" }}>조직 단위 토글</div></div>
                </div>
                <div style={{ marginTop: 13 }}><div className="callout-red"><span className="ico"><I name="alert-triangle" size={16} /></span>
                  <div><div className="ttl">🔴 OFF면 자동 발행이 일어나지 않습니다</div></div></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════ D · Dark Scenario Rail ════════════════════════════════════ */
  const dMap = [
    { st: "done", ic: "inbox", t: "Import", s: "7 received" }, { st: "done", ic: "layout-grid", t: "Library", s: "16 stored" },
    { st: "done", ic: "layers", t: "Group", s: "6 assembled" }, { st: "sched", ic: "calendar", t: "Calendar", s: "scheduled" },
    { st: "active", ic: "shield-check", t: "Review", s: "검수 중 · 3" }, { st: "wait", ic: "lock", t: "Publish", s: "locked" },
  ];
  function DirD() {
    const g = T.groupById("g_security_card");
    const members = T.assets.filter((a) => ["cardnews", "image", "caption"].includes(a.content_type)).slice(0, 4);
    return (
      <div className="dir dD">
        <div className="dD-rail">
          <div className="logo">T</div>
          {[["inbox"],["layout-grid"],["layers"],["calendar"],["shield-check",true,true],["activity"]].map(([ic, on, dot], i) =>
            <div key={i} className={"dD-rt" + (on ? " on" : "")}><I name={ic} size={20} />{dot && <span className="dotc" />}</div>)}
        </div>
        <div className="dD-main">
          <div className="dD-top">
            <span style={{ font: "700 15px/1 var(--w-font-sans)", color: "#fff" }}>Review · Approval</span>
            <span className="dD-chip" style={{ color: "#6699fa", borderColor: "rgba(0,102,255,.3)", background: "rgba(0,102,255,.12)" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6699fa" }} />in_review · 3</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <span className="dD-chip"><I name="user-plus" size={14} />할당</span>
              <button className="btn sm" style={{ background: "var(--green)", color: "#fff" }}><I name="check" size={14} />승인</button>
            </div>
          </div>
          <div className="dD-body">
            <div className="dD-card" style={{ padding: 18, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="t-title" style={{ fontSize: 18, color: "#fff" }}>{g.name}</div>
                <span className="dD-chip"><span style={{ width: 8, height: 8, borderRadius: 2, background: T.channels[g.channel].color }} />Instagram</span>
                <span className="dD-chip" style={{ marginLeft: "auto" }}><I name="clock" size={13} />06/24 15:00 예약</span>
              </div>
              <div style={{ display: "flex", gap: 11, marginTop: 16, overflow: "hidden" }}>
                {members.map((m) => (
                  <div key={m.id} style={{ width: 158, flex: "none" }}>
                    <div style={{ aspectRatio: "16/10", borderRadius: 10, overflow: "hidden" }}><Thumb ct={m.content_type} dur={m.duration} full /></div>
                    <div style={{ fontSize: 11.5, color: "#c7c9d1", marginTop: 7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
              <div className="dD-card" style={{ padding: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#8b8e98", marginBottom: 9 }}>캡션 · 본문</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "#c7c9d1", margin: 0 }}>TRUSTA가 제안하는 안전한 자산 관리 습관 5가지. 매주 점검하는 보안 루틴으로 사고를 예방하세요. 카드뉴스를 넘기며 단계별로 확인할 수 있습니다.</p>
                <div style={{ display: "flex", gap: 7, marginTop: 16 }}>
                  {["컴플라이언스 ✓", "저작권 ✓", "채널 규격 ✓", "대표 이미지 ✓"].map((c) => <span key={c} className="dD-chip" style={{ color: "#66e092", borderColor: "rgba(0,191,64,.25)", background: "rgba(0,191,64,.1)" }}>{c}</span>)}
                </div>
              </div>
              <div className="dD-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#8b8e98", marginBottom: 12 }}>검수 결정</div>
                <button className="btn" style={{ width: "100%", background: "var(--green)", color: "#fff", marginBottom: 9 }}><I name="check" size={16} />승인 (approved)</button>
                <button className="btn" style={{ width: "100%", background: "transparent", color: "#ff7a7a", border: "1px solid rgba(245,59,59,.45)" }}><I name="x" size={16} />반려</button>
              </div>
            </div>
          </div>
        </div>
        <div className="dD-map">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><I name="workflow" size={16} color="#6699fa" /><span style={{ font: "700 13px/1 var(--w-font-sans)", color: "#fff" }}>시나리오 미니맵</span></div>
          {dMap.map((m, i) => (
            <React.Fragment key={i}>
              <div className={"dD-mnode " + m.st}><span className="mi"><I name={m.ic} size={16} /></span>
                <div style={{ flex: 1 }}><div className="mt">{i + 1}. {m.t}</div><div className="ms">{m.s}</div></div>
                {m.st === "active" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--violet)" }} />}
              </div>
              {i < dMap.length - 1 && <div className={"dD-conn" + (i < 3 ? " on" : "")} />}
            </React.Fragment>
          ))}
          <div style={{ marginTop: 16, padding: 12, borderRadius: 11, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
            <div style={{ fontSize: 11.5, color: "#8b8e98", display: "flex", gap: 7, alignItems: "center" }}><I name="lock" size={13} />publishing_enabled OFF</div>
          </div>
        </div>
      </div>
    );
  }

  window.DIRECTIONS = { DirA, DirB, DirC, DirD };
})();
