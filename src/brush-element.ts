import * as d3 from 'd3';
import { axisBottom, axisLeft, scaleLinear } from 'd3';
import dayjs from 'dayjs';
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
  xDomain,
  xScale,
  xScaleCopy,
  yAxis,
  yDomain,
  yScale,
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
      xScale.domain(xDomain);
      yScale.domain(yDomain);
    } else {
      // do nothing
      return;
    }
  } else {
    changed = true;
    const start = xScaleCopy.invert(extent[0]);
    const end = xScaleCopy.invert(extent[1]);
    xScale.domain([start, end]);
    const dateRange = d3.scaleUtc().domain([start, end]).ticks(d3.utcDay);
    const startDate = d3.min(dateRange);
    const endDate = d3.max(dateRange);
    const startSliceIndex = data.findIndex((d) => d.date === dayjs(startDate).format('YYYY-MM-DD'));
    const endSliceIndex = data.findIndex((d) => d.date === dayjs(endDate).format('YYYY-MM-DD'));
    const slicedData = data.slice(startSliceIndex, endSliceIndex + 1);
    const maxValue =
      d3.max(slicedData, (d) =>
        Math.max(d.requestCount, d.distinctRequestCount, d.distinctIpCount),
      ) || 0;
    yScale.domain([maxValue, 0]);
  }

  // remove existing circles
  line.selectAll('.circle').remove();
  // update axis and line position
  xAxis.transition().duration(1000).call(axisBottom(xScale));
  yAxis.transition().duration(1000).call(axisLeft(yScale));
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

const histogram = d3
  .bin<Datum, number>()
  .thresholds(data.length)
  .value((_, i) => i);

const bins = histogram(data);
const maxDistinctIpCount = d3.max(data, (d) => d.distinctIpCount) || 0;
const yHistogramScale = d3.scaleLinear().domain([maxDistinctIpCount, 0]).range([0, 50]);
const yHistogramColor = scaleLinear<string, number>()
  .domain([0, maxDistinctIpCount])
  .range(['#ffffff', '#0000ff']);

// 添加直方图
const binWidth = (width - 2 * padding) / bins.length;
brushElement
  .insert('g', ':first-child')
  .attr('class', 'brush-histogram')
  .selectAll('rect')
  .data(bins)
  .join('rect')
  .attr('width', () => {
    return binWidth;
  })
  .attr('height', (d) => {
    if (d[0]) {
      return 50 - yHistogramScale(d[0].distinctIpCount);
    }
    return 0;
  })
  .style('fill', (d) => {
    if (d[0]) {
      return yHistogramColor(d[0].distinctIpCount);
    }
    return yHistogramColor(0);
  })
  .attr('transform', (d, i) => {
    if (d[0]) {
      return `translate(${binWidth * i},${yHistogramScale(d[0].distinctIpCount)})`;
    }
    return null;
  });
