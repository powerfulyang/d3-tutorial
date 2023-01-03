import type { Selection } from 'd3';
import * as d3 from 'd3';
import { scaleLinear } from 'd3';
import type { Datum } from '@/basic/base';
import { data, dateExtent, padding, width } from '@/basic/base';

const xHistogramExtent = [dateExtent[0], d3.timeSecond.offset(dateExtent[1], 24 * 60 * 60 - 1)] as [
  Date,
  Date,
];
export const xHistogramScale = d3
  .scaleTime()
  .domain(xHistogramExtent)
  .range([0, width - 2 * padding]);
export function createHistogram(brushElement: Selection<SVGGElement, unknown, HTMLElement, any>) {
  const histogram = d3
    .bin<Pick<Datum, 'date' | 'distinctIpCount'>, Date>()
    .domain(xHistogramExtent)
    .thresholds(xHistogramScale.ticks(d3.timeDay))
    .value((d) => d.date);

  const bins = histogram(
    data.map((d) => {
      return { date: d.date, distinctIpCount: d.distinctIpCount };
    }),
  )
    .filter((x) => {
      return x[0] !== undefined && x.x0 !== undefined && x.x1 !== undefined;
    })
    .map((x) => {
      return {
        distinctIpCount: x[0].distinctIpCount,
        x0: x.x0 as Date,
        x1: x.x1 as Date,
      };
    });
  const height = 50;
  const maxDistinctIpCount = d3.max(data, (d) => d.distinctIpCount) || 0;
  const yHistogramScale = d3.scaleLinear().domain([maxDistinctIpCount, 0]).range([0, height]);
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
    .attr('x', (d) => {
      return xHistogramScale(d.x0) + 1;
    })
    .attr('y', (d) => {
      return yHistogramScale(d.distinctIpCount);
    })
    .attr('width', (d) => {
      return xHistogramScale(d.x1) - xHistogramScale(d.x0) - 1;
    })
    .attr('height', (d) => {
      return height - yHistogramScale(d.distinctIpCount);
    })
    .style('fill', (d) => {
      return yHistogramColor(d.distinctIpCount);
    });
}
