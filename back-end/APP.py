import os
import json
from support import Support
from service import Service
from prediction import Prediction
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS

support_instance = Support()
service_instance = Service()
prediction_instance = Prediction()

# Configure Flask to serve static files from 'heatmap' directory at '/heatmap' URL
app = Flask(__name__, static_folder='heatmap', static_url_path='/heatmap')
CORS(app)

UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_inputs(data):
    required_fields = [
        'user_input_country', 'user_input_event_type', 'user_input_month',
        'user_input_year', 'user_input_crowd_size', 'user_input_entrance_symbol',
        'user_input_exit_symbol', 'user_input_area_A', 'user_input_area_B',
        'user_input_other', 'user_input_description'
    ]

    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        return False, f"Missing fields: {', '.join(missing_fields)}"
    try:
        crowd_size = int(data['user_input_crowd_size'])
        if crowd_size <= 0:
            return False, "Crowd size must be a positive integer."
    except ValueError:
        return False, "Invalid crowd size. It must be an integer."
    return True, None

def clear_upload_folder():
    """Deletes all files in the upload directory."""
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')

def run(form_data):
    crowd_count = form_data['user_input_crowd_size']
    country = form_data['user_input_country']
    event_type = form_data['user_input_event_type']
    description = form_data['user_input_description']
    # Assuming 'user_input_weather' is not used; remove if unnecessary
    # weather = form_data['user_input_weather']

    country_en, event_en = support_instance.encode_input(country, event_type)

    input_data = {
        'Month': [form_data['user_input_month']],
        'Year': [form_data['user_input_year']],
        'Country': [country_en],
        'Purpose of gathering': [event_en],
        'Crowd size': [form_data['user_input_crowd_size']]
    }
    crowd_count = int(crowd_count)
    prediction = prediction_instance.predict_targets(input_data)

    # Initialize 'validator' inside the function
    validator = crowd_count <= 7000

    prediction_dict = {
        'Fatalities': prediction['Fatalities'],
        'Injured': prediction['Injured'],
        form_data['user_input_entrance_symbol']: prediction['entrance'],
        form_data['user_input_exit_symbol']: prediction['exit'],
        form_data['user_input_area_A']: prediction['A'],
        form_data['user_input_area_B']: prediction['B'],
        form_data['user_input_other']: prediction['other']
    }
    try:
        # Step 1: Generate density array
        density_array = support_instance.make_denstiy_rate(prediction_dict)
        if not density_array:
            return jsonify({"error": "Density array is invalid or empty"}), 400
        print('a1')

        # Step 2: Extract OCR results
        extracted_results = service_instance.extract_ocr()
        if not extracted_results:
            return jsonify({"error": "Feature Extraction Failed"}), 400
        print('a2')

        # Step 3: Filter common entries between OCR and density array
        final_array = support_instance.filter_common_entries(extracted_results, density_array)
        if not final_array:
            return jsonify({"error": "Failed to filter common entries or no matching entries found"}), 400
        print('a3')

        # Step 4: Plot heat map and get the filename
        heatmap_filename = service_instance.plot_heat_map(final_array)
        if not heatmap_filename:
            return jsonify({"error": "Heat map generation failed"}), 500
        print('a4')

        # Step 5: Process outcomes
        content_array = support_instance.process_outcomes(prediction_dict, country, crowd_count, event_type)
        if not content_array:
            return jsonify({"error": "Outcome processing failed or returned invalid data"}), 400
        print('a5')

        # Step 6: Generate suggestions based on processed content
        suggestions = service_instance.generate_suggestions(content_array, description)
        if not suggestions:
            return jsonify({"error": "Suggestion generation failed or returned empty results"}), 400
        print('a6')

        # Step 7: Prepare final return array
        if validator:
            prediction_list = support_instance.split_number_to_parts(crowd_count)
            return_array = [prediction_list, suggestions, heatmap_filename]
            return return_array  # Return success result in JSON format

        return_array = [content_array[0], suggestions, heatmap_filename]
        return return_array  # Return success result in JSON format

    except Exception as e:
        return json.dumps({"error": str(e)})

@app.route('/')
def test():
    x = 200
    return jsonify({"Success": x}), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    clear_upload_folder()
    try:
        # Extract form data
        form_data = {
            'user_input_country': request.form.get('user_input_country'),
            'user_input_event_type': request.form.get('user_input_event_type'),
            'user_input_month': request.form.get('user_input_month'),
            'user_input_year': request.form.get('user_input_year'),
            'user_input_crowd_size': request.form.get('user_input_crowd_size'),
            'user_input_entrance_symbol': request.form.get('user_input_entrance_symbol'),
            'user_input_exit_symbol': request.form.get('user_input_exit_symbol'),
            'user_input_area_A': request.form.get('user_input_area_A'),
            'user_input_area_B': request.form.get('user_input_area_B'),
            'user_input_other': request.form.get('user_input_other'),
            'user_input_description': request.form.get('user_input_description'),
            # 'user_input_weather': request.form.get('user_input_weather')  # Uncomment if used
        }

        is_valid, error_message = validate_inputs(form_data)
        if not is_valid:
            return jsonify({'error': error_message}), 400

        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({'error': 'No selected image file'}), 400

        if file and allowed_file(file.filename):
            ext = file.filename.rsplit('.', 1)[1].lower()
            new_fileName = f"plan_1111.{ext}"

            filename = secure_filename(new_fileName)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            result = run(form_data)
            if isinstance(result, tuple) and len(result) == 2 and isinstance(result[0], dict) and 'error' in result[0]:
                # If 'run' returned an error response
                return result

            predictions = result[0]
            suggestions = result[1]
            heatmap_filename = result[2]

            # Construct HeatmapImageUrl
            HeatmapImageUrl = f'/heatmap/{heatmap_filename}'

            return jsonify({
                'Status': 'Success',
                'Predictions': predictions,
                'Suggestions': suggestions,
                'HeatmapImageUrl': HeatmapImageUrl,
            }), 200
        else:
            clear_upload_folder()
            return jsonify({'error': 'File type not allowed'}), 400
    except Exception as e:
        clear_upload_folder()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
