/* =========================================================
   ISOLATION — shared map vocabulary
   Loaded by both the game (index.html) and the editor (editor.html)
   so there is exactly one definition of what a tile is.

   To add a tile type: add one entry to TILES. It appears in the
   editor palette automatically and the game obeys it immediately.
   ========================================================= */
(function(global){
'use strict';

/* Every tile is one character in a map row.
   walk  — can the unit stand here
   fill  — body colour (null = draw nothing, pure negative space)
   line  — outline colour
   glyph — optional character stamped in the tile
   bump  — log line when the unit walks into it (non-walkable)
   enter — log line the first time the unit steps on it (walkable)
   alert — log lines from this tile are rendered as warnings        */
const TILES = {
  ' ': {key:' ', id:'void',   name:'Unmapped',  walk:false, fill:null,
        bump:'Edge of mapped space. Nothing registers beyond.'},
  '.': {key:'.', id:'floor',  name:'Floor',     walk:true,  fill:'rgba(28,240,28,.045)', line:'rgba(28,240,28,.14)'},
  ',': {key:',', id:'debris', name:'Debris',    walk:true,  fill:'rgba(28,240,28,.085)', line:'rgba(28,240,28,.14)', glyph:'·',
        enter:'Loose material underfoot. Composition unlogged.'},
  '=': {key:'=', id:'plate',  name:'Plating',   walk:true,  fill:'rgba(28,240,28,.11)',  line:'rgba(28,240,28,.2)',  glyph:'='},
  '+': {key:'+', id:'door',   name:'Doorway',   walk:true,  fill:'rgba(255,180,74,.16)', line:'rgba(255,180,74,.55)',glyph:'+',
        enter:'Threshold registered.'},
  '#': {key:'#', id:'wall',   name:'Wall',      walk:false, fill:'rgba(28,240,28,.2)',   line:'rgba(28,240,28,.45)',
        bump:'Obstruction. No route through.'},
  '%': {key:'%', id:'bulk',   name:'Bulkhead',  walk:false, fill:'rgba(191,247,220,.22)',line:'rgba(191,247,220,.5)', glyph:'▚',
        bump:'Bulkhead. Sealed from the far side.'},
  '~': {key:'~', id:'sludge', name:'Sludge',    walk:true,  fill:'rgba(79,133,112,.28)', line:'rgba(79,133,112,.5)', glyph:'~',
        enter:'Surface unstable. Traction reduced.'},
  '!': {key:'!', id:'hazard', name:'Hazard',    walk:true,  fill:'rgba(255,59,47,.18)',  line:'rgba(255,59,47,.55)', glyph:'!',
        enter:'WARNING: RADIOLOGICAL SPIKE. DO NOT LINGER.', alert:true},
  'o': {key:'o', id:'relay',  name:'Relay',     walk:false, fill:'rgba(255,180,74,.2)',  line:'rgba(255,180,74,.7)', glyph:'◉',
        bump:'Fixed structure. Origin unknown.'},
};
const ORDER = Object.keys(TILES);
const VOID = TILES[' '];

const def = ch => TILES[ch] || VOID;

/* ---------- map objects ---------- */
/* A map is { id, name, w, h, spawn:{x,y}, beacons:[{x,y}], rows:[string] } */
function makeMap(opts){
  opts = opts || {};
  const w = Math.max(1, opts.w|0 || 24), h = Math.max(1, opts.h|0 || 16);
  const fill = opts.fill || '.';
  return normalize({
    id: opts.id || 'untitled',
    name: opts.name || 'Untitled Sector',
    w, h,
    spawn: opts.spawn || {x:w>>1, y:h>>1},
    beacons: opts.beacons || [],
    rows: opts.rows || Array.from({length:h}, ()=>fill.repeat(w)),
  });
}

/* Pad/trim rows so they always match w x h exactly, and keep markers in bounds. */
function normalize(map){
  const w = Math.max(1, map.w|0), h = Math.max(1, map.h|0);
  const rows = [];
  for(let y=0;y<h;y++){
    let r = map.rows && map.rows[y] || '';
    if(r.length < w) r = r + ' '.repeat(w - r.length);
    rows.push(r.slice(0,w));
  }
  map.w = w; map.h = h; map.rows = rows;
  map.spawn = clampPt(map.spawn || {x:0,y:0}, w, h);
  map.beacons = (map.beacons||[]).map(p=>clampPt(p,w,h));
  return map;
}
const clampPt = (p,w,h) => ({x:Math.min(w-1,Math.max(0,p.x|0)), y:Math.min(h-1,Math.max(0,p.y|0))});

const inside = (map,x,y) => x>=0 && y>=0 && x<map.w && y<map.h;
const tileAt = (map,x,y) => inside(map,x,y) ? map.rows[y][x] : ' ';
const at     = (map,x,y) => def(tileAt(map,x,y));
const walkable = (map,x,y) => at(map,x,y).walk;

function setTile(map,x,y,ch){
  if(!inside(map,x,y)) return false;
  const r = map.rows[y];
  if(r[x] === ch) return false;
  map.rows[y] = r.slice(0,x) + ch + r.slice(x+1);
  return true;
}

/* Resize about an anchor: dx/dy shift the existing content inside the new frame. */
function resize(map, w, h, dx, dy){
  w = Math.max(1,w|0); h = Math.max(1,h|0); dx = dx|0; dy = dy|0;
  const rows = [];
  for(let y=0;y<h;y++){
    let r = '';
    for(let x=0;x<w;x++) r += tileAt(map, x-dx, y-dy);
    rows.push(r);
  }
  map.w = w; map.h = h; map.rows = rows;
  map.spawn = {x:map.spawn.x+dx, y:map.spawn.y+dy};
  map.beacons = map.beacons.map(p=>({x:p.x+dx, y:p.y+dy}))
                           .filter(p=>p.x>=0&&p.y>=0&&p.x<w&&p.y<h);
  return normalize(map);
}

/* Trim unmapped space from all four edges. */
function trim(map){
  let x0=map.w, y0=map.h, x1=-1, y1=-1;
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++){
    if(tileAt(map,x,y)!==' '){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
  }
  if(x1<0) return map;                       // nothing but void — leave it alone
  return resize(map, x1-x0+1, y1-y0+1, -x0, -y0);
}

/* Flood fill of everything walkable reachable from a point (4-way). */
function reachable(map, from){
  const seen = new Set();
  if(!from || !walkable(map, from.x, from.y)) return seen;
  const q = [[from.x, from.y]];
  seen.add(from.x+','+from.y);
  while(q.length){
    const [x,y] = q.pop();
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx, ny=y+dy, k=nx+','+ny;
      if(seen.has(k) || !walkable(map,nx,ny)) continue;
      seen.add(k); q.push([nx,ny]);
    }
  }
  return seen;
}

/* Health check the editor surfaces and the game can log. */
function audit(map){
  const out = {walkable:0, unreachable:0, issues:[]};
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++) if(walkable(map,x,y)) out.walkable++;
  if(!walkable(map, map.spawn.x, map.spawn.y))
    out.issues.push('Spawn sits on '+at(map,map.spawn.x,map.spawn.y).name+' — the unit cannot stand there.');
  const seen = reachable(map, map.spawn);
  out.reached = seen.size;
  out.unreachable = out.walkable - seen.size;
  if(out.unreachable > 0) out.issues.push(out.unreachable+' walkable tile(s) are sealed off from spawn.');
  map.beacons.forEach((b,i)=>{
    if(!walkable(map,b.x,b.y)) out.issues.push('Beacon '+(i+1)+' is inside '+at(map,b.x,b.y).name+'.');
    else if(!seen.has(b.x+','+b.y)) out.issues.push('Beacon '+(i+1)+' cannot be reached from spawn.');
  });
  if(!out.walkable) out.issues.push('No walkable ground anywhere on this map.');
  return out;
}

