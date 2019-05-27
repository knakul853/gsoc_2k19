InvalidContainerDiv = function(message) {
	this.name = 'InvalidContainerDiv';
	this.message = message;
}

InvalidConnectivityData = function(message) {
	this.name = 'InvalidConnectivityData';
	this.message = message;
}


ConnectivitySVG = function(divID, matrixData, options) {
	/*
	 * @param divID: the parent div on which to draw this SVG plot
	 * @param matrixData: 2D data that should be plotted here
	 * @param option: a dictionary of extra options to be used in the SVG plot
	 */
	if (!matrixData.length || matrixData.length != matrixData[0].length) {
		throw new InvalidConnectivityData("Invalid matrix data. Expected a 2d quare matrix as input.")
	}
	var self = this; // Save proper reference so we can use it in inner functions.
	this.containerDiv = document.getElementById(divID);
	if (this.containerDiv == null || this.containerDiv == undefined) {
		throw new InvalidContainerDiv('Could not find any div with id=' + divID);
	}
	this.chartSize = this.containerDiv.clientWidth / 2;
	this.matrixData = matrixData;
	this.nrNodes = this.matrixData.length;
	this.elementSize = this.chartSize / this.nrNodes;
	
	this.options = options || {}; // Any extra options will go here
	this.options.maxValue = options.maxValue || 1; // TODO: compute min and max from weights if they are not passed as options.
	this.options.minValue = options.minValue || 0;
	this.options.labels = options.labels || this.dummyLabels(this.nrNodes);
	
	if (this.options.labels.length != this.matrixData.length) {
		throw new InvalidConnectivityData("Labels and matrix data have different sizes.")
	}
	
	// x-scale
  	this.xScale = d3.scale.ordinal()
      						.domain(this.options.labels)
      						.rangePoints([0, this.chartSize]);
    // y-scale
  	this.yScale = d3.scale.ordinal()
      						.domain(this.options.labels)
      						.rangePoints([0, this.chartSize]); 
	// For drag x and drag y logic.
    this.downX = Math.NaN;
    this.downY = Math.NaN;
    this.dragged = null;
    this.selected = null;
    
    // Root SVG elemet
    this.svgPlot = d3.select(this.containerDiv).append("svg")
   													.attr("width",  this.chartSize)
      												.attr("height", this.chartSize)
      												.attr("pointer-events", "all"); // TODO: Check what this does
      												
    // Create a group holding entire data to be added. Also bind events to it.
    this.rootGroup = this.svgPlot.append("g").call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", this.redraw()));
								    
	// Create all the required svg rects now
	for (var idx = 0; idx < this.nrNodes; idx++) {
		// Create a new group for this line of entries
		var lineGroup = this.rootGroup.append("g");
		for (var idy = 0; idy < this.nrNodes; idy++) {
			// Create a line of rectangles
			var currentRect = lineGroup.selectAll('rect').data(this.matrixData[idx]).enter()					
	    															.append('rect')
							    									.attr("fill", this.computeColor)
							    									.attr("id", this.positionToNodeId(idx, idy))
							                						.style("stroke", "transparent")
													                .attr("x", function (d, i) {
													                    return self.elementSize * i;
													                })
													                .attr("y", function (d, i) {
													                    return self.elementSize * idx;
													                })
													                .attr("width", this.chartSize)
													                .attr("height", this.chartSize); // TODO: check if this makes sense to be splitt
		}
	}
};

ConnectivitySVG.prototype.dummyLabels = function (labelsLength) {
	/*
	 * In case no labels can be generated, this creates a range of integers starting from 0.
	 * 
	 * @param labelsLength: the number of label labels to be generated
	 */
	var resultLabels = [];
	for (var i = 0; i < labelsLength; i++) {
		resultLabels.push(i.toString());
	};
	return resultLabels;
};

ConnectivitySVG.prototype.computeColor = function(dataValue) {
	/*
	 * Compute the corresponding color from our gradient, give the value of a point.
	 * 
	 * @param dataValue: the value of this point.
	 */
	return "rgb(" + Math.floor(255 - 255 * dataValue) + ", 0, " + Math.floor(255 * dataValue) + ")"; //TODO: this should be gradient computation
}

ConnectivitySVG.prototype.positionToNodeId = function(idx, idy) {
	/*
	 * Compute a unique id for a table element, given an idx and idy.
	 */
	return idx + '-' + idy; // TODO: Once we have weights and tracts this should either be overwriten or take an addition parameter.
}

ConnectivitySVG.prototype.nodeIdToPosition = function(nodeID) {
	/*
	 * Compute the position given the node ID.
	 */
	return nodeID.split('-');
}

ConnectivitySVG.prototype.redraw = function() {
	var self = this;
	return function() {
		self.rootGroup.selectAll('rect').attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
	}
}

function testSVG() {
	var dataPoints = [];
	var dataLabels = [];
	var nrElems = 500;
	for (var i = 0; i < nrElems; i++) {
		var row = [];
		dataLabels.push('lbl_' + i);
		for (var j = 0; j < nrElems; j++) {
			row.push(Math.random());
		};
		dataPoints.push(row);
	}
	graph = new ConnectivitySVG("svg-matrix-view", dataPoints, {"labels" : dataLabels});
}


