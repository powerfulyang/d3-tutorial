import * as d3 from 'd3';
import { axisBottom, axisLeft, max, scaleLinear, scaleTime, select } from 'd3';
import { prefix } from '@/constants/prefix';
import dayjs from 'dayjs';

export type Datum = {
  date: Date;
  requestCount: number;
  distinctIpCount: number;
};
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const headers = new Headers({
  'x-client-timezone': timezone,
});
const res = await fetch(`${prefix}/api/public/view-count`, {
  headers,
});
const array = await res.json();
const sourceData: Datum[] = array.reverse().map((x: any) => {
  return {
    date: d3.timeDay(new Date(x.date)),
    requestCount: x.requestCount,
    distinctRequestCount: x.distinctRequestCount,
    distinctIpCount: x.distinctIpCount,
  };
});
export const dateExtent = d3.extent(sourceData, (d) => d.date) as [Date, Date];
// complete the date range
export const dateRange = d3.scaleTime().domain(dateExtent).ticks(d3.timeDay);

export const data = dateRange.map((date) => {
  const datum = sourceData.find((d) => {
    return dayjs(d.date).isSame(date);
  });
  if (datum) {
    return datum;
  }
  return {
    date,
    requestCount: 0,
    distinctRequestCount: 0,
    distinctIpCount: 0,
  };
});

const container = select('#container');

export const width = 1300;
export const height = 600;
export const padding = 50;
export const svg = container
  .append('svg')
  .attr('width', width)
  .attr('height', height + 150);

// 根据 $data 绘制折线图
const maxValue = max(data, (d) => Math.max(d.requestCount, d.distinctIpCount)) || 0;

export const xScale = scaleTime()
  .domain(dateExtent)
  .range([0, width - 2 * padding]);
export const xScaleCopy = xScale.copy();

export const yScale = scaleLinear()
  .domain([maxValue, 0])
  .range([0, height - 2 * padding]);
export const yScaleCopy = yScale.copy();
export const yDomain = yScaleCopy.domain() as [number, number];

export const genLinePos = () => {
  return d3
    .line<number>()
    .x((d, i) => xScale(data[i].date) || 0)
    .y((d) => yScale(d) || 0);
};

export const genCurveLinePos = () => {
  return genLinePos().curve(d3.curveMonotoneX);
};

// 绘制 x 轴
export const xAxis = svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(${padding},${height - padding})`)
  .call(axisBottom(xScale));
// y 轴
export const yAxis = svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(${padding},${padding})`)
  .call(axisLeft(yScale));
// 绘制折线
export const line = svg
  .append('g')
  .attr('transform', `translate(${padding},${padding})`)
  .attr('clip-path', 'url(#clip)');

// 绘制 requestCount 折线
export const requestCountData = data.map((d) => d.requestCount);

export function createRequestCountLine() {
  return line
    .append('path')
    .datum(requestCountData)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', d3.schemeSet1[0])
    .attr('stroke-width', 1)
    .attr('d', genLinePos());
}

export const requestCountLine = createRequestCountLine();

// animation
const line1Path = requestCountLine.node()?.getTotalLength();
if (line1Path) {
  requestCountLine
    .attr('stroke-dasharray', line1Path)
    .attr('stroke-dashoffset', line1Path)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);
}

// 绘制 distinctIpCount 折线
const distinctIpCountData = data.map((d) => d.distinctIpCount);

export function createDistinctIpCountLine() {
  line
    .append('path')
    .datum(distinctIpCountData)
    .attr('class', 'curve-line')
    .attr('fill', 'none')
    .attr('stroke', d3.schemeSet1[1])
    .attr('stroke-width', 1)
    .attr('d', genCurveLinePos());
}

createDistinctIpCountLine();

// clip to avoid animation overflow
export const clipWidth = width - 2 * padding;
export const clipHeight = height - 2 * padding;
svg
  .append('defs')
  .append('clipPath')
  .attr('id', 'clip')
  .append('rect')
  .attr('width', clipWidth)
  .attr('height', clipHeight)
  .attr('x', 0)
  .attr('y', 0);
