# ⚡ AI Energy Prediction Project

This project is designed to predict energy consumption or production using machine learning models based on synthetic data. It features a complete stack with a Python Flask backend and a HTML/CSS/JS frontend.

---

## 📁 Project Structure

```
AI_PROJECT/
├── BackEnd/
│   ├── __pycache__/
│   ├── app.py                  # Flask API to serve the models
│   ├── generate_data.py        # Script to generate synthetic energy data
│   ├── model.pkl               # Main ML model (could be a default model)
│   ├── rf_model.pkl            # Random Forest model
│   ├── ridge_model.pkl         # Ridge Regression model
│   ├── scaler.pkl              # Scaler object for preprocessing
│   ├── synthetic_data.csv      # Generated synthetic data
│   ├── target.csv              # Target values for training
│   └── train_model.py          # Training script for the models
├── FrontEnd/
│   ├── index.html              # Main frontend HTML file
│   ├── script.js               # JavaScript to interact with the Flask API
│   └── style.css               # Styling for the web interface
├── .gitignore                  # Ignore files and directories
├── README.md                   # This README file
```

---

## 🚀 Features

- 🔢 Generates and trains on synthetic energy consumption/production data.
- 🧠 Multiple ML models: Random Forest, Ridge Regression.
- 🌐 Full-stack integration using Flask API and frontend in HTML/CSS/JS.
- 📉 Scaler for proper preprocessing of features before inference.
- 📊 Interactive frontend to send input and display predictions.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-energy-project.git
cd ai-energy-project
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

> If `requirements.txt` doesn't exist, include common packages:
```bash
pip install flask pandas scikit-learn numpy
```

### 4. Run Backend

```bash
cd BackEnd
python app.py
```

### 5. Run Frontend

Open `FrontEnd/index.html` in your browser or serve via a local server like Live Server in VS Code.

---

## 📈 Model Training

To retrain the models using new synthetic data:

```bash
cd BackEnd
python train_model.py
```

---

## 📬 API Endpoint

- `POST /predict`: Accepts input JSON and returns model prediction.

Example:

```json
{
  "feature1": value,
  "feature2": value,
  ...
}
```

---

## 🙌 Contributions

Feel free to fork and contribute via pull requests. Suggestions are always welcome!

## Author

Yashvardhan Ahuja

---

## 📄 License

[MIT License](LICENSE)