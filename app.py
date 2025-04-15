import pickle
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler
import numpy as np

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app, resources={r"/api/*": {"origins": "*"}})

with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)
with open('scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

@app.route('/')
def serve_index():
    return render_template('index.html')
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = [
            "latitude", "longitude", "elevation", 
            "temperature", "humidity", "windSpeed", 
            "solarRadiation", "area", "energy_consumption"
        ]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        features = [
            data['latitude'], data['longitude'], data['elevation'],
            data['temperature'], data['humidity'], data['windSpeed'],
            data['solarRadiation'], data['area'], data['energy_consumption']
        ]
        features_scaled = scaler.transform([features])
        prediction = model.predict(features_scaled)
        energyGeneration = np.random.uniform(0, 100, 12).tolist()
        roiProjection = np.random.uniform(0, 30, 5).tolist()

        strategies = [
            "Increase solar panel efficiency",
            "Optimize storage solutions",
            "Enhance energy forecasting"
        ]
        return jsonify({
            "energy_consumption_prediction": prediction[0],
            "strategies": strategies,
            "energyGeneration": energyGeneration,
            "roiProjection": roiProjection,
            "latitude": data["latitude"],
            "longitude": data["longitude"]
        })

    except Exception as e:
        print("Error during prediction:", str(e))
        return jsonify({"error": "An error occurred during prediction"}), 500

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)