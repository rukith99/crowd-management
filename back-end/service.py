import os
import cv2
import easyocr
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib as mpl
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import google.generativeai as genai
from matplotlib.colors import Normalize
import gc
gc.collect()

load_dotenv()

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

upload_folder = "uploads"

class Service:
    def __init__(self):
        pass

    def extract_ocr(self):
        files = os.listdir(upload_folder)

        if len(files) == 0:
            print("No files found in the uploads folder.")
            return None
        else:
            plan_path = os.path.join(upload_folder, files[0])
            image = cv2.imread(plan_path)

            if image is not None:
                print("Image loaded successfully.")
            else:
                print("Failed to load the image.")
                return None
        try:
            reader = easyocr.Reader(['en'])
            results = reader.readtext(image)
            return results
        except Exception as e:
            return {'error': f'{str(e)}'}

    def plot_heat_map(self, data):
        files = os.listdir(upload_folder)

        if len(files) == 0:
            print("No files found in the uploads folder.")
            return None
        else:
            plan_path = os.path.join(upload_folder, files[0])
            image = cv2.imread(plan_path)

            if image is not None:
                print("Image loaded successfully.")
            else:
                print("Failed to load the image.")
                return None

        low_density_threshold = 0.01

        def enlarge_bbox_to_square(bbox, scale=1.5):
            center = np.mean(bbox, axis=0)
            width = np.max(bbox[:, 0]) - np.min(bbox[:, 0])
            height = np.max(bbox[:, 1]) - np.min(bbox[:, 1])
            max_side = max(width, height) * scale
            enlarged_bbox = np.array([
                [center[0] - max_side / 2, center[1] - max_side / 2],
                [center[0] + max_side / 2, center[1] - max_side / 2],
                [center[0] + max_side / 2, center[1] + max_side / 2],
                [center[0] - max_side / 2, center[1] + max_side / 2]
            ])
            return enlarged_bbox.astype(np.int32)

        if not data:
            print("No data provided to plot.")
            return None

        converted_array = [
            (bbox, label, np.float64(density))
            for bbox, label, density in data
        ]
        transparent_layer = np.zeros_like(image, dtype=np.uint8)
        densities = [density for _, _, density in converted_array]

        if not densities:
            print("No densities available for plotting.")
            return None

        max_density = max(densities)
        min_density = min(densities)
        adjusted_min_density = max(min_density, low_density_threshold)

        for (bbox, text, density) in converted_array:
            enlarged_bbox = enlarge_bbox_to_square(np.array(bbox), scale=5.0)
            denominator = max_density - adjusted_min_density
            if denominator == 0:
                red_intensity = 255
            else:
                red_intensity = int(255 * (1 - (density - adjusted_min_density) / denominator))
            red_intensity = max(0, min(255, red_intensity))
            rgb_color = [0, 0, red_intensity]
            cv2.fillPoly(transparent_layer, [enlarged_bbox], rgb_color)

        blurred_layer = cv2.GaussianBlur(transparent_layer, (151, 151), 0)
        alpha = 0.6
        output_image = cv2.addWeighted(blurred_layer, alpha, image, 1 - alpha, 0)

        output_dir = 'heatmap'
        os.makedirs(output_dir, exist_ok=True)
        files = os.listdir(output_dir)
        x = len(files)
        print(x)

        number = x
        filename = f"{number:04d}.jpg"
        output_path = os.path.join(output_dir, filename)

        fig, ax = plt.subplots(figsize=(10, 10))
        ax.imshow(cv2.cvtColor(output_image, cv2.COLOR_BGR2RGB))
        ax.axis('off')
        norm = mpl.colors.Normalize(vmin=adjusted_min_density, vmax=max_density)
        cmap = mpl.cm.Reds
        cbar = fig.colorbar(
            mpl.cm.ScalarMappable(norm=norm, cmap=cmap),
            ax=ax,
            orientation='vertical',
            fraction=0.046, pad=0.04
        )
        cbar.set_label('Density range', rotation=270, labelpad=15)

        plt.savefig(output_path, bbox_inches='tight', pad_inches=0.1)
        plt.close('all')
        print(f"Heatmap saved as {output_path}")

        return filename  # Return the filename of the generated heatmap image

    def generate_suggestions(self, content_array, description):
        # content_array: [[3, 10.4, 1368, 3710, 1575, 1782, 1565], 'USA', '5000', 'Sport']

        event_content = f"""This is a {description} {content_array[3]} event in {content_array[1]}. Where {content_array[2]} people participated.
        In here {content_array[0][0]} fatalities and {content_array[0][1]} injuries reported.
        To the entrance, exit, stadium, ground and exit people have gathered according to these counts respectively. {content_array[0][2]}, {content_array[0][3]}, {content_array[0][4]}, {content_array[0][5]}, {content_array[0][6]}."""

        llm_system_role = "As a helpful chatbot, your role is to analyze event crowd management. Given Event content has details related to the event, understand and analyze those data very well."

        query = "Give detailed suggestions with examples from Event content numbers, to manage the crowd and avoid unnecessary situations."

        prompt = f"Your role: {llm_system_role}\n\nEvent content: {event_content}\n\nUser's query: {query}"

        genai.configure(api_key=GOOGLE_API_KEY)
        model = genai.GenerativeModel()
        req = prompt
        response = model.generate_content(req)
        res = response.text

        max_tokens = 180  # You can adjust this value
        tokens = res.split()
        truncated_tokens = tokens[:max_tokens]
        limited_response = ' '.join(truncated_tokens)

        return res
