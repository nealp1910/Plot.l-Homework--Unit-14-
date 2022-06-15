// Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data) {
    console.log(data);
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// function that contains instructions at page load/refresh
// function does not run until called
// code that runs once (only on page load or refresh)
// create dropdown/select
d3.json("samples.json").then(function(jsonData) {
    
    //Populate the dropdown
    d3.select("#selDataset")
        .selectAll("option")
        .data(jsonData.names)
        .enter()
        .append("option")
        .text(d=>d)
        .attr("value",d=>d);

    optionChanged(d3.select("#selDataset").property("value"));
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Creating Horizontal Bar Graph
function createBar(x,y,text) {
    var data = [{
        type: 'bar',
        x: x,
        y: y,
        text: text,
        orientation: 'h'
    }];

    var layout = {
        title: "Top 10 OTUs"
      };

    Plotly.newPlot('bar', data, layout);
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Creating Scatter Plot (Bubble Chart)
function createScatter(x,y,text) {
    var data = [{
        x: x,
        y: y,
        text: text,
        mode: 'markers',
        marker: {
          size: y,
          color: x.map(value=>value)
        }
    }];
    var layout = {
        title: "OTU Values",
        xaxis: {
            title: {
              text: 'OTU ID',
            }
        }
    };
    Plotly.newPlot('bubble', data, layout);
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Creating Gauge Plot
function createGauge(num) {
    
    var data = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: num,
        title: "Belly Button Washing Frequency",
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 10]},
            bar: { color: "#000000" },
            steps: [
                { range: [0, 1], color: "#f1f8e9" },
                { range: [1, 2], color: "#dcedc8" },
                { range: [2, 3], color: "#c5e1a5" },
                { range: [3, 4], color: "#aed581" },
                { range: [4, 5], color: "#9ccc65" },
                { range: [5, 6], color: "#8bc34a" },
                { range: [6, 7], color: "#7cb342" },
                { range: [7, 8], color: "#689f38" },
                { range: [8, 9], color: "#558b2f" },
                { range: [9, 10], color: "#33691e" },
            ],
        }
    }];
    Plotly.newPlot('gauge', data);
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Meta(data) {
    var div = d3.select("#sample-metadata");
    div.html("")
    var list = div.append("ul");
    Object.entries(data).forEach(([key, value]) => {
        list.append("li").text(key + ": " + value);
     });
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Code that makes list, paragraph, text/linebreaks at id='sample-meta'
function optionChanged(value) {
    d3.json("samples.json").then(function(jsonData) {
        var metadata = jsonData.metadata.filter(data => data.id ==value);
        console.log(metadata);

        var sample = jsonData.samples.filter(data => data.id ==value);
        console.log(sample);

        createBar(sample[0].sample_values.slice(0,10).reverse(),sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a),sample[0].otu_labels.slice(0,10).reverse());
        createScatter(sample[0].otu_ids,sample[0].sample_values,sample[0].otu_labels);
        Meta(metadata[0]);
        createGauge(metadata[0].wfreq);
    });
}