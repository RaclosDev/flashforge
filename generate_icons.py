from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    # Create an image with solid background
    img = Image.new('RGB', (size, size), color=(15, 23, 42)) # var(--bg-color) = #0f172a
    draw = ImageDraw.Draw(img)
    
    # Try to load a font, otherwise use default
    font = None
    try:
        # Load a truetype font, adjust path as necessary for windows
        font = ImageFont.truetype("arialbd.ttf", int(size * 0.6))
    except:
        font = ImageFont.load_default()
    
    # Draw 'F' in the center
    text = "F"
    
    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) / 2
    y = (size - text_height) / 2 - (size * 0.1) # adjust y slightly up
    
    # Draw text in primary color
    draw.text((x, y), text, fill=(59, 130, 246), font=font) # var(--accent-color) = #3b82f6
    
    img.save(output_path)
    print(f"Saved {output_path}")

def main():
    public_dir = r"C:\Users\raclo\.gemini\antigravity-ide\scratch\flashforge\public"
    create_icon(192, os.path.join(public_dir, "flashforge-icon-192.png"))
    create_icon(512, os.path.join(public_dir, "flashforge-icon-512.png"))

if __name__ == "__main__":
    main()
