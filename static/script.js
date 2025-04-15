document.addEventListener('DOMContentLoaded', function () {
    initializeCharts();
    initializeMap();
    setupFormHandling();
    setupDownloadReport();
});
function scrollToPredictor() {
    document.getElementById('predictor').scrollIntoView({ behavior: 'smooth' });
}

function scrollToVisualization() {
    document.getElementById('visualization').scrollIntoView({ behavior: 'smooth' });
}

let map;
let markers = [];
function initializeCharts() {
    const generationCtx = document.getElementById('generationChart').getContext('2d');
    const roiCtx = document.getElementById('roiChart').getContext('2d');

    window.generationChart = new Chart(generationCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Solar Energy Potential',
                data: Array(12).fill(0),
                borderColor: '#2E7D32',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Energy Generation Potential'
                }
            }
        }
    });

    window.roiChart = new Chart(roiCtx, {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [{
                label: 'Projected ROI',
                data: Array(5).fill(0),
                backgroundColor: '#FB8C00'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Return on Investment Projection'
                }
            }
        }
    });
}
function initializeMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}
function setupFormHandling() {
    const form = document.getElementById('predictionForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('.submit-button');
        submitButton.textContent = 'Generating...';
        submitButton.disabled = true;

        const formData = {
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value),
            elevation: parseFloat(document.getElementById('elevation').value),
            temperature: parseFloat(document.getElementById('temperature').value),
            humidity: parseFloat(document.getElementById('humidity').value),
            windSpeed: parseFloat(document.getElementById('windSpeed').value),
            solarRadiation: parseFloat(document.getElementById('solarRadiation').value),
            area: parseFloat(document.getElementById('area').value),
            energy_consumption: parseFloat(document.getElementById('energy_consumption').value)
        };

        try {
            const url = 'http://localhost:5000/api/predict';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Prediction response:", data);
                displayPredictionResult(data);
                updateVisualizations(data);
                updateRecommendations(data);
                updateMap(data);
            } else {
                const errorData = await response.json();
                console.error("Backend error:", errorData);
                alert(`Error: ${errorData.error || 'An unknown error occurred'}`);
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert('Error connecting to the backend. Please ensure the server is running.');
        } finally {
            submitButton.textContent = 'Generate Predictions';
            submitButton.disabled = false;
        }
    });
}
function displayPredictionResult(data) {
    const resultContainer = document.getElementById('predictionResult');
    if (data.energy_consumption_prediction) {
        resultContainer.innerHTML = `
            <h3>Prediction Result</h3>
            <p><strong>Predicted Energy Consumption:</strong> ${data.energy_consumption_prediction.toFixed(2)} kWh</p>
        `;
    } else {
        resultContainer.innerHTML = `
            <h3>Prediction Result</h3>
            <p>No prediction data available. Please check your inputs.</p>
        `;
    }
}
function updateVisualizations(data) {
    const { energyGeneration, roiProjection } = data;
    if (energyGeneration && Array.isArray(energyGeneration)) {
        const fluctuatedEnergyGeneration = energyGeneration.map(value => value + Math.random() * 10);
        window.generationChart.data.datasets[0].data = fluctuatedEnergyGeneration;
        window.generationChart.update();
    }
    if (roiProjection && Array.isArray(roiProjection)) {
        const fluctuatedRoiProjection = roiProjection.map(value => value + Math.random() * 2);
        window.roiChart.data.datasets[0].data = fluctuatedRoiProjection;
        window.roiChart.update();
    }
}
function updateRecommendations(data) {
    const { strategies } = data;

    const strategiesContent = document.querySelector('.strategies-content');
    
    if (strategies && Array.isArray(strategies) && strategies.length > 0) {
        strategiesContent.innerHTML = strategies.map(strategy => `<p>${strategy}</p>`).join('');
    } else {
        strategiesContent.innerHTML = `<p>No optimization strategies found.</p>`;
        console.warn("No valid optimization strategies found in the data.");
    }
}
function updateMap(data) {
    const { latitude, longitude } = data;
    if (markers.length > 0) {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
    }
    if (typeof latitude === 'number' && !isNaN(latitude) && typeof longitude === 'number' && !isNaN(longitude)) {
        const marker = L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`Energy prediction location<br>Latitude: ${latitude}<br>Longitude: ${longitude}`)
            .openPopup();

        markers.push(marker);
        map.setView([latitude, longitude], 10);
    } else {
        console.error('No valid coordinates received for the map.');
    }
}
function setupDownloadReport() {
    const downloadButton = document.getElementById('downloadReport');
    downloadButton.addEventListener('click', generatePDFReport);
}
function generatePDFReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('EnergyAI Optimizer Report', 10, 10);
    const predictionResult = document.getElementById('predictionResult').textContent || 'No prediction results available.';
    doc.setFontSize(12);
    doc.text('Prediction Result:', 10, 20);
    doc.text(predictionResult, 10, 30);
    const generationCanvas = document.getElementById('generationChart');
    const generationImage = generationCanvas.toDataURL('image/png');
    doc.addPage();
    doc.text('Energy Generation Potential:', 10, 10);
    doc.addImage(generationImage, 'PNG', 10, 20, 180, 90);
    const roiCanvas = document.getElementById('roiChart');
    const roiImage = roiCanvas.toDataURL('image/png');
    doc.addPage();
    doc.text('ROI Projection:', 10, 10);
    doc.addImage(roiImage, 'PNG', 10, 20, 180, 90);
    const strategiesContent = document.querySelector('.strategies-content').textContent || 'No strategies available.';
    doc.addPage();
    doc.text('AI-Generated Recommendations:', 10, 10);
    doc.text(strategiesContent, 10, 20);
    doc.save('EnergyAI_Optimizer_Report.pdf');
}