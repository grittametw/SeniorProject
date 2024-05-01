import cv2
import numpy as np
import pyrealsense2 as rs
import threading
import time

class DepthCamera:
    def __init__(self):
        self.pipeline = rs.pipeline()
        config = rs.config()
        pipeline_wrapper = rs.pipeline_wrapper(self.pipeline)
        pipeline_profile = config.resolve(pipeline_wrapper)
        device = pipeline_profile.get_device()
        device_product_line = str(device.get_info(rs.camera_info.product_line))

        config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)
        config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)

        self.pipeline.start(config)
        self.align_to = rs.stream.color
        self.align = rs.align(self.align_to)

    def get_frame(self):
        frames = self.pipeline.wait_for_frames(timeout_ms=5000)
        aligned_frames = self.align.process(frames)
        depth_frame = aligned_frames.get_depth_frame()
        color_frame = aligned_frames.get_color_frame()

        if not depth_frame or not color_frame:
            print("Frame didn't arrive in 5000 milliseconds")
            return False, None, None

        depth_image = np.asanyarray(depth_frame.get_data())
        color_image = np.asanyarray(color_frame.get_data())
        return True, depth_image, color_image, frames

    def release(self):
        self.pipeline.stop()

def data_processing_thread(dc):
    predefined_points = [(320, 290), (320, 250), (260, 290), (380, 290), (320, 365), (320, 350)]
    zone_names = ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6"]

    ret, depth_frame, color_frame, frames = dc.get_frame()

    for point, zone_name in zip(predefined_points, zone_names):
        depth_value = depth_frame[point[1], point[0]]
        depth_intrin = frames.get_depth_frame().profile.as_video_stream_profile().intrinsics
        depth_point = rs.rs2_deproject_pixel_to_point(
            depth_intrin, [point[0], point[1]], depth_value)  # Use the Y-coordinate of the point itself
        
        print("{} : X: {:.2f} mm, Y: {:.2f} mm, Z: {:.2f} mm".format(zone_name, depth_point[0], depth_point[1], depth_point[2]))

    time.sleep(1)


# Initialize Camera Intel Realsense
dc = DepthCamera()

# Create and start the data processing thread
data_thread = threading.Thread(target=data_processing_thread, args=(dc,))
data_thread.start()

# Main loop for displaying frames
while True:
    ret, depth_frame, color_frame, _ = dc.get_frame()

    # Get image dimensions
    image_height, image_width = color_frame.shape[:2]

    # Calculate center position
    center_x = image_width // 2
    center_y = image_height // 2

    # Define the position of the circle centers
    predefined_points = [(320, 290), (320, 200), (260, 290), (380, 290), (320, 365), (320, 350)] # เพิ่ม (center_x, center_y) ที่นี่ด้วย
    colors = [(0, 0, 255), (0, 255, 0), (255, 0, 0), (0, 255, 255), (255, 0, 255), (255, 0, 0)] # เพิ่มสีสำหรับจุดใหม่
    names = ["1", "2", "3", "4", "5", "6"] # เพิ่มข้อความสำหรับจุดใหม่

    # Draw circles on the color frame for each predefined point
    for point, color, color_name in zip(predefined_points, colors, names):
        cv2.circle(color_frame, point, 4, color, -1)
        # Calculate text position to align it with the circle
        text_position = (point[0] - 8, point[1] - 20)  # Adjust according to your preference
        # Add text to indicate the color
        cv2.putText(color_frame, color_name, text_position, cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    cv2.imshow("Color frame", color_frame)

    key = cv2.waitKey(1)
    if key == 27 or key == ord('q'):
        break


# Release resources
dc.release()
data_thread.join()
cv2.destroyAllWindows()