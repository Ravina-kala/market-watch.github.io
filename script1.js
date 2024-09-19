let data = {};

// Function to load and merge multiple JSON files
function loadData() {
    const jsonFiles = ['data_1d_part_19.json',
 'data_1d_part_16.json',
 'data_1d_part_13.json',
 'data_1d_part_4.json',
 'data_1d_part_29.json',
 'data_1d_part_20.json',
 'data_1d_part_25.json',
 'data_1d_part_9.json',
 'data_1d_part_21.json',
 'data_1d_part_23.json',
 'data_1d_part_6.json',
 'data_1d_part_22.json',
 'data_1d_part_17.json',
 'data_1d_part_36.json',
 'data_1d_part_5.json',
 'data_1d_part_18.json',
 'data_1d_part_2.json',
 'data_1d_part_3.json',
 'data_1d_part_38.json',
 'data_1d_part_8.json',
 'data_1d_part_30.json',
 'data_1d_part_12.json',
 'data_1d_part_33.json',
 'data_1d_part_40.json',
 'data_1d_part_14.json',
 'data_1d_part_34.json',
 'data_1d_part_31.json',
 'data_1d_part_7.json',
 'data_1d_part_10.json',
 'data_1d_part_15.json',
 'data_1d_part_39.json',
 'data_1d_part_27.json',
 'data_1d_part_37.json',
 'data_1d_part_24.json',
 'data_1d_part_35.json',
 'data_1d_part_28.json',
 'data_1d_part_26.json',
 'data_1d_part_11.json',
 'data_1d_part_1.json',
 'data_1d_part_32.json'];  // Add full list as needed
    const fetchPromises = jsonFiles.map(file => fetch(file).then(response => response.json()));

    Promise.all(fetchPromises)
        .then(jsonParts => {
            jsonParts.forEach(part => {
                Object.assign(data, part);
            });
            displayMessage("All data successfully loaded.");
        })
        .catch(error => displayMessage('Error loading JSON files: ' + error));
}

// Call loadData when the page loads
window.onload = loadData;

