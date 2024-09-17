let data;

// Fetch the JSON data from the GitHub repo
fetch('data_1d.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        console.log("Data loaded");
    })
    .catch(error => console.error('Error loading JSON:', error));

function plotGraph() {
    const tick = document.getElementById("search-box").value;

    if (tick in data) {
        const tickData = data[tick];

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
    } else {
        alert("Tick not found in the dataset.");
    }
}
