
dashboard();
d3.select('select').on('change', dashboard);

function dashboard() {

    d3.json('samples.json').then(jsonData => {
        data = jsonData;

        select = d3.select('select');
        var { names, metadata, samples } = data;

        names.forEach(name => {
            select.append('option').text(name);
        });

        var demo = metadata.filter(obj => obj.id == select.property('value'))[0];
        d3.select('.panel-body').html('');

        Object.entries(demo).forEach(([key, val]) => {
            d3.select('.panel-body').append('h5').text(`${key.toUpperCase()}: ${val}`);
        });

        var sample = samples.filter(obj => obj.id == select.property('value'))[0];
        var { otu_ids, sample_values, otu_labels } = sample;

        var barData = [
            {
                y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: 'bar',
                orientation: 'h'
            }
        ];

        var barLayout = {
            title: 'Top 10 Bacteria Cultures Found',
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot('bar', barData, barLayout);

        var bubbleData = [
            {
                y: otu_ids,
                x: sample_values,
                text: otu_labels,
                mode: 'markers',
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: 'Earth'
                }
            }
        ];

        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            margin: { t: 0 },
            hovermode: 'closest',
            xaxis: { title: 'OTU ID' },
            margin: { t: 30 }
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        var gaugeData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: demo.wfreq,
                title: { text: "Belly Button Washing Frequency per Week" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 400 },
                gauge: { axis: { range: [0, 9] } }
            }
        ];

        var layout = { width: 600, height: 400 };
        Plotly.newPlot('gauge', gaugeData, layout);
    });
};
