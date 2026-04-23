import fitz
import sys
import os

pdf_path = sys.argv[1]
output_dir = sys.argv[2]
os.makedirs(output_dir, exist_ok=True)

try:
    doc = fitz.open(pdf_path)
    count = 0
    for i in range(len(doc)):
        page = doc[i]
        images = page.get_images(full=True)
        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            ext = base_image["ext"]
            # To make it easier for the user to identify, name with page number
            img_name = f"page_{i+1}_img_{img_index + 1}.{ext}"
            with open(os.path.join(output_dir, img_name), "wb") as f:
                f.write(image_bytes)
            count += 1
    print(f"SUCCESS: Extracted {count} images to {output_dir}")
except Exception as e:
    print(f"ERROR: {str(e)}")
