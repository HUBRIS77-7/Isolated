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
   clear   — sight passes through it even where the unit cannot: mesh, a
             console flush to the wall, a surface low enough to look over
   fill    — body colour (null = draw nothing, pure negative space)
   line    — outline colour
   glyph   — optional character stamped in the tile
   bump    — log line when the unit walks into it (non-walkable)
   enter   — log line the first time the unit steps on it (walkable)
   alert   — log lines from this tile are rendered as warnings
   deadly  — stepping here ends the run
   beacon  — counts as a landing-beacon destination
   press   — the unit can interact with it from an adjacent tile ([E])
   signal  — what happens when a button signals it: 'toggle' | 'move' | 'lift'
   away    — log line when the unit walks into a rail the platform has left
   open    — alternate look to draw while the block is open
   foot    — the block covers more than its own tile: {len, wide}. Either is a
             number, or the name of a per-instance field holding one, so a
             fixture can be a fixed two tiles long or sized copy by copy. It
             runs along the block's `dir`, so rotating it turns the footprint.
   parts   — glyph per footprint cell (without it, `glyph` is stamped once)
   merge   — touching copies of the same block draw as one body, whose glyph
             repeats across every tile: an author builds something as big as
             they like out of ordinary tiles
   lock    — alternate look and bump line for a copy set `locked`, which no
             control and no [E] will ever drive
   spent   — alternate look and bump line for a one-shot block that has been
             used up: a station whose stock is fitted, a beacon gone quiet
   ping    — it transmits: the unit reads it through walls, and it goes quiet
             once the unit is within its own `range`
   sized   — its log line reports how big the copy the unit found actually is
   slow    — the unit labours over it: how much longer than an ordinary step a
             move onto or off it takes. A body has to be climbed over
   link    — it joins two decks and the unit can be set down on it: {kind,
             noun}. `kind` is what it pairs with at the far end — a car comes
             out at a car and a flight of steps at a flight — and `noun` is
             what the log and the survey call one
   fall    — walking into it drops the unit to the deck below, one way only:
             it carries `dest`/`arrive` the way a car does, and with nothing
             registered under it the drop is simply the end of the run
   see     — it is an opening rather than a surface: whatever deck the map
             registers beneath it is drawn through the hole, dimmer, and a
             see-through tile that is deadly is a hole rather than an end —
             with a deck under it the unit drops through instead of dying
   over    — alternate look for a see-through block that has a deck under it,
             so a pit over a registered deck reads as a drop rather than as
             an unbroken square of black
   powered — it runs on power, so it carries a `circuit` setting: blank and it
             is live from the start, named and it waits on that circuit
   take    — it is holding something small enough for the unit to carry off:
             {kind, from} — which kind of object, and which of this block's own
             settings names the variant
   props   — per-instance settings (see below)                      */

/* ---------- per-instance settings ----------
   A block that needs to be configured copy-by-copy declares a `props`
   schema. Every placed copy keeps its own values in map.props, keyed
   "x,y". The editor builds its inspector straight from the schema, so a
   new field costs one line here and nothing anywhere else.

   type  — text | lines | bool | int | dir | pick | point | points | map
   def   — value a freshly painted copy starts with
   opts  — for `pick`, the values it offers: [{value, label}]
   from  — an older field this one replaces, so maps written before the
           change still load (a lone point reads as a list of one)    */

/* ---------- abilities ----------
   What the unit can be fitted with over the course of a game. A modification
   station hands one of these over; the game reads `fitted` and `hint` when it
   does, and the station's picker in the editor is built straight from this
   list — so a new ability costs one entry here and nothing anywhere else. */
const ABILITIES = {
  jump: {id:'jump', name:'Vault servos',
         fitted:'MOBILITY PACKAGE FITTED: VAULT SERVOS.',
         hint:'Hold [SPACE] to wind up, aim with the movement keys, release to clear up to four squares.'},
};
const ABILITY_OPTS = Object.keys(ABILITIES).map(k=>({value:k, label:ABILITIES[k].name}));
/* Squares a fully wound-up jump clears. The game and the survey both read it
   from here, so the reach the unit has and the reach a map is checked against
   are the same number. */
const JUMP = 4;

/* ---------- fuses ----------
   A fuse is a small object the unit carries. Its rating is what a fusebox way
   is keyed to: seat the right one and the circuit reads live, seat the wrong
   one and the way stays dead and says so. A new rating costs one entry here —
   the editor's pickers and the fusebox screen are both built from this list. */
const FUSES = {
  a5:  {id:'a5',  tag:'5A',  name:'5A fuse'},
  a15: {id:'a15', tag:'15A', name:'15A fuse'},
  a30: {id:'a30', tag:'30A', name:'30A fuse'},
};
const FUSE_OPTS = Object.keys(FUSES).map(k=>({value:k, label:FUSES[k].name}));

/* ---------- small objects ----------
   Anything loose enough for the unit to lift off the deck and carry. A tile
   says `take`: which kind of object it is holding, and which of its own
   settings names the variant. Everything else is read from here, so a second
   kind of object costs one entry and one tile.
     tile  — the block a dropped copy is drawn as
     kinds — the variants it comes in, if it comes in any                   */
const ITEMS = {
  fuse: {id:'fuse', name:'Fuse', tile:'f', kinds:FUSES},
};
/* How many small objects the manipulator holds at once. */
const CARRY = 6;

/* Every powered block carries this setting. It is written once and fitted to
   each of them below rather than repeated: blank means the block is live from
   the moment the run starts, and a name means it waits on that circuit. */
