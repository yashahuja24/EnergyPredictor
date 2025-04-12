import numpy as np
import pandas as pd
import random
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pickle
num_samples = 200000
def generate_temperature(latitude):
    """Generate temperature based on latitude (degrees Celsius)."""
    if latitude < -40 or latitude > 40:
        return random.uniform(-20, 5)
    elif -40 <= latitude < -10 or 10 <= latitude < 40:
        return random.uniform(5, 25)
    else:
        return random.uniform(20, 35)
def generate_solar_radiation(latitude):
    """Generate solar radiation (W/m²) based on latitude."""
    if latitude < -40 or latitude > 40:
        return random.uniform(100, 200)
    elif -20 <= latitude < 20:
        return random.uniform(500, 1000)
    else:
        return random.uniform(300, 600)
def generate_energy_consumption(solarRadiation, area):
    """Generate energy consumption (kWh) based on solar radiation and area."""
    base_consumption = area * solarRadiation * 0.1 
    noise = random.gauss(0, 50)
    return max(base_consumption + noise, 100)

latitude = np.random.uniform(-90, 90, num_samples)
longitude = np.random.uniform(-180, 180, num_samples)
elevation = np.random.uniform(0, 3000, num_samples)
temperature = np.array([generate_temperature(lat) for lat in latitude])
humidity = np.random.uniform(20, 100, num_samples)
windSpeed = np.random.uniform(0, 50, num_samples)
solarRadiation = np.array([generate_solar_radiation(lat) for lat in latitude])
area = np.random.uniform(50, 5000, num_samples)
energy_consumption = np.array([generate_energy_consumption(solarRadiation[i], area[i]) for i in range(num_samples)])

data = pd.DataFrame({
    'latitude': latitude,
    'longitude': longitude,
    'elevation': elevation,
    'temperature': temperature,
    'humidity': humidity,
    'windSpeed': windSpeed,
    'solarRadiation': solarRadiation,
    'area': area,
    'energy_consumption': energy_consumption
})
target = energy_consumption * 0.8 + np.random.normal(0, 200, num_samples)
X_train, X_test, y_train, y_test = train_test_split(data, target, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
data.to_csv('synthetic_data.csv', index=False)
pd.DataFrame(target, columns=['energy_consumption_prediction']).to_csv('target.csv', index=False)
with open('scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)
print(data.head())
