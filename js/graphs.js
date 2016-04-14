// d3.select("div")
//     .style("background-color", "pink")
//     .style("font-size", "24px")
//     .attr("id", "newDiv")
//     .attr("class", "d3div")
//     .on("click", function() {console.log("You clicked a div"); })
//     .html("D3 in effect y'all");

d3.select('svg')
    .append('line')
    .attr('x1', 20)
    .attr('y1', 20)
    .attr('x2', 400)
    .attr('y2', 400)
    .style('stroke', 'black')
    .style('stroke-width', '2px');

d3.select('svg')
    .append('text')
    .attr('x', 20)
    .attr('y', 20)
    .text('Hello');

d3.select('svg')
    .append('circle')
    .attr('r', 100)
    .attr('cx', 400)
    .attr('cy', 400)
    .style('fill', 'red');

d3.select('svg')
    .append('circle')
    .attr('r', 20)
    .attr('cx', 250)
    .attr('cy', 250)
    .style('fill', 'lightblue');

d3.select('svg')
    .append('text')
    .attr('x', 400)
    .attr('y', 400)
    .text("World");

d3.selectAll('circle')
    .transition()
    .duration(2000)
    .attr('cy', 200);