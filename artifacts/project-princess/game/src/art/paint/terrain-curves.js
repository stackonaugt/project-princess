// Trace tile centres and round the joins into continuous banks and kerbs.
const EDGES = { 1:[[3,0]], 2:[[0,1]], 3:[[3,1]], 4:[[1,2]], 5:[[3,0],[1,2]], 6:[[0,2]], 7:[[3,2]], 8:[[2,3]], 9:[[0,2]], 10:[[0,1],[2,3]], 11:[[1,2]], 12:[[1,3]], 13:[[0,1]], 14:[[3,0]] };
export function terrainContours(map, letters, tile = 16) {
  const inside = (x,y) => x>=0 && y>=0 && x<map.w && y<map.h && letters.includes(map.ground[y][x]);
  const graph = new Map(), points = new Map();
  const connect = (a,b) => {
    const ka=a.join(','), kb=b.join(','); points.set(ka,a); points.set(kb,b);
    if (!graph.has(ka)) graph.set(ka,[]);
    if (!graph.has(kb)) graph.set(kb,[]);
    graph.get(ka).push(kb); graph.get(kb).push(ka);
  };
  for (let y=0;y<=map.h;y++) for (let x=0;x<=map.w;x++) {
    const bits=(inside(x-1,y-1)?1:0)|(inside(x,y-1)?2:0)|(inside(x,y)?4:0)|(inside(x-1,y)?8:0);
    const v=[[x*tile,(y-.5)*tile],[(x+.5)*tile,y*tile],[x*tile,(y+.5)*tile],[(x-.5)*tile,y*tile]];
    for (const [a,b] of EDGES[bits]||[]) connect(v[a],v[b]);
  }
  const visited=new Set(), loops=[];
  for (const first of graph.keys()) {
    if (visited.has(first)) continue;
    const loop=[]; let prev=null,current=first;
    while (current && !visited.has(current)) {
      visited.add(current); loop.push(points.get(current));
      const next=graph.get(current).find(k=>k!==prev); prev=current; current=next;
    }
    if (current===first && loop.length>=3) loops.push(loop);
  }
  return loops;
}
export function traceTerrain(ctx,loops) {
  ctx.beginPath();
  for (const source of loops) {
    // Smooth the tile-scale notches before rounding each remaining join.
    // Limit smoothing on tiny loops so small ponds and islands remain visible.
    let loop=source;
    for (let pass=0;pass<Math.min(3,Math.floor(source.length/8));pass++) loop=loop.map((p,i)=>{
      const a=loop[(i+loop.length-1)%loop.length],b=loop[(i+1)%loop.length];
      return [(a[0]+2*p[0]+b[0])/4,(a[1]+2*p[1]+b[1])/4];
    });
    const last=loop.at(-1),first=loop[0]; ctx.moveTo((last[0]+first[0])/2,(last[1]+first[1])/2);
    for (let i=0;i<loop.length;i++) {
      const p=loop[i],next=loop[(i+1)%loop.length];
      ctx.quadraticCurveTo(p[0],p[1],(p[0]+next[0])/2,(p[1]+next[1])/2);
    }
    ctx.closePath();
  }
}
