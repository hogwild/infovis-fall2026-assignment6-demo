import {cityKey} from './data.js';
export function aggregateAirlines(routes) {
  const groups=new Map();
  for (const route of routes) {
    const id=route.AirlineID;
    if (!groups.has(id)) groups.set(id,{airlineId:id,airlineName:route.AirlineName,count:0});
    groups.get(id).count+=1;
  }
  return [...groups.values()];
}
export function aggregateCities(routes) {
  const groups=new Map();
  for (const route of routes) for (const side of ['Source','Dest']) {
    const city=route[side+'City'],country=route[side+'Country'],key=cityKey(city,country);
    if (!groups.has(key)) groups.set(key,{cityKey:key,city,country,count:0});
    groups.get(key).count+=1;
  }
  return [...groups.values()];
}
