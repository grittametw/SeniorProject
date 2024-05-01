### Position with Database ###
import cv2
import numpy as np
import pyrealsense2 as rs
import threading
import time
import mysql.connector

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

def send_to_database(data):
    # Connect to MySQL database
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        database="test_layduna"
    )
    cursor = conn.cursor()

    # Insert data into the database
    query = "INSERT INTO zone(z1_x, z1_y, z1_z, z2_x, z2_y, z2_z, z3_x, z3_y, z3_z, z4_x, z4_y, z4_z, z5_x, z5_y, z5_z, z6_x, z6_y, z6_z) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(query, data)

    # Commit changes and close connection
    conn.commit()
    conn.close()

def data_processing_thread(dc):
    predefined_points = [(320, 290), (320, 250), (260, 290), (380, 290), (320, 365), (320, 350)]
    ret, depth_frame, _, frames = dc.get_frame()
    y_coordinate = predefined_points[0][1]  # Use the Y-coordinate of the first predefined point for alignment

    data = []
    for point in predefined_points:
        depth_value = depth_frame[point[1], point[0]]
        depth_intrin = frames.get_depth_frame().profile.as_video_stream_profile().intrinsics
        depth_point = rs.rs2_deproject_pixel_to_point(
            depth_intrin, [point[0], y_coordinate], depth_value)
        data.extend(depth_point)

    print("Data:", data)
    send_to_database(data)
    time.sleep(1)


# Initialize Camera Intel Realsense
dc = DepthCamera()

# Create and start the data processing thread
data_thread = threading.Thread(target=data_processing_thread, args=(dc,))
data_thread.start()

# Main loop for displaying frames
while True:
    ret, depth_frame, color_frame, _ = dc.get_frame()

    # Define the position of the circle centers
    predefined_points = [(320, 290), (320, 250), (260, 290), (380, 290), (320, 365), (320, 350)]
    colors = [(0, 0, 255), (0, 255, 0), (255, 0, 0), (0, 255, 255), (255, 0, 255), (255, 0, 0)]
    names = ["1", "2", "3", "4", "5", "6"]

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