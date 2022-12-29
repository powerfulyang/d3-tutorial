import * as d3 from 'd3';
import dayjs from 'dayjs';

describe('dates', () => {
  it('range', () => {
    const start = new Date('2021-01-01');
    const end = new Date('2022-12-31');
    const array = d3.utcDay.range(start, end);
    const extent = d3.extent(array, (d) => d);
    expect(extent).toEqual([start, new Date('2022-12-30')]);
    const count = dayjs(end).diff(dayjs(start), 'day');
    expect(array.length).toEqual(count);
  });
});
