"""Gera as imagens da página (WebP leve) a partir do material Rota PRF 2027.

Uso: python tools/montar-imagens.py
Origem: prévias PNG em CODEX/.../outputs e capas em D:/acer nitro/CONCURSO/PRF/ENTREGAVEL/Capas.
"""
import glob
import os
import shutil

from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(RAIZ, "assets", "img")
OUT = "C:/Users/Rafael/Documents/CODEX/2026-10-31/aqu/outputs"
CAPAS = "D:/acer nitro/CONCURSO/PRF/ENTREGAVEL/Capas"

# Ordem dos 15 módulos (igual aos PDFs numerados da entrega)
MODULOS = [
    ("Transito_108", "Trânsito"), ("Portugues_48", "Português e Redação Oficial"),
    ("Administrativo_28", "Direito Administrativo"), ("Constitucional_28", "Direito Constitucional"),
    ("Penal_26", "Direito Penal"), ("Processual_24", "Direito Processual Penal"),
    ("Especial_30", "Legislação Especial"), ("Humanos_16", "Direitos Humanos"),
    ("RLM_21", "Raciocínio Lógico-Matemático"), ("Informatica_20", "Informática"),
    ("Fisica_19", "Física"), ("Etica_12", "Ética e Cidadania"),
    ("Geopolitica_12", "Geopolítica"), ("Ingles_14", "Inglês"), ("Espanhol_14", "Espanhol"),
]

# Mapas da galeria: (módulo, posição na pasta de prévias, começando em 0)
GALERIA = [
    ("Transito_108", 0), ("Portugues_48", 5), ("Constitucional_28", 0), ("Transito_108", 86),
    ("Penal_26", 3), ("Administrativo_28", 0), ("Processual_24", 2), ("Transito_108", 69),
    ("Especial_30", 0), ("Fisica_19", 2), ("Informatica_20", 5), ("Humanos_16", 1),
    ("RLM_21", 3), ("Transito_108", 30), ("Etica_12", 0), ("Geopolitica_12", 2),
    ("Ingles_14", 0), ("Espanhol_14", 0),
]


def previas(mod):
    return sorted(glob.glob(f"{OUT}/PRF_{mod}_Previas/*.png"))


def salvar(src, nome, largura, q=78):
    im = Image.open(src).convert("RGB")
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    im.save(os.path.join(DEST, nome), "WEBP", quality=q, method=6)
    return im


def og_image():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), "#000D4B")
    d = ImageDraw.Draw(img)
    # faixa central de rodovia
    for x in range(0, W, 70):
        d.rectangle([x, H - 40, x + 40, H - 30], fill="#FFC900")
    capa = Image.open(f"{CAPAS}/01-Capa PRF em destaque.png").convert("RGB")
    capa = capa.resize((360, round(capa.height * 360 / capa.width)), Image.LANCZOS)
    mapa = Image.open(previas("Transito_108")[13]).convert("RGB")
    mapa = mapa.resize((300, round(mapa.height * 300 / mapa.width)), Image.LANCZOS)
    img.paste(mapa.rotate(-6, expand=True, fillcolor="#000D4B"), (860, 40))
    img.paste(capa, (700, 45))
    try:
        f1 = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 64)
        f2 = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 34)
    except OSError:
        f1 = f2 = ImageFont.load_default()
    d.text((60, 150), "Resumos e Esquemas", font=f1, fill="white")
    d.text((60, 225), "PRF 2027", font=f1, fill="#FFC900")
    d.text((60, 330), "420 mapas visuais", font=f2, fill="white")
    d.text((60, 375), "15 módulos do edital", font=f2, fill="white")
    d.text((60, 420), "Bizus e pegadinhas da banca", font=f2, fill="white")
    img.save(os.path.join(DEST, "og-image.jpg"), quality=85)


def main():
    os.makedirs(DEST, exist_ok=True)
    for i, (mod, pos) in enumerate(GALERIA, 1):
        salvar(previas(mod)[pos], f"mapa-{i:02d}.webp", 760)
    for i, (mod, _) in enumerate(MODULOS, 1):
        salvar(previas(mod)[0], f"modulo-{i:02d}.webp", 420, q=72)
    salvar(previas("Transito_108")[13], "mapa-velocidades.webp", 1100, q=82)
    salvar(f"{CAPAS}/01-Capa PRF em destaque.png", "capa.webp", 820, q=82)
    salvar(f"{CAPAS}/Com policiais/03-Rota PRF 2027 policiais post-it amarelo.png", "capa-2.webp", 700)
    salvar(f"{CAPAS}/02-Capa Rota 2027 em destaque.png", "capa-3.webp", 700)
    shutil.copy(f"{OUT}/Logo_Rota_PRF_2027_v6.svg", os.path.join(DEST, "logo.svg"))
    og_image()
    total = sum(os.path.getsize(os.path.join(DEST, f)) for f in os.listdir(DEST))
    print(f"ok: {len(os.listdir(DEST))} arquivos, {total / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()
