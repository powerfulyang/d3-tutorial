import * as d3 from 'd3';
import { axisBottom, axisLeft, max, scaleLinear, scaleUtc, select } from 'd3';

const prefix = process.env.BASE_URL;

const res = await fetch(`${prefix}/api/public/view-count`);
const sourceData = (await res.json()) as {
  createAt: string;
  requestCount: number;
  distinctRequestCount: number;
  distinctIpCount: number;
}[];
const data = sourceData.reverse();

const container = select('#container');

const width = 1300;
const height = 600;
const padding = 50;
const svg = container.append('svg').attr('width', width).attr('height', height);

// 根据 $data 绘制折线图

const maxValue =
  max(data, (d) => Math.max(d.requestCount, d.distinctRequestCount, d.distinctIpCount)) || 0;

const xScale = scaleUtc()
  .domain(d3.extent(data, (d) => new Date(d.createAt)) as [Date, Date])
  .range([0, width - 2 * padding]);

const yScale = scaleLinear()
  .domain([maxValue, 0])
  .range([0, height - 2 * padding]);

// 绘制 x 轴
const xAxis = svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(${padding},${height - padding})`)
  .call(axisBottom(xScale));
// y 轴
svg
  .append('g')
  .attr('class', 'axis')
  .attr('transform', `translate(${padding},${padding})`)
  .call(axisLeft(yScale));
// 绘制折线
const line = svg
  .append('g')
  .attr('transform', `translate(${padding},${padding})`)
  .attr('clip-path', 'url(#clip)');

// 绘制 requestCount 折线
const requestCountData = data.map((d) => d.requestCount);
line
  .append('path')
  .datum(requestCountData)
  .attr('class', 'line')
  .attr('fill', 'none')
  .attr('stroke', 'steelblue')
  .attr('stroke-width', 1)
  .attr(
    'd',
    d3
      .line<number>()
      .x((d, i) => xScale(new Date(data[i].createAt)) || 0)
      .y((d) => yScale(d) || 0),
  );

// 绘制 distinctRequestCount 折线
const distinctRequestCountData = data.map((d) => d.distinctRequestCount);
line
  .append('path')
  .datum(distinctRequestCountData)
  .attr('class', 'line')
  .attr('fill', 'none')
  .attr('stroke', 'red')
  .attr('stroke-width', 1)
  .attr(
    'd',
    d3
      .line<number>()
      .x((d, i) => xScale(new Date(data[i].createAt)) || 0)
      .y((d) => yScale(d) || 0),
  );

// 绘制 distinctIpCount 折线
const distinctIpCountData = data.map((d) => d.distinctIpCount);
line
  .append('path')
  .datum(distinctIpCountData)
  .attr('class', 'line')
  .attr('fill', 'none')
  .attr('stroke', 'green')
  .attr('stroke-width', 1)
  .attr(
    'd',
    d3
      .line<number>()
      .x((d, i) => xScale(new Date(data[i].createAt)) || 0)
      .y((d) => yScale(d) || 0),
  );

// clip
svg
  .append('defs')
  .append('svg:clipPath')
  .attr('id', 'clip')
  .append('svg:rect')
  .attr('width', width - 2 * padding)
  .attr('height', height - 2 * padding)
  .attr('x', 0)
  .attr('y', 0);

let idleTimeout: NodeJS.Timeout | null;
function idled() {
  idleTimeout = null;
}

const brush = d3.brushX().extent([
  [0, 0],
  [width - 2 * padding, height - 2 * padding],
]);

const updateChart = (event: any) => {
  const extent = event.selection;
  if (!extent) {
    if (!idleTimeout) {
      idleTimeout = setTimeout(idled, 350);
      return;
    }
    xScale.domain(d3.extent(data, (d) => new Date(d.createAt)) as [Date, Date]);
  } else {
    xScale.domain([xScale.invert(extent[0]), xScale.invert(extent[1])]);
    brush.move(line.select<SVGGElement>('.brush'), null);
  }

  // update axis and line position
  xAxis.transition().duration(1000).call(axisBottom(xScale));
  line
    .selectAll<SVGPathElement, number[]>('.line')
    .transition()
    .duration(1000)
    .attr(
      'd',
      d3
        .line<number>()
        .x((d, i) => xScale(new Date(data[i].createAt)) || 0)
        .y((d) => yScale(d) || 0),
    );
};

brush.on('end', updateChart);

// add the brushing
line.append('g').attr('class', 'brush').call(brush);
