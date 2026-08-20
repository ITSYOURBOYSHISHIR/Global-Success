#!/usr/bin/env python3
"""Download all website images locally from Pexels (reliable CDN)."""
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parent.parent / "assets" / "images"
JOURNEY_ROOT = Path(__file__).resolve().parent.parent / "assets" / "journey"
UA = "Mozilla/5.0 (SkillsAustralia/1.0)"

# Curated Pexels IDs — verified Australian city skylines & student content
DOWNLOADS = {
    "heroes/sydney-opera.jpg": "https://images.pexels.com/photos/36837750/pexels-photo-36837750.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    "heroes/australia-hero.jpg": "https://images.pexels.com/photos/3225534/pexels-photo-3225534.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "heroes/melbourne-hero.jpg": "https://images.pexels.com/photos/29813638/pexels-photo-29813638.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    "heroes/students-australia.jpg": "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop",
    "cities/sydney.jpg": "https://images.pexels.com/photos/36837750/pexels-photo-36837750.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop",
    "cities/melbourne.jpg": "https://images.pexels.com/photos/29813638/pexels-photo-29813638.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop",
    "cities/brisbane.jpg": "https://images.pexels.com/photos/28210361/pexels-photo-28210361.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop",
    "cities/perth.jpg": "https://images.pexels.com/photos/20777136/pexels-photo-20777136.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop",
    "cities/gold-coast.jpg": "https://images.pexels.com/photos/30828089/pexels-photo-30828089.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop",
    "australia/city-street.jpg": "https://images.pexels.com/photos/29813638/pexels-photo-29813638.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/office-laptop.jpg": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/house.jpg": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/restaurant.jpg": "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/cleaning.jpg": "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/community.jpg": "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/business.jpg": "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/travel.jpg": "https://images.pexels.com/photos/30828089/pexels-photo-30828089.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/campus.jpg": "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/driving.jpg": "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/naati.jpg": "https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/jobs.jpg": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/renting.jpg": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/hospitality.jpg": "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/cleaning.jpg": "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/ndis.jpg": "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/tfn.jpg": "https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/food.jpg": "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/safety.jpg": "https://images.pexels.com/photos/29813638/pexels-photo-29813638.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/bank.jpg": "https://images.pexels.com/photos/50987/money-card-business-credit-card-50987.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/linkedin.jpg": "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/resume.jpg": "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/transport.jpg": "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/coaching.jpg": "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=900",
    "packages/airport.jpg": "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/housing.jpg": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/transport.jpg": "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/study.jpg": "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=900",
    "australia/work.jpg": "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900",
    "people/person-01.jpg": "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-02.jpg": "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-03.jpg": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-04.jpg": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-05.jpg": "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-06.jpg": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-07.jpg": "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-08.jpg": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-09.jpg": "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-10.jpg": "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-11.jpg": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-12.jpg": "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-13.jpg": "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-14.jpg": "https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=500",
    "people/person-15.jpg": "https://images.pexels.com/photos/3758101/pexels-photo-3758101.jpeg?auto=compress&cs=tinysrgb&w=500",
    "journey/step-4-arrive.jpg": "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=900",
    "journey/step-5-thrive.jpg": "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=900",
}

FORCE_REFRESH = {
    "cities/sydney.jpg", "cities/melbourne.jpg", "cities/brisbane.jpg",
    "cities/perth.jpg", "cities/gold-coast.jpg",
    "heroes/melbourne-hero.jpg", "heroes/students-australia.jpg", "heroes/sydney-opera.jpg",
}


def dest_for(rel: str) -> Path:
    if rel.startswith("journey/"):
        return JOURNEY_ROOT / rel.split("/", 1)[1]
    return ROOT / rel


def fetch(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    if len(data) < 5000:
        raise RuntimeError(f"File too small ({len(data)} bytes): {dest}")
    dest.write_bytes(data)
    print(f"OK  {dest.name} ({len(data)//1024} KB)")


def main():
    ok = fail = 0
    for rel, url in DOWNLOADS.items():
        dest = dest_for(rel)
        try:
            if dest.exists() and dest.stat().st_size > 5000 and rel not in FORCE_REFRESH:
                print(f"skip {rel}")
                ok += 1
                continue
            fetch(url, dest)
            ok += 1
        except Exception as e:
            print(f"FAIL {rel}: {e}")
            fail += 1
    print(f"\n{ok} ok, {fail} failed")


if __name__ == "__main__":
    main()
