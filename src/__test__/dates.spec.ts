import * as d3 from 'd3';
import dayjs from 'dayjs';

describe('dates', () => {
  it('range', () => {
    const start = new Date('2021-01-01');
    const end = new Date('2021-01-03');
    const extent = [start, end];
    const dateRange = d3.scaleTime().domain(extent).ticks(d3.timeDay);
    const diffCount = dayjs(end).diff(start, 'day');
    expect(dateRange.length).toEqual(diffCount + 1);
  });
});
