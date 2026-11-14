"""Jana fail tafsir (Tadabbur) untuk app.

Sumber: Tafsir Ringkas Kementerian Agama Republik Indonesia (quran.kemenag.go.id),
seperti yang dihimpunkan oleh github.com/gadingnst/quran-api (data/quran.json).
Guna: python3 scripts/build-tafsir-data.py <quran.json>
"""
import json
import os
import sys

root = os.path.join(os.path.dirname(__file__), '..')
data = json.load(open(sys.argv[1]))['data']
assert len(data) == 114
out_dir = os.path.join(root, 'public', 'tafsir')
os.makedirs(out_dir, exist_ok=True)
for i, s in enumerate(data, 1):
    assert s['number'] == i
    ours = json.load(open(os.path.join(root, 'public', 'quran', f'{i}.json')))['ar']
    verses = s['verses']
    assert len(verses) == len(ours)
    assert [v['number']['inSurah'] for v in verses] == list(range(1, len(verses) + 1))
    out = {
        'intro': s['tafsir']['id'].strip(),
        'ayat': [v['tafsir']['id']['short'].strip() for v in verses],
    }
    assert all(out['ayat'])
    with open(os.path.join(out_dir, f'{i}.json'), 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
print('ok', len(data), 'surah')
