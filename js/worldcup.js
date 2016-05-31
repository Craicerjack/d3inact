var WC = {
    width: function() {
        return document.getElementById('viz').offsetWidth;
    },
    createSoccerViz: function() {
        var _this = this;
        d3.csv('data/worldcup.csv', function(data) {
            _this.header();
            _this.overallTeam(data);
            _this.createButtons(data);
        });
        d3.html("resources/icon.svg", this.loadSVG);
    },
    loadSVG: function(data) {
        // while (!d3.select(data).selectAll("path").empty()) {
        //     d3.select("svg").node().appendChild(d3.select(data).select("path").node());
        // }
        // d3.select(data).selectAll("path").each(function() {
        //     d3.select("svg").node().appendChild(this);
        // });
        // d3.selectAll("path").attr("transform", "translate(50, 50)");
        d3.selectAll("g.overallG").each(function() {
            var gParent = this;
            d3.select(data).selectAll("path").each(function() {
                gParent.appendChild(this.cloneNode(true));
            });
            d3.selectAll("path").style("fill", "white")
                .style("stroke", "black").style("stroke-width", "1px");
        })
    },
    header: function() {
        var _this = this;
        d3.text("resources/modal.html", function(data) {
            d3.select("body")
                .append("div")
                .attr("id", "modal")
                .html(data);
        });
        d3.select('svg')
            .append('text')
            .attr('transform', 'translate(20, 0)')
            .attr('id', 'header')
            .attr('X', 100)
            .attr('y', 60)
            .style('font-size', '20px');

        
    },
    overallTeam: function(data) {
        var _this = this;
        d3.select('svg')
            .attr('width', _this.width)
            .attr('height', "300px")
            .append('g')
            .attr('id', 'teamsG')
            .attr('transform', 'translate(50, 100)')
            .selectAll('g')
            .data(data)
        .enter()
            .append('g')
            .attr('class', 'overallG')
            .attr('transform', function(d, i) {
                var no = _this.width()/8;
                return 'translate(' + (i * no) + ', 20)';
            });

        var teamG = d3.selectAll('g.overallG');

        teamG.append('circle')
                // start circles as invisble, grow them dependent on their place in the data array
                // and then shrink them back to regular size.
                .attr('r', 0)
                .transition()
                .delay(function(d, i) { return i * 100; })
                .duration(500)
                .attr("r", 40)
                .transition()
                .duration(500)
                .attr("r", 20)
                .style('fill', 'rgb(12, 67, 199)')
                .style('stroke', 'black')
                .style('stroke-width', '1px');
                // .on('mouseover', function(e) {
                //     console.log(this," ****",  e , " -  test  ");
                // });
        d3.select('circle').each(function(d, i) {
            console.log(d, " - ", i, " - ", this);
        });
        console.log(d3.select('circle').node() , " -  test  ");

        // add country flags to each circle
        // teamG.insert("image", "text")
        //         .attr("xlink:href", function(d) { return "images/" + d.team + ".png"; })
        //         .attr("width", "45px")
        //         .attr("height", "20px").attr("x", "-22")
        //         .attr("y", "-10");

        teamG.append('text')
                .style('text-anchor', 'middle')
                .attr('y', 60)
                .style('font-size', '12px')
                .text(function(d) { return d.team; });

        teamG.on('mouseover', _this.highlightRegion);
        teamG.on('mouseout', _this.deHighlight);
        teamG.on('click', _this.teamClick);
    },
    teamClick: function(d) {
        d3.selectAll("td.data")
            .data(d3.values(d))
            .html(function(p) { return p; });
    },
    highlightRegion: function(d) {
        d3.selectAll('g.overallG')
            .select('circle')
            .style('fill', function(p) {
                return p.region === d.region ? d3.rgb(12, 67, 199).brighter(5) : d3.rgb(12, 67, 199);
            });

        d3.select('#header')
            .text(function(p) { console.log(d , " -  test  ");return d.region; });
    },
    deHighlight: function(d) {
        d3.selectAll('g.overallG').select('circle').style('fill', "rgb(12, 67, 199)");
    },
    createButtons: function(data) {
        var _this = this;
        var dataKeys = d3.keys(data[0]).filter(function(header) {
            return header;
        });

        d3.select('#controls')
            .selectAll('buttons.teams')
            .data(dataKeys)
        .enter()
            .append('button')
            .on('click', buttonClick)
            .html(function(d) { return d; });

        function buttonClick(datapoint) {
            var button = this.textContent;
            var butts = document.getElementsByTagName('button');
            for(var i = 0; i < butts.length; i++) {
                butts[i].classList.remove('active');
            }
            (this.classList.contains('active')) ? this.classList.remove('active'): this.classList.add('active');
            var maxValue = d3.max(data, function(d) { return parseFloat(d[datapoint]); });
            var colorQuantize = d3.scale.quantize().domain([0, maxValue]).range(colorbrewer.Reds[8]);
            var tenColorScale = d3.scale.category10(['UEFA', 'CONMEBOL', 'CAF', 'AFC']);
            var radiusScale = d3.scale.linear().domain([0, maxValue]).range([4, 40]);
            var teamG = d3.selectAll('g.overallG');
            
            teamG.select('circle')
                .transition().duration(1000)
                .style("fill", function(p) {
                    return (button === 'region') ?  tenColorScale(p.region): colorQuantize(p[datapoint]);
                })  
                .attr('r', function(d) { return radiusScale(d[datapoint]) || 40; });
            
            teamG.select('text')
                .text(function(d) { return (d.team === d[datapoint]) ? d.team : d.team+ " : " +d[datapoint]; });

            d3.select('#header')
                .text(function(d) { return datapoint.toUpperCase(); });
        }
    }
}