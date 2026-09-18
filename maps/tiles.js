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
   walk    — can the unit stand here
   fill    — body colour (null = draw nothing, pure negative space)
   line    — outline colour
   glyph   — optional character stamped in the tile
   bump    — log line when the unit walks into it (non-walkable)
   enter   — log line the first time the unit steps on it (walkable)
   alert   — log lines from this tile are rendered as warnings
   deadly  — stepping here ends the run
   beacon  — counts as a landing-beacon destination
   press   — the unit can interact with it from an adjacent tile ([E])
   signal  — what happens when a button signals it: 'toggle' | 'move'
   away    — log line when the unit walks into a rail the platform has left
   open    — alternate look to draw while the block is open
   props   — per-instance settings (see below)                      */

/* ---------- per-instance settings ----------
   A block that needs to be configured copy-by-copy declares a `props`
   schema. Every placed copy keeps its own values in map.props, keyed
   "x,y". The editor builds its inspector straight from the schema, so a
   new field costs one line here and nothing anywhere else.

   type  — text | lines | bool | int | dir | point | points
   def   — value a freshly painted copy starts with
   from  — an older field this one replaces, so maps written before the
           change still load (a lone point reads as a list of one)    */
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
        bump:'Bulkhead. Sealed. Look for the control that drives it.',
        signal:'toggle',
        open:{fill:'rgba(191,247,220,.05)', line:'rgba(191,247,220,.3)', glyph:'▘'},
        props:{open:{type:'bool', label:'Starts open', def:false}}},
  '~': {key:'~', id:'sludge', name:'Sludge',    walk:true,  fill:'rgba(79,133,112,.28)', line:'rgba(79,133,112,.5)', glyph:'~',
        enter:'Surface unstable. Traction reduced.'},
  '!': {key:'!', id:'hazard', name:'Hazard',    walk:true,  fill:'rgba(255,59,47,.18)',  line:'rgba(255,59,47,.55)', glyph:'!',
        enter:'WARNING: RADIOLOGICAL SPIKE. DO NOT LINGER.', alert:true},
  'o': {key:'o', id:'relay',  name:'Relay',     walk:false, fill:'rgba(255,180,74,.2)',  line:'rgba(255,180,74,.7)', glyph:'◉',
        bump:'Fixed structure. Origin unknown.'},
  'x': {key:'x', id:'fence',  name:'Fencing',   walk:false, fill:'rgba(28,240,28,.03)',  line:'rgba(28,240,28,.4)',  glyph:'╳',
        bump:'Fencing. Mesh reads clear but holds.'},
  'v': {key:'v', id:'pit',    name:'Pit',       walk:true,  fill:'rgba(0,0,0,.92)',      line:'rgba(255,59,47,.35)', glyph:'▽',
        deadly:'FLOOR ENDS. NO SURFACE BELOW.', alert:true},
  'T': {key:'T', id:'tram',   name:'Tram',      walk:true,  fill:'rgba(191,247,220,.14)',line:'rgba(191,247,220,.55)',glyph:'▤',
        enter:'Platform plating. Held, not fixed.', signal:'move',
        away:'Bare rail. The platform is at the other end of it.',
        props:{dir:{type:'dir',  label:'Travels',       def:'right'},
               dist:{type:'int', label:'Distance',      def:4, min:1, max:60}}},
  'b': {key:'b', id:'button', name:'Button',    walk:false, fill:'rgba(255,180,74,.16)', line:'rgba(255,180,74,.7)', glyph:'◎',
        bump:'Control surface. [E] to press.', press:'button',
        props:{targets:{type:'points', label:'Signals blocks at', def:[], from:'target'},
               label:{type:'text',    label:'Stencilled', def:''}}},
  'c': {key:'c', id:'term',   name:'Terminal',  walk:false, fill:'rgba(28,240,28,.14)',  line:'rgba(28,240,28,.6)',  glyph:'▣',
        bump:'Powered console. [E] to read.', press:'terminal',
        props:{title:{type:'text',  label:'Header',  def:'UNLABELLED CONSOLE'},
               text:{type:'lines',  label:'Text',    def:'No readable record.'},
               desktop:{type:'bool',label:'Has desktop', def:false}}},
  '^': {key:'^', id:'lift',   name:'Elevator',  walk:true,  fill:'rgba(255,59,47,.14)',  line:'rgba(255,59,47,.6)',  glyph:'⇕',
        beacon:true, enter:'Transit link. Carrier plate reads live.'},
};
const ORDER = Object.keys(TILES);
const VOID = TILES[' '];
const DIRS = {up:[0,-1], down:[0,1], left:[-1,0], right:[1,0]};

const def = ch => TILES[ch] || VOID;
const schemaOf = ch => def(ch).props || null;
const pk = (x,y) => x+','+y;

/* ---------- map objects ---------- */
/* A map is { id, name, w, h, spawn:{x,y}, beacons:[{x,y}], rows:[string],
              props:{ "x,y": {...per-instance settings} } }               */
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
    props: opts.props || {},
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
  normalizeProps(map);
  return map;
}
const clampPt = (p,w,h) => ({x:Math.min(w-1,Math.max(0,p.x|0)), y:Math.min(h-1,Math.max(0,p.y|0))});

