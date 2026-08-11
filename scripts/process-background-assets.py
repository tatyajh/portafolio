#!/usr/bin/env python3
"""
Processes the raw decorative icon PNGs in src/assets/{folder}/ (white
background, uncropped) into transparent, content-trimmed PNGs in
public/media/background/{category}/. Rerun after adding new numbered
files to any src/assets/{folder}/ source directory.
"""
import os
from PIL import Image, ImageDraw

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
SRC_ASSETS = os.path.join(REPO_ROOT, 'src', 'assets')
OUT_ROOT = os.path.join(REPO_ROOT, 'public', 'media', 'background')

# folder en src/assets -> category (coincide con BackgroundAsset['category']
# en src/lib/backgroundAssets.ts)
FOLDER_TO_CATEGORY = {
    'agujas': 'aguja',
    'carretes': 'carrete',
    'codigo': 'codigo',
    'controles': 'gamepad',
    'Figuras musicales': 'nota',
    'hilos': 'hilo',
    'maniquis': 'patron',  # antes 'patrones' — la categoría interna sigue llamándose 'patron', solo cambió el arte
    'saxofones': 'saxofon',
    'tijeras': 'tijeras',
}

WHITE_THRESHOLD = 235  # tolerancia para considerar un pixel "fondo blanco"


def remove_white_background(im: Image.Image) -> Image.Image:
    im = im.convert('RGBA')
    w, h = im.size
    ImageDraw.floodfill(im, (0, 0), (0, 0, 0, 0), thresh=255 - WHITE_THRESHOLD)
    ImageDraw.floodfill(im, (w - 1, 0), (0, 0, 0, 0), thresh=255 - WHITE_THRESHOLD)
    ImageDraw.floodfill(im, (0, h - 1), (0, 0, 0, 0), thresh=255 - WHITE_THRESHOLD)
    ImageDraw.floodfill(im, (w - 1, h - 1), (0, 0, 0, 0), thresh=255 - WHITE_THRESHOLD)
    return im


def process_folder(folder: str, category: str) -> int:
    src_dir = os.path.join(SRC_ASSETS, folder)
    out_dir = os.path.join(OUT_ROOT, category)
    os.makedirs(out_dir, exist_ok=True)

    expected_names = set()
    for fname in sorted(os.listdir(src_dir)):
        name, ext = os.path.splitext(fname)
        if ext.lower() != '.png' or not name.isdigit():
            continue  # salta el atlas (nombre no numérico)

        im = Image.open(os.path.join(src_dir, fname))
        im = remove_white_background(im)
        bbox = im.getbbox()
        if bbox:
            im = im.crop(bbox)
        im.save(os.path.join(out_dir, fname))
        expected_names.add(fname)

    # Limpia huérfanos: si se borró un número de src/assets/{folder}/
    # (o cambió de nombre), el .png procesado de esa vez se quedaba
    # aquí para siempre — el script solo escribía, nunca borraba.
    # Sucedió de verdad: al actualizar las imágenes se redujeron
    # carretes/controles/codigo y quedaron archivos de calidad vieja
    # sueltos en public/ que el sitio seguía usando.
    removed = []
    for existing in os.listdir(out_dir):
        if existing not in expected_names:
            os.remove(os.path.join(out_dir, existing))
            removed.append(existing)
    if removed:
        print(f'  (limpiados {len(removed)} huérfanos en {category}: {", ".join(sorted(removed))})')

    return len(expected_names)


def main():
    total = 0
    for folder, category in FOLDER_TO_CATEGORY.items():
        n = process_folder(folder, category)
        print(f'{folder} -> {category}: {n} archivos')
        total += n
    print(f'Total: {total} archivos procesados en {OUT_ROOT}')


if __name__ == '__main__':
    main()
