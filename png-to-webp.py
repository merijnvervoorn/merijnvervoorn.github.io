import sys
import os
from PIL import Image

def get_output_details(input_path):
    """Determines the output path, directory, and target width based on JS rules."""
    dir_path, filename = os.path.split(input_path)
    parent_dir = os.path.basename(dir_path)
    base_name = os.path.splitext(filename)[0]
    
    # Match the routing logic from your JavaScript file
    if parent_dir == 'image' or parent_dir == 'projects':
        suffix = "-800"
        target_width = 800
    elif parent_dir == 'logo':
        if 'logo-zen' in base_name:
            suffix = "-200"
            target_width = 200
        else:
            suffix = "-400"
            target_width = 400
    elif parent_dir == 'shape':
        suffix = "-200"
        target_width = 200
    else:
        # Fallback if run on an unknown folder
        suffix = "-800"
        target_width = 800

    # Output directory is an 'optimized' folder inside the current image directory
    output_dir = os.path.join(dir_path, 'optimized')
    output_filename = f"{base_name}{suffix}.webp"
    output_path = os.path.join(output_dir, output_filename)
    
    return output_path, output_dir, target_width

def convert_to_webp(input_path):
    try:
        output_path, output_dir, target_width = get_output_details(input_path)
        
        # Create the 'optimized' subdirectory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)

        image = Image.open(input_path)
        
        # Resize image to match the target width, keeping aspect ratio intact
        if target_width and image.width > target_width:
            ratio = target_width / image.width
            target_height = int(image.height * ratio)
            # Use LANCZOS for high-quality downsampling
            image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
            
        # Save as WebP with an optimized quality setting
        image.save(output_path, 'webp', quality=85)
        print(f"Success: Saved as {output_path}")
        
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 convert_to_webp.py <path_to_png_file_or_directory>")
        sys.exit(1)

    input_path = sys.argv[1]
    
    # Strip trailing slashes to ensure path parsing works correctly
    input_path = input_path.rstrip('/\\')

    if os.path.isfile(input_path) and input_path.lower().endswith('.png'):
        convert_to_webp(input_path)
    elif os.path.isdir(input_path):
        found_png = False
        for filename in os.listdir(input_path):
            if filename.lower().endswith('.png'):
                found_png = True
                full_input_path = os.path.join(input_path, filename)
                convert_to_webp(full_input_path)
        if not found_png:
            print(f"No PNG files found in directory: {input_path}")
    else:
        print("Error: The specified path is neither a PNG file nor a directory.")

if __name__ == "__main__":
    main()