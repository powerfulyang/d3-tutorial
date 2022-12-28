import * as d3 from 'd3';
import { axisBottom, axisLeft, max, scaleLinear, scaleUtc, select } from 'd3';

const prefix = process.env.BASE_URL;

export type Datum = {
  createAt: string;
  requestCount: number;
  distinctRequestCount: number;
  distinctIpCount: number;
};
const res = await fetch(`${prefix}/api/public/view-count`);
const sourceData = (await res.json()) as Datum[];
export const data = sourceData.reverse();

const container = select('#container');

export const width = 1300;
export const height = 600;
export const padding = 50;
export const svg = container
  .append('svg')
  .attr('width', width)
  .attr('height', height + 150);

// 根据 $data 绘制折线图

const maxValue =
  max(data, (d) => Math.max(d.requestCount, d.distinctRequestCount, d.distinctIpCount)) || 0;

export const xScale = scaleUtc()
  .domain(d3.extent(data, (d) => new Date(d.createAt)) as [Date, Date])
  .range([0, width - 2 * padding]);
export const xScaleBackUp = scaleUtc()
  .domain(d3.extent(data, (d) => new Date(d.createAt)) as [Date, Date])
  .range([0, width - 2 * padding]);

export const yScale = scaleLinear()
  .domain([maxValue, 0])
  .range([0, height - 2 * padding]);

export const genLinePos = () => {
  return d3
    .line<number>()
    .x((d, i) => xScale(new Date(data[i].createAt)) || 0)
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
svg
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
const requestCountData = data.map((d) => d.requestCount);
const line1 = line
  .append('path')
  .datum(requestCountData)
  .attr('class', 'line')
  .attr('fill', 'none')
  .attr('stroke', d3.schemeSet1[0])
  .attr('stroke-width', 1)
  .attr('d', genLinePos());

// animation
const line1Path = line1.node()?.getTotalLength();
if (line1Path) {
  line1
    .attr('stroke-dasharray', line1Path)
    .attr('stroke-dashoffset', line1Path)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0)
    .end()
    .finally(() => {
      line1.attr('stroke-dasharray', null).attr('stroke-dashoffset', null);
    });
}

// 绘制 distinctRequestCount 折线
const distinctRequestCountData = data.map((d) => d.distinctRequestCount);
line
  .append('path')
  .datum(distinctRequestCountData)
  .attr('class', 'curve-line')
  .attr('fill', 'none')
  .attr('stroke', d3.schemeSet1[1])
  .attr('stroke-width', 1)
  .attr('d', genCurveLinePos());

// 绘制 distinctIpCount 折线
const distinctIpCountData = data.map((d) => d.distinctIpCount);
line
  .append('path')
  .datum(distinctIpCountData)
  .attr('class', 'line')
  .attr('fill', 'none')
  .attr('stroke', d3.schemeSet1[2])
  .attr('stroke-width', 1)
  .attr('d', genLinePos());

// clip
svg
  .append('defs')
  .append('clipPath')
  .attr('id', 'clip')
  .append('rect')
  .attr('width', width - 2 * padding)
  .attr('height', height - 2 * padding)
  .attr('x', 0)
  .attr('y', 0);

// tooltip
const tooltip = svg
  .append('g')
  .attr('class', 'tooltip')
  .attr('transform', `translate(${padding},${padding})`);

tooltip
  // this is the black vertical line to follow mouse
  // .append('line')
  .append('path')
  .attr('class', 'tooltip-line')
  .style('stroke', '#ccc')
  .style('stroke-width', '1px')
  .style('opacity', '0');

tooltip.append('text').attr('class', 'tooltip-text').style('opacity', '0');

const tooltipGroup = tooltip
  .selectAll('.tooltip-group')
  .data(['requestCount', 'distinctRequestCount', 'distinctIpCount'])
  .enter()
  .append('g')
  .attr('class', 'tooltip-group');

tooltipGroup
  .append('circle')
  .attr('r', 2)
  .style('fill', (_, i) => {
    return d3.schemeSet1[i];
  })
  .style('opacity', '0');

tooltipGroup
  .append('text')
  .style('fill', (_, i) => {
    return d3.schemeSet1[i];
  })
  .attr('transform', 'translate(10,3)');

tooltip
  .append('rect') // append a rect to catch mouse movements on canvas
  .attr('width', width - 2 * padding) // can't catch mouse events on a g element
  .attr('height', height - 2 * padding)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', () => {
    // on mouse out hide line, circles and text
    d3.select('.tooltip-line').style('opacity', '0');
    d3.selectAll('.tooltip-group circle').style('opacity', '0');
    d3.selectAll('.tooltip-group text').style('opacity', '0');
    d3.select('.tooltip-text').style('opacity', '0');
  })
  .on('mouseover', () => {
    // on mouse in show line, circles and text
    d3.select('.tooltip-line').style('opacity', '1');
    d3.selectAll('.tooltip-group circle').style('opacity', '1');
    d3.selectAll('.tooltip-group text').style('opacity', '1');
    d3.select('.tooltip-text').style('opacity', '1');
  })
  .on('mousemove', (event) => {
    const mouse = d3.pointer(event);
    const x = xScale;
    const y = yScale;
    const xDate = x.invert(mouse[0]);
    const idx = d3.bisector((d1: any) => new Date(d1.createAt)).right(data, xDate);
    const x1 = x(new Date(data[idx].createAt)) || 0;
    const y1 = height - 2 * padding;
    const y2 = 0;
    // below is line element
    // d3.select('.tooltip-line').attr('x1', x1).attr('x2', x1).attr('y1', y1).attr('y2', y2);
    d3.select('.tooltip-line')
      .datum([
        [x1, y1],
        [x1, y2],
      ])
      .attr('d', d3.line());
    const t = d3.select<SVGTextElement, unknown>('.tooltip-text').text(data[idx].createAt);
    const tW = t.node()?.getBBox().width || 0;
    t.style('transform', `translate(${x1 - tW / 2}px, 0)`);

    d3.selectAll<SVGGElement, 'requestCount' | 'distinctRequestCount' | 'distinctIpCount'>(
      '.tooltip-group',
    ).attr('transform', function group(d) {
      const value = data[idx][d];
      d3.select(this).select('text').text(value.toFixed(0));
      return `translate(${x(new Date(data[idx].createAt))},${y(value)})`;
    });
  });
