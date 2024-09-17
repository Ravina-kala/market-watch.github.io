let data;

// Fetch the JSON data from the GitHub repo
fetch('data_1d.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        console.log("Data successfully loaded from JSON.");
    })
    .catch(error => console.error('Error loading JSON:', error));

function plotGraph() {
    const tick = document.getElementById("search-box").value.trim();

    if (!tick) {
        console.log("No tick entered.");
        alert("Please enter a tick.");
        return;
    }

    if (tick in data) {
        console.log(`Data found for tick: ${tick}`);
        const tickData = data[tick];

        // Extract the necessary data for plotting
        const dates = tickData.map(entry => entry.Datetime);
        const prices = tickData.map(entry => entry.Close);

        console.log(`Found ${dates.length} data points for ${tick}.`);

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
        console.log(`Plot created successfully for ${tick}.`);
    } else {
        console.log(`No data found for tick: ${tick}`);
        alert("Tick not found in the dataset.");
    }
}
