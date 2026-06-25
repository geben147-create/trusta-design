/* TRUSTA 운영 콘솔 — dummy data (window.TRUSTA) */
(function () {
  const channels = {
    youtube:   { label: "YouTube",   color: "#FF0033" },
    instagram: { label: "Instagram", color: "#E1306C" },
    x:         { label: "X",         color: "#111418" },
    threads:   { label: "Threads",   color: "#5B5B5B" },
    blog:      { label: "Blog",      color: "#16A34A" },
  };

  const contentTypes = {
    video:     { label: "영상",     icon: "video",    hue: 218 },
    shorts:    { label: "쇼츠",     icon: "smartphone", hue: 0 },
    cardnews:  { label: "카드뉴스", icon: "layout-grid", hue: 262 },
    image:     { label: "이미지",   icon: "image",    hue: 190 },
    caption:   { label: "캡션",     icon: "type",     hue: 152 },
    script:    { label: "대본",     icon: "file-text", hue: 32 },
    blogpost:  { label: "블로그글", icon: "newspaper", hue: 140 },
    thumbnail: { label: "썸네일",   icon: "image",    hue: 290 },
    reels:     { label: "릴스",     icon: "film",     hue: 330 },
    story:     { label: "스토리",   icon: "circle-dashed", hue: 24 },
    longform:  { label: "롱폼",     icon: "scroll-text", hue: 205 },
  };

  const sourceTypes = {
    manual_upload: { label: "직접 업로드", icon: "upload" },
    ai_generated:  { label: "AI 생성",    icon: "sparkles" },
    imported:      { label: "가져오기",   icon: "download" },
    crawled:       { label: "크롤링",     icon: "globe" },
  };

  const statusLabel = {
    draft: "초안", scheduled: "예약됨", in_review: "검수중",
    approved: "승인됨", failed: "실패", published: "발행됨",
  };

  const groups = [
    { id: "g_launch_q3", name: "Q3 신뢰지수 캠페인", channel: "youtube", primaryType: "video", members: 6, status: "scheduled", srcMix: { ai_generated: 2, manual_upload: 3, imported: 1 } },
    { id: "g_security_card", name: "보안 점검 카드뉴스 시리즈", channel: "instagram", primaryType: "cardnews", members: 5, status: "in_review", srcMix: { ai_generated: 3, manual_upload: 2 } },
    { id: "g_founder_short", name: "창업자 인터뷰 쇼츠", channel: "youtube", primaryType: "shorts", members: 4, status: "approved", srcMix: { manual_upload: 4 } },
    { id: "g_weekly_blog", name: "주간 핀테크 인사이트", channel: "blog", primaryType: "blogpost", members: 3, status: "draft", srcMix: { ai_generated: 1, crawled: 2 } },
    { id: "g_reels_tips", name: "30초 금융 팁 릴스", channel: "instagram", primaryType: "reels", members: 5, status: "scheduled", srcMix: { ai_generated: 4, manual_upload: 1 } },
    { id: "g_x_thread", name: "규제 업데이트 스레드", channel: "x", primaryType: "caption", members: 4, status: "in_review", srcMix: { crawled: 2, ai_generated: 2 } },
  ];

  const A = (id, title, ct, src, ch, grp, conf, status, dur, media) =>
    ({ id, title, content_type: ct, source_type: src, channel: ch, group: grp, confidence: conf, status, duration: dur, media: media || 1 });

  const assets = [
    A("m_001", "신뢰지수 2.0 브랜드 필름", "video", "manual_upload", "youtube", "g_launch_q3", 96, "scheduled", "1:48", 3),
    A("m_002", "신뢰지수 키 비주얼 썸네일", "thumbnail", "ai_generated", "youtube", "g_launch_q3", 88, "scheduled", null, 4),
    A("m_003", "캠페인 메인 카피 캡션", "caption", "ai_generated", "youtube", "g_launch_q3", 74, "scheduled", null, 1),
    A("m_004", "보안 점검 5단계 카드뉴스", "cardnews", "manual_upload", "instagram", "g_security_card", 93, "in_review", null, 5),
    A("m_005", "2FA 안내 카드뉴스", "cardnews", "ai_generated", "instagram", "g_security_card", 67, "in_review", null, 5),
    A("m_006", "창업자 김도현 인터뷰 쇼츠", "shorts", "manual_upload", "youtube", "g_founder_short", 91, "approved", "0:58", 1),
    A("m_007", "팀 컬처 비하인드 쇼츠", "shorts", "manual_upload", "youtube", "g_founder_short", 90, "approved", "0:42", 1),
    A("m_008", "핀테크 규제 변화 롱폼", "longform", "crawled", "blog", "g_weekly_blog", 58, "draft", null, 1),
    A("m_009", "주간 인사이트 본문 초안", "blogpost", "ai_generated", "blog", "g_weekly_blog", 71, "draft", null, 1),
    A("m_010", "예적금 금리 비교 릴스", "reels", "ai_generated", "instagram", "g_reels_tips", 84, "scheduled", "0:31", 2),
    A("m_011", "환율 헤지 30초 팁", "reels", "ai_generated", "instagram", "g_reels_tips", 79, "scheduled", "0:29", 2),
    A("m_012", "릴스 자막 대본", "script", "ai_generated", "instagram", "g_reels_tips", 69, "scheduled", null, 1),
    A("m_013", "규제 업데이트 요약 스레드", "caption", "crawled", "x", "g_x_thread", 62, "in_review", null, 1),
    A("m_014", "금융위 발표 인용 이미지", "image", "imported", "x", "g_x_thread", 81, "in_review", null, 2),
    A("m_015", "투자자 대상 스토리", "story", "manual_upload", "instagram", "g_reels_tips", 86, "scheduled", "0:15", 1),
    A("m_016", "분기 실적 인포그래픽", "image", "imported", "blog", "g_weekly_blog", 77, "draft", null, 1),
  ];

  const kpis = [
    { id: "k1", label: "예약 건수", icon: "calendar", value: "24", delta: +12, dir: "up", spark: [4,6,5,7,6,8,9] },
    { id: "k2", label: "검수 대기", icon: "shield-check", value: "3", delta: -2, dir: "up", spark: [6,5,5,4,4,3,3] },
    { id: "k3", label: "승인 완료", icon: "check", value: "18", delta: +9, dir: "up", spark: [3,4,6,7,8,9,11] },
    { id: "k4", label: "발행 완료", icon: "send", value: "11", delta: +4, dir: "up", spark: [2,3,3,5,6,7,8] },
    { id: "k5", label: "실패", icon: "alert-triangle", value: "1", delta: -1, dir: "up", spark: [3,2,2,1,2,1,1] },
  ];

  const opsRows = [
    { ch: "youtube", cycle: "발행 사이클 A", status: "scheduled", last: "06/22 18:02", next: "06/24 18:00" },
    { ch: "instagram", cycle: "발행 사이클 B", status: "in_review", last: "06/22 15:40", next: "06/24 15:00" },
    { ch: "x", cycle: "발행 사이클 C", status: "in_review", last: "06/22 21:10", next: "06/27 21:00" },
    { ch: "blog", cycle: "발행 사이클 D", status: "draft", last: "06/21 09:30", next: "—" },
    { ch: "threads", cycle: "발행 사이클 E", status: "failed", last: "06/22 12:00", next: "재시도 대기" },
  ];

  window.TRUSTA = {
    channels, contentTypes, sourceTypes, statusLabel,
    groups, assets, kpis, opsRows,
    groupById: (id) => groups.find((g) => g.id === id),
    assetsOf: (gid) => assets.filter((a) => a.group === gid),
  };
})();
