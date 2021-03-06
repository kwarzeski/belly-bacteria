function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
	var samples = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
	// console.log(resultArray)
	
    // Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
	// 2. Create a variable that holds the first sample in the metadata array.
    var metadata = resultArray[0];
	
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
	var topTenIDs = result.otu_ids.slice(0,10).reverse();
	var topTenLabels = result.otu_labels.slice(0,10).reverse();
	var topTenValues = result.sample_values.slice(0,10).reverse();
	// console.log(topTenIDs)
	//console.log(topTenLabels)
	//console.log(topTenValues)

    // Create a variable that holds the washing frequency.
	var washFreq = metadata["wfreq"]
	
    // Create the yticks for the bar chart.

    var yticks = topTenIDs.map(a=>"OTU ID "+ a);

    // Create the trace for the bar chart.  
    var trace = { 
		y: yticks, 
		x: topTenValues, 
		text: topTenLabels,
		type: "bar",
		orientation: 'h'
	};
	
    // Create the layout for the bar chart. 
    var barLayout = { 
		title: "Top 10 Bacteria Cultures Found"
	};
	  
    // Use Plotly to plot the data with the layout.
	Plotly.newPlot("bar", [trace], barLayout);

	// console.log(result);
    // Create the trace for the bubble chart.
	var trace1 = {
		x: result.otu_ids,
		y: result.sample_values,
		text: result.otu_labels,
		mode: "markers",
		marker: {
			size: result.sample_values,
			color: result.otu_ids,
			colorscale: 'Earth'
		}
	};
    var bubbleData = [trace1];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
	  title: 'Bacteria Cultures per Sample',
	  xaxis: {
		title: {
		  text: 'OTU ID',
		}
      },
	  showlegend: false
	};

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
   
   // console.log(sample);
    // 4. Create the trace for the gauge chart.
	var gaugeData = [
		{
			gauge: {
				axis: { range: [null, 10] },
				bar: { color: "black" },
				steps: [
					{ range: [0, 2], color: "red" },
					{ range: [2, 4], color: "orange" },
					{ range: [4, 6], color: "yellow" },
					{ range: [6, 8], color: "greenyellow" },
					{ range: [8, 10], color: "green" }
				]
			},
			title: { text: "Scrubs per Week" },
			value: washFreq,
			type: "indicator",
			mode: "gauge+number"
		}
	];
    
    // 5. Create the layout for the gauge chart.
	var gaugeLayout = { title: 'Belly Button Wahsing Frequency' };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
