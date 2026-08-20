#!/bin/bash
# Download all website images locally (Unsplash)
set -e
BASE="$(cd "$(dirname "$0")/.." && pwd)/assets/images"
mkdir -p "$BASE/people" "$BASE/australia" "$BASE/cities" "$BASE/heroes"

download() {
  local url="$1"
  local out="$2"
  if [ -f "$out" ] && [ -s "$out" ]; then
    echo "skip $out"
    return
  fi
  echo "get $out"
  curl -fsSL "$url" -o "$out"
}

# Heroes
download "https://images.unsplash.com/photo-1523482585902-039997384759?w=1920&q=85" "$BASE/heroes/sydney-opera.jpg"
download "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=85" "$BASE/heroes/students-australia.jpg"

# Cities
download "https://images.unsplash.com/photo-1506973035872-a4ec16b8e589?w=800&q=85" "$BASE/cities/sydney.jpg"
download "https://images.unsplash.com/photo-1514395462725-fbc4b474278a?w=800&q=85" "$BASE/cities/melbourne.jpg"
download "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=85" "$BASE/cities/brisbane.jpg"
download "https://images.unsplash.com/photo-1590846407426-62c35a8bb6b6?w=800&q=85" "$BASE/cities/perth.jpg"
download "https://images.unsplash.com/photo-1586273965635-32a8122d0a49?w=800&q=85" "$BASE/cities/adelaide.jpg"
download "https://images.unsplash.com/photo-1574824746387-abb35f37d4d7?w=800&q=85" "$BASE/cities/gold-coast.jpg"

# People (packages + add-ons)
download "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=85" "$BASE/people/person-01.jpg"
download "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=85" "$BASE/people/person-02.jpg"
download "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=85" "$BASE/people/person-03.jpg"
download "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=85" "$BASE/people/person-04.jpg"
download "https://images.unsplash.com/photo-1551836022-d5d88e1328ef?w=500&q=85" "$BASE/people/person-05.jpg"
download "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=85" "$BASE/people/person-06.jpg"
download "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=85" "$BASE/people/person-07.jpg"
download "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=85" "$BASE/people/person-08.jpg"
download "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=85" "$BASE/people/person-09.jpg"
download "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=85" "$BASE/people/person-10.jpg"
download "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=85" "$BASE/people/person-11.jpg"
download "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=85" "$BASE/people/person-12.jpg"
download "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=85" "$BASE/people/person-13.jpg"
download "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=85" "$BASE/people/person-14.jpg"
download "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=85" "$BASE/people/person-15.jpg"

# Australia backgrounds
download "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=85" "$BASE/australia/city-street.jpg"
download "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&q=85" "$BASE/australia/office-laptop.jpg"
download "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=85" "$BASE/australia/house.jpg"
download "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85" "$BASE/australia/restaurant.jpg"
download "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=85" "$BASE/australia/cleaning.jpg"
download "https://images.unsplash.com/photo-1519451241324-20b4ea2a1495?w=900&q=85" "$BASE/australia/community.jpg"
download "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=85" "$BASE/australia/business.jpg"
download "https://images.unsplash.com/photo-1524821909977-74105ad0563d?w=900&q=85" "$BASE/australia/travel.jpg"
download "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=85" "$BASE/australia/campus.jpg"

echo "Done — $(find "$BASE" -type f | wc -l | tr -d ' ') images"
