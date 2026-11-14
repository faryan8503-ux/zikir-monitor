"""Jana data Al-Quran untuk app daripada fawazahmed0/quran-api.

Teks Arab: Quran Academy (Uthmani, berasaskan Tanzil, CC BY 3.0).
Terjemahan: Abdullah Muhammad Basmeih (melalui Tanzil).
Guna: python3 scripts/build-quran-data.py <folder-sumber>
Folder sumber mesti ada ara-quranacademy.json, msa-abdullahmuhamma.json, info.json.
"""
import json
import os
import sys

src = sys.argv[1]
root = os.path.join(os.path.dirname(__file__), '..')

NAMES = """Al-Fatihah|Al-Baqarah|Ali 'Imran|An-Nisa'|Al-Ma'idah|Al-An'am|Al-A'raf|Al-Anfal|At-Taubah|Yunus|Hud|Yusuf|Ar-Ra'd|Ibrahim|Al-Hijr|An-Nahl|Al-Isra'|Al-Kahf|Maryam|Taha|Al-Anbiya'|Al-Hajj|Al-Mu'minun|An-Nur|Al-Furqan|Asy-Syu'ara'|An-Naml|Al-Qasas|Al-'Ankabut|Ar-Rum|Luqman|As-Sajdah|Al-Ahzab|Saba'|Fatir|Yasin|As-Saffat|Sad|Az-Zumar|Ghafir|Fussilat|Asy-Syura|Az-Zukhruf|Ad-Dukhan|Al-Jathiyah|Al-Ahqaf|Muhammad|Al-Fath|Al-Hujurat|Qaf|Adz-Dzariyat|At-Tur|An-Najm|Al-Qamar|Ar-Rahman|Al-Waqi'ah|Al-Hadid|Al-Mujadalah|Al-Hasyr|Al-Mumtahanah|As-Saff|Al-Jumu'ah|Al-Munafiqun|At-Taghabun|At-Talaq|At-Tahrim|Al-Mulk|Al-Qalam|Al-Haqqah|Al-Ma'arij|Nuh|Al-Jinn|Al-Muzzammil|Al-Muddaththir|Al-Qiyamah|Al-Insan|Al-Mursalat|An-Naba'|An-Nazi'at|'Abasa|At-Takwir|Al-Infitar|Al-Mutaffifin|Al-Insyiqaq|Al-Buruj|At-Tariq|Al-A'la|Al-Ghasyiyah|Al-Fajr|Al-Balad|Asy-Syams|Al-Lail|Ad-Duha|Asy-Syarh|At-Tin|Al-'Alaq|Al-Qadr|Al-Bayyinah|Az-Zalzalah|Al-'Adiyat|Al-Qari'ah|At-Takathur|Al-'Asr|Al-Humazah|Al-Fil|Quraisy|Al-Ma'un|Al-Kauthar|Al-Kafirun|An-Nasr|Al-Masad|Al-Ikhlas|Al-Falaq|An-Nas""".split('|')
assert len(NAMES) == 114, len(NAMES)

ar = json.load(open(os.path.join(src, 'ara-quranacademy.json')))['quran']
ms = json.load(open(os.path.join(src, 'msa-abdullahmuhamma.json')))['quran']
info = json.load(open(os.path.join(src, 'info.json')))
assert len(ar) == len(ms) == 6236

by_surah = {}
for a, m in zip(ar, ms):
    assert (a['chapter'], a['verse']) == (m['chapter'], m['verse'])
    by_surah.setdefault(a['chapter'], []).append((a['text'], m['text']))

surahs = []
juz_starts = {}
for ch in info['chapters']:
    n = ch['chapter']
    verses = ch['verses']
    texts = by_surah[n]
    assert len(texts) == len(verses)
    data = {
        'ar': [t[0] for t in texts],
        'ms': [t[1] for t in texts],
        'juz': [v['juz'] for v in verses],
        'page': [v['page'] for v in verses],
        'sajda': [v['verse'] for v in verses if v['sajda']],
    }
    with open(os.path.join(root, 'public', 'quran', f'{n}.json'), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    for v in verses:
        juz_starts.setdefault(v['juz'], [n, v['verse']])
    surahs.append({
        'n': n,
        'name': NAMES[n - 1],
        'arabic': ch['arabicname'],
        'ayat': len(verses),
        'type': 'Makkiyah' if ch['revelation'] == 'Mecca' else 'Madaniyah',
        'juz': verses[0]['juz'],
        'page': verses[0]['page'],
    })

assert sum(s['ayat'] for s in surahs) == 6236 and len(juz_starts) == 30

with open(os.path.join(root, 'src', 'quran', 'surahs.js'), 'w', encoding='utf-8') as f:
    f.write('// Dijana oleh scripts/build-quran-data.py — jangan ubah secara manual\n')
    f.write('export const SURAHS = ' + json.dumps(surahs, ensure_ascii=False, indent=1) + '\n\n')
    f.write('// Permulaan setiap juz: [surah, ayat]\n')
    f.write('export const JUZ_STARTS = ' + json.dumps([juz_starts[j] for j in range(1, 31)]) + '\n')
print('ok', len(surahs), 'surah')
