import {config,fmt} from './config.js';
import {uniqueAirports,routeToFeature} from './data.js';
const svg=d3.select('#map'),land=svg.append('g'),background=svg.append('g'),lines=svg.append('g'),foreground=svg.append('g');
export function renderMap(countries,airports,activeRoutes,selectedAirlineId) {
  const projection=d3.geoMercator().scale(config.map.scale).translate(config.map.translate);
  const path=d3.geoPath(projection);
  land.selectAll('path').data(countries.features).join('path').attr('d',path).attr('fill','#edf1f4').attr('stroke','#cbd5de').attr('stroke-width',0.5);
  background.selectAll('circle').data(airports,d=>d.airportId).join('circle').attr('class','airport').attr('cx',d=>projection([d.longitude,d.latitude])[0]).attr('cy',d=>projection([d.longitude,d.latitude])[1]).attr('r',1.8).attr('fill',config.colors.airport);
  const selected=selectedAirlineId===null?[]:activeRoutes;
  lines.selectAll('path').data(selected,d=>d.ID).join('path').attr('class','route').attr('d',d=>path(routeToFeature(d))).attr('fill','none').attr('stroke',config.colors.selected).attr('stroke-width',0.7).attr('opacity',0.17);
  foreground.selectAll('circle').data(uniqueAirports(selected),d=>d.airportId).join('circle').attr('class','selected-airport').attr('cx',d=>projection([d.longitude,d.latitude])[0]).attr('cy',d=>projection([d.longitude,d.latitude])[1]).attr('r',2.6).attr('fill',config.colors.active);
  d3.select('#map-status').text(selectedAirlineId===null?'All airports · select an airline to reveal routes.':`${fmt(uniqueAirports(selected).length)} selected airports · ${fmt(selected.length)} route records`);
}
