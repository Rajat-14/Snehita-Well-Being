#!/usr/bin/env python3
"""Generate placeholder SVG images for all team members referenced in seed.js"""

import os

buddies = [
    "KRISHNAKUMAR.jpg",
    "KATYAYNITIWARI.jpg",
    "AswathiPrakash.jpg",
    "ARNAVKHARBANDA.jpg",
    "NishantYadav.jpg",
    "VijayVaishampayan.jpg",
    "BhushanVanjiwale.jpg",
    "MANAVCHAUHAN.jpg",
    "SnehaShah.jpg",
    "AdityaBadoni.jpg",
    "ShivamKainth.jpg",
    "ShyamPatil.jpg",
    "Ankush.jpg",
    "MAYANKKUMAR.jpg",
    "PiyushKumar.jpg",
    "ShrenikNandre.jpg",
]

base_path = "server/uploads/team/buddies"
os.makedirs(base_path, exist_ok=True)

# SVG template with unique color per name hash
svg_template = '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="{color}"/>
  <circle cx="100" cy="70" r="35" fill="white" opacity="0.8"/>
  <ellipse cx="100" cy="150" rx="50" ry="40" fill="white" opacity="0.8"/>
  <text x="100" y="195" font-size="10" fill="white" text-anchor="middle" font-weight="bold">{name}</text>
</svg>'''

colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B88B", "#B8E6D5",
    "#F5A9B8", "#C39BD3", "#82E0AA", "#F5B7B1", "#D7BDE2", "#FADBD8"
]

for i, buddy in enumerate(buddies):
    color = colors[i % len(colors)]
    name = buddy.replace(".jpg", "").replace("_", " ")
    svg_content = svg_template.format(color=color, name=name[:15])
    
    file_path = os.path.join(base_path, buddy)
    with open(file_path, 'w') as f:
        f.write(svg_content)
    print(f"Created {file_path}")

print(f"\nGenerated {len(buddies)} placeholder images in {base_path}")
