#!/usr/bin/env python3
import shutil
from pathlib import Path

src = Path(
    "/Users/shishirchandrapoudel/.cursor/projects/Users-shishirchandrapoudel-NEPAL-AUSTRALIA/assets/"
    "Gemini_Generated_Image_gequclgequclgequ-871f593c-a222-4e42-9c15-d6be00b595d7.png"
)
assets = Path(__file__).resolve().parent.parent / "assets"
assets.mkdir(parents=True, exist_ok=True)
for name in ("thuldai-logo.png", "favicon.png"):
    shutil.copy2(src, assets / name)
    print("wrote", assets / name, (assets / name).stat().st_size)
