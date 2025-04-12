import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
import pickle
data = pd.read_csv('synthetic_data.csv')
features = data[["latitude", "longitude", "elevation", "temperature", "humidity", "windSpeed", "solarRadiation", "area", "energy_consumption"]]
y = data["energy_consumption"]
X_train, X_test, y_train, y_test = train_test_split(features, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
ridge_model = Ridge(alpha=100)
ridge_model.fit(X_train_scaled, y_train)
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train_scaled, y_train)
with open('ridge_model.pkl', 'wb') as model_file:
    pickle.dump(ridge_model, model_file)

with open('rf_model.pkl', 'wb') as model_file:
    pickle.dump(rf_model, model_file)

with open('scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)
data[['energy_consumption']].to_csv('target.csv', index=False)
print("Model, scaler, and target saved successfully.")