const CIRCUIT = {type:'text', label:'On circuit (blank: always live)', def:''};

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
        signal:'toggle', powered:true,
        open:{fill:'rgba(191,247,220,.05)', line:'rgba(191,247,220,.3)', glyph:'▘'},
        props:{open:{type:'bool', label:'Starts open', def:false}}},
  '~': {key:'~', id:'sludge', name:'Sludge',    walk:true,  slow:1.7,
        fill:'rgba(79,133,112,.28)', line:'rgba(79,133,112,.5)', glyph:'~',
        enter:'Surface unstable. Traction reduced.'},
  '!': {key:'!', id:'hazard', name:'Hazard',    walk:true,  fill:'rgba(255,59,47,.18)',  line:'rgba(255,59,47,.55)', glyph:'!',
        enter:'WARNING: RADIOLOGICAL SPIKE. DO NOT LINGER.', alert:true},
  'o': {key:'o', id:'relay',  name:'Relay',     walk:false, fill:'rgba(255,180,74,.2)',  line:'rgba(255,180,74,.7)', glyph:'◉',
        bump:'Fixed structure. Origin unknown.'},
  'x': {key:'x', id:'fence',  name:'Fencing',   walk:false, fill:'rgba(28,240,28,.03)',  line:'rgba(28,240,28,.4)',  glyph:'╳',
        clear:true, bump:'Fencing. Mesh reads clear but holds.'},
  'v': {key:'v', id:'pit',    name:'Pit',       walk:true,  fill:'rgba(0,0,0,.92)',      line:'rgba(255,59,47,.35)', glyph:'▽',
        see:true, deadly:'FLOOR ENDS. NO SURFACE BELOW.', alert:true,
        over:{fill:'rgba(0,0,0,.3)', line:'rgba(255,59,47,.45)'}},
  'T': {key:'T', id:'tram',   name:'Tram',      walk:true,  fill:'rgba(191,247,220,.14)',line:'rgba(191,247,220,.55)',glyph:'▤',
        enter:'Platform plating. Held, not fixed.', signal:'move', powered:true,
        away:'Bare rail. The platform is at the other end of it.',
        props:{dir:{type:'dir',  label:'Travels',       def:'right'},
               dist:{type:'int', label:'Distance',      def:4, min:1, max:60}}},
  'b': {key:'b', id:'button', name:'Button',    walk:false, fill:'rgba(255,180,74,.16)', line:'rgba(255,180,74,.7)', glyph:'◎',
        clear:true, bump:'Control surface. [E] to press.', press:'button', powered:true,
        props:{targets:{type:'points', label:'Signals blocks at', def:[], from:'target'},
               label:{type:'text',    label:'Stencilled', def:''}}},
  'c': {key:'c', id:'term',   name:'Terminal',  walk:false, fill:'rgba(28,240,28,.14)',  line:'rgba(28,240,28,.6)',  glyph:'▣',
        clear:true, bump:'Powered console. [E] to read.', press:'terminal', powered:true,
        props:{title:{type:'text',  label:'Header',  def:'UNLABELLED CONSOLE'},
               text:{type:'lines',  label:'Text',    def:'No readable record.'},
               desktop:{type:'bool',label:'Has desktop', def:false}}},
  'u': {key:'u', id:'fusebox',name:'Fusebox',   walk:false, fill:'rgba(255,180,74,.14)',
        line:'rgba(255,180,74,.6)', glyph:'⊞',
        clear:true, press:'fusebox',
        bump:'Distribution box. [E] opens the ways.',
        props:{ways:{type:'slots', label:'Ways it feeds', def:[],
                     fields:{circuit:{type:'text', label:'Circuit', def:''},
                             rating:{type:'pick', label:'Takes', def:'a15', opts:FUSE_OPTS}}},
               label:{type:'text', label:'Stencilled', def:''}}},
  '^': {key:'^', id:'lift',   name:'Elevator',  walk:true,  fill:'rgba(255,59,47,.14)',  line:'rgba(255,59,47,.6)',  glyph:'⇕',
        beacon:true, press:'lift', signal:'lift', powered:true,
        link:{kind:'lift', noun:'carriage'},
        enter:'Transit link. Carrier plate reads live. [E] rides it.',
        props:{dest:{type:'map',  label:'Deck it serves',    def:''},
               arrive:{type:'text',label:'Comes out at car', def:''},
               label:{type:'text', label:'Stencilled',       def:''}}},
  /* The other way between decks, and the plain one: no carriage, no control
     and no circuit — a flight of steps works on a deck with nothing left
     running on it. The chassis climbs rather than walks, which is the only
     price it asks. */
  's': {key:'s', id:'stair',  name:'Stairway',  walk:true,  fill:'rgba(191,247,220,.18)',line:'rgba(191,247,220,.65)',glyph:'⇅',
        beacon:true, press:'stair', slow:1.9,
        link:{kind:'stair', noun:'flight'},
        enter:'Companionway. The steps run off this deck. [E] climbs them.',
        props:{dest:{type:'map',  label:'Deck it climbs to',     def:''},
               arrive:{type:'text',label:'Comes out at flight',  def:''},
               label:{type:'text', label:'Stencilled',           def:''}}},

  /* ---------- fixtures: they furnish a room and stop the unit ---------- */
  'L': {key:'L', id:'locker', name:'Locker',    walk:false, fill:'rgba(28,240,28,.13)',  line:'rgba(28,240,28,.42)', glyph:'▯',
        bump:'Crew locker. Door welded by corrosion.'},
  'B': {key:'B', id:'box',    name:'Box',       walk:false, fill:'rgba(28,240,28,.1)',   line:'rgba(28,240,28,.36)', glyph:'□',
        bump:'Supply box. Too heavy to shift.'},
  'A': {key:'A', id:'cabinet',name:'Filing cabinet', walk:false, fill:'rgba(28,240,28,.12)', line:'rgba(28,240,28,.4)', glyph:'⊟',
        bump:'Filing cabinet. Drawers jammed shut.'},
  '/': {key:'/', id:'gap',    name:'Broken wall', walk:true, fill:'rgba(28,240,28,.09)',  line:'rgba(28,240,28,.3)',  glyph:'▞',
        enter:'Wall breached here. The gap is wide enough to pass.'},
  ':': {key:':', id:'grate',  name:'Catwalk',   walk:true,  see:true, clear:true,
        fill:'rgba(28,240,28,.03)', line:'rgba(28,240,28,.32)', glyph:'┼',
        enter:'Open grating. The deck below reads straight through it.'},
  'C': {key:'C', id:'crate',  name:'Cargo container', walk:false, fill:'rgba(255,180,74,.1)', line:'rgba(255,180,74,.45)', glyph:'▩',
        merge:true, sized:true, bump:'Cargo container. Hull seals read intact.'},
  'F': {key:'F', id:'fork',   name:'Forklift',  walk:false, fill:'rgba(255,180,74,.18)', line:'rgba(255,180,74,.6)',
        foot:{len:2}, parts:['▫','≡'],
        bump:'Cargo handler. Power cell flat.',
        props:{dir:{type:'dir', label:'Faces', def:'right'}}},
  'D': {key:'D', id:'desk',   name:'Desk',      walk:false, fill:'rgba(28,240,28,.12)',  line:'rgba(28,240,28,.38)',
        foot:{len:3}, parts:['≡','≡','≡'],
        clear:true, bump:'Work surface. Bolted to the deck.',
        props:{dir:{type:'dir', label:'Runs', def:'right'}}},

  /* ---------- powered: the gate answers a button or the unit itself ---------- */
  'G': {key:'G', id:'gate',   name:'Cargo gate', walk:false, fill:'rgba(255,180,74,.2)', line:'rgba(255,180,74,.6)', glyph:'▥',
        bump:'Cargo gate. Sealed. [E] to drive it, or find the control.',
        signal:'toggle', press:'gate', merge:true, powered:true,
        open:{fill:'rgba(255,180,74,.05)', line:'rgba(255,180,74,.3)', glyph:'▏'},
        lock:{fill:'rgba(255,180,74,.3)',  line:'rgba(255,180,74,.85)', glyph:'▦',
              bump:'Cargo gate. Locked out. Nothing on this side drives it.'},
        props:{open:{type:'bool',   label:'Starts open', def:false},
               locked:{type:'bool', label:'Locked — cannot be driven', def:false}}},
  'V': {key:'V', id:'vent',   name:'Vent',      walk:true,  fill:'rgba(191,247,220,.1)', line:'rgba(191,247,220,.45)', glyph:'☰',
        press:'vent', enter:'Duct cover reads loose. [E] to crawl through.',
        props:{dest:{type:'point', label:'Comes out at', def:null},
               label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- the unit itself changes: stations fit it, beacons steer it ---------- */
  'M': {key:'M', id:'station',name:'Modification Station', walk:false,
        fill:'rgba(191,247,220,.24)', line:'rgba(191,247,220,.7)', glyph:'╬',
        clear:true, press:'station', powered:true,
        bump:'Modification station. Fabrication arm reads live. [E] to dock.',
        spent:{fill:'rgba(191,247,220,.05)', line:'rgba(191,247,220,.28)', glyph:'╫',
               bump:'Modification station. Stock spent. Nothing left to fit.'},
        props:{ability:{type:'pick', label:'Fits', def:'jump', opts:ABILITY_OPTS},
               label:{type:'text', label:'Stencilled', def:''}}},
  '*': {key:'*', id:'ping',   name:'Signal beacon', walk:true,
        fill:'rgba(255,59,47,.12)', line:'rgba(255,59,47,.5)', glyph:'◇',
        ping:true, beacon:true, powered:true,
        enter:'Beacon plate. The transmitter sits flush with the deck.',
        spent:{fill:'rgba(255,59,47,.04)', line:'rgba(255,59,47,.22)', glyph:'◌',
               enter:'Beacon plate. Transmitter dark.'},
        props:{range:{type:'int',  label:'Goes quiet within', def:2, min:0, max:20},
               armed:{type:'bool', label:'Starts transmitting', def:true},
               objective:{type:'text', label:'Objective while lit', def:''},
               label:{type:'text',  label:'Stencilled', def:''}}},
  'f': {key:'f', id:'fuse',   name:'Fuse', walk:true, clear:true,
        fill:'rgba(255,180,74,.1)', line:'rgba(255,180,74,.5)', glyph:'▮',
        press:'take', take:{kind:'fuse', from:'rating'},
        enter:'Small object on the deck. [E] lifts it.',
        spent:{fill:'rgba(255,180,74,.03)', line:'rgba(255,180,74,.2)', glyph:'▫',
               enter:'Empty clip. Whatever sat in it has been lifted.'},
        props:{rating:{type:'pick', label:'Rating', def:'a15', opts:FUSE_OPTS},
               label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- remains: what the crew left on the deck ----------
     None of it stops the unit. Blood and bone are read on the way past; a
     body is three tiles of obstruction the chassis has to climb, which is
     what `slow` says and the only thing any of it does to a route. */
  ';': {key:';', id:'blood',  name:'Blood', walk:true, merge:true,
        fill:'rgba(150,18,18,.3)', line:'rgba(255,59,47,.34)', glyph:'\u2234',
        enter:'Dried spray across the plating. Organic. Not hydraulic fluid.'},
  'S': {key:'S', id:'skull',  name:'Skull', walk:true,
        fill:'rgba(214,226,220,.14)', line:'rgba(214,226,220,.5)', glyph:'\u2620',
        enter:'Cranium. Human. The jaw is somewhere else.'},
  'X': {key:'X', id:'bones',  name:'Bones', walk:true, merge:true,
        fill:'rgba(214,226,220,.1)', line:'rgba(214,226,220,.4)', glyph:'\u2021',
        enter:'Scattered bone, long and picked clean. It cracks underfoot.'},
  'Y': {key:'Y', id:'body',   name:'Dead body', walk:true, slow:2.6,
        foot:{len:3}, parts:['\u2620','\u2263','\u2261'],
        fill:'rgba(150,18,18,.22)', line:'rgba(255,59,47,.45)',
        enter:'Crew remains, full length across the deck. The chassis climbs rather than walks.',
        props:{dir:{type:'dir', label:'Lies', def:'right'}}},

  /* ---------- a hole with a deck under it ----------
     Three tiles by three of missing plating. The unit walks in and goes down,
     and nothing on the deck below carries it back up — so a breach is a route
     an author can only send the unit through once. */
  'O': {key:'O', id:'breach', name:'Hull breach', walk:true, alert:true,
        foot:{len:3, wide:3}, parts:['\u25bd','\u25bd','\u25bd'],
        fill:'rgba(0,0,0,.92)', line:'rgba(255,59,47,.45)',
        see:true, over:{fill:'rgba(0,0,0,.3)', line:'rgba(255,59,47,.55)'},
        fall:true, deadly:'FLOOR ENDS. NOTHING REGISTERS BELOW.',
        enter:'PLATING GIVES WAY.',
        props:{dest:{type:'map',  label:'Deck it drops to',  def:''},
               arrive:{type:'text',label:'Comes down at',    def:''},
               label:{type:'text', label:'Stencilled',       def:''}}},

  /* ---------- paper ----------
     A console needs a circuit; a note needs nothing at all, and reads the
     same on a dead deck as on a live one. */
  'n': {key:'n', id:'note',   name:'Note', walk:true,
        fill:'rgba(255,230,180,.13)', line:'rgba(255,230,180,.55)', glyph:'\u00b6',
        press:'note', enter:'A scrap of paper on the deck. [E] reads it.',
        props:{title:{type:'text', label:'Header', def:'HANDWRITTEN NOTE'},
               text:{type:'lines', label:'Text',   def:'The ink has run. Nothing legible.'}}},
};

/* ---------- palette categories ----------
   Only the editor's palette reads these: they are how a list of thirty blocks
   stays legible, not a second vocabulary. A tile named in none of them still
   shows up, under "Other", so adding a tile can never lose it. */
const CATS = [
  {id:'ground',    name:'Ground',     keys:' .,=+~!v/:'},
  {id:'structure', name:'Structure',  keys:'#%oxG'},
  {id:'controls',  name:'Controls',   keys:'bcun'},
  {id:'transit',   name:'Transit',    keys:'T^sVO'},
  {id:'fixtures',  name:'Fixtures',   keys:'LBACFD'},
  {id:'remains',   name:'Remains',    keys:';SXY'},
  {id:'kit',       name:'Unit & kit', keys:'M*f'},
];
/* One setting, fitted to every block that runs on power. */
for(const ch in TILES) if(TILES[ch].powered)
  TILES[ch].props = Object.assign({}, TILES[ch].props, {circuit:Object.assign({}, CIRCUIT)});
const ORDER = Object.keys(TILES);
const VOID = TILES[' '];
const DIRS = {up:[0,-1], down:[0,1], left:[-1,0], right:[1,0]};

const def = ch => TILES[ch] || VOID;
const schemaOf = ch => def(ch).props || null;
const pk = (x,y) => x+','+y;

/* ---------- blocks bigger than one tile ----------
   A map is still one character per tile: a big block is its anchor character
   and nothing else, and the tiles it covers are worked out from its own
   settings. So rotating a desk or growing a container is a change of setting,
   never a redraw of the rows — and an author never has to keep several
   characters in step by hand.

   Two ways to be big, because the two read differently to an author:
     foot  — the block states its own size ({len, wide} along its `dir`), so a
             forklift is always two tiles and a desk always three.
     merge — plain tiles that happen to touch draw as one body, so a container
             is exactly as big as the author painted it.                     */
const bumpVersion = map => { map._v = (map._v|0) + 1; return map };
const versionOf = map => map._v|0;

/* len/wide are either a number or the name of a field on this copy. */
function footSize(t, p){
  const read = v => (typeof v === 'number') ? v : Math.max(1, (p && p[v]|0) || 1);
  return {len: Math.max(1, read(t.foot.len == null ? 1 : t.foot.len)),
          wide:Math.max(1, read(t.foot.wide == null ? 1 : t.foot.wide))};
}

/* Every cell the block anchored at x,y covers, anchor first. `i` runs along
   the block's facing and `j` across it, which is what `parts` is indexed by. */
function footprint(map,x,y){
  const t = at(map,x,y);
  if(!t.foot) return [{x, y, i:0, j:0}];
  const p = propsAt(map,x,y) || {};
  const {len, wide} = footSize(t, p);
  const [dx,dy] = DIRS[p.dir] || DIRS.right;
  const ax = -dy, ay = dx;                     // across the facing
  const out = [];
  for(let j=0;j<wide;j++)for(let i=0;i<len;i++)
    out.push({x:x+dx*i+ax*j, y:y+dy*i+ay*j, i, j});
  return out;
}

/* "x,y" -> {x,y of the anchor, i, j} for every cell any big block covers.
   Rebuilt only when the map actually changes; both renderers hit it per tile. */
const FOOT = new WeakMap();
function footIndex(map){
  const cached = FOOT.get(map);
  if(cached && cached.v === versionOf(map)) return cached.index;
  const index = {};
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++){
    if(!at(map,x,y).foot) continue;
    for(const c of footprint(map,x,y)){
      if(!inside(map,c.x,c.y)) continue;
      const k = pk(c.x,c.y);
      if(k in index) continue;                 // whoever claimed it first keeps it
      index[k] = {x, y, i:c.i, j:c.j};
    }
  }
  FOOT.set(map, {v:versionOf(map), index});
  return index;
}
/* The big block this cell belongs to, anchor included (null if none). */
const partAt = (map,x,y) => footIndex(map)[pk(x,y)] || null;
/* …and the same, but only where the cell is not the anchor itself: this is
   what makes the far half of a forklift as solid as the half you painted. */
function coveredBy(map,x,y){
  const f = partAt(map,x,y);
  return (f && (f.x !== x || f.y !== y)) ? f : null;
}

/* Everything one merged block is made of, 4-way, plus its bounding box.
   A block that does not merge is a cluster of one, so callers need no branch. */
function cluster(map,x,y){
  const ch = tileAt(map,x,y);
  let x0=x, y0=y, x1=x, y1=y;
  const cells = [];
  if(!def(ch).merge || !inside(map,x,y)){
    cells.push({x,y});
  }else{
    const seen = new Set([pk(x,y)]), q = [[x,y]];
    while(q.length){
      const [cx,cy] = q.pop();
      cells.push({x:cx, y:cy});
      if(cx<x0)x0=cx; if(cx>x1)x1=cx; if(cy<y0)y0=cy; if(cy>y1)y1=cy;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nx=cx+dx, ny=cy+dy, k=pk(nx,ny);
        if(seen.has(k) || tileAt(map,nx,ny) !== ch) continue;
        seen.add(k); q.push([nx,ny]);
      }
    }
  }
  return {ch, cells, x0, y0, x1, y1, w:x1-x0+1, h:y1-y0+1};
}

/* ---------- map objects ---------- */
/* A map is { id, name, w, h, spawn:{x,y}, beacons:[{x,y}], rows:[string],
              under:{deck, dx, dy} | null,
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
    under: opts.under || null,
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
  /* the deck this one is stacked on: an id and where its origin sits in this
     deck's own squares, so two decks of different sizes still line up */
  const u = map.under;
  map.under = (u && u.deck) ? {deck:String(u.deck), dx:u.dx|0, dy:u.dy|0} : null;
  normalizeProps(map);
  return bumpVersion(map);
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
    case 'pick':  { const opts = (field.opts || []).map(o=>o.value);
                    if(opts.includes(v)) return v;
                    return opts.includes(field.def) ? field.def : (opts[0] || '') }
    case 'point': return (v && typeof v === 'object') ? {x:v.x|0, y:v.y|0} : null;
    /* a list of rows, each one a small record of its own — a fusebox way is
       a circuit name and the rating it takes, and there are as many as the
       author drew */
    case 'slots': {
      const fields = field.fields || {};
      return (Array.isArray(v) ? v : []).map(row=>{
        const out = {};
        for(const k in fields)
          out[k] = coerce(fields[k], (row && k in row) ? row[k] : clone(fields[k].def));
        return out;
      });
    }
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
  bumpVersion(map);                   // rotating a desk moves the tiles it covers
  return true;
}

