from PIL import Image
import os

def create_icons(source_image_path, output_dir):
    """Convert a source image to Windows icon files"""

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Open the source image
    img = Image.open(source_image_path).convert('RGBA')

    # Define icon sizes needed
    icon_configs = {
        'icon-256.ico': (256, 256),
        'installer-icon.ico': (256, 256),
        'installer-header.ico': (150, 57),
        'uninstaller-icon.ico': (256, 256),
    }

    for filename, size in icon_configs.items():
        # Resize image
        resized = img.resize(size, Image.Resampling.LANCZOS)

        # Save as ICO
        output_path = os.path.join(output_dir, filename)
        resized.save(output_path, 'ICO')
        print(f'Created: {output_path}')

    print('All icons created successfully!')

if __name__ == '__main__':
    # Change these paths as needed
    source = 'diskoh_icon.png'  # Path to your floppy disk image
    output = 'public/icons'

    if not os.path.exists(source):
        print(f'Error: {source} not found!')
        print('Please save your floppy disk image as "diskoh_icon.png" in the project root')
    else:
        create_icons(source, output)
