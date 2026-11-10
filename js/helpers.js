import {config,fmt} from './config.js';
// A common translation preserves all distances and bubble radii.
export function centerNodes(nodes,radius) {
  if (!nodes.length) return;
  const c=config.bubble;
  const minX=d3.min(nodes,d=>d.x-radius(d.count)),maxX=d3.max(nodes,d=>d.x+radius(d.count));
  const minY=d3.min(nodes,d=>d.y-radius(d.count)),maxY=d3.max(nodes,d=>d.y+radius(d.count));
  for (const d of nodes) {d.x+=(c.width-minX-maxX)/2;d.y+=(c.height-minY-maxY)/2;}
}
export function drawHubLabels(layer,top) {
  // Reserve a right-hand label column; stable vertical slots prevent text overlap.
  const narrow=window.matchMedia('(max-width:991.98px)').matches;
  d3.select('#bubbles').attr('viewBox',narrow?'0 0 740 1080':'0 0 1100 640');
  const sorted=[...top].sort((a,b)=>a.y-b.y);
  const groups=layer.selectAll('g').data(sorted,d=>d.cityKey).join('g');
  groups.each(function(d,i){
    const g=d3.select(this),y=narrow?700+Math.floor(i/2)*125:100+i*100,x=narrow?30+(i%2)*360:828;
    g.selectAll('path').data([d]).join('path').attr('d',narrow?`M${d.x},${d.y} L${x},${y-24}`:`M${d.x},${d.y} L800,${y} L820,${y}`).attr('display',narrow?'none':null).attr('fill','none').attr('stroke','#8d663f').attr('stroke-width',1);
    const text=g.selectAll('text.hub-label').data([d]).join('text').attr('class','hub-label').attr('x',x).attr('y',y-4).attr('font-size',narrow?18:14);
    text.selectAll('tspan').data([`${top.indexOf(d)+1}. ${d.city}`,d.country,`${fmt(d.count)} endpoints`]).join('tspan').attr('x',x).attr('dy',(v,j)=>j===0?0:19).text(v=>v);
    g.selectAll('text.hub-number').data(narrow?[d]:[]).join('text').attr('class','hub-number')
      .attr('x',d.x).attr('y',d.y).attr('dy','0.35em').attr('text-anchor','middle')
      .attr('font-size',16).text(top.indexOf(d)+1);
  });
  d3.select('#top-cities').selectAll('li').data(top,d=>d.cityKey).join('li').text(d=>`${d.city}, ${d.country}: ${fmt(d.count)}`);
}
export function drawSizeLegend(radius) {
  const groups=d3.select('#size-legend').selectAll('g').data([100,500,1000]).join('g').attr('transform',(d,i)=>`translate(${70+i*170},48)`);
  groups.selectAll('circle').data(d=>[d]).join('circle').attr('r',radius).attr('fill','none').attr('stroke','#345e87');
  groups.selectAll('text').data(d=>[d]).join('text').attr('y',55).attr('text-anchor','middle').attr('font-size',13).text(d=>`${fmt(d)} endpoints`);
}
