export const config = {
  bar: {width:560,height:660,left:190,right:52,top:12,bottom:52},
  map: {width:800,height:560,scale:122,translate:[400,340]},
  bubble: {width:1100,height:640,maxRadius:43,gap:1.2,strength:0.025,ticks:420,velocityDecay:0.3},
  colors: {bar:'#345e87',selected:'#7654a3',airport:'#aab6bf',active:'#c96219',bubble:'#789bbb',hub:'#e8a263'}
};
export const fmt = d3.format(',');
export const compareCities = (a,b) => b.count-a.count || d3.ascending(a.cityKey,b.cityKey);
