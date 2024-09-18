let data = {};

// Function to update message on the screen
function displayMessage(message) {
    const messageDiv = document.getElementById("message");
    messageDiv.innerHTML = message;
}

// Function to load and merge multiple JSON files
function loadData() {
    const jsonFiles = ['data_1d_part_22.json', 'data_1d_part_9.json', 'data_1d_part_34.json', 'data_1d_part_40.json', 'data_1d_part_26.json', 'data_1d_part_27.json', 'data_1d_part_20.json', 'data_1d_part_6.json', 'data_1d_part_2.json', 'data_1d_part_32.json', 'data_1d_part_7.json', 'data_1d_part_24.json', 'data_1d_part_1.json', 'data_1d_part_16.json', 'data_1d_part_35.json', 'data_1d_part_31.json', 'data_1d_part_38.json', 'data_1d_part_11.json', 'data_1d_part_37.json', 'data_1d_part_39.json', 'data_1d_part_36.json', 'data_1d_part_12.json', 'data_1d_part_33.json', 'data_1d_part_10.json', 'data_1d_part_4.json', 'data_1d_part_30.json', 'data_1d_part_23.json', 'data_1d_part_21.json', 'data_1d_part_5.json', 'data_1d_part_17.json', 'data_1d_part_29.json', 'data_1d_part_13.json', 'data_1d_part_14.json', 'data_1d_part_15.json', 'data_1d_part_19.json', 'data_1d_part_18.json', 'data_1d_part_28.json', 'data_1d_part_8.json', 'data_1d_part_25.json', 'data_1d_part_3.json'];

    const fetchPromises = jsonFiles.map(file => fetch(file).then(response => response.json()));

    Promise.all(fetchPromises)
        .then(jsonParts => {
            // Merge all parts into the 'data' object
            jsonParts.forEach(part => {
                Object.assign(data, part);
            });
            displayMessage("All data successfully loaded from JSON files.");
        })
        .catch(error => displayMessage('Error loading JSON files: ' + error));
}

// Call loadData when the page loads
window.onload = loadData;

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
            y: lows.filter((_, i) => signals[i] === 'Buy').map(low => low * 0.98),
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
            y: highs.filter((_, i) => signals[i] === 'Sell').map(high => high * 1.02),
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
            height: 800,
		dragmode: 'zoom',
            grid: {
                rows: 3,
                columns: 1,
                pattern: 'independent',
                roworder: 'top to bottom'
            },
            xaxis: {
                
                autorange: true,
                rangeslider: { visible: true },  // Disable the date slider
                range: [dates[dates.length - 50], dates[dates.length - 1]],  // Initial fixed range (last 50 dates)
                showticklabels: false,  // Remove date labels on the x-axis
            },
            yaxis1: {
                title: 'Price',
                autorange: true,
                domain: [0.5, 1],  // Height for candlestick panel
                anchor: 'x'
            },
            yaxis3: {
                title: 'Oscillator',
                autorange: true,
                domain: [0.2, 0.45],  // Height for K and D oscillator panel
                anchor: 'x'
            },
            yaxis2: {
                title: 'Volume',
                autorange: true,
                domain: [0, 0.19],  // Height for volume panel
                anchor: 'x'
            },
            showlegend: true,
            hovermode: 'x',  // Enable hovermode for dates to be shown only on hover
        };

        // Plot the chart
        Plotly.newPlot('plot', [candlestick, k_trace, d_trace, volume_trace, buy_signal_trace, sell_signal_trace], layout, {showSendToCloud: true});
        displayMessage(`Plot created successfully for ${tick}.`);
    } else {
        displayMessage(`No data found for tick: ${tick}`);
    }
};


var myPlot = document.getElementById('plot');

var isUnderRelayout = false;
myPlot.on('plotly_relayout',function(relayoutData){
   
	if(isUnderRelayout != true)
		{
			isUnderRelayout = true;			
			
			// get the start and end dates of current 'view'
			var start = relayoutData['xaxis.range'][0];
			var end = relayoutData['xaxis.range'][1];	
			
			// get the index of the start and end dates
			var xstart = myPlot.data[0].x.map(function(e) { return e; }).indexOf(start.substring(0, 10));
			var xend = myPlot.data[0].x.map(function(e) { return e; }).indexOf(end.substring(0, 10));
			
			if (xstart < 0) { xstart = 0;} // sometimes the date is before the data and returns -1			
						
			// get the min and max's
			var low = Math.min.apply(null, myPlot.data[0].low.slice(xstart, xend));
			var high = Math.max.apply(null, myPlot.data[0].high.slice(xstart, xend));
			
			// update the yaxis range and set flag to false
			var update = {'yaxis.range': [low, high]};	
			Plotly.relayout(myPlot, update).then(() => {isUnderRelayout = false})	
		}
});
