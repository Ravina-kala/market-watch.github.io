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
            grid: {
                rows: 3,
                columns: 1,
                pattern: 'independent',
                roworder: 'top to bottom'
            },
            xaxis: {
                type: 'category',
                rangeslider: { visible: true },  // Enable the date slider
                range: [dates[dates.length - 50], dates[dates.length - 1]],  // Initial fixed range (last 50 dates)
                showticklabels: false,  // Remove date labels on the x-axis
            },
            yaxis1: {
                title: 'Price',
                domain: [0.5, 1],  // Height for candlestick panel
                anchor: 'x'
            },
            yaxis3: {
                title: 'Oscillator',
                domain: [0.2, 0.45],  // Height for K and D oscillator panel
                anchor: 'x'
            },
            yaxis2: {
                title: 'Volume',
                domain: [0, 0.19],  // Height for volume panel
                anchor: 'x'
            },
            showlegend: true,
            hovermode: 'x',  // Enable hovermode for dates to be shown only on hover
        };

        // Plot the chart
        Plotly.newPlot('plot', [candlestick, k_trace, d_trace, volume_trace, buy_signal_trace, sell_signal_trace], layout);

        var myPlot = document.getElementById('plot');

        var isUnderRelayout = false;
        myPlot.on('plotly_relayout', function(relayoutData) {
            if (!isUnderRelayout) {
                isUnderRelayout = true;

                // Get the start and end dates of current 'view'
                var start = relayoutData['xaxis.range'][0];
                var end = relayoutData['xaxis.range'][1];

                // Get the index of the start and end dates
                var xstart = myPlot.data[0].x.map(e => e).indexOf(start.substring(0, 10));
                var xend = myPlot.data[0].x.map(e => e).indexOf(end.substring(0, 10));

                if (xstart < 0) { xstart = 0; } // sometimes the date is before the data and returns -1

                // Get the min and max's
                var low = Math.min.apply(null, myPlot.data[0].low.slice(xstart, xend));
                var high = Math.max.apply(null, myPlot.data[0].high.slice(xstart, xend));

                // Update the yaxis range and set flag to false
                var update = { 'yaxis1.range': [low, high] };
                Plotly.relayout(myPlot, update).then(() => { isUnderRelayout = false });
            }
        });

        displayMessage(`Plot created successfully for ${tick}.`);
    } else {
        displayMessage(`No data found for tick: ${tick}`);
    }
}