// Function to update message on the screen
function displayMessage(message) {
    const messageDiv = document.getElementById("message");
    messageDiv.innerHTML = message;
}
function findMissingDates(tick) {
    if (!(tick in data)) {
        displayMessage(`No data found for tick: ${tick}`);
        return [];
    }

    const tickData = data[tick];
    const dates = tickData.map(entry => new Date(entry.Datetime).toISOString().split('T')[0]);

    // Determine the full range of dates
    const minDate = new Date(Math.min(...dates.map(date => new Date(date))));
    const maxDate = new Date(Math.max(...dates.map(date => new Date(date))));

    const allDates = [];
    const currentDate = new Date(minDate);

    while (currentDate <= maxDate) {
        allDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Find missing dates
    const missingDates = allDates.filter(date => !dates.includes(date));

    return missingDates;
}

// Function to plot candlestick data
function plotGraph() {
    const tick = document.getElementById("search-box").value.trim();

    if (!tick) {
        displayMessage("Please enter a tick.");
        return;
    }

    if (tick in data) {
        const tickData = data[tick];
        displayMessage(`Data found for tick: ${tick}`);

        // Find missing dates
        const missingDates = findMissingDates(tick);
        const rangebreaks = missingDates.map(date => ({ bounds: [date, date] }));
        displayMessage(missingDates)
        displayMessage(rangebreaks)
        // Extract candlestick data
        const dates = tickData.map(entry => entry.Datetime.slice(0, 10)); // Use YYYY-MM-DD
        const opens = tickData.map(entry => entry.Open);
        const highs = tickData.map(entry => entry.High);
        const lows = tickData.map(entry => entry.Low);
        const closes = tickData.map(entry => entry.Close);
        const volumes = tickData.map(entry => entry.Volume);
        const d_values = tickData.map(entry => entry.k);
        const k_values = tickData.map(entry => entry.d);
        const signals = tickData.map(entry => entry.signal);

        // Get first and last date for setting X-axis range
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];

        // Candlestick data
        var candlestick = {
            x: dates,
            open: opens,
            high: highs,
            low: lows,
            close: closes,
            type: 'candlestick',
            name: 'Price',
            xaxis: 'x',
            yaxis: 'y1',
            increasing: {line: {color: '#17BECF'}},
            decreasing: {line: {color: '#7F7F7F'}}
        };
        
        // Volume bar chart trace
        var volume_trace = {
            x: dates,
            y: volumes,
            type: 'bar',
            name: 'Volume',
            marker: { color: 'rgba(100, 150, 250, 0.4)' },
            xaxis: 'x',
            yaxis: 'y2'
        };
        
        // K and D oscillator traces
        var k_trace = {
            x: dates,
            y: k_values,
            mode: 'lines',
            name: 'K',
            line: { color: 'blue' },
            xaxis: 'x',
            yaxis: 'y3'
        };
        
        var d_trace = {
            x: dates,
            y: d_values,
            mode: 'lines',
            name: 'D',
            line: { color: 'orange' },
            xaxis: 'x',
            yaxis: 'y3'
        };
        
        // Buy/Sell signals (arrows)
        var buy_signal_trace = {
            x: dates.filter((_, i) => signals[i] === 'Buy'),
            y: lows.filter((_, i) => signals[i] === 'Buy').map(low => low * 0.98),  // Slightly below the low
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
        
        var sell_signal_trace = {
            x: dates.filter((_, i) => signals[i] === 'Sell'),
            y: highs.filter((_, i) => signals[i] === 'Sell').map(high => high * 1.02),  // Slightly above the high
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
        
        // Overbought and Oversold lines (for the K and D Oscillator)
        var ob_line = {
            x: dates,
            y: Array(dates.length).fill(80),
            mode: 'lines',
            name: 'Overbought (80)',
            line: { color: 'red', dash: 'dash' },
            xaxis: 'x',
            yaxis: 'y3'
        };
        
        var os_line = {
            x: dates,
            y: Array(dates.length).fill(20),
            mode: 'lines',
            name: 'Oversold (20)',
            line: { color: 'green', dash: 'dash' },
            xaxis: 'x',
            yaxis: 'y3'
        };
        
        // Layout for the chart
        var layout = {
            title: `Stock Data for ${tick}`,
            height: 900,
            grid: {
                rows: 3,
                columns: 1,
                pattern: 'independent',
                roworder: 'top to bottom'
            },
            xaxis: {
                autorange: true,
                rangeslider: { visible: true, range: [dates[0], dates[dates.length - 1]] },
                rangebreaks: rangebreaks,
                title: 'Date'
            },
            yaxis1: {
                title: 'Price',
                domain: [0.55, 1],  // Adjusted height for candlestick panel
                autorange: true,
                anchor: 'x'
            },
            yaxis2: {
                title: 'Volume',
                domain: [0.35, 0.5],  // Adjusted height for volume panel
                autorange: true,
                anchor: 'x'
            },
            yaxis3: {
                title: 'Oscillator',
                domain: [0, 0.3],  // Adjusted height for K and D oscillator panel
                autorange: true,
                anchor: 'x'
            },
            showlegend: true,
            hovermode: 'x',
        };

        // Plot the chart
        Plotly.newPlot('plot', [candlestick, volume_trace, k_trace, d_trace, buy_signal_trace, sell_signal_trace, ob_line, os_line], layout, {showSendToCloud: true});


        // Set up relayout event for auto-scaling on zoom, pan, or rangeslider move
        var myPlot = document.getElementById('plot');
        var isUnderRelayout = false;

        myPlot.on('plotly_relayout', function (relayoutData) {
            if (isUnderRelayout !== true) {
                isUnderRelayout = true;

                // Get the start and end dates from the current view or rangeslider
                var start = relayoutData['xaxis.range'] ? relayoutData['xaxis.range'][0].slice(0, 10) : firstDate;
                var end = relayoutData['xaxis.range'] ? relayoutData['xaxis.range'][1].slice(0, 10) : lastDate;

                // Get the index range
                var xstart = myPlot.data[0].x.indexOf(start);
                var xend = myPlot.data[0].x.indexOf(end);
                
                if (xstart < 0) { xstart = 0; }
                if (xend < 0) { xend = myPlot.data[0].x.length - 1; }

                // Find the min and max values in the visible range
                var low = Math.min.apply(null, myPlot.data[0].low.slice(xstart, xend));
                var high = Math.max.apply(null, myPlot.data[0].high.slice(xstart, xend));

                // Update the Y-axis range
                var update = {'yaxis.range': [low, high]};
                Plotly.relayout(myPlot, update).then(() => { isUnderRelayout = false; });
            }
        });

    } else {
        displayMessage(`No data found for tick: ${tick}`);
    }
};
