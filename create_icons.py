from PIL import Image
import os

def create_pixelated_floppy_icon(size):
    """Create a cute pixelated floppy disk icon matching the retro style"""

    # Create base image with transparency
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    pixels = img.load()

    # Color palette matching the icon
    cyan = (0, 255, 255, 255)
    light_cyan = (100, 255, 255, 255)
    pink = (255, 105, 180, 255)
    magenta = (255, 0, 255, 255)
    purple = (128, 0, 255, 255)
    white = (255, 255, 255, 255)
    black = (0, 0, 0, 255)
    gray = (200, 200, 200, 255)

    # Calculate pixel size for the block grid
    block = size // 16

    # Fill background (gradient simulation with blocks)
    for y in range(size):
        for x in range(size):
            # Gradient from cyan to pink
            t = (x + y) / (2 * size)
            if t < 0.5:
                r = int(0 + (255 - 0) * t * 2)
                g = int(255 - (255 - 105) * t * 2)
                b = int(255 - (255 - 180) * t * 2)
            else:
                r = int(255)
                g = int(105 - (105 - 0) * (t - 0.5) * 2)
                b = int(180 - (180 - 255) * (t - 0.5) * 2)
            pixels[x, y] = (r, g, b, 255)

    # Draw outer border (black outline)
    border = block // 2
    for i in range(size):
        for j in range(border):
            pixels[i, j] = black
            pixels[j, i] = black
            pixels[i, size - 1 - j] = black
            pixels[size - 1 - j, i] = black

    # Draw cyan body
    body_start = block * 2
    body_end = size - block * 2
    for y in range(body_start, body_end):
        for x in range(body_start, body_end):
            pixels[x, y] = cyan

    # Draw top label area (light gray/white)
    label_start = block * 3
    label_end = block * 7
    for y in range(label_start, label_end):
        for x in range(body_start, body_end):
            pixels[x, y] = gray

    # Draw slot area (dark)
    slot_start = block * 4
    slot_end = block * 6
    for y in range(slot_start, slot_end):
        for x in range(block * 10, block * 14):
            pixels[x, y] = (50, 50, 50, 255)

    # Draw face on metal plate
    face_y = block * 9

    # Left eye (large black with white highlight)
    eye_l_x = block * 5
    eye_l_y = block * 9
    eye_size = block

    for dy in range(-eye_size, eye_size):
        for dx in range(-eye_size, eye_size):
            if dx * dx + dy * dy < eye_size * eye_size:
                pixels[eye_l_x + dx, eye_l_y + dy] = magenta

    # Eye highlight
    hl_size = block // 2
    for dy in range(-hl_size, hl_size):
        for dx in range(-hl_size, hl_size):
            if dx * dx + dy * dy < hl_size * hl_size:
                pixels[eye_l_x - block // 2 + dx, eye_l_y - block // 2 + dy] = white

    # Right eye (small winky)
    eye_r_x = block * 11
    draw_pixels_range(pixels, eye_r_x, eye_l_y, block // 2, magenta)

    # Mouth
    mouth_y = block * 11
    draw_smile(pixels, block * 8, mouth_y, block, black)

    # Blush marks (pink)
    blush_color = (255, 150, 200, 255)
    draw_blush(pixels, block * 4, block * 10, blush_color)
    draw_blush(pixels, block * 12, block * 10, blush_color)

    return img

def draw_pixels_range(pixels, cx, cy, size, color):
    """Draw a filled circle of pixels"""
    for dy in range(-size, size):
        for dx in range(-size, size):
            if dx * dx + dy * dy < size * size:
                if 0 <= cx + dx < 256 and 0 <= cy + dy < 256:
                    pixels[cx + dx, cy + dy] = color

def draw_smile(pixels, cx, cy, size, color):
    """Draw a curved smile"""
    for dx in range(-size, size):
        y_offset = int((size * size - dx * dx) ** 0.5) // 2
        for dy in range(y_offset - 2, y_offset + 3):
            if 0 <= cx + dx < 256 and 0 <= cy + dy < 256:
                pixels[cx + dx, cy + dy] = color

def draw_blush(pixels, cx, cy, color):
    """Draw blush marks"""
    size = 4
    for dy in range(-size, size):
        for dx in range(-size, size):
            if dx * dx + dy * dy < size * size * 2:
                if 0 <= cx + dx < 256 and 0 <= cy + dy < 256:
                    pixels[cx + dx, cy + dy] = color

def create_all_icons():
    """Create all necessary icon files"""
    icons_dir = 'public/icons'
    os.makedirs(icons_dir, exist_ok=True)

    icon_configs = {
        'icon-256.ico': 256,
        'installer-icon.ico': 256,
        'uninstaller-icon.ico': 256,
    }

    print('Creating pixelated floppy disk icons...')

    for filename, size in icon_configs.items():
        print(f'  Creating {filename} ({size}x{size})...')
        img = create_pixelated_floppy_icon(size)
        output_path = os.path.join(icons_dir, filename)
        img.save(output_path, 'ICO')
        print(f'    * {output_path}')

    # Create installer header
    print(f'  Creating installer-header.ico (150x57)...')
    header = Image.new('RGBA', (150, 57), (100, 200, 255, 255))
    header_path = os.path.join(icons_dir, 'installer-header.ico')
    header.save(header_path, 'ICO')
    print(f'    * {header_path}')

    print('\nAll icons created!\n')

if __name__ == '__main__':
    create_all_icons()
