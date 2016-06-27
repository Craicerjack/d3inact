// view-source:http://diethardsteiner.github.io/sample-files/gis/uk-election-results/uk-election-winners-5-click-to-zoom.html
var width = 960,
    height = 500;
var sitesArray = ["Costa Rica", "Ireland", "Netherlands", "Puerto Rico", "United States"];
var sites = [];
var country, site, centered;

var centroid = d3.geo.path().projection(function(d) { return d; }).centroid;

var projection = d3.geo.orthographic().scale(248).clipAngle(90);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule()
    .extent([[-180, -90], [180 - .1, 90 - .1]]);

var svg = d3.select('#map').append('svg')
    .attr('width', width)
    .attr('height', height);

var line = svg.append("path").datum(graticule).attr("class", "graticule").attr("d", path);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("zoom", highlightCountry);

var rotate = d3_geo_greatArcInterpolator();

var g = svg.append("g");

// load files
queue()
    .defer(d3.json, "data/world.json")
    .defer(d3.json, "data/siteData.json")
    .await(ready);

function ready(error, world, names) {
    if (error) throw error;  
    
    land = topojson.feature(world, world.objects.land);
    countries = topojson.feature(world, world.objects.countries).features;
    borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });
    countries.forEach(function(country) {
        if ($.inArray(country.properties.name, sitesArray) > -1 ) {
            return sites.push(country);
        }
    });
    i = -1;
    n = sites.length;
    
    // create a polygon for every constituency
    country = g.selectAll('.country')
        .data(countries)
        .enter()
        .insert('path', '.graticule')
        .attr("class", "country")
        .attr('id', function(d) { return "country"+d.id; })
        .attr('d', path)
        .on('zoom', highlightCountry);

    site = g.selectAll(".site")
        .data(sites)
        .enter().insert("path", ".graticule")
        .attr("class", "site")
        .attr("d", path)
        .on('zoom', highlightCountry);

    changeSite();
}

function changeSite() {
    console.log('changeSite()', i, " n - ")
    if (++i >= n) i = 0;
    // title.text(sites[i].properties.name);
    site.transition()
        .style("fill", function(d, j) { return j === i ? "red" : "#b8b8b8"; })
        .style("stroke", function(d, j) { if (j === i) { return "blue" } })
        .style("stroke-width", function(d, j) { if (j === i) { return "2px" } });
    console.log('site ' , site);
    d3.transition()
        .delay(250)
        .duration(1250)
        .tween("rotate", function() {
            var point = centroid(sites[i]);
            rotate.source(projection.rotate()).target([-point[0], -point[1]]).distance();
            return function(t) {
                projection.rotate(rotate(t));
                site.attr("d", path);
                country.attr("d", path);
                line.attr("d", path);
            };
        })
        .transition()
        .each("end", highlightCountry);
}

function zoomOut() {
    console.log('zoomOut ', i, n);
    var x, y, k;
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
    i ++;

    site.transition()
        .duration(2000)
        .selectAll(['.country', '.site'])
        .style('fill', '#b8b8b8')
        .style('stroke-width', '.5px')
        .transition()
        .delay(2000)
        .each('end', changeSite);
    
     d3.transition()
        .duration(2000)
        .selectAll('.graticule-outline')
        .style('fill', 'none')
        .style('stroke-width', '0')
    
     d3.transition()
        .duration(2000).selectAll('.graticule')
        .style('stroke-opacity', '0.3');

    g.transition()
        .duration(2000)  
        .selectAll('.country')
        .style('fill', '#b8b8b8');

    g.transition()
        .duration(2000)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style('fill', '#000')
        .selectAll('.site')
        .style("stroke-width", 1.5 / k + "px")
        .transition()
        .delay(2000)
        .each('end', changeSite);
}

////////////////////////////////////////////////////////////////////////
// ZOOM         ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function highlightCountry() {
    var d = sites[i];
    var x, y, k;

    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 20;
    centered = d;

    g.selectAll("path").classed("active", centered && function(d) { return d === centered; });

    site.transition()
        .duration(2000)
        .selectAll(['.country', '.site'])
        .style('fill', '#fff')
        .style('stroke-width', '0')
        .transition()
        .delay(2000)
        .each('end', zoomOut);
    
    d3.transition()
        .duration(2000)
        .selectAll('.graticule-outline')
        .style('fill', 'none')
        .style('stroke-width', '0')
    
    d3.transition()
        .duration(2000).selectAll('.graticule')
        .style('stroke-opacity', '0');

    g.transition()
        .duration(2000)  
        .select('#country'+d.id)
        .style('fill', '#000')
        .each('end', zoomOut);  

    g.transition()
        .duration(2000)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style('fill', '#000')
        .selectAll('.site')
        .style("stroke-width", 1.5 / k + "px");
}

////////////////////////////////////////////////////////////////////////
// ROTATION     ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
var d3_radians = Math.PI / 180;

function d3_geo_greatArcInterpolator() {
  var x0, y0, cy0, sy0, kx0, ky0,
      x1, y1, cy1, sy1, kx1, ky1,
      d,
      k;

  function interpolate(t) {
    var B = Math.sin(t *= d) * k,
        A = Math.sin(d - t) * k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
    return [
      Math.atan2(y, x) / d3_radians,
      Math.atan2(z, Math.sqrt(x * x + y * y)) / d3_radians
    ];
  }

  interpolate.distance = function() {
    if (d == null) k = 1 / Math.sin(d = Math.acos(Math.max(-1, Math.min(1, sy0 * sy1 + cy0 * cy1 * Math.cos(x1 - x0)))));
    return d;
  };

  interpolate.source = function(_) {
    var cx0 = Math.cos(x0 = _[0] * d3_radians),
        sx0 = Math.sin(x0);
    cy0 = Math.cos(y0 = _[1] * d3_radians);
    sy0 = Math.sin(y0);
    kx0 = cy0 * cx0;
    ky0 = cy0 * sx0;
    d = null;
    return interpolate;
  };

  interpolate.target = function(_) {
    var cx1 = Math.cos(x1 = _[0] * d3_radians),
        sx1 = Math.sin(x1);
    cy1 = Math.cos(y1 = _[1] * d3_radians);
    sy1 = Math.sin(y1);
    kx1 = cy1 * cx1;
    ky1 = cy1 * sx1;
    d = null;
    return interpolate;
  };

  return interpolate;
}