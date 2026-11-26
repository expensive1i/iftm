"""Make the "sticker" cut-outs used on the auth pages.

For each photo below: remove the background with rembg (people model),
trim to the people, scale to a fixed height, then add a thick rounded
outline in the brand deep red behind them, like a sticker. Writes transparent
PNGs to public/images/cutouts/.

Setup (once, in its own environment):
    python -m venv .rembg-env
    .rembg-env/Scripts/python -m pip install "rembg[cpu]" pillow
Run:
    .rembg-env/Scripts/python scripts/make-cutouts.py

The first run downloads rembg's u2net_human_seg model (~170 MB).
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageFilter
from rembg import new_session, remove
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images"
OUT = ROOT / "public" / "images" / "cutouts"

PHOTOS = [
    "community/march-wall.jpg",
    "banner-home.jpeg",
    "community/bauchi-schoolgirls.jpg",
]
HEIGHT = 1000  # px of the finished cut-out
OUTLINE = 22  # px thickness of the sticker edge
COLOR = (110, 0, 8)  # brand deep red #6e0008
KEEP = 0.35  # keep figures at least this share of the largest one


def sticker(person: Image.Image) -> Image.Image:
    """Add a rounded outline in COLOR behind an RGBA cut-out."""
    pad = OUTLINE * 2
    canvas = Image.new("RGBA", (person.width + pad * 2, person.height + pad), (0, 0, 0, 0))
    # Leave no padding at the bottom: the people are cut by the frame there
    canvas.paste(person, (pad, pad), person)
    alpha = canvas.getchannel("A").point(lambda a: 255 if a > 40 else 0)
    # Grow the silhouette: blur, then threshold low = a smooth, rounded edge
    grown = alpha.filter(ImageFilter.GaussianBlur(OUTLINE)).point(lambda a: 255 if a > 10 else 0)
    grown = grown.filter(ImageFilter.GaussianBlur(1.2))  # soften the edge
    edge = Image.new("RGBA", canvas.size, COLOR + (0,))
    edge.putalpha(grown)
    return Image.alpha_composite(edge, canvas)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    session = new_session("u2net_human_seg")
    for name in PHOTOS:
        src = Image.open(SRC / name).convert("RGB")
        cut = remove(src, session=session, post_process_mask=True)
        # Clean the mask: drop faint specks, and any separate figure much
        # smaller than the main one (e.g. a passer-by in the background)
        a = np.array(cut.getchannel("A"))
        a[a < 30] = 0
        labels, n = ndimage.label(a > 0)
        if n > 1:
            sizes = ndimage.sum(np.ones_like(a), labels, range(1, n + 1))
            keep = {i + 1 for i, size in enumerate(sizes) if size >= sizes.max() * KEEP}
            a[~np.isin(labels, list(keep))] = 0
        a = Image.fromarray(a)
        cut.putalpha(a)
        box = a.getbbox()
        if box:
            cut = cut.crop(box)
        cut = cut.resize((round(cut.width * HEIGHT / cut.height), HEIGHT), Image.LANCZOS)
        out = sticker(cut)
        # Trim the transparent margin again (keeps the outline)
        bbox = ImageChops.difference(out.getchannel("A"), Image.new("L", out.size, 0)).getbbox()
        if bbox:
            out = out.crop(bbox)
        dest = OUT / (Path(name).stem + ".png")
        out.save(dest, optimize=True)
        print(f"{dest.relative_to(ROOT)}  {out.width}x{out.height}  {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
