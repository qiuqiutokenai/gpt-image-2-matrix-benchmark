#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "assets" / "compressed"
MANIFEST_PATH = ASSET_ROOT / "manifest.json"

DATASETS = [
    {"id": "apple", "dir": ROOT / "data" / "apple"},
    {"id": "reading", "dir": ROOT / "data" / "reading-corner"},
    {"id": "city", "dir": ROOT / "data" / "floating-city"},
]

THUMB_MAX = 320
THUMB_QUALITY = 72
PREVIEW_MAX = 1800
PREVIEW_QUALITY = 82


def format_bytes(size):
    if size < 1024:
        return f"{size} B"
    if size < 1024 * 1024:
        return f"{size / 1024:.2f} KB"
    return f"{size / 1024 / 1024:.2f} MB"


def rel(path):
    return str(Path(path).relative_to(ROOT))


def image_path_for(row):
    raw = Path(row["图片文件"])
    return raw if raw.is_absolute() else ROOT / raw


def save_jpeg(source, target, max_side, quality):
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
        if image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info):
            canvas = Image.new("RGB", image.size, (255, 255, 255))
            alpha = image.getchannel("A") if image.mode in ("RGBA", "LA") else None
            canvas.paste(image.convert("RGBA"), mask=alpha)
            image = canvas
        else:
            image = image.convert("RGB")
        image.save(target, "JPEG", quality=quality, optimize=True, progressive=True)


def ensure_variant(source, target, max_side, quality):
    if target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
        return
    save_jpeg(source, target, max_side, quality)


def main():
    rows = []
    seen = set()
    totals = {
        "count": 0,
        "originalBytes": 0,
        "thumbBytes": 0,
        "previewBytes": 0,
    }

    for dataset in DATASETS:
        csv_path = dataset["dir"] / "results.csv"
        with csv_path.open("r", encoding="utf-8", newline="") as handle:
            for row in csv.DictReader(handle):
                image_path = image_path_for(row)
                if not image_path.exists() or image_path in seen:
                    continue
                seen.add(image_path)

                stem = image_path.stem
                thumb_path = ASSET_ROOT / dataset["id"] / "thumbs" / f"{stem}.jpg"
                preview_path = ASSET_ROOT / dataset["id"] / "previews" / f"{stem}.jpg"

                ensure_variant(image_path, thumb_path, THUMB_MAX, THUMB_QUALITY)
                ensure_variant(image_path, preview_path, PREVIEW_MAX, PREVIEW_QUALITY)

                original_bytes = image_path.stat().st_size
                thumb_bytes = thumb_path.stat().st_size
                preview_bytes = preview_path.stat().st_size
                saved_bytes = max(0, original_bytes - preview_bytes)
                savings_ratio = saved_bytes / original_bytes if original_bytes else 0

                rows.append({
                    "datasetId": dataset["id"],
                    "originalPath": str(image_path),
                    "originalRelPath": rel(image_path),
                    "thumbPath": str(thumb_path),
                    "thumbRelPath": rel(thumb_path),
                    "previewPath": str(preview_path),
                    "previewRelPath": rel(preview_path),
                    "originalBytes": original_bytes,
                    "thumbBytes": thumb_bytes,
                    "previewBytes": preview_bytes,
                    "savedBytes": saved_bytes,
                    "savingsRatio": savings_ratio,
                    "originalSize": format_bytes(original_bytes),
                    "thumbSize": format_bytes(thumb_bytes),
                    "previewSize": format_bytes(preview_bytes),
                    "savingsPercent": f"{savings_ratio * 100:.1f}%",
                })

                totals["count"] += 1
                totals["originalBytes"] += original_bytes
                totals["thumbBytes"] += thumb_bytes
                totals["previewBytes"] += preview_bytes

    totals["savedPreviewBytes"] = max(0, totals["originalBytes"] - totals["previewBytes"])
    totals["previewSavingsRatio"] = (
        totals["savedPreviewBytes"] / totals["originalBytes"] if totals["originalBytes"] else 0
    )
    totals["originalSize"] = format_bytes(totals["originalBytes"])
    totals["thumbSize"] = format_bytes(totals["thumbBytes"])
    totals["previewSize"] = format_bytes(totals["previewBytes"])
    totals["savedPreviewSize"] = format_bytes(totals["savedPreviewBytes"])
    totals["previewSavingsPercent"] = f"{totals['previewSavingsRatio'] * 100:.1f}%"

    ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(
        json.dumps({
            "generatedAt": __import__("datetime").datetime.now().isoformat(),
            "root": ".",
            "settings": {
                "thumbMaxSide": THUMB_MAX,
                "thumbQuality": THUMB_QUALITY,
                "previewMaxSide": PREVIEW_MAX,
                "previewQuality": PREVIEW_QUALITY,
                "format": "JPEG",
            },
            "summary": totals,
            "images": rows,
        }, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(json.dumps({
        "manifest": str(MANIFEST_PATH),
        "images": totals["count"],
        "original": totals["originalSize"],
        "previews": totals["previewSize"],
        "saved": totals["savedPreviewSize"],
        "savedPercent": totals["previewSavingsPercent"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
