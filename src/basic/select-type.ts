import {
  clipHeight,
  clipWidth,
  createDistinctIpCountLine,
  createRequestCountLine,
  data,
  padding,
  svg,
  yDomain,
  yScale,
} from '@/basic/base';
import {
  drawDistinctIpCountLineWithAnimate,
  drawRequestCountLineWithAnimate,
  redrawYAxis,
  xAxisHeight,
} from '@/basic/brush-element';
import * as d3 from 'd3';

const g = svg
  .append('g')
  .attr('transform', `translate(${clipWidth / 2},${clipHeight + xAxisHeight + padding + 20})`);

const requestCount = g
  .append('g')
  .attr('class', 'active')
  .style('fill', d3.schemeSet1[0])
  .on('click', function click() {
    const el = d3.select(this);
    if (el.classed('active')) {
      el.classed('active', false);
      el.style('fill', '#ccc');
      d3.select('.line').remove();
      const max = d3.max(data, (d) => d.distinctIpCount)!;
      yScale.domain([max, 0]);
      redrawYAxis();
      drawDistinctIpCountLineWithAnimate();
    } else {
      el.classed('active', true);
      el.style('fill', d3.schemeSet1[0]);
      yScale.domain(yDomain);
      redrawYAxis();
      createRequestCountLine();
      drawDistinctIpCountLineWithAnimate();
    }
  });

requestCount
  .append('text')
  .text('requestCount')
  .attr('class', 'request-count-line')
  .attr('transform', 'translate(-100,0)')
  .style('cursor', 'pointer');
requestCount.append('circle').attr('r', 2).attr('transform', 'translate(-110,-4)');

const distinctIpCount = g
  .append('g')
  .attr('class', 'active')
  .style('fill', d3.schemeSet1[1])
  .on('click', function click() {
    const el = d3.select(this);
    if (el.classed('active')) {
      el.classed('active', false);
      el.style('fill', '#ccc');
      d3.select('.curve-line').remove();
      const max = d3.max(data, (d) => d.requestCount)!;
      yScale.domain([max, 0]);
      redrawYAxis();
      drawRequestCountLineWithAnimate();
    } else {
      el.classed('active', true);
      el.style('fill', d3.schemeSet1[1]);
      yScale.domain(yDomain);
      redrawYAxis();
      createDistinctIpCountLine();
      drawRequestCountLineWithAnimate();
    }
  });

distinctIpCount
  .append('text')
  .text('distinctIpCount')
  .attr('class', 'distinct-ip-count-line')
  .attr('transform', 'translate(100,0)')
  .style('cursor', 'pointer');
distinctIpCount.append('circle').attr('r', 2).attr('transform', 'translate(90,-4)');
