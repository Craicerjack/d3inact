function vizTweets(incomingData) {
    var incomingData = incomingData.tweets;
    incomingData.forEach(function (el) {
        el.impact = el.favorites.length + el.retweets.length;
        el.tweetTime = new Date(el.timestamp);
    })
    var maxImpact   = d3.max(incomingData, function(el) {return el.impact;});
    var startEnd    = d3.extent(incomingData, function(el) { return el.tweetTime; });
    var timeRamp = d3.time.scale().domain(startEnd).range([20,480]);
    var yScale = d3.scale.linear().domain([0,maxImpact]).range([0,460]);
    var radiusScale = d3.scale.linear().domain([0,maxImpact]).range([1,20]);
    var colorScale = d3.scale.linear().domain([0, maxImpact/2, maxImpact]).range(["yellow", "orange", "red"]);
    var tweetG = d3.select("#tweets svg").selectAll("g")
        .data(incomingData, function(d) {
            return JSON.stringify(d);
        })
        .enter()
        .append("g")
        .attr("transform", function(d) {
            return "translate(" +
            timeRamp(d.tweetTime) + "," + (480 - yScale(d.impact))
            + ")"; });

    tweetG.append("circle")
        .attr("r", function(d) {return radiusScale(d.impact);})
        .style("fill", function(d) {return colorScale(d.impact);})
        .style("stroke", "black")
        .style("stroke-width", "1px");
    
    tweetG.append("text")
        .text(function(d) {return d.user + "-" + d.impact;});
}

var button = document.querySelector("button");
button.addEventListener("click", function() { clicked(); });

function clicked() {
    d3.json("data/tweets.json", function(incomingData) { 
        var incomingData = incomingData.tweets;
        incomingData.forEach(function (el) {
            el.impact = el.favorites.length + el.retweets.length;
            el.tweetTime = new Date(el.timestamp);
        })
        var filteredData = incomingData.filter(function(el) { 
            return el.impact > 2
        });
        d3.selectAll("circle")
         .data(filteredData, function(d) {return JSON.stringify(d)})
         .exit()
         .remove();
    });
}

var svg1 = d3.select('#vizcontainer svg');
svg1.append('line')
    .attr('x1', 20)
    .attr('y1', 20)
    .attr('x2', 400)
    .attr('y2', 400)
    .style('stroke', 'black')
    .style('stroke-width', '2px');

svg1.append('text')
    .attr('x', 20)
    .attr('y', 20)
    .text('Hello');

svg1.append('circle')
    .attr('r', 100)
    .attr('cx', 400)
    .attr('cy', 400)
    .style('fill', 'red');

svg1.append('circle')
    .attr('r', 20)
    .attr('cx', 250)
    .attr('cy', 250)
    .style('fill', 'lightblue');

svg1.append('text')
    .attr('x', 400)
    .attr('y', 400)
    .text("World");

d3.selectAll('circle')
    .transition()
    .duration(2000)
    .attr('cy', 200)
    .attr('cx', 100);

// var yScale = d3.scale.linear().domain([0, 25000]).range([0, 100]);
var yScale = d3.scale.linear().domain([0,100, 1000, 25000]).range([0, 50, 75, 100]);

var testDiv = d3.select('#test');
testDiv.append("svg")
        .selectAll('rect')
        .data([15, 20, 8, 100, 10, 1000, 245000, 5555])
    .enter()
        .append('rect')
        .attr('width', 20)
        .attr('height', function(d) { return yScale(d); })
        .style("fill", "orange")
        .style("stroke", "red")
        .style("stroke-width", "2px")
        .style("opacity", 0.5)
        .attr("x", function(d, i) { return i * 20; })
        .attr("y", function(d) { return 100 - yScale(d); })


d3.json("data/tweets.json",function(data) { vizTweets(data); });

