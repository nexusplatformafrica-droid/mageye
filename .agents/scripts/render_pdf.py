from pathlib import Path

import fitz


pdf_path = Path("attached_assets/website_1789295191430.pdf")
output_dir = Path(".agents/outputs/website-pdf")
output_dir.mkdir(parents=True, exist_ok=True)

document = fitz.open(pdf_path)
for page_number, page in enumerate(document, start=1):
    pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    pixmap.save(output_dir / f"page-{page_number}.png")
    print(f"rendered page {page_number}: {page.rect.width:g}x{page.rect.height:g}")

print(f"pages: {document.page_count}")