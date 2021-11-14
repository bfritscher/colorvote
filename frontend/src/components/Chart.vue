<template>
  <svg ref="svgRef" width="500" height="500" class="chart">
    <g class="transform">
      <g class="x axis"></g>
      <g class="y axis"></g>
    </g>
  </svg>
</template>
<script>
import * as d3 from "d3";
import { onMounted, ref, watchEffect } from "vue";

function drawChart(element, data) {
  const margin = { top: 30, right: 20, bottom: 30, left: 40 },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const formatPercent = d3.format(".0%");

  const x = d3.scaleBand().range([0, width]).round(0.1);

  const y = d3.scaleLinear().range([height, 0]);

  const keys = Object.keys(data).map(x => parseInt(x));

  const xAxis = d3.axisBottom(x);

  const yMax = d3.sum(data);
  const yAxis = d3.axisLeft(y).tickFormat(d3.format("d"));
  //.tickSubdivide(0);

  const svg = d3
    .select(element)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .select("g.transform")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(keys);
  y.domain([0, d3.max(data)]);

  svg
    .select("g.x.axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.select("g.y.axis").transition().duration(1000).call(yAxis);

  const bar = svg
    .selectAll(".bar")
    .data(data.map((value, key) => ({ key, value })));
  const barEnter = bar.enter();
  const barG = barEnter
    .append("g")
    .attr("class", "bar")
    .attr("transform", (d) => {
      return "translate(" + x(d.key) + ",0)";
    });

  //repeat code not to have flash in animation
  barG
    .append("rect")
    .attr("class", (d) => {
      return "color-" + d.key;
    })
    .attr("width", x.bandwidth())
    .attr("y", (d) => {
      return y(d.value);
    })
    .attr("height", (d) => {
      return height - y(d.value);
    });
  barG
    .append("text")
    .attr("x", x.bandwidth() / 2 - 12)
    .attr("y", (d) => {
      return y(d.value) - 8;
    });

  bar.attr("transform", (d) => {
    return "translate(" + x(d.key) + ",0)";
  });

  bar
    .select("rect")
    .transition()
    .duration(1000)
    .attr("y", (d) => {
      return y(d.value);
    })
    .attr("height", (d) => {
      return height - y(d.value);
    });
  bar.select("rect").attr("width", x.bandwidth());
  bar
    .select("text")
    .transition()
    .duration(1000)
    .text((d) => {
      return formatPercent(d.value / yMax || 0);
    })
    .attr("y", (d) => {
      return y(d.value) - 8;
    });
  bar.select("text").attr("x", x.bandwidth() / 2 - 12);

  bar.exit().remove();
}

export default {
  name: "Chart",
  props: ["data"],
  setup(props) {
    const svgRef = ref(null);
    onMounted(() => {
      watchEffect(() => {
        drawChart(svgRef.value, props.data);
      });
    });
    return {
      svgRef,
    };
  },
};
</script>
<style>
.chart {
  background-color: white;
  display: block;
}
.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}
.x.axis path {
  display: none;
}
</style>
