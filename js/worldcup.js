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
    },
    header: function() {
        var _this = this;
        d3.select('svg')
            .append('text')
            .attr('transform', 'translate(20, 0)')
            .attr('id', 'header')
            .attr('X', 100)
            .attr('y', 60)
            .style('font-size', '20px')
    },
    overallTeam: function(data) {
        var _this = this;
        d3.select('svg')
            .attr('width', _this.width)
            .attr('height', "500px")
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
                .attr('r', 40)
                .style('fill', 'blue')
                .style('stroke', 'black')
                .style('stroke-width', '1px');
                // .on('mouseover', function(e) {
                //     console.log(this," ****",  e , " -  test  ");
                // });

        teamG.append('text')
                .style('text-anchor', 'middle')
                .attr('y', 60)
                .style('font-size', '12px')
                .text(function(d) { return d.team; });

        teamG.on('mouseover', _this.highlightRegion);
        teamG.on('mouseout', _this.deHighlight);
    },
    highlightRegion: function(d) {
        d3.selectAll('g.overallG')
            .select('circle')
            .style('fill', function(p) {
                return p.region === d.region ? "red" : "blue";
            });

        d3.select('#header')
            .text(function(p) { console.log(d , " -  test  ");return d.region; });
    },
    deHighlight: function(d) {
        d3.selectAll('g.overallG')
            .select('circle')
            .style('fill', function(p) { return "blue"; });
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
            var butts = document.getElementsByTagName('button');
            for(var i = 0; i < butts.length; i++) {
                butts[i].classList.remove('active');
            }
            (this.classList.contains('active')) ? this.classList.remove('active'): this.classList.add('active');
            var maxValue = d3.max(data, function(d) { return parseFloat(d[datapoint]); });
            var radiusScale = d3.scale.linear().domain([0, maxValue]).range([4, 40]);
            var teamG = d3.selectAll('g.overallG');
            teamG.select('circle')
                .attr('r', function(d) { return radiusScale(d[datapoint]) || 40; });
            
            teamG.select('text')
                .text(function(d) { return (d.team === d[datapoint]) ? d.team : d.team+ " : " +d[datapoint]; });

            d3.select('#header')
                .text(function(d) { return datapoint.toUpperCase(); });
        }


    },
}