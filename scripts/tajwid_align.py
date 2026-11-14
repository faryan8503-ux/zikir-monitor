"""Padankan tanda tajwid (format Al-Quran Cloud) dengan teks Uthmani Quran Academy.

Warna tajwid dipindahkan huruf demi huruf; teks Al-Quran sendiri tidak diubah.
"""
import difflib
import unicodedata
import re
TAG = re.compile(r'\[([a-z])(?::\d+)?\[')
def parse(s):
    """Pulangkan senarai segmen: str (biasa) atau [kod, teks]. Hukum paling dalam diutamakan."""
    out = []; stack = []; buf = ''; i = 0
    def flush():
        nonlocal buf
        if buf:
            code = next((c for c in reversed(stack) if c), None)
            if code is None:
                if out and isinstance(out[-1], str): out[-1] += buf
                else: out.append(buf)
            else:
                if out and isinstance(out[-1], list) and out[-1][0] == code: out[-1][1] += buf
                else: out.append([code, buf])
            buf = ''
    while i < len(s):
        m = TAG.match(s, i)
        if m:
            flush(); stack.append(m.group(1)); i = m.end(); continue
        if s[i] == '[':
            # kurungan tanpa kod hukum (data rosak): anggap teks biasa
            flush(); stack.append(None); i += 1; continue
        if s[i] == ']' and stack:
            flush(); stack.pop(); i += 1; continue
        buf += s[i]; i += 1
    flush()
    assert not stack, s
    return out
def plain(segs): return ''.join(x if isinstance(x, str) else x[1] for x in segs)


# Huruf yang dianggap sama ketika membandingkan dua versi teks
EQUIV = {
    'ی': 'ي', 'ى': 'ي', 'ٮ': 'ي',  # bentuk ya
    'ۡ': 'ْ', 'ۤ': 'ٓ',  # sukun & mad kecil
    'ࣰ': 'ً', 'ࣱ': 'ٌ', 'ࣲ': 'ٍ',  # tanwin terbuka
    'ٲ': 'ٰ', 'ک': 'ك',  # alif kecil, kaf
}
# Tatweel, hair space, word joiner, ZWNJ, ruang: tidak dibandingkan
SKIP = set('ـ ⁠‌ ')

def norm(c):
    return EQUIV.get(c, c)

def transfer(km_markup, qa):
    segs = parse(km_markup)
    kc, kr = [], []
    for s in segs:
        text, rule = (s, None) if isinstance(s, str) else (s[1], s[0])
        for ch in text:
            kc.append(ch); kr.append(rule)
    ki = [i for i, c in enumerate(kc) if c not in SKIP]
    qi = [i for i, c in enumerate(qa) if c not in SKIP]
    a = [norm(kc[i]) for i in ki]; b = [norm(qa[i]) for i in qi]
    mapping = {}
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == 'equal' or (op == 'replace' and i2 - i1 == j2 - j1):
            for x, y in zip(range(i1, i2), range(j1, j2)): mapping[ki[x]] = qi[y]
    # kumpulkan julat bagi setiap segmen hukum
    spans = []
    i = 0
    while i < len(kc):
        r = kr[i]
        j = i
        while j < len(kc) and kr[j] == r: j += 1
        if r:
            idx = [mapping[k] for k in range(i, j) if k in mapping]
            if idx:
                s, e = min(idx), max(idx) + 1
                # sertakan baris/tanda (Mn) dan tatweel yang melekat pada huruf terakhir
                while e < len(qa) and (unicodedata.category(qa[e]) == 'Mn' or qa[e] == '\u0640'): e += 1
                spans.append([s, e, r])
        i = j
    # buang pertindihan
    spans.sort()
    clean = []
    for s, e, r in spans:
        if clean and s < clean[-1][1]:
            s = clean[-1][1]
            if s >= e: continue
        clean.append([s, e, r])
    return clean

def to_segments(qa, spans):
    out, pos = [], 0
    for s, e, r in spans:
        if s > pos: out.append(qa[pos:s])
        out.append([r, qa[s:e]])
        pos = e
    if pos < len(qa): out.append(qa[pos:])
    return out

