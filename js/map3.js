var width = 1200,
    height = 800,
    k = 80,
    cr = [9.934739, -84.087502];

var sitesArray = ["Costa Rica", "Ireland", "Netherlands", "Puerto Rico", "United States"];
var sites = [];
var sclae, translate, visibleArea, invisibleArea;
var projection = d3.geo.orthographic().clipAngle(90).precision(0.6);
var canvas = d3.select("body").append("canvas").attr("width", width).attr("height", height);
var context = canvas.node().getContext("2d");
var path = d3.geo.path().projection(projection).context(context);
var title = d3.select("h1");

var zoom = d3.behavior.zoom()
        .scaleExtent([1,8]).on('zoom', zoomed);
        // .translate(projection.translate())
        // .scale(projection.scale())
        // .scaleExtent([projection.scale()/5, projection.scale()*5])
        // .on('zoom', zoomed);


var i = -1, n, globe, land, countries, borders;

queue()
    .defer(d3.json, "data/world.json")
    .defer(d3.json, "data/siteData.json")
    .await(ready);

function zoomed() {
    translate = zoom.translate();
    scale = zoom.scale();
    context.beginPath();
    path(sites[i]);
    context.stroke();
    console.log('zoomed  d- ', d);

    // var d = d || sites[i];
    // console.log('zoomed ' , d);
    // console.log('zoom' , zoom);
    // projection.translate(d3.event.translate).scale(d3.event.scale);
    // var zTranslate = zoom.translate();
    // var zScale = zoom.scale();
    // console.log(zTranslate, zScale, d);
    // context.clearRect(0, 0, width, height);
}

function zoomTo(location, scale) {
    console.log('scale ' , scale);  
    console.log('location ' , location);
    console.log('zoomTo ');
    var point = projection(location);
    return zoom.translate([width - point[0] * scale, height - point[1] * scale]).scale(scale);
}

function jump() {
    var t = d3.select(this);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "#f00", context.lineWidth = .5, context.beginPath(), path(sites[i]), context.stroke();
    context.fillStyle   = "#f00", context.beginPath(), path(sites[i]), context.fill();
    t = t.transition().call(zoomTo(sites[i], 10).event);


    canvas.transition()
        .duration(5000)
        // .call(zoomTo(sites[i], 10).event)
        .each("end", transition);
}

function transition() {
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
            context.clearRect(0, 0, width, height);
            context.strokeStyle = "#000", context.lineWidth = .5, context.beginPath(), path(land), context.stroke();
            context.fillStyle   = "#f00", context.beginPath(), path(sites[i]), context.fill();
            context.strokeStyle = "#000", context.lineWidth = .5, context.beginPath(), path(borders), context.stroke();
            context.strokeStyle = "#000", context.lineWidth = 2, context.beginPath(), path(globe), context.stroke();
        };
    })
    .transition()
    .each("end", jump);
};

function ready(error, world, names) {
    if (error) throw error;

    globe = {type: "Sphere"};
    land = topojson.feature(world, world.objects.land);
    countries = topojson.feature(world, world.objects.countries).features;
    borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });
    countries.forEach(function(country) {
        if ($.inArray(country.properties.name, sitesArray) > -1 ) {
            return sites.push(country);
        }
    });
    n = sites.length;
    transition();
}