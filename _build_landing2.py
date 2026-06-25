# -*- coding: utf-8 -*-
"""TRUSTA 랜딩페이지.dc.html -> 독립 실행 표준 HTML 빌드 (실제 이미지 포함판).

- MCP get_file 로 내려받아 tool-results 에 저장된 이미지(base64)를 uploads/ 로 디코딩
  (truncated=true 인 것은 깨졌으므로 저장하지 않고 목록만 보고)
- <helmet> -> <head> 이동 (support.js / image-slot.js 프레임워크 스크립트만 제거, motion-fx.js 유지)
- <x-dc> 래퍼 제거
- <image-slot> -> 실제 <img src="uploads/..."> + 누락 시 보이는 플레이스홀더 div
- uploads/ 일반 <img> 는 onerror 시 그라데이션 대체 (전역 핸들러)
"""
import json, re, os, base64, glob

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLDIR = r"C:\Users\llorr\.claude\projects\c--Users-llorr-OneDrive---------------------\90cf750e-aab5-4700-aea5-7c3056531a69\tool-results"
DC_SRC = os.path.join(TOOLDIR, "toolu_017BAz3FFa5taEMtBbNofvaA.txt")   # TRUSTA 랜딩페이지.dc.html
OUT = os.path.join(HERE, "TRUSTA 랜딩페이지.html")
UPDIR = os.path.join(HERE, "uploads")
os.makedirs(UPDIR, exist_ok=True)

# ---------- 1) tool-results 안의 이미지 base64 -> uploads/ 디코딩 ----------
saved, truncated, total = [], [], 0
for fp in glob.glob(os.path.join(TOOLDIR, "toolu_*.txt")):
    try:
        obj = json.load(open(fp, encoding="utf-8"))
    except Exception:
        continue
    if obj.get("method") != "get_file":
        continue
    ct = obj.get("contentType", "")
    path = obj.get("path", "")
    if not (obj.get("isBase64") and ct.startswith("image/") and path.startswith("uploads/")):
        continue
    total += 1
    name = os.path.basename(path)
    if obj.get("truncated"):
        truncated.append(name)
        continue
    try:
        data = base64.b64decode(obj["content"])
        open(os.path.join(UPDIR, name), "wb").write(data)
        saved.append((name, len(data)))
    except Exception as e:
        truncated.append(name + f" (decode-fail:{e})")

# ---------- 2) 소스 로드 ----------
content = json.load(open(DC_SRC, encoding="utf-8"))["content"]

hm = re.search(r"<helmet>(.*?)</helmet>", content, re.S)
helmet = hm.group(1)
# 프레임워크 스크립트만 제거: support.js, image-slot.js  (motion-fx.js 는 유지)
helmet = re.sub(r'<script\b[^>]*src="[^"]*(?:support|image-slot)\.js"[^>]*>\s*</script>', "", helmet)

body = re.search(r"<x-dc>(.*?)</x-dc>", content, re.S).group(1)
body = body.replace(hm.group(0), "")

# ---------- 3) <image-slot> -> 플레이스홀더 div + 실제 img ----------
slot_count = 0
def attr(tag, name, default=""):
    m = re.search(name + r'="([^"]*)"', tag)
    return m.group(1) if m else default

def repl_slot(m):
    global slot_count
    slot_count += 1
    tag = m.group(0)
    style = attr(tag, "style")
    src = attr(tag, "src")
    ph = attr(tag, "placeholder", "이미지")
    fit = attr(tag, "fit", "cover")
    return (
        f'<div class="img-slot" style="{style};position:relative;overflow:hidden;">'
        f'<span class="ph-label">{ph}</span>'
        f'<img src="{src}" alt="{ph}" loading="lazy" '
        f'style="position:absolute;inset:0;width:100%;height:100%;object-fit:{fit};border-radius:inherit;">'
        f'</div>'
    )
body = re.sub(r"<image-slot\b[^>]*></image-slot>", repl_slot, body)

HEAD_EXTRA = """
<title>TRUSTA · 해외 진출 콘텐츠 검수 · 월관리형 운영</title>
<meta name="description" content="K-뷰티 브랜드부터 피부과·성형외과·치과까지, 해외 진출 콘텐츠를 발행 전 한 번 더 검수합니다. 제작·AI검증·사람검수 3단계.">
<meta property="og:title" content="TRUSTA · 해외 진출 콘텐츠 검수">
<meta property="og:description" content="해외 고객에게 어색하지 않도록 표현과 흐름을 다시 정리합니다.">
<style>
  .img-slot{background:linear-gradient(135deg,#eef1ff,#f6f7f9);border:1px dashed #c7cdf0;display:flex;align-items:center;justify-content:center;}
  .img-slot .ph-label{position:relative;z-index:0;color:#1B3DEB;font-size:14px;font-weight:600;text-align:center;padding:24px;line-height:1.5;}
  .img-slot img{z-index:1;}
</style>
<script>
  // 누락 이미지(256KB 초과로 미전송 등) 깨진 아이콘 방지: 숨기고 부모에 그라데이션
  window.addEventListener('error', function(e){
    var t = e.target;
    if (t && t.tagName === 'IMG'){
      t.style.display = 'none';
      var p = t.parentElement;
      if (p && !p.querySelector('.ph-label')){
        p.style.background = 'linear-gradient(135deg,#eef1ff,#f6f7f9)';
        p.style.minHeight = p.style.minHeight || '120px';
      }
    }
  }, true);
</script>
"""

html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{HEAD_EXTRA.strip()}
{helmet.strip()}
</head>
<body>
{body.strip()}
</body>
</html>
"""

open(OUT, "w", encoding="utf-8").write(html)

# ---------- 4) 자가 검증 (ponytail: 깨지면 실패하는 최소 체크) ----------
leftovers = {t: html.count(t) for t in ["<x-dc", "<helmet", "<image-slot", "support.js", "image-slot.js"]}
assert all(v == 0 for v in leftovers.values()), f"leftover framework tags: {leftovers}"
assert "motion-fx.js" in html, "motion-fx.js 유지 실패"
assert html.count('class="img-slot"') == slot_count, "슬롯 카운트 불일치"
assert body.count("<section") >= 20, "섹션 수 비정상"

print("OK ->", OUT)
print(f"sections={body.count('<section')}  image-slots={slot_count}  html={len(html)}chars")
print(f"이미지 디코딩: 저장 {len(saved)} / 전체 {total}  (잘림 {len(truncated)})")
for n, sz in saved:
    print(f"  [OK]  {n}  {sz//1024}KB")
for n in truncated:
    print(f"  [잘림] {n}")