/* A block that will never change state: locked, and not locked open. The unit
   cannot drive it, a control cannot drive it, and ground behind it really is
   sealed off — which is what the survey has to know to stay honest. */
function lockedShut(map,x,y){
  const p = propsAt(map,x,y) || {};
  return !!p.locked && !p.open;
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

/* ---------- power ----------
   Every block is live unless its author put it on a circuit, so a map that
   says nothing about power behaves exactly as it always did. A circuit is a
   name and nothing more: a fusebox way stencilled with that name, holding a
   fuse of the rating the way takes, is what makes it live. A dark room is
   therefore a fuse somewhere else — and a block on a circuit no box feeds
   never wakes up at all, which is how a block is switched off for good. */
const circuitOf = (map,x,y) => String((propsAt(map,x,y)||{}).circuit || '').trim();
const waysOf    = (map,x,y) => ((propsAt(map,x,y)||{}).ways) || [];
function boxes(map){
  const out = [];
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++)
    if(def(tileAt(map,x,y)).press === 'fusebox') out.push({x, y, ways:waysOf(map,x,y)});
  return out;
}
/* Is this circuit so much as wired to a box on this deck? Whether it is made
   up with a fuse is a question about a run; this is a question about the record. */
const circuitFed = (map,name) => boxes(map).some(b=>b.ways.some(w=>w.circuit === name));

