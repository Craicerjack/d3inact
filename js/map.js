queue()
    .defer(d3.json, "data/world.geojson")
    .defer(d3.json, "data/cities.json")
    .await(function(er, f1, f2) {
        createMap(f1, f2);
    });

function createMap(countries, cities) {
    var width = 500;
    var height = 500;

    var aProjection = d3.geo.mercator()
                            .scale(180)
                            .translate([width/1.2, height/1.4]);
    var geoPath = d3.geo.path().projection(aProjection);
    
    var map = d3.select('#map svg');

    map.selectAll('path')
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("class", "countries")
        .style("fill", "lightblue")
        .style("stroke", "black");

    var g = map.append('g').attr('transform', 'translate(-10, -10)');
    g.selectAll(".city")//adding mark in the group
       .data(cities.cities)
    .enter()
       .append("image")
       .attr('class', 'mark')
       .attr('width', 20)
       .attr('height', 20)
       .attr("xlink:href", 'resources/map_marker.svg')
       .attr("transform", function(d) {
            return "translate(" + aProjection([d.coordinates[1], d.coordinates[0]]) + ")";
       });



    // g.selectAll('circle')
    //     .data(cities.cities)
    //     .enter()
    //     .append('circle')
    //     .style('fill', 'blue')
    //     .attr('class', 'cities')
    //     .attr('r', 5)
    //     .attr('cx', function(d) { 
    //         return aProjection([d.coordinates[1], d.coordinates[0]])[0]; 
    //     })
    //     .attr('cy', function(d) { return aProjection([d.coordinates[1], d.coordinates[0]])[1]; });

    map.selectAll('.mark').on('click', clicked);

    function clicked(d) {
        alert(d.name);
    }

}


// Map Marker by anbileru adaleru from the Noun Project