/* ---------- per-instance settings ---------- */
/* Defaults for a freshly placed copy of `ch` (null if it takes no settings). */
function defaults(ch){
  const s = schemaOf(ch);
  if(!s) return null;
  const out = {};
  for(const k in s) if('def' in s[k]) out[k] = clone(s[k].def);
  return out;
}
const clone = v => (v && typeof v === 'object') ? JSON.parse(JSON.stringify(v)) : v;

/* Coerce one stored value to what its field says it is. */
function coerce(field, v){
  switch(field.type){
    case 'bool':  return !!v;
    case 'int':   { let n = Math.round(+v || 0);
                    if(field.min != null) n = Math.max(field.min, n);
                    if(field.max != null) n = Math.min(field.max, n);
                    return n }
    case 'dir':   return DIRS[v] ? v : (field.def || 'right');
    case 'point': return (v && typeof v === 'object') ? {x:v.x|0, y:v.y|0} : null;
    case 'points': {
      /* a lone point is read as a list of one, so older maps still load */
      const list = v == null ? [] : (Array.isArray(v) ? v : [v]);
      const seen = new Set(), out = [];
      for(const q of list){
        if(!q || typeof q !== 'object') continue;
        const p = {x:q.x|0, y:q.y|0}, k = pk(p.x,p.y);
        if(seen.has(k)) continue;                  // signalling one block twice is a no-op
        seen.add(k); out.push(p);
      }
      return out;
    }
    default:      return v == null ? '' : String(v);
  }
}

/* Drop settings that no longer belong to anything, fill in missing fields. */
function normalizeProps(map){
  const out = {};
  const src = map.props || {};
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++){
    const s = schemaOf(map.rows[y][x]);
    if(!s) continue;                                   // this tile takes none
    const had = src[pk(x,y)] || {};
    const p = {};
    for(const k in s){
      const f = s[k];
      const from = k in had ? k : (f.from && f.from in had ? f.from : null);
      p[k] = coerce(f, from ? had[from] : clone(f.def));
    }
    out[pk(x,y)] = p;
  }
  map.props = out;
  return map;
}

const propsAt = (map,x,y) => (map.props && map.props[pk(x,y)]) || null;
function setProp(map,x,y,key,value){
  const s = schemaOf(tileAt(map,x,y));
  if(!s || !s[key]) return false;
  const p = map.props[pk(x,y)] || (map.props[pk(x,y)] = {});
  p[key] = coerce(s[key], value);
  return true;
}

/* Every block one button drives. A control may run to any number of them. */
const signalTargets = (map,x,y) => ((propsAt(map,x,y)||{}).targets) || [];

/* Every block a button points at, as "x,y" -> [{x,y} of each button]. */
function signalIndex(map){
  const out = {};
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++){
    if(def(tileAt(map,x,y)).press !== 'button') continue;
    for(const t of signalTargets(map,x,y))
      (out[pk(t.x,t.y)] || (out[pk(t.x,t.y)] = [])).push({x,y});
  }
  return out;
}

/* The cells a tram sweeps, home first. */
function tramPath(map,x,y){
  const p = propsAt(map,x,y) || {};
  const [dx,dy] = DIRS[p.dir] || DIRS.right;
  const out = [];
  for(let i=0;i<=(p.dist|0);i++) out.push({x:x+dx*i, y:y+dy*i});
  return out;
}

const inside = (map,x,y) => x>=0 && y>=0 && x<map.w && y<map.h;
const tileAt = (map,x,y) => inside(map,x,y) ? map.rows[y][x] : ' ';
const at     = (map,x,y) => def(tileAt(map,x,y));
const walkable = (map,x,y) => at(map,x,y).walk;