/* ---------- small objects ----------
   What a takeable tile is holding, in the form the unit carries it in. */
function itemAt(map,x,y){
  const t = at(map,x,y);
  if(!t.take) return null;
  const spec = ITEMS[t.take.kind];
  if(!spec) return null;
  const p = propsAt(map,x,y) || {};
  const v = spec.kinds ? spec.kinds[p[t.take.from]] : null;
  return {kind:spec.id, variant:v ? v.id : '', tag:v ? v.tag : '',
          name:v ? v.name : spec.name, label:p.label || '', tile:spec.tile};
}

/* The cells a tram sweeps, home first. */
function tramPath(map,x,y){
  const p = propsAt(map,x,y) || {};
  const [dx,dy] = DIRS[p.dir] || DIRS.right;
  const out = [];
  for(let i=0;i<=(p.dist|0);i++) out.push({x:x+dx*i, y:y+dy*i});
  return out;
}

/* ---------- decks, and the links that run between them ----------
   One deck is one map. A link — a car, a flight of steps — is one tile on it,
   and the deck it serves is a setting on that tile, so a map never holds
   another map's coordinates. Where the unit is set down is worked out from the
   far deck's own links instead: stencil one shaft with one name on both decks
   and it runs both ways. A link only ever pairs with its own kind, so a car
   comes out at a car and a flight comes out at a flight. */
