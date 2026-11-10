export const cityKey = (city,country) => JSON.stringify([city,country]);
export async function loadData() {
  const [text,countries] = await Promise.all([d3.text('data/airline-routes.csv'),d3.json('data/countries.geo.json')]);
  const routes = d3.csvParse(text.replace(/^\uFEFF/,''), row => {
    for (const side of ['Source','Dest']) {
      for (const field of ['Latitude','Longitude']) {
        const key=side+field;
        if (!row[key]?.trim()) throw new Error(`Missing ${key} in route ${row.ID}`);
        row[key]=Number(row[key]);
        if (!Number.isFinite(row[key]) || Math.abs(row[key])>(field==='Latitude'?90:180)) throw new Error(`Invalid ${key}`);
      }
    }
    return row;
  });
  // The supplied GeoJSON contains an oppositely wound polygon. Normalize
  // each polygon for D3 spherical geometry without editing the source file.
  for (const feature of countries.features) {
    const geometry=feature.geometry;
    const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.type==='MultiPolygon'?geometry.coordinates:[];
    for (const rings of polygons) {
      if (d3.geoArea({type:'Polygon',coordinates:rings})>2*Math.PI) for (const ring of rings) ring.reverse();
    }
  }
  return {routes,countries};
}
export function uniqueAirports(routes) {
  const airports=new Map();
  for (const route of routes) for (const side of ['Source','Dest']) {
    const airportId=route[side+'AirportID'];
    if (!airports.has(airportId)) airports.set(airportId,{airportId,name:route[side+'Airport'],longitude:route[side+'Longitude'],latitude:route[side+'Latitude']});
  }
  return [...airports.values()];
}
export function routeToFeature(route) {
  return {type:'Feature',geometry:{type:'LineString',coordinates:[[route.SourceLongitude,route.SourceLatitude],[route.DestLongitude,route.DestLatitude]]}};
}
