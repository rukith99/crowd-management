import joblib
import pandas as pd
import random
import os

# Define the path to the models folder
models_path = 'models/'

# Load the models from the joblib files in the specified folder
models = {
    'Fatalities': joblib.load(os.path.join(models_path, 'Fatalities_model.joblib')),
    'Injured': joblib.load(os.path.join(models_path, 'Injured_model.joblib')),
    'entrance': joblib.load(os.path.join(models_path, 'entrance_model.joblib')),
    'exit': joblib.load(os.path.join(models_path, 'exit_model.joblib')),
    'A': joblib.load(os.path.join(models_path, 'A_model.joblib')),
    'B': joblib.load(os.path.join(models_path, 'B_model.joblib')),
    'other': joblib.load(os.path.join(models_path, 'other_model.joblib')),
}

# Define the input data
# input_data = {
#     'Month': [9],
#     'Year': [2024],
#     'Country': [70],
#     'Purpose of gathering': [0],
#     'Crowd size': [10000]
# }

class Prediction:
    def __init__(self):
        pass
    
    def predict_targets(self,input_data):
        input_df = pd.DataFrame(input_data)

        predictions = {}
        for target in models.keys():
            predictions[target] = float(models[target].predict(input_df)[0]) 


        # Output the predictions
        return predictions