function links(map, kind){
  const out = [];
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++){
    const l = def(tileAt(map,x,y)).link;
    if(!l || l.kind !== kind) continue;
    const p = propsAt(map,x,y) || {};
    out.push({x, y, label:p.label || '', dest:p.dest || ''});
  }
  return out;
}
/* Where a link of this kind calling `want` sets the unit down on `map`: the
   one stencilled that name, else one whose own far end comes back to the deck
   `from`, else the first of its kind on the deck, else the deck's landing
   record. */
function linkLanding(map, kind, want, from){
  const ends = links(map, kind);
  const end = (want && ends.find(c => c.label === want))
           || (from && ends.find(c => c.dest === from))
           || ends[0] || null;
  return end ? {x:end.x, y:end.y, car:true}
             : {x:map.spawn.x, y:map.spawn.y, car:false};
}
/* What the log and the survey call a link of this kind — read off the block
   itself, so a new way between decks names itself along with everything else. */
function linkNoun(kind){
  for(const ch in TILES)
    if(TILES[ch].link && TILES[ch].link.kind === kind) return TILES[ch].link.noun;
  return 'link';
}
/* The cars on a deck, and where one of them sets the unit down. Kept as they
   were: a car is simply the first kind of link there was. */
const lifts       = map => links(map, 'lift');
const liftLanding = (map, want, from) => linkLanding(map, 'lift', want, from);

/* ---------- a drop, rather than a ride ----------
   A breach has no car at the bottom of it, so where the unit comes down is
   worked out from a name instead: the block on the far deck stencilled with
   whatever the breach `arrive`s at. Any block that carries a stencil will do —
   a beacon is the obvious marker, but a control or a station does as well, and
   then the unit comes down beside it rather than inside it. Failing all of
   that it falls back to what a car would do, so a breach always sets the unit
   down somewhere.                                                           */
function stencilled(map, want){
  if(!want) return null;
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++){
    const p = propsAt(map,x,y);
    if(p && String(p.label || '') === want) return {x, y};
  }
  return null;
}
/* Somewhere the unit can stand that is not another hole: the square itself,
   else the first of its neighbours that reads solid. */
function footing(map, x, y){
  const ok = (cx,cy) => inside(map,cx,cy) && walkable(map,cx,cy) &&
                        !bodyAt(map,cx,cy).fall && !bodyAt(map,cx,cy).deadly;
  if(ok(x,y)) return {x, y};
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]])
    if(ok(x+dx, y+dy)) return {x:x+dx, y:y+dy};
  return null;
}
function dropLanding(map, want, from){
  const mark = stencilled(map, want);
  const spot = mark && footing(map, mark.x, mark.y);
  if(spot) return {x:spot.x, y:spot.y, spot:true};
  const land = liftLanding(map, want, from);
  const safe = footing(map, land.x, land.y) || land;
  return {x:safe.x, y:safe.y, spot:false};
}

const inside = (map,x,y) => x>=0 && y>=0 && x<map.w && y<map.h;
const tileAt = (map,x,y) => inside(map,x,y) ? map.rows[y][x] : ' ';
const at     = (map,x,y) => def(tileAt(map,x,y));
/* What the unit actually meets here — the block covering the cell if one
   does, otherwise the tile itself. Bump lines and looks both come from it. */
const bodyAt = (map,x,y) => { const f = coveredBy(map,x,y); return f ? at(map,f.x,f.y) : at(map,x,y) };
/* The floor a forklift is parked on is still floor in the rows; what makes it
   solid is the block standing over it — and what makes the far end of a body
   something the unit can climb is that the body itself can be climbed. So the
   whole of a big block walks the way the tile it was painted on does. */
