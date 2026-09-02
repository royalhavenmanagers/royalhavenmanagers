import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH, HEIGHT = 1200, 630

# 1. Create base background image
im = Image.new('RGB', (WIDTH, HEIGHT), color='#08080A')
draw = ImageDraw.Draw(im)

# 2. Draw luxury subtle radial gold glow in the center-left
glow = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
center_x, center_y = 600, 315
for r in range(450, 0, -10):
    alpha = int(24 * (1 - r / 450))
    # Rich warm amber gold glow
    glow_draw.ellipse(
        [center_x - r * 1.5, center_y - r, center_x + r * 1.5, center_y + r],
        fill=(212, 175, 55, alpha)
    )

glow = glow.filter(ImageFilter.GaussianBlur(35))
im.paste(Image.alpha_composite(Image.new('RGBA', (WIDTH, HEIGHT), (8, 8, 10, 255)), glow).convert('RGB'), (0, 0))
draw = ImageDraw.Draw(im)

# 3. Draw dual luxury borders
# Outer border
draw.rectangle([20, 20, WIDTH - 21, HEIGHT - 21], outline='#755418', width=1)
# Inner gold border with corner notches
margin = 32
draw.rectangle([margin, margin, WIDTH - margin, HEIGHT - margin], outline='#D4AF37', width=2)

# Corner accents
corner_size = 18
for cx, cy in [(margin, margin), (WIDTH - margin, margin), (margin, HEIGHT - margin), (WIDTH - margin, HEIGHT - margin)]:
    draw.rectangle([cx - 4, cy - 4, cx + 4, cy + 4], fill='#D4AF37')

# 4. Load & place the transparent emblem logo on the left
logo_path = 'public/images/logo-emblem-transparent.png'
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert('RGBA')
    # Resize keeping aspect ratio
    target_h = 360
    aspect = logo.width / logo.height
    target_w = int(target_h * aspect)
    logo_resized = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    logo_x = 75
    logo_y = (HEIGHT - target_h) // 2
    
    # Paste with transparency mask
    im.paste(logo_resized, (logo_x, logo_y), logo_resized)

# 5. Add Typography on the right
# Find fonts
font_dir = r'C:\Windows\Fonts'
serif_bold = os.path.join(font_dir, 'georgiab.ttf')
serif_regular = os.path.join(font_dir, 'georgia.ttf')
sans_bold = os.path.join(font_dir, 'segoeuib.ttf')
sans_regular = os.path.join(font_dir, 'segoeui.ttf')

f_super = ImageFont.truetype(serif_bold, 54) if os.path.exists(serif_bold) else ImageFont.load_default()
f_sub = ImageFont.truetype(sans_bold, 17) if os.path.exists(sans_bold) else ImageFont.load_default()
f_tagline = ImageFont.truetype(serif_regular, 24) if os.path.exists(serif_regular) else ImageFont.load_default()
f_pill = ImageFont.truetype(sans_bold, 13) if os.path.exists(sans_bold) else ImageFont.load_default()
f_url = ImageFont.truetype(sans_bold, 18) if os.path.exists(sans_bold) else ImageFont.load_default()

text_x = 520
y_cursor = 125

# Small category badge
badge_text = "PREMIER PROPERTY MANAGEMENT & ASSET OVERSIGHT"
draw.rectangle([text_x, y_cursor, text_x + 470, y_cursor + 32], fill='#1E190D', outline='#D4AF37', width=1)
draw.text((text_x + 16, y_cursor + 7), badge_text, fill='#EBD2A0', font=f_pill)

y_cursor += 54

# Main Brand Title
draw.text((text_x, y_cursor), "ROYAL HAVEN", fill='#F7E7CE', font=f_super)

y_cursor += 66
# Subtitle
draw.text((text_x, y_cursor), "REALTY & PROPERTY MANAGERS LTD.", fill='#D4AF37', font=f_sub)

y_cursor += 42
# Separator line
draw.line([text_x, y_cursor, text_x + 580, y_cursor], fill='#755418', width=1)
draw.rectangle([text_x + 270, y_cursor - 3, text_x + 276, y_cursor + 3], fill='#D4AF37')

y_cursor += 28
# Slogan
draw.text((text_x, y_cursor), '"Building Trust. Managing Excellence."', fill='#FFFFFF', font=f_tagline)

y_cursor += 46
# Features bullets
features = [
    "Tenant Screening & Background Vetting",
    "Prompt Rent Remittance & Legal Agreements",
    "Routine Facility Inspection & Maintenance"
]
for feat in features:
    # Gold diamond bullet
    draw.polygon([(text_x + 3, y_cursor + 6), (text_x + 7, y_cursor + 2), (text_x + 11, y_cursor + 6), (text_x + 7, y_cursor + 10)], fill='#D4AF37')
    draw.text((text_x + 22, y_cursor), feat, fill='#CBD5E1', font=f_sub)
    y_cursor += 30

y_cursor += 20
# Location & URL footer strip
draw.text((text_x, y_cursor), "LAGOS STATE & OGUN STATE, NIGERIA", fill='#94A3B8', font=f_pill)
draw.text((WIDTH - margin - 220, y_cursor - 4), "royalhaven.com.ng", fill='#E2BD6B', font=f_url)

# Save output
os.makedirs('public/images', exist_ok=True)
out_path = 'public/images/og-image.jpg'
im.save(out_path, 'JPEG', quality=95)
print(f"Successfully generated Open Graph image at {out_path} ({WIDTH}x{HEIGHT})")
