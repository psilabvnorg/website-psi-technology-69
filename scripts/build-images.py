"""Crop + convert the source photos in photo/ (and two PsiLab catalog shots)
into web-sized WebP files in public/img/.

Run from the repo root:  python3 scripts/build-images.py
Each entry: output name, source, aspect ratio (w/h), focal point (0-1), width.
The crop keeps the focal point as close to centre as the frame allows.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "img"
PSILAB = ROOT / "photo" / "psilab-catalog"  # copied from psilabvnorg/PsiLab public/images/catalog

P = ROOT / "photo"
JOBS = [
    # --- About us: 4:5 portraits, warehouse wide ---
    ("about-automation", P / "about-us/automation_engineering.jpg", 4 / 5, (0.5, 0.55), 800),
    ("about-cnc", P / "about-us/cnc_machine.jpg", 4 / 5, (0.5, 0.6), 800),
    ("about-electrical", P / "about-us/electrical_engineering.jpg", 4 / 5, (0.55, 0.55), 800),
    ("about-mechanical", P / "about-us/mechanical_engineering.jpg", 4 / 5, (0.4, 0.55), 800),
    ("about-production-1", P / "about-us/production1.jpg", 4 / 5, (0.5, 0.6), 800),
    ("about-production-2", P / "about-us/production2.jpg", 4 / 5, (0.5, 0.6), 800),
    ("about-production-3", P / "about-us/production3.jpg", 4 / 5, (0.5, 0.6), 800),
    ("about-warehouse", P / "about-us/warehouse.jpg", 16 / 9, (0.5, 0.55), 1600),
    # --- Product slideshows: 4:5, "-<n>" = slide order ---
    ("product-cargo-2-1", P / "cargo-bike/51b5b875-a811-47b6-8d62-a97435fa6300.jpg", 4 / 5, (0.5, 0.62), 900),
    ("product-cargo-2-2", PSILAB / "psi-2-banh.webp", 4 / 5, (0.5, 0.7), 900),
    ("product-cargo-2-3", P / "cargo-bike/b7b0f441-bcd5-4a20-8467-dcfa8adf707a.jpg", 4 / 5, (0.42, 0.62), 900),
    ("product-cargo-2-4", P / "cargo-bike/2040dcac-f2b3-4f9a-a092-0ffc063e3dce.jpg", 4 / 5, (0.6, 0.5), 900),
    ("product-cargo-2-5", P / "cargo-bike/f2c305bf-0163-4752-9c38-2326c0e7d5ea (1).jpg", 4 / 5, (0.45, 0.6), 900),
    ("product-cargo-2-6", P / "cargo-bike/acf9da64-bfb9-4b88-9719-ef170e7e8bbf.jpg", 4 / 5, (0.5, 0.55), 900),
    ("product-cargo-3-1", PSILAB / "psi-3-banh.webp", 4 / 5, (0.5, 0.62), 900),
    ("product-vision-1", P / "vision-bike/05fabd53-05e4-4768-9312-9dc21096510b.jpg", 4 / 5, (0.6, 0.65), 900),
    ("product-vision-2", P / "vision-bike/052424c2-6f49-4112-bb4c-c156050bf37f.jpg", 4 / 5, (0.45, 0.68), 900),
    ("product-vision-3", P / "vision-bike/0c8ffadc-0914-480a-b79d-92c178d5c2e3.jpg", 4 / 5, (0.5, 0.65), 900),
    ("product-vision-4", P / "vision-bike/24517399-ed46-4463-8dc8-3fab8fa59319.jpg", 4 / 5, (0.5, 0.7), 900),
    ("product-vision-5", P / "vision-bike/47dbb18c-172d-4e94-8b9d-b427bda151d5.jpg", 4 / 5, (0.6, 0.7), 900),
    ("product-vision-6", P / "vision-bike/59c289eb-b400-49ce-a37d-77f8583c7a5e.jpg", 4 / 5, (0.6, 0.7), 900),
    ("product-vision-7", P / "vision-bike/b5572710-23c3-4118-a78a-b9c21f43aa85.jpg", 4 / 5, (0.5, 0.65), 900),
    ("product-vision-8", PSILAB / "vision-dien-den.webp", 4 / 5, (0.5, 0.6), 900),
    ("product-charger-1", P / "super-fast-charger/2ff0ac00-ada6-4499-8d50-a5b43f4eefa5.jpg", 4 / 5, (0.45, 0.6), 900),
    ("product-charger-2", P / "super-fast-charger/72dcfb54-cd21-4944-acfb-692c4d55d97c.jpg", 4 / 5, (0.5, 0.55), 900),
    ("product-charger-3", PSILAB / "sac-sieu-nhanh-1-8kw.webp", 4 / 5, (0.5, 0.6), 900),
    ("product-storage-1", PSILAB / "bo-luu-dien-inverter.webp", None, None, 544),
    ("product-storage-2", P / "battery/Screenshot 2026-11-10 182428.png", 4 / 5, (0.5, 0.45), 425),
    ("product-storage-3", P / "battery/Screenshot 2026-11-10 182609.png", 4 / 5, (0.5, 0.5), 423),
    ("product-storage-4", P / "battery/Screenshot 2026-11-10 182541.png", 4 / 5, (0.5, 0.5), 427),
    ("product-storage-5", P / "battery/Screenshot 2026-11-10 182307.png", 4 / 5, (0.5, 0.5), 419),
    ("product-storage-6", P / "battery/d066fe3f-62e6-4696-9f52-15884adb1d54.jpg", 4 / 5, (0.5, 0.6), 900),
    ("product-gpu-1", P / "gpu-power-supply/Screenshot 2026-11-10 182732.png", None, None, 690),
    # --- Founders (cropped from the founder slide; replace with originals when available) ---
    ("founder-tung-nguyen", P / "founders/tung-nguyen.png", 1, (0.5, 0.5), 224),
    ("founder-cuong-phan", P / "founders/cuong-phan.png", 1, (0.5, 0.5), 224),
    ("founder-nathan-cheng", P / "founders/nathan-cheng.png", 1, (0.5, 0.5), 224),
    ("founder-quan-trinh", P / "founders/quan-trinh.png", 1, (0.5, 0.5), 224),
    # --- Testimonials: 3:4 ---
    ("testimonial-flower-shop", P / "testimonials/flower-shop.png", 3 / 4, (0.5, 0.5), 480),
    ("testimonial-bulky-cargo", P / "testimonials/bulky-cargo.png", 3 / 4, (0.5, 0.5), 480),
    ("testimonial-spx", P / "testimonials/cargo-delivery.jpg", 3 / 4, (0.55, 0.5), 480),
    ("testimonial-chemical", P / "testimonials/chemical-delivery.jpg", 3 / 4, (0.4, 0.6), 480),
    ("testimonial-seafood", P / "testimonials/noodle-delivery.jpg", 3 / 4, (0.67, 0.5), 480),
    ("testimonial-ahamove", P / "testimonials/ahamove.png", 3 / 4, (0.5, 0.5), 480),
    # --- Street gallery (marquee): 4:5 ---
    ("street-1", P / "vision-bike/05fabd53-05e4-4768-9312-9dc21096510b.jpg", 4 / 5, (0.6, 0.65), 640),
    ("street-2", P / "cargo-bike/2040dcac-f2b3-4f9a-a092-0ffc063e3dce.jpg", 4 / 5, (0.6, 0.5), 640),
    ("street-3", P / "vision-bike/47dbb18c-172d-4e94-8b9d-b427bda151d5.jpg", 4 / 5, (0.6, 0.7), 640),
    ("street-4", P / "cargo-bike/acf9da64-bfb9-4b88-9719-ef170e7e8bbf.jpg", 4 / 5, (0.5, 0.55), 640),
    ("street-5", P / "vision-bike/24517399-ed46-4463-8dc8-3fab8fa59319.jpg", 4 / 5, (0.5, 0.7), 640),
    ("street-6", P / "cargo-bike/b7b0f441-bcd5-4a20-8467-dcfa8adf707a.jpg", 4 / 5, (0.42, 0.62), 640),
    ("street-7", P / "super-fast-charger/72dcfb54-cd21-4944-acfb-692c4d55d97c.jpg", 4 / 5, (0.5, 0.55), 640),
    ("street-8", P / "cargo-bike/f2c305bf-0163-4752-9c38-2326c0e7d5ea (1).jpg", 4 / 5, (0.45, 0.6), 640),
    # --- Battery workshop (about mosaic) ---
    ("battery-pack", P / "battery/Screenshot 2026-11-10 182428.png", 4 / 5, (0.5, 0.45), 425),
    # --- Charging franchise network ---
    ("network-1", P / "charging-station-franchise-network/82330041-24a2-4adb-af67-b0b2f839ebc5.jpg", 4 / 5, (0.5, 0.6), 800),
    ("network-2", P / "charging-station-franchise-network/f0747376-09cc-452e-9a28-643f1138940b.jpg", 4 / 5, (0.45, 0.45), 800),
    ("network-3", P / "charging-station-franchise-network/7d0644fc-2721-4239-9e30-d09d534c1772.jpg", 4 / 5, (0.5, 0.6), 800),
]


def crop(im, ratio, focal):
    w, h = im.size
    if w / h > ratio:  # too wide -> trim sides
        nw = round(h * ratio)
        left = min(max(round(focal[0] * w - nw / 2), 0), w - nw)
        return im.crop((left, 0, left + nw, h))
    nh = round(w / ratio)
    top = min(max(round(focal[1] * h - nh / 2), 0), h - nh)
    return im.crop((0, top, w, top + nh))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for name, src, ratio, focal, width in JOBS:
        im = ImageOps.exif_transpose(Image.open(src))
        im = im.convert("RGBA" if ratio is None else "RGB")
        if ratio:
            im = crop(im, ratio, focal)
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        dst = OUT / f"{name}.webp"
        im.save(dst, "WEBP", quality=80, method=6)
        total += dst.stat().st_size
        print(f"{dst.name:28s} {im.size} {dst.stat().st_size // 1024} KB")
    print(f"total {total // 1024} KB")


if __name__ == "__main__":
    main()
