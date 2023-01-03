import * as d3 from 'd3';
import { axisBottom, axisLeft } from 'd3';
import dayjs from 'dayjs';
import { createHistogram, xHistogramScale } from '@/basic/create-histogram';
import {
  data,
  dateExtent,
  genCurveLinePos,
  genLinePos,
  height,
  line,
  padding,
  svg,
  width,
  xAxis,
  xScale,
  yAxis,
  yDomain,
  yScale,
} from './base';

const brush = d3.brushX().extent([
  [0, 0],
  [width - 2 * padding, padding],
]);

export const redrawYAxis = () => {
  yAxis.transition().duration(1000).call(axisLeft(yScale));
};

export const drawRequestCountLineWithAnimate = () => {
  line
    .selectAll<SVGPathElement, number[]>('.line')
    .transition()
    .duration(1000)
    .attr('d', genLinePos());
};

export const drawDistinctIpCountLineWithAnimate = () => {
  line
    .selectAll<SVGPathElement, number[]>('.curve-line')
    .transition()
    .duration(1000)
    .attr('d', genCurveLinePos());
};

let changed = false;
const updateChart = (event: any) => {
  const extent = event.selection;
  if (!extent) {
    if (changed) {
      changed = false;
      xScale.domain(dateExtent);
      yScale.domain(yDomain);
    } else {
      // do nothing
      return;
    }
  } else {
    changed = true;
    const start = xHistogramScale.invert(extent[0]);
    const end = xHistogramScale.invert(extent[1]);
    const domain = [d3.timeDay(start), d3.timeDay(end)];
    const dateRange = d3.scaleTime().domain(domain).ticks(d3.timeDay);
    const startDate = d3.min(dateRange);
    const endDate = d3.max(dateRange);
    if (startDate && endDate) {
      xScale.domain([startDate, endDate]);
      const startSliceIndex = data.findIndex((d) => dayjs(startDate).isSame(d.date));
      const endSliceIndex = data.findIndex((d) => dayjs(endDate).isSame(d.date));
      const slicedData = data.slice(startSliceIndex, endSliceIndex + 1);
      const maxValue = d3.max(slicedData, (d) => Math.max(d.requestCount, d.distinctIpCount)) || 0;
      yScale.domain([maxValue, 0]);
    } else {
      changed = false;
    }
  }

  // remove existing circles
  line.selectAll('.circle').remove();
  // update axis and line position
  xAxis.transition().duration(1000).call(axisBottom(xScale));
  redrawYAxis();
  drawRequestCountLineWithAnimate();
  drawDistinctIpCountLineWithAnimate();
};

brush.on('end', updateChart);

export const xAxisHeight = 20;
export const selectTypeHeight = 30;

export function createBrushElement() {
  // add the brushing
  const brushElement = svg
    .append('g')
    .attr('class', 'brush')
    .attr('transform', `translate(${padding},${height - padding + xAxisHeight + selectTypeHeight})`)
    .call(brush);
  createHistogram(brushElement);
}
