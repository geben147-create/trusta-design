# -*- coding: utf-8 -*-
"""TRUSTA 랜딩페이지.dc.html -> 독립 실행 표준 HTML 변환 빌드.
- <helmet> 내용을 <head>로 이동 (프레임워크 <script> 제거)
- <x-dc> 래퍼 제거
- <image-slot> -> 스타일 플레이스홀더 div (placeholder 텍스트 유지)
"""
import json, re, sys, os

SRC = r"C:\Users\llorr\.claude\projects\c--Users-llorr-OneDrive---------------------\6bf43b64-a11d-4b2f-a444-7fe1bb93043c\tool-results\toolu_019EFo1xm2qQ1HCbYGQovDYt.txt"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "TRUSTA-랜딩페이지.html")

content = json.load(open(SRC, encoding="utf-8"))["content"]

# 1) helmet 추출 + 프레임워크 script 제거
hm = re.search(r"<helmet>(.*?)</helmet>", content, re.S)
helmet = hm.group(1)
helmet = re.sub(r"<script\b[^>]*>.*?</script>", "", helmet, flags=re.S)  # image-slot.js 등 제거

# 2) body = <x-dc> 내부에서 helmet 블록 제거
body = re.search(r"<x-dc>(.*?)</x-dc>", content, re.S).group(1)
body = body.replace(hm.group(0), "")

# 3) image-slot -> 플레이스홀더 div
slot_count = 0
def repl(m):
    global slot_count
    slot_count += 1
    tag = m.group(0)
    style = (re.search(r'style="([^"]*)"', tag) or [None, ""])[1]
    ph = (re.search(r'placeholder="([^"]*)"', tag) or [None, "이미지 업로드"])[1]
    extra = ("display:flex;align-items:center;justify-content:center;"
             "background:linear-gradient(135deg,#eef1ff,#f6f7f9);"
             "border:1px dashed #c7cdf0;color:#1B3DEB;font-size:14px;"
             "font-weight:600;text-align:center;padding:24px;line-height:1.5;")
    return f'<div class="img-ph" style="{style};{extra}">{ph}</div>'

body = re.sub(r"<image-slot\b[^>]*></image-slot>", repl, body)

html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TRUSTA · 해외 진출 콘텐츠 검수 · 월관리형 운영</title>
<meta name="description" content="K-뷰티 브랜드부터 피부과·성형외과·치과까지, 해외 진출 콘텐츠를 발행 전 한 번 더 검수합니다. 제작·AI검증·사람검수 3단계.">
<meta property="og:title" content="TRUSTA · 해외 진출 콘텐츠 검수">
<meta property="og:description" content="해외 고객에게 어색하지 않도록 표현과 흐름을 다시 정리합니다.">
{helmet.strip()}
</head>
<body>
{body.strip()}
</body>
</html>
"""

open(OUT, "w", encoding="utf-8").write(html)

# --- 검증 (ponytail: 빌드가 깨지면 실패하는 최소 체크) ---
leftovers = {t: html.count(t) for t in
             ["<x-dc", "<helmet", "<image-slot", "support.js", "image-slot.js"]}
assert all(v == 0 for v in leftovers.values()), f"leftover framework tags: {leftovers}"
assert html.count("class=\"img-ph\"") == slot_count
assert body.count("<section") >= 20, "섹션 수가 비정상적으로 적음"
print("OK  ->", OUT)
print("size:", len(html), "chars | image-slots replaced:", slot_count,
      "| sections:", body.count("<section"))
print("leftovers(all must be 0):", leftovers)
