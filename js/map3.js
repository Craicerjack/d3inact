var width = 960,
    height = 500,
    k = 80;

var sitesArray = ["Costa Rica", "Ireland", "Netherlands", "Puerto Rico", "United States"];
var sites = [];
var projection = d3.geo.orthographic().clipAngle(90).precision(0.6);
var canvas = d3.select("body").append("canvas").attr("width", width).attr("height", height);
var c = canvas.node().getContext("2d");
var path = d3.geo.path().projection(projection).context(c);
var title = d3.select("h1");
var zoom = d3.behavior.zoom().size([width, height]).on('zoom', zoomed);

queue()
    .defer(d3.json, "data/world.json")
    .defer(d3.json, "data/siteData.json")
    .await(ready);

function ready(error, world, names) {
if (error) throw error;

var globe = {type: "Sphere"},
land = topojson.feature(world, world.objects.land),
countries = topojson.feature(world, world.objects.countries).features,
borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
i = -1;
countries.forEach(function(country) {
if ($.inArray(country.properties.name, sitesArray) > -1 ) {
return sites.push(country);
}
});
var n = sites.length;
c.strokeStyle = "#000", c.lineWidth = .5, c.beginPath(), path(land), c.stroke();
c.fillStyle   = "#f00", c.beginPath(), path(sites[i]), c.fill();
c.strokeStyle = "#000", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();

(function transition() {
d3.transition()
.duration(1250)
.each("start", function() {
title.text(sites[i = (i + 1) % n].properties.name);
})
.tween("rotate", function() {
var p = d3.geo.centroid(sites[i]),
r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
return function(t) {
projection.rotate(r(t));
c.clearRect(0, 0, width, height);
c.strokeStyle = "#000", c.lineWidth = .5, c.beginPath(), path(land), c.stroke();
c.fillStyle   = "#f00", c.beginPath(), path(sites[i]), c.fill();
c.strokeStyle = "#000", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
};
})
.transition()
.each("end", transition);
})();
}