function setTile(map,x,y,ch){
  if(!inside(map,x,y)) return false;
  const r = map.rows[y];
  if(r[x] === ch) return false;
  map.rows[y] = r.slice(0,x) + ch + r.slice(x+1);
  /* settings belong to the block that was there, not to the square */
  const props = map.props || (map.props = {});
  const fresh = defaults(ch);
  if(fresh) props[pk(x,y)] = fresh; else delete props[pk(x,y)];
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
  const props = {};
  const shift = v => (v && typeof v === 'object' && 'x' in v)
    ? {x:v.x+dx, y:v.y+dy} : v;                       // points travel with the map
  for(const k in map.props){
    const [px,py] = k.split(',').map(Number);
    const p = map.props[k];
    for(const f in p) p[f] = Array.isArray(p[f]) ? p[f].map(shift) : shift(p[f]);
    props[pk(px+dx, py+dy)] = p;
  }
  map.w = w; map.h = h; map.rows = rows; map.props = props;
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

/* Flood fill of everything walkable reachable from a point (4-way).
   opts.powered — count blocks that open or move on a signal as passable,
   which is what an author means by "can the unit get there at all". */
function reachable(map, from, opts){
  const powered = !!(opts && opts.powered);
  const pass = (x,y) => walkable(map,x,y) || (powered && !!at(map,x,y).signal);
  const seen = new Set();
  if(!from || !pass(from.x, from.y)) return seen;
  const q = [[from.x, from.y]];
  seen.add(pk(from.x,from.y));
  while(q.length){
    const [x,y] = q.pop();
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx, ny=y+dy, k=pk(nx,ny);
      if(seen.has(k) || !pass(nx,ny)) continue;
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
  const seen = reachable(map, map.spawn, {powered:true});
  out.reached = seen.size;
  out.unreachable = out.walkable - [...seen].filter(k=>{const [x,y]=k.split(',').map(Number);return walkable(map,x,y)}).length;
  if(out.unreachable > 0) out.issues.push(out.unreachable+' walkable tile(s) are sealed off from spawn.');
  map.beacons.forEach((b,i)=>{
    if(!walkable(map,b.x,b.y)) out.issues.push('Beacon '+(i+1)+' is inside '+at(map,b.x,b.y).name+'.');
    else if(!seen.has(pk(b.x,b.y))) out.issues.push('Beacon '+(i+1)+' cannot be reached from spawn.');
  });
  if(!out.walkable) out.issues.push('No walkable ground anywhere on this map.');

  /* wiring */
  const wired = signalIndex(map);
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++){
    const t = at(map,x,y), p = propsAt(map,x,y) || {}, where = ' at '+x+','+y;
    if(t.press === 'button'){
      const targets = signalTargets(map,x,y);
      if(!targets.length) out.issues.push('Button'+where+' signals nothing.');
      for(const c of targets){
        if(!inside(map, c.x, c.y))
          out.issues.push('Button'+where+' signals a square outside the record.');
        else if(!at(map, c.x, c.y).signal)
          out.issues.push('Button'+where+' signals '+at(map,c.x,c.y).name+
                          ' at '+c.x+','+c.y+', which does not answer signals.');
      }
    }
    if(t.press === 'terminal' && !String(p.text||'').trim())
      out.issues.push('Terminal'+where+' has no text to display.');
    if(t.signal === 'toggle' && !wired[pk(x,y)])
      out.issues.push(t.name+where+' has no button wired to it.');
    if(t.signal === 'move'){
      if(!wired[pk(x,y)]) out.issues.push(t.name+where+' has no button wired to it.');
      tramPath(map,x,y).slice(1).forEach(c=>{
        if(!inside(map,c.x,c.y))
          out.issues.push('Tram'+where+' runs off the edge of the record.');
        else if(!walkable(map,c.x,c.y) && tileAt(map,c.x,c.y)!==' ' && !at(map,c.x,c.y).signal)
          out.issues.push('Tram'+where+' is blocked by '+at(map,c.x,c.y).name+' at '+c.x+','+c.y+'.');
      });
    }
  }
  out.issues = [...new Set(out.issues)];
  return out;
}

/* ---------- serialising ---------- */
function toJSON(map){
  const keys = Object.keys(map.props||{}).sort((a,b)=>{
    const [ax,ay]=a.split(',').map(Number), [bx,by]=b.split(',').map(Number);
    return ay-by || ax-bx;
  });
  return '{\n'+
    '  "id": '+JSON.stringify(map.id)+',\n'+
    '  "name": '+JSON.stringify(map.name)+',\n'+
    '  "w": '+map.w+',\n  "h": '+map.h+',\n'+
    '  "spawn": {"x": '+map.spawn.x+', "y": '+map.spawn.y+'},\n'+
    '  "beacons": ['+map.beacons.map(b=>'{"x": '+b.x+', "y": '+b.y+'}').join(', ')+'],\n'+
    '  "props": {'+(keys.length
      ? '\n'+keys.map(k=>'    '+JSON.stringify(k)+': '+JSON.stringify(map.props[k])).join(',\n')+'\n  '
      : '')+'},\n'+
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
/* state.open — draw the block's open variant (a bulkhead that has been signalled) */
function drawTile(ctx, ch, px, py, size, scale, state){
  const t = def(ch);
  const look = (state && state.open && t.open) ? Object.assign({}, t, t.open) : t;
  if(!look.fill) return;
  ctx.fillStyle = look.fill;
  ctx.fillRect(px, py, size, size);
  if(look.line){
    ctx.strokeStyle = look.line; ctx.lineWidth = Math.max(1, scale||1);
    ctx.strokeRect(px+.5, py+.5, size-1, size-1);
  }
  if(look.glyph && size > 10){
    ctx.fillStyle = look.line || look.fill;
    ctx.font = Math.round(size*.62)+'px "Courier Prime", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(look.glyph, px+size/2, py+size/2+size*.04);
  }
}

global.ISO = {TILES, ORDER, VOID, DIRS, def, MAPS, register, makeMap, normalize, resize, trim,
               inside, tileAt, at, walkable, setTile, reachable, audit,
               schemaOf, defaults, propsAt, setProp, signalIndex, signalTargets, tramPath, key:pk,
               toJSON, toModule, parse, drawTile};
})(typeof globalThis!=='undefined'?globalThis:this);
