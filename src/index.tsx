import * as d3 from 'd3';

const container = d3.select('#container');

// draw a chart
container
  .append('svg')
  .attr('width', 100)
  .attr('height', 100)
  .append('circle')
  .attr('cx', 50)
  .attr('cy', 50)
  .attr('r', 50)
  .attr('fill', 'red');
