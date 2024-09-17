let data;

// Function to update message on the screen
function displayMessage(message) {
    const messageDiv = document.getElementById("message");
    messageDiv.innerHTML = message;
}

fetch('data_1d.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        displayMessage("Data successfully loaded from JSON.");
    })
    .catch(error => displayMessage('Error loading JSON: ' + error));

function plotGraph() {
    const tick = document.getElementById("search-box").value.trim();

    if (!tick) {
        displayMessage("Please enter a tick.");
        return;
    }

    if (tick in data) {
        const tickData = data[tick];
        displayMessage(`Data found for tick: ${tick}`);

        // Extract the necessary data for plotting
        const dates = tickData.map(entry => entry.Datetime);
        const prices = tickData.map(entry => entry.Close);

        // Plotly graph
        var trace = {
            x: dates,
            y: prices,
            mode: 'lines',
            name: tick
        };

        var layout = {
            title: `Price Data for ${tick}`,
            xaxis: { title: 'Date' },
            yaxis: { title: 'Price' }
        };

        Plotly.newPlot('plot', [trace], layout);
        displayMessage(`Plot created successfully for ${tick}.`);
    } else {
        displayMessage(`No data found for tick: ${tick}`);
    }
}