const walkable = (map,x,y) => bodyAt(map,x,y).walk;
/* What a jump passes over without coming down on it: ground of any kind, the
   empty space the record does not reach into, and anything low enough to see
   across — mesh, a console flush to the wall, a desk. A wall, a sealed
   bulkhead or a stack of crating is as high as it is solid, so it turns a
   jump back the way it turns a step back. */
const vaultable = (map,x,y) => { const t = bodyAt(map,x,y); return !!(t.walk || t.clear || t.fill == null) };

function setTile(map,x,y,ch){
  if(!inside(map,x,y)) return false;
  const r = map.rows[y];
  if(r[x] === ch) return false;
  map.rows[y] = r.slice(0,x) + ch + r.slice(x+1);
  /* settings belong to the block that was there, not to the square */
  const props = map.props || (map.props = {});
  const fresh = defaults(ch);
  if(fresh) props[pk(x,y)] = fresh; else delete props[pk(x,y)];
  bumpVersion(map);
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
   which is what an author means by "can the unit get there at all".
   opts.jump    — the unit has vault servos fitted, so it also clears up to
                  JUMP squares of pit, mesh or open span in a straight line
                  and comes down on the far side. */
function reachable(map, from, opts){
  const powered = !!(opts && opts.powered);
  const jump = !!(opts && opts.jump);
  const pass  = (x,y) => walkable(map,x,y) ||
                         (powered && !!at(map,x,y).signal && !lockedShut(map,x,y));
  /* a jump comes down on ground, never on a pit or a breach: it sails over one */
  const land  = (x,y) => pass(x,y) && !bodyAt(map,x,y).deadly;
  const over  = (x,y) => vaultable(map,x,y) ||
                         (powered && !!at(map,x,y).signal && !lockedShut(map,x,y));
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
    if(!jump) continue;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      for(let d=1; d<=JUMP; d++){
        const nx=x+dx*d, ny=y+dy*d, k=pk(nx,ny);
        if(!inside(map,nx,ny)) break;
        if(land(nx,ny) && !seen.has(k)){ seen.add(k); q.push([nx,ny]) }
        if(!over(nx,ny)) break;              // something solid in the arc
      }
    }
  }
  return seen;
}

