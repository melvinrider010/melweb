import subprocess
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageFilter
import time

def main():
    start_time = time.time()
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    input_file = "public/assets/videos/site-loader.mp4"
    output_webm = "public/assets/videos/site-loader-transparent.webm"
    
    width = 1280
    height = 720
    fps = 24
    frame_bytes_rgb = width * height * 3
    frame_bytes_rgba = width * height * 4
    
    print("Starting video processing with true alpha channel...")
    
    # Decoder process: reads raw rgb24 from source video
    decoder = subprocess.Popen([
        ffmpeg_exe,
        "-i", input_file,
        "-f", "image2pipe",
        "-pix_fmt", "rgb24",
        "-vcodec", "rawvideo",
        "-"
    ], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    
    # Encoder process: encodes raw rgba into WebM with VP9 alpha (yuva420p)
    # -auto-alt-ref 0 is critical for WebM alpha support in browsers
    encoder = subprocess.Popen([
        ffmpeg_exe,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{width}x{height}",
        "-pix_fmt", "rgba",
        "-r", str(fps),
        "-i", "-",
        "-c:v", "libvpx-vp9",
        "-pix_fmt", "yuva420p",
        "-auto-alt-ref", "0",
        "-b:v", "1800k",
        "-lossless", "0",
        "-an",
        output_webm
    ], stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    
    frame_count = 0
    
    while True:
        raw_rgb = decoder.stdout.read(frame_bytes_rgb)
        if len(raw_rgb) < frame_bytes_rgb:
            break
            
        arr = np.frombuffer(raw_rgb, dtype=np.uint8).reshape((height, width, 3))
        
        # Calculate color metrics
        max_c = np.maximum(arr[:,:,0], np.maximum(arr[:,:,1], arr[:,:,2]))
        min_c = np.minimum(arr[:,:,0], np.minimum(arr[:,:,1], arr[:,:,2]))
        sat = max_c.astype(int) - min_c.astype(int)
        
        # Checkerboard is neutral and bright:
        # Squares are ~225 and ~250, sat < 16, min_c > 190
        is_checkerboard = (min_c > 190) & (sat < 16)
        
        # Create alpha: 0 for checkerboard, 255 for coin
        alpha = np.where(is_checkerboard, 0, 255).astype(np.uint8)
        
        # Smooth antialiased boundary: radius 0.6 Gaussian blur
        alpha_img = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(radius=0.6))
        alpha_smooth = np.array(alpha_img)
        
        # Combine into RGBA
        rgba = np.dstack([arr, alpha_smooth])
        
        # Write to encoder
        encoder.stdin.write(rgba.tobytes())
        frame_count += 1
        if frame_count % 30 == 0:
            print(f"Processed {frame_count} frames...")
            
    decoder.stdout.close()
    decoder.wait()
    encoder.stdin.close()
    encoder.wait()
    
    elapsed = time.time() - start_time
    print(f"Finished {frame_count} frames in {elapsed:.2f}s. Saved to {output_webm}")

if __name__ == "__main__":
    main()
