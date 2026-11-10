import {config,fmt} from './config.js';
const svg=d3.select('#bars'), c=config.bar;
const marks=svg.append('g'),labels=svg.append('g'),axis=svg.append('g');
export function renderBars(airlines,selectedAirlineId,onSelect) {
  const sorted=[...airlines].sort((a,b)=>b.count-a.count || d3.ascending(a.airlineName,b.airlineName) || d3.ascending(a.airlineId,b.airlineId));
  const x=d3.scaleLinear().domain([0,d3.max(sorted,d=>d.count)||1]).nice().range([0,c.width-c.left-c.right]);
  const y=d3.scaleBand().domain(sorted.map(d=>d.airlineId)).range([c.top,c.height-c.bottom]).padding(0.22);
  marks.selectAll('rect').data(sorted,d=>d.airlineId).join('rect').attr('class','airline-bar')
    .attr('data-id',d=>d.airlineId).attr('x',c.left).attr('y',d=>y(d.airlineId)).attr('width',d=>x(d.count)).attr('height',y.bandwidth())
    .attr('fill',d=>d.airlineId===selectedAirlineId?config.colors.selected:config.colors.bar)
    .attr('stroke',d=>d.airlineId===selectedAirlineId?'#192c3d':'none').attr('stroke-width',2)
    .attr('tabindex',0).attr('role','button').attr('aria-label',d=>`${d.airlineName}: ${fmt(d.count)} route records`)
    .attr('aria-pressed',d=>String(d.airlineId===selectedAirlineId))
    .on('click',(event,d)=>onSelect(d.airlineId)).on('keydown',(event,d)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(d.airlineId);}});
  labels.selectAll('.name').data(sorted,d=>d.airlineId).join('text').attr('class','name').attr('x',c.left-10).attr('y',d=>y(d.airlineId)+y.bandwidth()/2).attr('dy','0.35em').attr('text-anchor','end').attr('font-size',13).text(d=>d.airlineName);
  labels.selectAll('.count').data(sorted,d=>d.airlineId).join('text').attr('class','count').attr('x',d=>c.left+x(d.count)+6).attr('y',d=>y(d.airlineId)+y.bandwidth()/2).attr('dy','0.35em').attr('font-size',13).text(d=>fmt(d.count));
  axis.attr('transform',`translate(${c.left},${c.height-c.bottom})`).call(d3.axisBottom(x).ticks(5));
  svg.selectAll('.axis-title').data([0]).join('text').attr('class','axis-title').attr('x',c.left).attr('y',c.height-8).attr('font-size',14).text('Route records');
}
