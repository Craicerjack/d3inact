d3.csv("data/movies.csv", drawMovies);

function drawMovies(data) {
    simpleStack(data);
    alternateStack(data);
}

function simpleStack(data) {
    var xScale = d3.scale.linear().domain([1, 10.5]).range([20, 480]);
    var yScale = d3.scale.linear().domain([0, 50]).range([480, 20]);
    var fillScale = d3.scale.linear().domain([0,5]).range(["lightgrey", "black"]);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10).tickSize(480).tickValues([1,2,3,4,5,6,7,8,9,10]);
    var yAxis =  d3.svg.axis().scale(yScale).orient("right").ticks(10).tickSize(480).tickSubdivide(true);
    var n = 0;
    // loop through data and for each movie
    for (x in data[0]) { 
        if (x !== "day") {

            // THIS IS A CONSTRUCTOR //
            ///////////////////////////
            var movieArea = d3.svg.area()
                .x(function(d) { return xScale(d.day); })
                .y(function(d) { return yScale(simpleStacking(d, x)); })
                .y0(function(d) { return yScale(simpleStacking(d, x) - d[x]); })
                .interpolate("basis");

            d3.select("#steam svg").append("g").attr("id", "xAxisG").call(xAxis);
            d3.select("#steam svg").append("g").attr("id", "yAxisG").call(yAxis);
            d3.select("#steam svg")
                .append('path')
                .style('id', x + "Area")
                .attr('d', movieArea(data))
                .attr('fill', fillScale(n))
                .attr('stroke', 'none')
                .attr('stroke-width', 2)
                .style('opacity', 0.5);
            n++;
        };
    };
    function simpleStacking(incomingData, incomingAttr) {
        var newHeight = 0;
        for (x in incomingData) {
            if (x !== "day") {
                newHeight += parseInt(incomingData[x]);
                if (x == incomingAttr) { break; }
            }
        }
        return newHeight;
    };
}

    

function alternateStack(data) {
    var xScale = d3.scale.linear().domain([0, 11]).range([0, 500]);
    var yScale = d3.scale.linear().domain([-100, 100]).range([500, 0]);
    var sizeScale = d3.scale.linear().domain([0, 200]).range([20, 20]);
    var yax = d3.svg.axis().scale(yScale).orient("right").ticks(8).tickSize(500).tickSubdivide(true);
    var xax = d3.svg.axis().scale(xScale).orient("bottom").tickSize(500).ticks(4); 
    d3.select("#steam2 svg").append("g").attr("id", "yax").call(yax);
    d3.select("#steam2 svg").append("g").attr("id", "xax").call(xax);
    var fillScale = d3.scale.linear().domain([1,10]).range(["lightgray","black"]);
    n = 0;
    for (x in data[0]) { 
        if (x !== "day") {
            // THIS IS A CONSTRUCTOR //
            ///////////////////////////
            var movieArea = d3.svg.area().x(function(d) { return xScale(d.day); })
                .y(function(d) { return yScale(alternatingStacking(d, x, "top")); })
                .y0(function(d) { return yScale(alternatingStacking(d, x, "bottom")); })
                .interpolate("basis");

            d3.select("#steam2 svg").append("g").attr("id", "xax").call(xax);
            d3.select("#steam2 svg").append("g").attr("id", "yax").call(yax);
            d3.select("#steam2 svg")
                .insert("path",".movie")
                .attr("class", "movie")
                // .append("path")
                .style('id', x + "Area2")
                .attr('d', movieArea(data))
                .attr('fill', fillScale(n))
                .attr('stroke', 'white')
                .attr('stroke-width', 1)
                .style('opacity', 1);
            n++;
        };
    };

    function alternatingStacking(incomingData, incomingAttr, topBottom) {
        var newHeight = 0;
        var skip = true;
        for (x in incomingData) {
            //skip day because thats x position
            if (x !== "day") {
                // skip first movie and skip every other movie to get alternating pattern
                if (x === "movie1" || skip === false) {
                    newHeight += parseInt(incomingData[x]);
                    if (x == incomingAttr) { break; }
                    if (skip === false) { skip = true; } 
                    else { n%2 === 0 ? skip = false : skip = true; }
                } else {
                    skip = false;
                }
            }
        }
        if (topBottom == "bottom") {
            newHeight = -newHeight;
        }
        if (n > 1 && n%2 === 1 && topBottom === "bottom") {
            newHeight = 0;
        }
        if (n > 1 && n%2 == 0 && topBottom == "top") {
          newHeight = 0;
        }
        return newHeight;
    }
}