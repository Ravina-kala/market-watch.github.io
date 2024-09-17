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

        // Extract the necessary data
        const dates = tickData.map(entry => entry.Datetime);
        const opens = tickData.map(entry => entry.Open);
        const highs = tickData.map(entry => entry.High);
        const lows = tickData.map(entry => entry.Low);
        const closes = tickData.map(entry => entry.Close);
        const volumes = tickData.map(entry => entry.Volume);
        const k_values = tickData.map(entry => entry.k);
        const d_values = tickData.map(entry => entry.d);
        const signals = tickData.map(entry => entry.signal);

        // Candlestick trace
        const candlestick = {
            x: dates,
            open: opens,
            high: highs,
            low: lows,
            close: closes,
            type: 'candlestick',
            name: 'Price',
            xaxis: 'x',
            yaxis: 'y1'
        };

        // K and D oscillator traces
        const k_trace = {
            x: dates,
            y: k_values,
            mode: 'lines',
            name: 'K',
            line: { color: 'blue' },
            xaxis: 'x',
            yaxis: 'y2'
        };

        const d_trace = {
            x: dates,
            y: d_values,
            mode: 'lines',
            name: 'D',
            line: { color: 'orange' },
            xaxis: 'x',
            yaxis: 'y2'
        };

        // Volume bar chart trace
        const volume_trace = {
            x: dates,
            y: volumes,
            type: 'bar',
            name: 'Volume',
            marker: { color: 'rgba(100, 150, 250, 0.4)' },
            xaxis: 'x',
            yaxis: 'y3'
        };

        // Buy/Sell signals (arrows)
        const buy_signal_trace = {
            x: dates.filter((_, i) => signals[i] === 'Buy'),
            y: lows.filter((_, i) => signals[i] === 'Buy'),
            mode: 'markers',
            name: 'Buy Signal',
            marker: {
                symbol: 'triangle-up',
                color: 'green',
                size: 12
            },
            xaxis: 'x',
            yaxis: 'y1'
        };

        const sell_signal_trace = {
            x: dates.filter((_, i) => signals[i] === 'Sell'),
            y: highs.filter((_, i) => signals[i] === 'Sell'),
            mode: 'markers',
            name: 'Sell Signal',
            marker: {
                symbol: 'triangle-down',
                color: 'red',
                size: 12
            },
            xaxis: 'x',
            yaxis: 'y1'
        };

        // Layout for the chart
        const layout = {
            title: `Stock Data for ${tick}`,
            grid: { rows: 3, columns: 1, pattern: 'independent' },
            xaxis: { type: 'category', title: 'Date' },
            yaxis: { title: 'Price' }, // y-axis for candlestick
            yaxis2: { title: 'Oscillator', overlaying: 'y', side: 'right', position: 0.85 }, // y-axis for K and D
            yaxis3: { title: 'Volume', domain: [0, 0.2], showticklabels: true }, // y-axis for Volume (separate)
            showlegend: true
        };

        // Plot the chart
        Plotly.newPlot('plot', [candlestick, k_trace, d_trace, volume_trace, buy_signal_trace, sell_signal_trace], layout);
        displayMessage(`Plot created successfully for ${tick}.`);
    } else {
        displayMessage(`No data found for tick: ${tick}`);
    }
}
