'use strict';

angular.module('colorvoteApp')
  .directive('chart', function () {
    return {
      template: '<svg width="500" height="500" class="chart"><g class="transform"><g class="x axis"></g><g class="y axis"></g></g></svg>',
	  replace: true,
      restrict: 'E',
	  scope: {
		data: '=data'
	  },
      link: function postLink(scope, element, attrs) {
		scope.$watch('data', function(){
			var margin = {top: 30, right: 20, bottom: 30, left: 40},
				width = 500 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			var formatPercent = d3.format(".0%");

			var x = d3.scale.ordinal()
				.rangeRoundBands([0, width], .1);

			var y = d3.scale.linear()
				.range([height, 0]);
			
			var data = scope.data;
			var keys = d3.keys(data).sort();
				
			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

			var yMax= d3.sum(d3.values(data));
			var yAxis = d3.svg.axis()
				.scale(y)
				.tickFormat(d3.format("d"))
				.tickSubdivide(0)
				.orient("left");

			var svg = d3.select(element[0])
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.select('g.transform').attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			x.domain(keys);
			y.domain([0, d3.max(d3.values(data))]);

			svg.select("g.x.axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			svg.select('g.y.axis')
				.transition().duration(1000)
				.call(yAxis);

			var bar = svg.selectAll(".bar")
				.data(d3.entries(data));
			var barEnter = bar.enter()
			var barG = barEnter.append("g")
				.attr("class", "bar")
				.attr("transform", function(d) { return 'translate(' + x(d.key) + ',0)'; });
			
			//repeat code not to have flash in animation		
			barG.append("rect")
				.attr("class", function(d){ return 'color-' + d.key;})
				.attr("width", x.rangeBand())
				.attr("y", function(d) { return y(d.value); })
				.attr("height", function(d) { return height - y(d.value); });
			barG.append('text')
				.attr('x',  x.rangeBand()/2 - 12)
				.attr('y', function(d) { return y(d.value) - 8; });
				
			bar.attr("transform", function(d) { return 'translate(' + x(d.key) + ',0)'; });
				
			bar.select("rect").transition().duration(1000)
				.attr("y", function(d) { return y(d.value); })
				.attr("height", function(d) { return height - y(d.value); });
			bar.select("rect")
				.attr("width", x.rangeBand());
			bar.select('text').transition().duration(1000)
				.text(function(d){ return formatPercent(d.value/yMax || 0);})
				.attr('y', function(d) { return y(d.value) - 8; });
			bar.select('text')
				.attr('x',  x.rangeBand()/2 - 12);
				
			bar.exit().remove();
		}, true);
      }
    };
  });
