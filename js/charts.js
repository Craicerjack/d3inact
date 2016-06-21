var scatterData = [
    {friends: 5, salary: 22000},
    {friends: 3, salary: 18000}, 
    {friends: 10, salary: 88000},
    {friends: 0, salary: 180000}, 
    {friends: 27, salary: 56000},
    {friends: 8, salary: 74000}
];

var xEx = d3.extent(scatterData, function(d) { return d.salary; });
var yEx = d3.extent(scatterData, function(d) { return d.friends; });
console.log(yEx , " -  test  ");
var xScale = d3.scale.linear().domain([0, 180000]).range([0, 500]);
var yScale = d3.scale.linear().domain([0, 30]).range([500, 0]);
d3.select("svg")
    .selectAll("circle")
    .data(scatterData)
.enter()
    .append("circle")
    .attr("r", 10)
    .attr("cx", function(d) { return xScale(d.salary); })
    .attr("cy", function(d) { return yScale(d.friends); })

// DRAWING AXIS'S //
var yax = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .tickSize(5)
                .ticks(5);
var xax = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .tickSize(5)
                .ticks(10);

d3.select("svg").append("g").attr("id", "yax").call(yax);
d3.select("svg").append("g").attr('id', 'xax').call(xax);

// STYLING AXIS //
d3.selectAll("path.domain")
    .style("fill", "none")
    .style("stroke", "black");
d3.selectAll("line")
    .style("stroke", "grey");

// Move x axis to bottom
// d3.selectAll("#xax").attr("transform", "translate(0, 500)");
// d3.selectAll("#yax").attr("transform", "translate(500, 0)");


// ******************************************
// SCATTER
// ******************************************
d3.csv("data/tweetdata.csv", lineChart);
function lineChart(data) {
    var svg = d3.select("#tweets svg");
    var xScale = d3.scale.linear().domain([1, 10.5]).range([20, 480]);
    var yScale = d3.scale.linear().domain([0, 35]).range([480, 20]);

    var xax = d3.svg.axis()
                    .scale(xScale)
                    .orient("top")
                    .tickSize(5)
                    .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var yax = d3.svg.axis()
                    .scale(yScale)
                    .orient("right")
                    .ticks(5)
                    .tickSize(5);

    svg.append("g").attr("id", "xax").call(xax);
    svg.append("g").attr("id", "yax").call(yax);
    d3.selectAll("#xax").attr("transform", "translate(0, 500)");

    // Draw a Circle and draw a line between points //
    drawCircles(svg, "circle.tweets", data, "tweets", xScale, yScale, "blue");
    var tweetLine = createLine(xScale, yScale, "tweets");
    drawLine(svg, tweetLine, data, "red");
    tweetLine.interpolate("basis");
    drawLine(svg, tweetLine, data, "blue");

    drawCircles(svg, "circle.retweets", data, "retweets", xScale, yScale, "lightblue");
    drawLine(svg, createLine(xScale, yScale, "retweets").interpolate("step"), data, "lightblue");

    drawCircles(svg, "circle.favorites", data, "favorites", xScale, yScale, "aqua");
    drawLine(svg, createLine(xScale, yScale, "favorites").interpolate("cardinal"), data, "aqua");
    
}

function createLine(xScale, yScale, vals) {
    return d3.svg.line()
                .x(function(d) { return xScale(d.day); })
                .y(function(d) { return yScale(d[vals]); })
}

function drawLine(svg, lineType, data, col) {
    svg.append("path")
        .attr("d", lineType(data))
        .attr("fill", "none")
        .attr("stroke", col)
        .attr("stroke-width", 2);
}

function drawCircles(svg, identifier, data, attrClass, xScale, yScale, col ) {
    svg.selectAll(identifier)
        .data(data)
    .enter()
        .append("circle")
        .attr("class", attrClass)
        .attr("r", 10)
        .attr("cx", function(d) { return xScale(d.day); })
        .attr("cy", function(d) { return yScale(d[attrClass]); })
        .style("fill", col);
}

