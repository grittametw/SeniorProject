### Color with Database ###
import cv2
import numpy as np
import time
import mysql.connector

class ColorPicker:
    def __init__(self, image_path):
        # Initialize the ColorPicker object
        self.image_path = image_path
        self.img = cv2.imread(self.image_path)
        self.selected_point = (self.img.shape[1] // 2, self.img.shape[0] // 2)  # Set initial position to center
        self.color_rgb = None
        self.show_window = True

        # Update color code initially
        self.get_color_code()

    def get_color_code(self):
        # Get the color code of the selected point
        if self.selected_point is not None:
            # Convert the image from BGR to HSV
            hsv_img = cv2.cvtColor(self.img, cv2.COLOR_BGR2HSV)

            # Get the color of the selected point
            color = self.img[self.selected_point[1], self.selected_point[0]]

            # Convert BGR to RGB
            self.color_rgb = (color[2], color[1], color[0])

            # Send RGB data to the database
            self.send_to_database()

    def send_to_database(self):
        # Connect to the local database
        db_connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="test_layduna",
        )

        # Create a cursor object to execute queries
        cursor = db_connection.cursor()

        # Convert RGB values to integers
        color_int = tuple(map(int, self.color_rgb))

        # Insert RGB data into the database
        sql = "INSERT INTO users (color_r, color_g, color_b) VALUES (%s, %s, %s)"
        cursor.execute(sql, color_int)

        # Commit the changes
        db_connection.commit()

        # Close the cursor and database connection
        cursor.close()
        db_connection.close()

    def run(self):
        # Run the main loop to display the window and wait for 2 seconds
        start_time = time.time()

        while True:
            img_copy = self.img.copy()

            # Show the fixed center point
            cv2.circle(img_copy, self.selected_point, 4, (0, 255, 0), -1)

            cv2.imshow("Image", img_copy)

            # Wait for a key press
            key = cv2.waitKey(1)

            # Check if 2 seconds have passed and the window is still visible
            if time.time() - start_time >= 2 and self.show_window:
                # Print the final color code in RGB format
                print("Selected Color (RGB):", self.color_rgb)

                self.show_window = False  # Set show_window to False to exit the loop

            # Exit the loop if 'q' key or 'Esc' key is pressed or show_window is False
            if key == ord('q') or key == 27 or not self.show_window:
                break

        # Close the window
        cv2.destroyAllWindows()

if __name__ == "__main__":
    # Change the file Location here !!!
    image_path = r"C:\Github\SeniorProject\views\img\image.png"
    color_picker = ColorPicker(image_path)
    color_picker.run()