/* ---------- serialising ---------- */
function toJSON(map){
  return '{\n'+
    '  "id": '+JSON.stringify(map.id)+',\n'+
    '  "name": '+JSON.stringify(map.name)+',\n'+
    '  "w": '+map.w+',\n  "h": '+map.h+',\n'+
    '  "spawn": {"x": '+map.spawn.x+', "y": '+map.spawn.y+'},\n'+
    '  "beacons": ['+map.beacons.map(b=>'{"x": '+b.x+', "y": '+b.y+'}').join(', ')+'],\n'+
    '  "rows": [\n'+map.rows.map(r=>'    '+JSON.stringify(r)).join(',\n')+'\n  ]\n}';
}

/* The editor exports this: a drop-in maps/<id>.js that self-registers. */
function toModule(map){
  return '/* ISOLATION map — edit by hand, or open editor.html and load this file. */\n'+
         'ISO.register('+toJSON(map)+');\n';
}

function parse(text){
  const s = String(text).trim();
  const i = s.indexOf('{'), j = s.lastIndexOf('}');
  if(i < 0 || j < i) throw new Error('No map data found in that file.');
  const data = JSON.parse(s.slice(i, j+1));
  if(!Array.isArray(data.rows)) throw new Error('Map has no "rows" array.');
  if(!data.w) data.w = Math.max(...data.rows.map(r=>r.length));
  if(!data.h) data.h = data.rows.length;
  return normalize(data);
}

/* ---------- registry ---------- */
/* Each maps/<id>.js calls ISO.register(...) as it loads. */
const MAPS = {};
function register(map){ const m = normalize(map); MAPS[m.id] = m; return m; }

/* ---------- shared tile painter (same look in game and editor) ---------- */
function drawTile(ctx, ch, px, py, size, scale){
  const t = def(ch);
  if(!t.fill) return;
  ctx.fillStyle = t.fill;
  ctx.fillRect(px, py, size, size);
  if(t.line){
    ctx.strokeStyle = t.line; ctx.lineWidth = Math.max(1, scale||1);
    ctx.strokeRect(px+.5, py+.5, size-1, size-1);
  }
  if(t.glyph && size > 10){
    ctx.fillStyle = t.line || t.fill;
    ctx.font = Math.round(size*.62)+'px "Courier Prime", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(t.glyph, px+size/2, py+size/2+size*.04);
  }
}

global.ISO = {TILES, ORDER, VOID, def, MAPS, register, makeMap, normalize, resize, trim,
               inside, tileAt, at, walkable, setTile, reachable, audit,
               toJSON, toModule, parse, drawTile};
})(typeof globalThis!=='undefined'?globalThis:this);
