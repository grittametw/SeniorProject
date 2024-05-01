### Photo ###
import cv2
import numpy as np
import pyrealsense2 as rs
import time
import os

def capture_image_and_save(output_directory):
    # Initialize the RealSense pipeline
    pipeline = rs.pipeline()
    config = rs.config()
    config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)

    # Start streaming
    pipeline.start(config)

    try:
        # Allow the camera to stabilize for a moment
        time.sleep(1)

        # Capture a few frames to ensure the camera is properly initialized
        for i in range(10):
            frames = pipeline.wait_for_frames()
        
        # Get a color frame
        color_frame = frames.get_color_frame()
        color_image = np.asanyarray(color_frame.get_data())

        # Display the color frame
        cv2.imshow("Color Frame", color_image)
        cv2.waitKey(500)  # Wait for 500 milliseconds

        # Capture another frame after the delay
        frames = pipeline.wait_for_frames()
        color_frame = frames.get_color_frame()
        color_image = np.asanyarray(color_frame.get_data())

        # Save the captured image as PNG with name "image.png"
        output_path = os.path.join(output_directory, "image.png")
        cv2.imwrite(output_path, color_image, [cv2.IMWRITE_PNG_COMPRESSION, 0])  # Save as PNG with no compression
        print(f"Image saved to: {output_path}")

    finally:
        # Stop streaming
        pipeline.stop()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    # Example usage with specified output directory
    output_directory = r"C:\Github\SeniorProject\views\img"
    os.makedirs(output_directory, exist_ok=True)
    
    capture_image_and_save(output_directory)