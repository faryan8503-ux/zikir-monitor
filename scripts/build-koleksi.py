"""Jana public/koleksi.json (Ayat Penting & Doa Al-Quran) daripada scripts/koleksi.json.

Teks Arab & terjemahan diambil daripada public/quran/<n>.json (data app).
Bacaan rumi diambil daripada github.com/gadingnst/quran-api (data/quran.json), jika diberi.
Guna: python3 scripts/build-koleksi.py [quran.json gadingnst]
"""
import json
import os
import sys

root = os.path.join(os.path.dirname(__file__), '..')
spec = json.load(open(os.path.join(os.path.dirname(__file__), 'koleksi.json')))
rumi = None
if len(sys.argv) > 1:
    rumi = json.load(open(sys.argv[1]))['data']

surah_cache = {}
def surah(n):
    if n not in surah_cache:
        surah_cache[n] = json.load(open(os.path.join(root, 'public', 'quran', f'{n}.json')))
    return surah_cache[n]

out = {}
for group, items in spec.items():
    out[group] = []
    for item in items:
        entry = dict(item)
        if not item.get('surah'):
            d = surah(item['s'])
            assert 1 <= item['from'] <= item['to'] <= len(d['ar']), item
            entry['ayat'] = []
            for a in range(item['from'], item['to'] + 1):
                row = {'a': a, 'ar': d['ar'][a - 1], 'ms': d['ms'][a - 1]}
                if rumi:
                    v = rumi[item['s'] - 1]['verses'][a - 1]
                    assert v['number']['inSurah'] == a
                    row['rumi'] = v['text']['transliteration']['en']
                entry['ayat'].append(row)
        out[group].append(entry)

with open(os.path.join(root, 'public', 'koleksi.json'), 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
print('ok', {k: len(v) for k, v in out.items()})
