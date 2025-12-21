# import sys
# import cv2
# import easyocr
# import os
# from rapidfuzz import process, fuzz

# # --- PATH HANDLING ---
# # Get the absolute path of the directory where this script is located
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# # Ensure the dictionary is loaded relative to the script location
# DICT_PATH = os.path.join(BASE_DIR, "bn_words.txt")

# # Load dictionary
# try:
#     with open(DICT_PATH, "r", encoding="utf-8") as f:
#         BN_WORDS = [w.strip() for w in f if len(w.strip()) > 1]
# except FileNotFoundError:
#     # Fallback if dictionary is missing to prevent script crash
#     BN_WORDS = []
#     print(f"Error: Dictionary not found at {DICT_PATH}", file=sys.stderr)

# def correct_word(word, threshold=80):
#     if not BN_WORDS or word in BN_WORDS:
#         return word
#     match = process.extractOne(word, BN_WORDS, scorer=fuzz.ratio)
#     if match and match[1] >= threshold:
#         return match[0]
#     return word

# def correct_text(text):
#     return "\n".join(
#         " ".join(correct_word(w) for w in line.split())
#         for line in text.split("\n")
#     )

# def main():
#     # ---- OCR ----
#     if len(sys.argv) < 2:
#         print("Error: No image path provided")
#         sys.exit(1)

#     image_path = sys.argv[1]

#     # Initialize Reader (Bengali and English for better coverage)
#     reader = easyocr.Reader(['bn', 'en'], gpu=False)

#     img = cv2.imread(image_path)
#     if img is None:
#         print(f"Error: Could not read image at {image_path}")
#         sys.exit(1)

#     # Pre-processing for better OCR results
#     img = cv2.resize(img, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#     thresh = cv2.adaptiveThreshold(
#         gray, 255,
#         cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
#         cv2.THRESH_BINARY,
#         31, 15
#     )

#     # Perform OCR
#     results = reader.readtext(thresh, paragraph=True)
#     text = "\n\n".join(r[1] for r in results)

#     # Print only the final corrected text to stdout
#     print(correct_text(text))

# if __name__ == "__main__":
#     main()


import sys
import os
import cv2
import easyocr
from rapidfuzz import process, fuzz

# ---------- FORCE UTF-8 (WINDOWS FIX) ----------
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

# ---------- PATHS ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DICT_PATH = os.path.join(BASE_DIR, "bn_words.txt")

# ---------- LOAD DICTIONARY ----------
BN_WORDS = []
if os.path.exists(DICT_PATH):
    with open(DICT_PATH, "r", encoding="utf-8") as f:
        BN_WORDS = [w.strip() for w in f if len(w.strip()) > 1]

# ---------- LOAD OCR MODEL (ONCE) ----------
reader = easyocr.Reader(
    ['bn', 'en'],
    gpu=False,
    verbose=False   # 🔥 critical for Windows
)

# ---------- SPELL CORRECTION ----------
def correct_word(word, threshold=80):
    if not BN_WORDS or word in BN_WORDS:
        return word
    match = process.extractOne(word, BN_WORDS, scorer=fuzz.ratio)
    if match and match[1] >= threshold:
        return match[0]
    return word

def correct_text(text):
    lines = []
    for line in text.split("\n"):
        words = [correct_word(w) for w in line.split()]
        lines.append(" ".join(words))
    return "\n".join(lines)

# ---------- MAIN ----------
def main():
    if len(sys.argv) < 2:
        sys.exit(1)

    image_path = sys.argv[1]

    if not os.path.exists(image_path):
        sys.exit(1)

    img = cv2.imread(image_path)
    if img is None:
        sys.exit(1)

    # ---------- SAFE IMAGE RESIZE (MEMORY FIX) ----------
    h, w = img.shape[:2]
    max_dim = 1200

    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        img = cv2.resize(
            img, None,
            fx=scale, fy=scale,
            interpolation=cv2.INTER_AREA
        )

    # ---------- PREPROCESS (BENGALI FRIENDLY) ----------
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 7, 50, 50)

    _, thresh = cv2.threshold(
        gray, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    # ---------- OCR (MEMORY-SAFE SETTINGS) ----------
    results = reader.readtext(
        thresh,
        detail=0,
        paragraph=True,
        batch_size=1,
        canvas_size=1024,   # 🔥 prevents 1GB alloc
        mag_ratio=1.0,     # 🔥 no internal upscaling
        low_text=0.4,
        text_threshold=0.6,
        link_threshold=0.4
    )

    text = "\n\n".join(results)

    # ---------- OUTPUT ONLY CLEAN TEXT ----------
    print(correct_text(text))

# ---------- ENTRY ----------
if __name__ == "__main__":
    main()