/* Health check the editor surfaces and the game can log. */
function audit(map){
  const out = {walkable:0, unreachable:0, issues:[]};
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++) if(walkable(map,x,y)) out.walkable++;
  const under = bodyAt(map, map.spawn.x, map.spawn.y);
  if(!walkable(map, map.spawn.x, map.spawn.y))
    out.issues.push('Spawn sits on '+under.name+' — the unit cannot stand there.');
  else if(under.fall)
    out.issues.push('Spawn sits on '+under.name+' — the run begins by falling through it.');
  else if(under.deadly)
    out.issues.push('Spawn sits on '+under.name+' — the run ends the moment it begins.');
  const seen = reachable(map, map.spawn, {powered:true});
  /* the same again for a unit that has been fitted with vault servos, so that
     ground an author gated behind a jump reads as gated rather than sealed */
  const jseen = reachable(map, map.spawn, {powered:true, jump:true});
  const walkIn = set => [...set].filter(k=>{const [x,y]=k.split(',').map(Number);return walkable(map,x,y)}).length;
  out.seen = seen; out.jumpSeen = jseen;
  out.reached = seen.size;
  out.unreachable = out.walkable - walkIn(seen);
  out.jumpOnly = walkIn(jseen) - walkIn(seen);
  const sealedOff = out.unreachable - out.jumpOnly;
  if(sealedOff > 0) out.issues.push(sealedOff+' walkable tile(s) are sealed off from spawn.');
  if(out.jumpOnly > 0) out.issues.push(out.jumpOnly+' walkable tile(s) can only be reached by jumping. '+
                                       'The unit needs vault servos fitted before it can get there.');
  map.beacons.forEach((b,i)=>{
    if(!walkable(map,b.x,b.y)) out.issues.push('Beacon '+(i+1)+' is inside '+at(map,b.x,b.y).name+'.');
    else if(!jseen.has(pk(b.x,b.y))) out.issues.push('Beacon '+(i+1)+' cannot be reached from spawn.');
    else if(!seen.has(pk(b.x,b.y))) out.issues.push('Beacon '+(i+1)+' can only be reached by jumping to it.');
  });
  if(!out.walkable) out.issues.push('No walkable ground anywhere on this map.');

  /* the deck stacked under this one, and what the openings in this one find
     when they get there */
  const below = map.under && map.under.deck;
  if(below){
    const known = Object.keys(MAPS).length;
    if(below === map.id)
      out.issues.push('This deck is registered under itself. Nothing shows through its openings.');
    else if(known && !MAPS[below])
      out.issues.push('Deck "'+below+'" is registered under this one but is not in the record. '+
                      'Add its script tag to index.html, or correct the id.');
    else if(known && MAPS[below]){
      let off = 0, solid = 0, holes = 0;
      for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++){
        if(!seeThrough(map,x,y) || !bodyAt(map,x,y).deadly) continue;
        holes++;
        const u = underAt(map,x,y);
        if(!u) off++;
        else if(!dropAt(map,x,y)) solid++;
      }
      if(off) out.issues.push(off+' opening(s) sit past the edge of deck "'+below+
                              '". The unit falls through them to nothing.');
      if(solid) out.issues.push(solid+' opening(s) come down on '+
                                'ground the unit cannot stand on. The fall ends the run there.');
      if(!holes) out.issues.push('Deck "'+below+'" is registered under this one, but nothing on '+
                                 'this deck is open enough to read it through.');
    }
  }

  /* wiring */
  const wired = signalIndex(map);
  /* what is on a circuit, and what fuses exist anywhere to make one up: a way
     the record holds no fuse for is a door that never opens */
  const onCircuit = {}, stock = {};
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++){
    const c = circuitOf(map,x,y);
    if(c) onCircuit[c] = (onCircuit[c]|0) + 1;
  }
  const tally = m => { for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){
    const it = itemAt(m,x,y);
    if(it && it.kind === 'fuse' && it.variant) stock[it.variant] = (stock[it.variant]|0) + 1;
  } };
  tally(map);
  for(const id in MAPS) if(id !== map.id) tally(MAPS[id]);
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
    /* a link has to say which deck it serves, and that deck has to be one the
       game will actually have loaded */
    if(t.link){
      const known = Object.keys(MAPS).length;     // nothing registered: nothing to check against
      const noun  = t.link.noun;
      if(!p.dest)
        out.issues.push(t.name+where+' serves no deck. The route reads dead.');
      else if(p.dest === map.id)
        out.issues.push(t.name+where+' calls the deck it already stands on.');
      else if(known && !MAPS[p.dest])
        out.issues.push(t.name+where+' calls deck "'+p.dest+'", which is not in the record. '+
                        'Add its script tag to index.html, or correct the id.');
      else if(known && MAPS[p.dest] && p.arrive &&
              !links(MAPS[p.dest], t.link.kind).some(c=>c.label === p.arrive))
        out.issues.push(t.name+where+' comes out at a '+noun+' stencilled "'+p.arrive+
                        '", which deck "'+p.dest+'" has none of.');
      /* a flight of steps with no answering flight over there is a route that
         only runs one way, which is almost never what an author drew */
      else if(known && MAPS[p.dest] && !links(MAPS[p.dest], t.link.kind).length)
        out.issues.push(t.name+where+' comes out on deck "'+p.dest+'", which has no '+noun+
                        ' to come out at. The unit is set down at that deck\'s landing record.');
    }
    /* a breach is a car with no car in it: it still has to say which deck is
       under the hole, and where on that deck the unit comes down */
    if(t.fall){
      const known = Object.keys(MAPS).length;
      if(!p.dest)
        out.issues.push(t.name+where+' drops to no deck. The fall ends the run.');
      else if(p.dest === map.id)
        out.issues.push(t.name+where+' drops to the deck it is cut into.');
      else if(known && !MAPS[p.dest])
        out.issues.push(t.name+where+' drops to deck "'+p.dest+'", which is not in the record. '+
                        'Add its script tag to index.html, or correct the id.');
      else if(known && MAPS[p.dest]){
        const want = p.arrive || p.label || '';
        const mark = want ? stencilled(MAPS[p.dest], want) : null;
        if(want && !mark)
          out.issues.push(t.name+where+' comes down at "'+want+
                          '", which nothing on deck "'+p.dest+'" is stencilled.');
        else if(mark && !footing(MAPS[p.dest], mark.x, mark.y))
          out.issues.push(t.name+where+' comes down at "'+want+'" on deck "'+p.dest+
                          '", where there is nothing to stand on.');
        else if(!want)
          out.issues.push(t.name+where+' comes down at no stencil, so the unit is '+
                          'set down wherever that deck happens to land it.');
      }
    }
    if(t.press === 'note' && !String(p.text||'').trim())
      out.issues.push('Note'+where+' has nothing written on it.');
    if(t.press === 'fusebox'){
      const ways = waysOf(map,x,y);
      if(!ways.length) out.issues.push('Fusebox'+where+' feeds nothing. Give it a way.');
      ways.forEach((w,i)=>{
        const way = ' way '+(i+1);
        if(!w.circuit)
          out.issues.push('Fusebox'+where+way+' is stencilled with no circuit, so nothing reads from it.');
        else if(!onCircuit[w.circuit])
          out.issues.push('Fusebox'+where+' feeds circuit "'+w.circuit+'", which nothing on this deck is on.');
        if(!stock[w.rating])
          out.issues.push('Fusebox'+where+way+' takes a '+((FUSES[w.rating]||{}).name || w.rating)+
                          ', and no fuse of that rating is placed on any deck.');
      });
    }
    /* a block on a circuit no box feeds is off for good — say so, because from
       the canvas it looks exactly like a block that works */
    const circ = circuitOf(map,x,y);
    if(circ && !circuitFed(map,circ))
      out.issues.push(t.name+where+' is on circuit "'+circ+'", which no fusebox on this deck feeds. '+
                      'Nothing will ever power it.');
    if(t.press === 'station' && !ABILITIES[p.ability])
      out.issues.push(t.name+where+' fits nothing the unit can carry.');
    if(t.ping && p.armed &&
       Math.max(Math.abs(map.spawn.x-x), Math.abs(map.spawn.y-y)) <= (p.range|0))
      out.issues.push(t.name+where+' goes quiet the moment the run starts — '+
                      'spawn is already inside its range.');
    if(t.press === 'vent'){
      const d = p.dest;
      if(!d) out.issues.push('Vent'+where+' has no far end set.');
      else if(!inside(map, d.x, d.y))
        out.issues.push('Vent'+where+' comes out beyond the record.');
      else if(!walkable(map, d.x, d.y))
        out.issues.push('Vent'+where+' comes out inside '+at(map,d.x,d.y).name+
                        ' at '+d.x+','+d.y+'.');
    }
    /* a gate the unit can drive itself does not need a control */
    if(t.signal === 'toggle' && !t.press && !wired[pk(x,y)] && !p.locked)
      out.issues.push(t.name+where+' has no button wired to it.');
    if(t.signal && lockedShut(map,x,y) && wired[pk(x,y)])
      out.issues.push(t.name+where+' is locked, so the control wired to it cannot open it.');
    if(t.signal && t.merge){
      /* one body, one answer: report from the tile the body starts at */
      const body = cluster(map,x,y);
      const head = body.cells.reduce((a,b)=>(b.y<a.y || (b.y===a.y && b.x<a.x)) ? b : a);
      const setting = c => { const q = propsAt(map,c.x,c.y) || {};
                             return (q.locked?'L':'-')+(q.open?'O':'-') };
      if(head.x===x && head.y===y && new Set(body.cells.map(setting)).size > 1)
        out.issues.push(t.name+where+' is one body, but its tiles are set differently. '+
                        'It answers as a whole: locked anywhere means locked.');
    }
    if(t.foot) for(const c of footprint(map,x,y)){
      if(!c.i && !c.j) continue;                       // the tile it is painted on
      if(!inside(map, c.x, c.y)){
        out.issues.push(t.name+where+' reaches past the edge of the record.');
        continue;
      }
      const f = partAt(map, c.x, c.y);
      if(f && (f.x !== x || f.y !== y))
        out.issues.push(t.name+where+' overlaps '+at(map,f.x,f.y).name+
                        ' at '+f.x+','+f.y+'.');
      else if(!at(map,c.x,c.y).walk && tileAt(map,c.x,c.y) !== ' ')
        out.issues.push(t.name+where+' stands in '+at(map,c.x,c.y).name+
                        ' at '+c.x+','+c.y+'.');
    }
    if(t.signal === 'move'){
      if(!wired[pk(x,y)]) out.issues.push(t.name+where+' has no button wired to it.');
      tramPath(map,x,y).slice(1).forEach(c=>{
        if(!inside(map,c.x,c.y))
          out.issues.push('Tram'+where+' runs off the edge of the record.');
        else if(!walkable(map,c.x,c.y) && tileAt(map,c.x,c.y)!==' ' &&
                (!at(map,c.x,c.y).signal || lockedShut(map,c.x,c.y)))
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
    (map.under ? '  "under": {"deck": '+JSON.stringify(map.under.deck)+
                 ', "dx": '+map.under.dx+', "dy": '+map.under.dy+'},\n' : '')+
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

/* ---------- the deck underneath ----------
   One map is still one deck. `under` says which deck lies beneath this one and
   how the two line up, and that is the whole of it: the renderer reads it to
   draw what shows through an opening, and a hole reads it to know where the
   unit comes down. A deck that names none is exactly the deck it always was. */
function underOf(map){
  const u = map && map.under;
  if(!u || !u.deck) return null;
  const m = MAPS[u.deck];
  return (m && m !== map) ? m : null;
}
/* The square of the deck below that sits under this one — null off its edge,
   or where there is no deck below at all. */
function underAt(map, x, y){
  const m = underOf(map);
  if(!m) return null;
  const ux = x - (map.under.dx|0), uy = y - (map.under.dy|0);
  return inside(m, ux, uy) ? {map:m, x:ux, y:uy} : null;
}
/* Whether the deck above is open here: a catwalk's grating, a pit, a breach. */
const seeThrough = (map,x,y) => !!bodyAt(map,x,y).see;
/* Where a hole comes out: the square directly below it, when there is a deck
   under this one and something to stand on down there. */
function dropAt(map, x, y){
  if(!seeThrough(map,x,y)) return null;
  const u = underAt(map, x, y);
  if(!u || !walkable(u.map, u.x, u.y) || bodyAt(u.map, u.x, u.y).deadly) return null;
  return u;
}

/* ---------- shared tile painter (same look in game and editor) ---------- */
/* state.open — draw the block's open variant (a bulkhead that has been signalled)

   One cell of one body. `join` says which sides carry on into the same body,
   so the seams inside a container or along a desk are left out and the thing
   reads as one object rather than a row of squares. */
function paintCell(ctx, look, px, py, size, scale, join, glyph){
  if(!look.fill) return;
  ctx.fillStyle = look.fill;
  ctx.fillRect(px, py, size, size);
  if(look.line){
    ctx.strokeStyle = look.line; ctx.lineWidth = Math.max(1, scale||1);
    if(!join){
      ctx.strokeRect(px+.5, py+.5, size-1, size-1);
    }else{
      const x0 = px+.5, y0 = py+.5, x1 = px+size-.5, y1 = py+size-.5;
      ctx.beginPath();
      if(!join.n){ ctx.moveTo(x0,y0); ctx.lineTo(x1,y0) }
      if(!join.s){ ctx.moveTo(x0,y1); ctx.lineTo(x1,y1) }
      if(!join.w){ ctx.moveTo(x0,y0); ctx.lineTo(x0,y1) }
      if(!join.e){ ctx.moveTo(x1,y0); ctx.lineTo(x1,y1) }
      ctx.stroke();
    }
  }
  if(glyph && size > 10){
    ctx.fillStyle = look.line || look.fill;
    ctx.font = Math.round(size*.62)+'px "Courier Prime", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(glyph, px+size/2, py+size/2+size*.04);
  }
}
/* An open block shows its open look; a block locked shut shows its locked one,
   which is how a gate nothing will ever move reads differently from one that
   is merely sealed. Open wins: a gate locked open is an opening. */
function lookOf(t, state){
  if(state && state.open   && t.open)  return Object.assign({}, t, t.open);
  if(state && state.locked && t.lock)  return Object.assign({}, t, t.lock);
  if(state && state.spent  && t.spent) return Object.assign({}, t, t.spent);
  /* a hole with a deck under it is drawn as a way through rather than as a
     square of black, so whatever is down there can be read through it */
  if(state && state.over   && t.over)  return Object.assign({}, t, t.over);
  return t;
}

/* One tile on its own — kept for callers that have a character and nothing else. */
function drawTile(ctx, ch, px, py, size, scale, state){
  const t = def(ch);
  paintCell(ctx, lookOf(t, state), px, py, size, scale, null, t.glyph);
}

/* One cell of a map: the tile there, or the body of whatever big block stands
   over it. This is what both renderers call, so a block that spans tiles looks
   the same while it is being drawn as it does while it is being played. */
function drawCell(ctx, map, x, y, px, py, size, scale, state){
  const f = partAt(map, x, y);
  if(f){
    const t = at(map, f.x, f.y);
    const mine = (nx,ny) => { const g = partAt(map,nx,ny); return !!g && g.x===f.x && g.y===f.y };
    const join = {n:mine(x,y-1), s:mine(x,y+1), w:mine(x-1,y), e:mine(x+1,y)};
    const glyph = t.parts ? (t.parts[f.i] || null)
                          : ((f.i===0 && f.j===0) ? t.glyph : null);
    return paintCell(ctx, lookOf(t, state), px, py, size, scale, join, glyph);
  }
  const ch = tileAt(map, x, y), t = def(ch);
  if(t.merge){
    const mine = (nx,ny) => tileAt(map,nx,ny) === ch;
    const join = {n:mine(x,y-1), s:mine(x,y+1), w:mine(x-1,y), e:mine(x+1,y)};
    /* the glyph repeats across the whole body, so a container reads as crating
       and a gate as slats however many tiles the author gave it */
    return paintCell(ctx, lookOf(t, state), px, py, size, scale, join, t.glyph);
  }
  paintCell(ctx, lookOf(t, state), px, py, size, scale, null, t.glyph);
}

global.ISO = {TILES, ORDER, VOID, DIRS, CATS, ABILITIES, JUMP, FUSES, ITEMS, CARRY,
               circuitOf, waysOf, boxes, circuitFed, itemAt,
               def, MAPS, register, makeMap, normalize, resize, trim,
               inside, tileAt, at, bodyAt, walkable, vaultable, setTile, reachable, audit,
               schemaOf, defaults, propsAt, setProp, signalIndex, signalTargets, tramPath, key:pk,
               links, linkLanding, linkNoun, lifts, liftLanding, stencilled, dropLanding,
               underOf, underAt, seeThrough, dropAt,
               footprint, partAt, coveredBy, cluster, lockedShut,
               toJSON, toModule, parse, drawTile, drawCell};
})(typeof globalThis!=='undefined'?globalThis:this);
