import {config,compareCities,fmt} from './config.js';
import {centerNodes,drawHubLabels,drawSizeLegend} from './helpers.js';
const svg=d3.select('#bubbles'),marks=svg.append('g'),labels=svg.append('g');
export function renderBubbles(cities,globalMax) {
  const c=config.bubble;
  const radius=d3.scaleSqrt().domain([0,globalMax||1]).range([0,c.maxRadius]);
  const nodes=cities.map(d=>({...d})).sort(compareCities),top=nodes.slice(0,5),topKeys=new Set(top.map(d=>d.cityKey));
  const simulation=d3.forceSimulation(nodes).stop().velocityDecay(c.velocityDecay)
    .force('x',d3.forceX(370).strength(c.strength)).force('y',d3.forceY(c.height/2).strength(c.strength))
    .force('collide',d3.forceCollide(d=>radius(d.count)+c.gap).iterations(3));
  simulation.tick(c.ticks);
  centerNodes(nodes,radius);
  // Keep a stable 740px layout region and reserve the rest for direct labels.
  for (const d of nodes) d.x-=180;
  marks.selectAll('circle').data(nodes,d=>d.cityKey).join('circle').attr('class','city-bubble').attr('data-key',d=>d.cityKey)
    .attr('cx',d=>d.x).attr('cy',d=>d.y).attr('r',d=>radius(d.count)).attr('fill',d=>topKeys.has(d.cityKey)?config.colors.hub:config.colors.bubble)
    .attr('stroke','white').attr('stroke-width',0.6).selectAll('title').data(d=>[d]).join('title').text(d=>`${d.city}, ${d.country}: ${fmt(d.count)} route endpoints`);
  drawHubLabels(labels,top);drawSizeLegend(radius);
  d3.select('#bubble-status').text(`${fmt(cities.length)} cities · ${fmt(d3.sum(cities,d=>d.count))} route endpoints · five leading cities highlighted`);
}
