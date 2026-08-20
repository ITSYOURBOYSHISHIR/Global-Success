#!/usr/bin/env python3
"""Generate Mac Terminal Cheat Sheet PDF from HTML."""
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "docs" / "terminal-cheatsheet.html"
OUT = ROOT / "MAC-TERMINAL-CHEATSHEET.pdf"
DESKTOP = Path.home() / "Desktop" / "MAC-TERMINAL-CHEATSHEET.pdf"


def html_to_pdf(html: Path, pdf: Path) -> bool:
    for chrome in (
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ):
        if not Path(chrome).exists():
            continue
        try:
            subprocess.run(
                [
                    chrome,
                    "--headless=new",
                    "--disable-gpu",
                    f"--print-to-pdf={pdf}",
                    "--no-pdf-header-footer",
                    html.as_uri(),
                ],
                check=True,
                capture_output=True,
                timeout=60,
            )
            return pdf.is_file() and pdf.stat().st_size > 5000
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
            continue
    return False


def main() -> None:
    HTML.parent.mkdir(parents=True, exist_ok=True)
    if not HTML.is_file():
        raise SystemExit(f"Missing {HTML}")
    if html_to_pdf(HTML, OUT):
        import shutil
        shutil.copy2(OUT, DESKTOP)
        print(f"PDF: {OUT}")
        print(f"Desktop copy: {DESKTOP}")
    else:
        print("Chrome PDF failed. Open HTML and Print to PDF:")
        print(HTML.as_uri())


if __name__ == "__main__":
    main()
