import {loadData,uniqueAirports} from './data.js';
import {aggregateAirlines,aggregateCities} from './aggregation.js';
import {renderBars} from './bar-chart.js';
import {renderMap} from './map.js';
import {renderBubbles} from './bubble-chart.js';
import {fmt} from './config.js';
let selectedAirlineId=null;
async function main() {
  const {routes,countries}=await loadData();
  const airlines=aggregateAirlines(routes),cities=aggregateCities(routes),airports=uniqueAirports(routes);
  const globalMax=d3.max(cities,d=>d.count)||1;
  function onSelect(id) {selectedAirlineId=selectedAirlineId===id?null:id;updateViews();}
  function updateViews() {
    const activeRoutes=selectedAirlineId===null?routes:routes.filter(d=>d.AirlineID===selectedAirlineId);
    const activeCities=aggregateCities(activeRoutes);
    renderBars(airlines,selectedAirlineId,onSelect);
    renderMap(countries,airports,activeRoutes,selectedAirlineId);
    renderBubbles(activeCities,globalMax);
    const name=selectedAirlineId===null?'All airlines':airlines.find(d=>d.airlineId===selectedAirlineId).airlineName;
    d3.select('#status').text(`${name} · ${fmt(activeRoutes.length)} route records`);
    d3.select('#checks').text(`Loaded ${fmt(routes.length)} records · ${airlines.length} airlines · ${fmt(airports.length)} airports. City endpoints in this view: ${fmt(d3.sum(activeCities,d=>d.count))}.`);
  }
  d3.select('#reset').on('click',()=>{selectedAirlineId=null;updateViews();});
  window.matchMedia('(max-width:991.98px)').addEventListener('change',updateViews);
  updateViews();
}
main().catch(error=>{console.error(error);d3.select('#status').text(`Unable to load or render: ${error.message}. Open index.html with VS Code Live Server and check the browser Console.`);});
