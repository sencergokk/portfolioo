#!/usr/bin/env python3
"""
Regenerates the portrait assets used by the site from a single source photo.

Outputs (relative to the repo root):
  public/images/sencer-portrait.png   transparent cut-out (About card, OG image, avatar chip)
  public/images/sencer.jpg            original framing (JSON-LD `image`)
  public/scene/portrait-map.png       200x200 particle map for the Three.js hero
                                      R = luminance, G = subject mask, B = edge strength

Usage:
  pip install "rembg[cpu]" pillow numpy
  python scripts/build-portrait-assets.py path/to/photo.jpg [--clean-sencer-2025]

Use a square, head-and-shoulders photo; 1000px+ gives a noticeably crisper About card.
`--clean-sencer-2025` applies the hand-tuned clean-up for the current CV photo
(removes the painting above the head and the chair edge) and must be dropped for other photos.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
MAP_SIZE = 200


# Blend of histogram-equalised and original luminance for the particle map. Equalising over the
# subject only lifts the shadow side of a low-key selfie so both halves of the face read as particles.
EQUALIZE_MIX = 0.28


def equalize_subject(lum: np.ndarray, mask: np.ndarray, mix: float) -> np.ndarray:
    inside = mask > 0.5
    values = np.sort(lum[inside])
    if values.size == 0 or mix <= 0:
        return lum
    ranks = np.searchsorted(values, lum, side="right") / values.size
    return np.clip(lum * (1 - mix) + ranks * mix, 0, 1)


def subject_mask(photo: Image.Image) -> np.ndarray:
    session = new_session("u2net_human_seg")
    mask = remove(photo.convert("RGB"), session=session, only_mask=True)
    return np.asarray(mask).astype(np.float32) / 255


def clean_current_photo(mask: np.ndarray) -> np.ndarray:
    """Hand-tuned for the 401x401 CV photo (coordinates scale with the image)."""
    h, w = mask.shape
    k = w / 401
    xs, ys = np.meshgrid(np.arange(w), np.arange(h))
    head_top = np.minimum(49 * k + 40 * k * ((xs - 205 * k) / (80 * k)) ** 4, 120 * k)
    cut = np.clip((ys - head_top) / (3 * k), 0, 1)
    cut[ys >= 120 * k] = 1
    mask = mask * cut
    mask[(xs < 118 * k) & (ys > 210 * k) & (ys < 298 * k)] = 0
    return mask


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("photo", type=Path)
    parser.add_argument("--clean-sencer-2025", action="store_true")
    args = parser.parse_args()

    src = Image.open(args.photo).convert("L")
    if src.width != src.height:
        side = min(src.size)
        left = (src.width - side) // 2
        src = src.crop((left, 0, left + side, side))

    mask = subject_mask(src)
    if args.clean_sencer_2025:
        mask = clean_current_photo(mask)
    mask_img = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8 * src.width / 401))

    # 1) cut-out, upscaled 2x for retina when the source is small
    out_side = max(802, src.width)
    sharp = ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2)
    up = src.resize((out_side, out_side), Image.LANCZOS).filter(sharp)
    alpha = mask_img.resize((out_side, out_side), Image.LANCZOS)
    (ROOT / "public/images").mkdir(parents=True, exist_ok=True)
    Image.merge("RGBA", (up, up, up, alpha)).save(ROOT / "public/images/sencer-portrait.png", optimize=True)
    up.convert("RGB").save(ROOT / "public/images/sencer.jpg", quality=88, optimize=True, progressive=True)

    # 2) particle map
    lum = np.asarray(src.resize((MAP_SIZE, MAP_SIZE), Image.LANCZOS)).astype(np.float32) / 255
    m = np.asarray(mask_img.resize((MAP_SIZE, MAP_SIZE), Image.LANCZOS)).astype(np.float32) / 255
    lum = equalize_subject(lum, m, EQUALIZE_MIX)
    blurred = (
        np.asarray(Image.fromarray((lum * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32)
        / 255
    )
    gx = np.zeros_like(blurred)
    gy = np.zeros_like(blurred)
    gx[:, 1:-1] = blurred[:, 2:] - blurred[:, :-2]
    gy[1:-1, :] = blurred[2:, :] - blurred[:-2, :]
    edge = np.sqrt(gx**2 + gy**2)
    edge = np.clip(edge / np.percentile(edge[m > 0.5], 97), 0, 1)
    eroded = (
        np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5))).astype(np.float32) / 255
    )
    edge *= eroded  # keep the silhouette outline from dominating
    rgb = np.stack([lum, m, edge], -1)
    (ROOT / "public/scene").mkdir(parents=True, exist_ok=True)
    Image.fromarray((rgb * 255).astype(np.uint8), "RGB").save(ROOT / "public/scene/portrait-map.png", optimize=True)
    print("portrait assets written")


if __name__ == "__main__":
    main()
