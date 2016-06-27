var width = 960,
    height = 500;
var sitesArray = ["Costa Rica", "Ireland", "Netherlands", "Puerto Rico", "United States"];
var sites = [];
var country, site;

var centroid = d3.geo.path().projection(function(d) { return d; }).centroid;

var projection = d3.geo.orthographic().scale(248).clipAngle(90);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule()
    .extent([[-180, -90], [180 - .1, 90 - .1]]);

var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

var line = svg.append("path").datum(graticule).attr("class", "graticule").attr("d", path);

svg.append("circle")
    .attr("class", "graticule-outline")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale());

var title = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height * 3 / 5);

var rotate = d3_geo_greatArcInterpolator();

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

    country = svg.selectAll(".country")
        .data(countries)
    .enter().insert("path", ".graticule")
        .attr("class", "country")
        .attr('id', function(d) { return d.id; })
        .attr('d', path)
        .on('zoom', zoomed);

    site = svg.selectAll(".site")
        .data(sites)
        .enter().insert("path", ".graticule")
        .attr("class", "site")
        .attr("d", path)
        .call(d3.behavior.zoom().on('zoom', redraw))

    step();
};

function zoom(xyz) {
    console.log('zoom()')
    console.log('xyz ' , xyz);
    d3.transition()
        .duration(2000)
        .attr('transform', 'translate(' + projection.translate() + ')scale(' + xyz[2] + ')translate(-' + xyz[0] + ', -' + xyz[1] +')')
        .selectAll(['.country', '.site'])
        .style('fill', '#000')
        .style('stroke-width', '0')//1.0/xyz[2] + 'px')
    d3.transition()
        .duration(2000)
        .selectAll('.graticule-outline')
        .style('fill', 'none')
        .style('stroke-width', '0');

    d3.transition()
        .duration(2000)
        .selectAll('.graticule')
        .style('stroke-opacity', '0');

}

function getXyz(d) {
    console.log('getXyz()')
    var bounds = path.bounds(site[0][i].__data__);
    var wScale = (bounds[1][0] - bounds[0][0] / width);
    var hScale = (bounds[1][1] - bounds[0][1] / height);
    var z = .96 / Math.max(wScale, hScale);
    var x = (bounds[1][0] + bounds[0][0]) / 2;
    var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
    return [x, y, z];
}

function zoomed(d) {
    console.log('zoomed()')
    var s = d3.select(site[0][i]);
    var xyz = getXyz();
    zoom(xyz);
    // var xyz = [width / 2, height / 1.5, 1];
    // setTimeout(zoom(xyz), 2000);
    // setTimeout(step, 5000);


    // if(site) {
    //    svg.selectAll('#'+site.id).style('display', null);
    // }

    // if (d && site !==d) {
    //     var xyz = getXyz(d);
    //     site = d;
    //     zoom(xyz);
    // } else {
    //     var xyz = [width / 2, height / 1.5, 1];

    //     zoom(xyz);
    // }
    // step();
}

function step() {
    console.log('step()')
    if (++i >= n) i = 0;

    title.text(sites[i].properties.name);

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
        .each("end", this.redraw);
}




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