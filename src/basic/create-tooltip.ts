import * as d3 from 'd3';
import type { Datum } from '@/basic/base';
import { data, height, padding, svg, width, xScale, yScale } from '@/basic/base';

export const hiddenTooltip = () => {
  d3.select('.tooltip-line').style('opacity', '0');
  d3.selectAll('.tooltip-group circle').style('opacity', '0');
  d3.selectAll('.tooltip-group text').style('opacity', '0');
  d3.select('.tooltip-text').style('opacity', '0');
};

export const showTooltip = () => {
  d3.select('.tooltip-line').style('opacity', '1');
  d3.selectAll('.tooltip-group circle').style('opacity', '1');
  d3.selectAll('.tooltip-group text').style('opacity', '1');
  d3.select('.tooltip-text').style('opacity', '1');
};

export function createTooltip() {
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
    .data(['requestCount', 'distinctIpCount'])
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
      hiddenTooltip();
    })
    .on('mouseover', () => {
      // on mouse in show line, circles and text
      showTooltip();
    })
    .on('mousemove', (event) => {
      const mouse = d3.pointer(event);
      const x = xScale;
      const y = yScale;
      const xDate = x.invert(mouse[0]);
      const idx = d3.bisector((d1: Datum) => d1.date).center(data, xDate);
      const x1 = x(data[idx].date) || 0;
      const y1 = height - 2 * padding;
      const y2 = 0;
      if (x1 < 0 || x1 > width - 2 * padding) {
        // 超出边界，不显示
        return;
      }
      // below is line element
      // d3.select('.tooltip-line').attr('x1', x1).attr('x2', x1).attr('y1', y1).attr('y2', y2);
      d3.select('.tooltip-line')
        .datum([
          [x1, y1],
          [x1, y2],
        ])
        .attr('d', d3.line());
      const t = d3
        .select<SVGTextElement, unknown>('.tooltip-text')
        .text(data[idx].date.toDateString());
      const tW = t.node()?.getBBox().width || 0;
      t.style('transform', `translate(${x1 - tW / 2}px, 0)`);

      d3.selectAll<SVGGElement, 'requestCount' | 'distinctIpCount'>('.tooltip-group').attr(
        'transform',
        function group(d) {
          const value = data[idx][d];
          d3.select(this).select('text').text(value.toFixed(0));
          return `translate(${x(data[idx].date)},${y(value)})`;
        },
      );
    });
}
