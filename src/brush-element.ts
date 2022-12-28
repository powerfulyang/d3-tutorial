import * as d3 from 'd3';
import { axisBottom, scaleLinear } from 'd3';
import type { Datum } from './base';
import {
  data,
  genCurveLinePos,
  genLinePos,
  height,
  line,
  padding,
  svg,
  width,
  xAxis,
  xScale,
  xScaleBackUp,
} from './base';

const brush = d3.brushX().extent([
  [0, 0],
  [width - 2 * padding, padding],
]);

let changed = false;
const updateChart = (event: any) => {
  const extent = event.selection;
  if (!extent) {
    if (changed) {
      changed = false;
      xScale.domain(d3.extent(data, (d) => new Date(d.createAt)) as [Date, Date]);
    } else {
      // do nothing
      return;
    }
  } else {
    changed = true;
    xScale.domain([xScaleBackUp.invert(extent[0]), xScaleBackUp.invert(extent[1])]);
  }

  // remove existing circles
  line.selectAll('.circle').remove();
  // update axis and line position
  xAxis.transition().duration(1000).call(axisBottom(xScale));
  line
    .selectAll<SVGPathElement, number[]>('.line')
    .transition()
    .duration(1000)
    .attr('d', genLinePos());
  line
    .selectAll<SVGPathElement, number[]>('.curve-line')
    .transition()
    .duration(1000)
    .attr('d', genCurveLinePos());
};

brush.on('end', updateChart);

// add the brushing
const brushElement = svg
  .append('g')
  .attr('class', 'brush')
  .attr('transform', `translate(${padding},${height - padding + 20})`)
  .call(brush);

//
const histogram = d3
  .bin<Datum, Date>()
  .value((d) => {
    return new Date(d.createAt);
  })
  .domain(xScale.domain() as [Date, Date])
  .thresholds(data.map((d) => new Date(d.createAt)));
const bins = histogram(data);
const maxDistinctIpCount = d3.max(data, (d) => d.distinctIpCount) || 0;
const yHistogramScale = d3.scaleLinear().domain([maxDistinctIpCount, 0]).range([0, 50]);
const yHistogramColor = scaleLinear<string, number>()
  .domain([0, maxDistinctIpCount])
  .range(['#ffffff', '#0000ff']);
// 添加直方图
brushElement
  .insert('g', ':first-child')
  .attr('class', 'brush-histogram')
  .selectAll('rect')
  .data(bins)
  .join('rect')
  .attr('width', (d) => {
    return xScale(d.x1!) - xScale(d.x0!);
  })
  .attr('height', (_, i) => {
    return 50 - yHistogramScale(data[i].distinctIpCount);
  })
  .style('fill', (_, i) => {
    return yHistogramColor(data[i].distinctIpCount);
  })
  .attr('transform', (d, i) => {
    return `translate(${xScale(d.x0!)},${yHistogramScale(data[i].distinctIpCount)})`;
  });
