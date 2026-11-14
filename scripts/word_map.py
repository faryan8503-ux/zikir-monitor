"""Padankan perkataan dalam teks app dengan nombor perkataan Quran.com (untuk audio perkataan).

Teks app kadang-kadang memisahkan satu perkataan Quran.com kepada dua (contoh: "أَوَ لَا").
Fungsi ini memulangkan, bagi setiap perkataan app, nombor perkataan Quran.com (bermula 1).
"""
import unicodedata

NORM = {
    'ی': 'ي', 'ى': 'ي', 'ٱ': 'ا', 'أ': 'ا', 'إ': 'ا',
    'آ': 'ا', 'ٲ': 'ا', 'ئ': 'ي', 'ؤ': 'و', 'ک': 'ك',
}


def skeleton(word):
    out = []
    for ch in word:
        if unicodedata.category(ch) in ('Mn', 'Cf', 'Zs') or ch in 'ـۥۦ۞۩ ء':
            continue
        if 'ۖ' <= ch <= 'ۜ':
            continue
        out.append(NORM.get(ch, ch))
    return ''.join(out)


def _consonants(word):
    # Abaikan alif & ya (ejaan berbeza antara mushaf), bandingkan konsonan sahaja
    return skeleton(word).replace('\u0627', '').replace('\u064a', '')


def _map_by(app_words, qcom_words, key):
    owner = []  # bagi setiap huruf dalam Quran.com: nombor perkataannya
    for i, w in enumerate(qcom_words, 1):
        owner.extend([i] * len(key(w)))
    pos = 0
    result = []
    for w in app_words:
        n = len(key(w))
        if n == 0 or pos >= len(owner):
            return None
        result.append(owner[pos])
        pos += n
    return result if pos == len(owner) else None


def map_words(app_words, qcom_words):
    """app_words, qcom_words: senarai teks. Pulangkan senarai nombor perkataan Quran.com.

    Setiap perkataan app dipadankan dengan perkataan Quran.com yang mengandungi huruf
    pertamanya. Mula-mula dibandingkan semua huruf; jika ejaan berbeza, konsonan sahaja.
    """
    for key in (skeleton, _consonants):
        result = _map_by(app_words, qcom_words, key)
        if result:
            return result
    raise ValueError('perkataan tidak dapat dipadankan')
