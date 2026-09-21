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
   parts   — glyph per footprint cell (without it, `glyph` is stamped once).
             A flat list is one glyph per cell along the block's facing; a
             list of lists is a row of them per cell across it, so a car
             seven long and three wide is drawn cell by cell
   merge   — touching copies of the same block draw as one body, whose glyph
             repeats across every tile: an author builds something as big as
             they like out of ordinary tiles
   lock    — alternate look and bump line for a copy set `locked`, which no
             control and no [E] will ever drive
   spent   — alternate look and bump line for a one-shot block that has been
             used up: a station whose stock is fitted, a beacon gone quiet
   run     — alternate look and bump line for a block that has been started
             and is turning rather than standing cold. A generator with fuel
             in it is read at a glance, from overhead, by this and nothing else
   ping    — it transmits: the unit reads it through walls, and it goes quiet
             once the unit is within its own `range`
   sized   — its log line reports how big the copy the unit found actually is
   slow    — the unit labours over it: how much longer than an ordinary step a
             move onto or off it takes. A body has to be climbed over
   dense   — walkable, and sight stops in it all the same: standing crop is
             ground the unit can walk into and read nothing out of, which
             makes a field the one piece of cover on an open deck
   slide   — a block that answers a signal by running rather than by
             switching: it opens a tile at a time, from the end its `dir`
             points at toward the far one, and shuts again in reverse
   keyed   — it is held by a lock rather than by a circuit. Its `opens`
             setting names the key that turns it, the unit has to be carrying
             that key, and nothing else — no control, no [E] on its own —
             will move it until the lock has been turned once
   hide    — the unit can get inside it. [E] from an adjacent square folds the
             chassis in and [E] climbs out again; while it is in there nothing
             hunting the deck can find it, and the optics read the slats and
             very little else. It is solid the whole time: a block the unit
             hides in is not a block anything walks through
   inside  — alternate look to draw while the unit is hidden in it
   burn    — it is alight. Nothing crosses it — not the unit, not a contact —
             and water puts it out. What is left is ash, and ash is walked
             over, so a fire is a wall until the deck floods
   pipe    — it is pushing water onto the deck. `reach` is how many squares of
             ground the flood works out to, and it only runs while the pipe's
             own circuit is live: kill the supply and the water drains back
   wet     — the tile is standing water in its own right. The flood spreads
             out of one as readily as out of a pipe, and crossing one costs a
             pipe nothing of its reach — which is how a pool already on the
             deck carries a burst line further than bare plating would
   alarm   — a beam across the way. Walking through an armed one sounds the
             deck, which is the loudest thing on it; a control disarms it, and
             `signal:'arm'` is how a button or a console reaches one
   noisy   — squares a step onto it carries to whatever hunts by sound. Left
             out it is NOISE.step; carpet is quieter than plating, and water,
             grating and loose debris are a great deal louder
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
   spill   — fuel on the plating. It is ground until something sets light to
             it, and from then on it is a fire that works its way across the
             whole of the body and burns itself out. Water washes one away
             before it ever catches
   silent  — a noise made on it is not made at all: there is no air on this
             square to carry one. It is the one ground on the ship a step
             costs nothing, and the reason vacuum is worth crossing
   airless — no atmosphere, so no weather either: a flood will not run across
             it, because water put onto this square is water that is gone
   charged — a line of current laid across the deck. It is the one block whose
             circuit decides whether it is ground or wall: dead, the unit walks
             over it, and live, nothing crosses it at all. The value is the
             line the log writes when one wakes under a chassis already
             standing on it, because that is the one way it kills
   thruster — an attitude port in the hull, firing on a cycle of its own. It
             is ground between firings, a warning while it builds, and open
             flame while it burns. Nothing about it waits on the unit
   sweep   — a rock comes through here, on a cycle of its own and along the
             block's own heading. What is painted is the track, which is
             ordinary ground: the rock is not on the deck until it arrives
   foe     — the square is where a contact starts rather than a block that
             stands there: the name of the entry in FOES that says what walks
             off it. The tile itself is plain ground from then on
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
  motion: {id:'motion', name:'Motion tracker',
         fitted:'SENSOR PACKAGE FITTED: DOPPLER MOTION TRACKER.',
         hint:'[M] raises the tracker. It reads movement through structure \u2014 and only movement. Anything holding still reads as nothing at all.'},
  /* The one package that is neither a thing the chassis can do nor a thing
     the operator can read: it is a second of not being killed, and it has to
     be spent before the blow rather than after it. */
  parry: {id:'parry', name:'Reactive plating',
         fitted:'DEFENSIVE PACKAGE FITTED: REACTIVE PLATING.',
         hint:'[P] brings the plate up for one second. Anything that strikes the chassis inside that second is turned, and whatever swung is left standing in front of it \u2014 but it answers a blow and nothing else. A deck that is simply trying to kill the unit is not a blow.'},
  flashlight: {id:'flashlight', name:'Chassis floodlamp',
         fitted:'ILLUMINATION PACKAGE FITTED: CHASSIS FLOODLAMP.',
         hint:'[F] strikes the lamp and [F] kills it. On a deck with nothing lighting it, that is the difference between two squares of ground and the whole of what the optics are rated for.'},
};
const ABILITY_OPTS = Object.keys(ABILITIES).map(k=>({value:k, label:ABILITIES[k].name}));
/* Squares a fully wound-up jump clears. The game and the survey both read it
   from here, so the reach the unit has and the reach a map is checked against
   are the same number. */
const JUMP = 4;

/* ---------- contacts ----------
   Whatever else is moving about on a deck. A contact is not a tile: the square
   it was painted on is only where it starts, and from the moment the run
   begins it is somewhere else. Nor does it live on the grid the way a block
   does — it holds a real position, in tiles rather than in squares, and
   crosses the ground at its own speed. The grid is only what it steers by.
   The tile says which kind it is and everything about how that kind behaves
   is read from here, so a second creature costs one entry here and one tile
   below.
   None of this waits on the unit. Every contact walks on its own time, in
   every mood it has: with nothing to follow it goes looking — picks
   somewhere on the deck it can get to, walks there, stands a moment, and
   picks somewhere else — and with something to follow it closes. Whether
   the unit has moved never decides whether a contact moves.

     hunts  — what it hunts by. 'motion': it finds the unit by movement and
              nothing else, so a unit that has been still for a few seconds
              is a unit it loses the trail of and wanders away from, and one
              it has caught up with it can only strike while that unit is
              moving. 'sound': it cannot see at all. Nothing about where the
              unit is standing reaches it — what it has is the last noise the
              deck made, and it walks to where that noise was. Leave it out
              and it hunts whatever is there, still or not
     hears  — squares a noise carries to one that hunts by sound. Sound is the
              one thing on a deck structure does not stop, so this is measured
              straight through walls rather than along a route — but how far
              any one noise actually carries is the noise's own, and this is
              only the furthest it is worth listening
     speed  — tiles a second it crosses the deck at while it is following.
              A contact quicker than the unit is one no open ground escapes,
              so anything that kills wants to be slower than the chassis
     prowl  — tiles a second while it is only wandering. Slower than the
              other, because looking for something is not the same as having
              found it
     wake   — squares of walkable route at which it takes an interest. It
              holds that interest a good way past the same number before
              losing it again, so a contact does not switch on and off while
              the unit paces the edge of its range
     keep   — how close it will come. 0 reaches the unit; 3 paces it three
              squares back and will not be crowded closer than that
     shy    — squares at which being approached is too much for it: it
              breaks and runs. Leave it out and nothing rattles it
     bolt   — how much faster than its following speed it runs when it does
     calm   — squares it wants between itself and the unit before it will
              stop running, and the ground it holds for a while afterwards
              rather than wandering straight back in
     bars   — tile ids it will not set a foot on, however walkable they are.
              A contact barred from doorways is a contact a room with a door
              on it keeps out
     kills  — what the log says when it reaches the unit, or false for one
              that never does — a contact that only ever follows
     notice — the line the first reading of one writes
     spooked— the line it writes when it breaks and runs
     cools  — the line one that hunts by movement writes when the trail it
              was following stops moving and goes cold
     side   — whose it is. A gun fires on anything whose side is not its own,
              and on the unit whatever happens, so two things of one side
              never trade rounds while the unit stands between them. Leave it
              out and the thing belongs to nobody, which is what everything
              that came aboard on its own does
     hull   — rounds it takes to put down. Left out, one does it
     fixed  — it is an emplacement rather than a contact: bolted where it was
              painted, it crosses no ground at all, and a route is never
              changed by one being in the way except that it is in the way
     gun    — it shoots: {range, warm, cool, spin}. `range` is tiles it
              reaches, and it reaches through nothing solid — the line has to
              be as clear as the optics would need it. `warm` is seconds it
              holds a target before the round goes, which is the whole of the
              warning anything gets; `cool` is seconds between rounds, and
              `spin` is radians a second it lays round onto a new mark
     shot   — what the log says when the round is the unit
     felled — what it says when one is put down
     carries— it picks the unit up rather than striking it: {hold, rest,
              struggle}. `hold` is seconds it keeps carrying before it sets
              the unit down wherever it has got to, `rest` is seconds it keeps
              its distance afterwards, and `struggle` is movement keys it
              takes to break the grip early
     grabs, drops, shaken — the lines it writes lifting the unit, setting it
              down where it was going, and losing it to a struggle
     bulk   — squares either side of its middle, so a `bulk` of 1 is three
              tiles by three. It needs the whole of that clear to move into a
              square, and anything it is over when it moves is under it
     slides — it does not steer. It takes a heading and runs along it until
              something stops the whole of its body, then it takes another —
              which is a thing to keep out of the way of rather than a thing
              to hide from
     fill, line, glyph — how it draws: a body, its edge, and the mark it
              carries. Neither of them is drawn as a square, because neither
              of them stands on one */
const FOES = {
  stalker: {id:'stalker', name:'Stalker', speed:5, prowl:2.8,
            wake:18, keep:3, shy:2, bolt:2.1, calm:9, kills:false, glyph:'\u03a8',
            fill:'rgba(255,180,74,.18)', line:'rgba(255,180,74,.85)',
            notice:'CONTACT. Something is keeping pace with the unit. It comes no closer.',
            spooked:'CONTACT BREAKS AND RUNS. It will not be walked up to.'},
  hunter:  {id:'hunter',  name:'Hunter',  hunts:'motion', speed:6.5, prowl:2.2,
            wake:14, keep:0, glyph:'\u039b', bars:['door'],
            kills:'CONTACT STRUCK WHAT IT HEARD MOVING. CHASSIS OPENED.',
            fill:'rgba(255,59,47,.2)', line:'rgba(255,59,47,.9)',
            notice:'CONTACT. It has the unit. It is coming.',
            cools:'CONTACT LOSES THE TRAIL. It is looking for something that has stopped.'},
  /* ---------- what the command deck left running ----------
     Three of them, and none of them came aboard: a gun bolted to the deck, a
     drone that was fitted to move things about and has nothing left to move
     but the unit, and nine squares of freight that stopped answering the
     control that used to steer it. The first two are `command` side, which
     is the whole of why the gun and the drone leave each other alone. */
  turret:  {id:'turret',  name:'Sentry turret', side:'command', fixed:true, hull:3,
            wake:0, keep:0, kills:false, glyph:'\u2295',
            gun:{range:10, warm:.8, cool:1.5, spin:2.6},
            fill:'rgba(96,170,255,.2)', line:'rgba(150,205,255,.9)',
            notice:'EMPLACEMENT ACTIVE. It has laid onto the unit. It is coming round.',
            shot:'ROUND THROUGH THE CHASSIS. THE TURRET HAD THE LINE.',
            felled:'EMPLACEMENT DOWN. The mount stops tracking.'},
  drone:   {id:'drone',   name:'Security drone', side:'command', speed:6, prowl:3.4,
            wake:16, keep:0, hull:2, kills:false, glyph:'\u25c8',
            carries:{hold:5, rest:7, struggle:8},
            fill:'rgba(52,116,214,.22)', line:'rgba(96,170,255,.9)',
            notice:'CONTACT. Command pattern, and it is coming for the unit rather than at it.',
            grabs:'THE DRONE HAS THE CHASSIS OFF THE DECK. It is taking it somewhere.',
            drops:'SET DOWN. The drone lets go and stands off.',
            shaken:'GRIP BROKEN. The drone drops the unit where it stands.',
            felled:'DRONE DOWN. Whatever it was carrying it is not carrying now.'},
  /* ---------- the one that cannot see ----------
     A ravager has no optics and nothing that stands in for them. It works
     entirely off what the deck sounds like: a door driven, a fuse seated, a
     control struck, a chassis wading through standing water — each of those
     is a mark on the deck it walks to and stands over. Holding still is not
     the defence it is against a hunter, because standing still is not the
     same as being quiet: it is what the unit does rather than whether it
     moves. Which makes the two of them opposites worth putting on one deck. */
  ravager: {id:'ravager', name:'Ravager', hunts:'sound', speed:5.8, prowl:2.6,
            hears:26, wake:0, keep:0, glyph:'Ω',
            fill:'rgba(214,226,220,.16)', line:'rgba(230,240,236,.85)',
            kills:'THE RAVAGER PUT ITS WEIGHT THROUGH WHATEVER WAS MAKING THE NOISE.',
            notice:'CONTACT. It has heard something. It is coming to where the sound was.',
            cools:'CONTACT ARRIVES AT NOTHING. It casts about, hears nothing more, and moves off.'},
  /* ---------- the one that holds its distance and then does not ----------
     A spectre paces the unit the way a stalker does and is nothing like one.
     It holds station off the chassis, picks its moment, sets itself where the
     operator can see it do it, and covers the whole of the gap in one
     movement. The tell is the entire fight: a second and a bit of standing
     still is the only warning there is, and it is enough for a plate to come
     up if the plate is fitted and the operator has learnt to read it.

     `lunge` is the whole of the behaviour: `reach` is how close it has to be
     before it will set itself, `tell` how long it stands doing it, `dash` how
     fast it crosses the ground once it goes, `run` how long it will keep
     running, `rest` how long it stands off afterwards, and `turned` how long
     it wants after a plate has turned one \u2014 longer, because being turned
     costs it more than missing does.

     `ward` is the other half, and it is the fair half: it will not set itself
     while the unit is standing within `within` squares of any of the blocks
     named in it. A fusebox is where an operator has to stand still, with the
     deck keys belonging to a screen rather than to the chassis, and something
     that lunges at a unit that cannot move is not a fight. So it holds off
     instead, and says so. */
  spectre: {id:'spectre', name:'Spectre', side:'command', speed:5.6, prowl:2.9,
            wake:17, keep:4, glyph:'\u03a6',
            /* the numbers are a contract with the plate, and they are set by
               it: a plate lasts one second, so the tell and the whole of the
               ground it has left to cover have to fit inside one second
               between them. Four squares at sixteen tiles a second is a
               quarter of one, and six tenths of a tell leaves the rest as
               margin \u2014 so a plate brought up the moment it sets itself
               is still up when it arrives, and one brought up late is up for
               the part that matters. An author who widens `reach` or slows
               `dash` is quietly taking the plate away. */
            lunge:{reach:4, tell:.6, dash:16, run:.45, rest:4.2, turned:7.5},
            ward:{blocks:['fusebox','panel'], within:3},
            fill:'rgba(168,130,255,.2)', line:'rgba(200,172,255,.9)',
            kills:'THE SPECTRE CROSSED THE WHOLE OF THE GAP IN ONE MOVEMENT. CHASSIS OPENED.',
            notice:'CONTACT. Command pattern, and it is standing off the unit rather than closing on it.',
            sets:'THE SPECTRE SETS ITSELF. Whatever it is about to do, it is about to do all at once.',
            turned:'LUNGE TURNED ON THE PLATE. It comes off the chassis and gives ground.',
            missed:'THE LUNGE GOES THROUGH WHERE THE UNIT WAS STANDING. It recovers and stands off again.',
            warded:'THE SPECTRE WILL NOT COME IN OFF THE BOX. It holds where it is while the unit is on the fusebox.'},
  block:   {id:'block',   name:'Block', bulk:1, slides:true, speed:4.4, prowl:3,
            wake:12, keep:0, hull:12, glyph:'\u25a0',
            fill:'rgba(255,59,47,.16)', line:'rgba(255,120,80,.85)',
            kills:'CHASSIS CAUGHT UNDER NINE SQUARES OF MOVING FREIGHT.',
            notice:'CONTACT. Nine squares of it, and it is already under way.',
            felled:'BLOCK STOPPED. Whatever was driving it has given out.'},
};

/* ---------- how far a noise carries ----------
   Squares, in any direction, and through anything at all: sound is the one
   reading on a deck that structure does not stop, so a door driven two rooms
   away is a door something heard. Everything the deck can be made to do is
   listed here rather than buried in the driver that does it, which is what
   makes "how loud is this ship" one table an author can read in a glance.

   A step is the quiet one on purpose. The chassis crossing plain plating
   carries four squares and no further, so an operator who has worked out
   what is on the deck with it can walk most of the way round one — and a
   tile that says `noisy` is what takes that away. */
const NOISE = {
  step:   4,      // the chassis crossing plain plating
  lift:   6,      // something small lifted off the deck or set down on it
  press:  9,      // a control struck, or a fire going out under water
  jump:   10,     // coming down off a full wind-up
  fuse:   11,     // a fuse seated in a way, or pulled back out of one
  gear:   13,     // machinery: a platform called, a car, a duct cover, an arm
  door:   15,     // a door, a gate or a bar driven
  engine: 20,     // a generator set catching, and every turn it takes after
  alarm:  60,     // the whole deck, and a good way past the edges of it
};

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

/* ---------- keys ----------
   The other thing the unit carries that a block is keyed to. A fuse wakes a
   circuit; a key turns a lock, and that is the whole difference between them:
   a lock needs no power and asks nothing of the record beyond the one key cut
   for it. A locked door names the key it takes and no other opens it, so a
   new key costs one entry here — the editor's pickers are built from this
   list the way the fusebox's are. */
const KEYS = {
  house: {id:'house', tag:'HOUSE', name:'Farmhouse key'},
  barn:  {id:'barn',  tag:'BARN',  name:'Barn key'},
  store: {id:'store', tag:'STORE', name:'Store key'},
  /* The two the command deck was run on. An operator key opens the face of
     the reactor and nothing else; a sacrifice key goes into a socket in it
     and does not come out again, which is the whole of why there are two of
     them and why they are called that. */
  operator:  {id:'operator',  tag:'OPERATOR',  name:'Operator key'},
  sacrifice: {id:'sacrifice', tag:'SACRIFICE', name:'Sacrifice key'},
};
const KEY_OPTS = Object.keys(KEYS).map(k=>({value:k, label:KEYS[k].name}));

/* ---------- what is cut off a body ----------
   The third thing the unit carries that something is keyed to, and the one
   the ship never issued. A scanner does not want a word or a cut of brass:
   it wants the crew member, and the crew member is lying in the corridor.
   These are the variants a sample comes in, read by the keypad exactly the
   way a lock reads a key's cut. */
const PARTS = {
  hand: {id:'hand', tag:'HAND', name:'Severed hand'},
  eye:  {id:'eye',  tag:'EYE',  name:'Excised eye'},
};
const PART_OPTS = Object.keys(PARTS).map(k=>({value:k, label:PARTS[k].name}));

/* ---------- small objects ----------
   Anything loose enough for the unit to lift off the deck and carry. A tile
   says `take`: which kind of object it is holding, and which of its own
   settings names the variant. Everything else is read from here, so a second
   kind of object costs one entry and one tile.
     tile  — the block a dropped copy is drawn as
     kinds — the variants it comes in, if it comes in any                   */
const ITEMS = {
  fuse: {id:'fuse', name:'Fuse', tile:'f', kinds:FUSES},
  key:  {id:'key',  name:'Key',  tile:'k', kinds:KEYS},
  /* The one that comes in no variants: a can is a can. A fuse is cut for a
     rating and a key for a lock, and fuel is only ever fuel — which is why it
     declares no `kinds` and every canister on the ship fits every set. */
  fuel: {id:'fuel', name:'Fuel canister', tile:'ƒ'},
  /* Not issued, not manufactured, and not found lying about unless something
     went very wrong here: a piece of somebody, carried in the manipulator
     because a scanner somewhere else on the deck will not read anything
     else. */
  organ: {id:'organ', name:'Tissue sample', tile:'ø', kinds:PARTS},
};
/* How many small objects the manipulator holds at once. */
const CARRY = 6;

/* Every powered block carries this setting. It is written once and fitted to
   each of them below rather than repeated: blank means the block is live from
   the moment the run starts, and a name means it waits on that circuit. */
const CIRCUIT = {type:'text', label:'On circuit (blank: always live)', def:''};

/* ---------- what is behind the fusebox ----------
   A circuit is live because a way in a box holds the fuse that way takes. A
   box is live because something is supplying the box. Left blank that is the
   ship's own supply and the box has worked since the day it was fitted;
   stencilled, it waits on a generator stencilled the same, and every fuse
   seated in it carries nothing at all until that set is turning. It is the
   one setting a generator and a box both declare, because it is the one name
   the two of them have to agree on. */
const SUPPLY = {type:'text', label:'On supply (blank: the ship’s own)', def:''};

/* Every link between decks carries these two. Left blank a crossing is only a
   crossing. Filled in, the screen holds on the black the link was already
   going to — the whole console goes with it, bars, log and feed — and the
   words sit on the dark until the operator presses something. It is what a
   chapter ends on, so it reads on a link whose `fade` is on and on no other:
   there is no black to hold without one. */
const CARD    = {type:'text', label:'Words held on the black', def:''};
const CARDSUB = {type:'text', label:'Line under them',         def:''};

/* ---------- what is on a desktop ----------
   A console an author marked `desktop` is not read straight off the glass: it
   opens the machine's own filing, and what the unit finds in there is a list
   of these. A folder is not one of them. A file names the folder it sits in,
   and the folder exists because something is in it — which is the whole of
   how deep a desktop goes.
     doc    — something written. Its `text` is what it says
     image  — something drawn. Its `text` is the drawing, kept column for
              column, because the only ink this machine has is characters
     locked — something the operator has to earn. Its `pass` is what opens it,
              and on the console that carries a `card` the opening of it is
              the end of the segment
     app    — something that does rather than says. Its `targets` are the
              blocks it drives, the same list a button on a wall carries, and
              opening it does not drive them: pressing it does. A `pass` on
              one is a control the operator has to earn the use of rather
              than a record they have to earn the reading of                */
const FILE_KINDS = {
  doc:    {id:'doc',    name:'Document',    glyph:'\u2261'},
  image:  {id:'image',  name:'Image',       glyph:'\u25a6'},
  locked: {id:'locked', name:'Locked file', glyph:'\u25a0'},
  app:    {id:'app',    name:'Control',     glyph:'\u25ce'},
};
const FILE_OPTS = Object.keys(FILE_KINDS).map(k=>({value:k, label:FILE_KINDS[k].name}));
/* One row of filing, wherever the filing is kept. A crew console declares this
   as its `files`; the unit's own store is the same list at deck level.

   Two of the fields only mean anything on some kinds — a document has no word
   on it and drives nothing — and `when` is what the editor reads to keep a row
   down to the fields that do. It is a question about the row, not about the
   map, so it is asked of the row. */
const FILE_SLOTS = {type:'slots', label:'Holds', def:[],
                    fields:{kind:{type:'pick',  label:'Kind',      def:'doc', opts:FILE_OPTS},
                            name:{type:'text',  label:'Called',    def:''},
                            folder:{type:'text',label:'In folder', def:''},
                            pass:{type:'text',  label:'Opens with',def:'',
                                  when:r=>r.kind === 'locked' || r.kind === 'app'},
                            targets:{type:'points', label:'Presses', def:[],
                                     when:r=>r.kind === 'app'},
                            text:{type:'lines', label:'Contents',  def:''}}};

/* ---------- the unit's own store ----------
   Not a block. The chassis carries a small store of its own and [O] brings it
   up on whatever glass is to hand, anywhere on a deck, with no console to walk
   to and no circuit to wait on. It is deck-level because it is a segment's
   business rather than the whole game's: a deck that stocks it has something
   for the operator to read while it is stuck somewhere, and a deck that leaves
   it empty never mentions it.

   It is the same filing a console's desktop holds and opens the same screen.
   What is different is whose it is — and that a sealed file in here can end a
   segment, which is what `card` is for.                                     */
const OS_SCHEMA = {
  files:   FILE_SLOTS,
  card:    {type:'text', label:'Words the sealed file ends on', def:''},
  cardsub: {type:'text', label:'Line under them',               def:''},
};
function normalizeOS(map){
  const had = (map.os && typeof map.os === 'object') ? map.os : {};
  const out = {};
  for(const k in OS_SCHEMA) out[k] = coerce(OS_SCHEMA[k], had[k]);
  /* a store with nothing filed on it is no store at all, and a deck that has
     one is only the deck that stocked it */
  map.os = out.files.length ? out : null;
  return map;
}
/* The store on this deck, tidied the way a console's filing is. */
const osOf = map => cleanFiles((map && map.os && map.os.files) || []);
const osCard = map => (map && map.os) ? {title:map.os.card||'', sub:map.os.cardsub||''} : null;

/* ---------- chapters ----------
   The chapter a deck opens, or nothing — most decks open none. */
const chapterOf = map => (map && map.chapter) || null;
/* Every seam the game has, in the order its chapters run. This is the whole
   shape of the thing, not the shape of one run: which of these a run has
   actually reached is the save's business, and a chapter select would read
   the two together. */
const chapters = () => Object.keys(MAPS).map(id => MAPS[id])
  .filter(m => m.chapter)
  .map(m => ({deck:m.id, n:m.chapter.n, name:m.chapter.name, deckName:m.name || m.id}))
  .sort((a,b) => a.n - b.n || (a.deck < b.deck ? -1 : 1));

/* ---------- the command deck ----------
   One family of blocks and one palette for it: the deep blue of structure,
   the blue of a working surface, and the pale blue of glass and painted
   lettering. Nothing else on the ship is blue — plating is green, controls
   are amber, transit is mint — so an operator that has crossed one deck of
   this knows the next one on sight, before it has read a single stencil. */
const CMD_DEEP = {fill:'rgba(18,48,116,.34)',  line:'rgba(74,132,214,.62)'};
const CMD_BLUE = {fill:'rgba(52,116,214,.18)', line:'rgba(96,170,255,.66)'};
const CMD_PALE = {fill:'rgba(150,205,255,.14)',line:'rgba(190,228,255,.7)'};

/* ---------- the fitted-out decks ----------
   Between the plating below and the command deck above, the ship was
   administered: carpet down, paint rolled onto the bulkheads, a counter to
   stand behind. It is blue too, and that is not an accident and not a
   collision either — it is the dull, deep, unlit blue of paint and carpet,
   where the command deck is the lit blue of glass and steel. One is where
   the ship was steered from. This is where its paperwork was done. */
const OFF_DEEP = {fill:'rgba(14,32,66,.42)',  line:'rgba(52,88,146,.55)'};   // paint on a bulkhead
const OFF_SOFT = {fill:'rgba(26,50,94,.26)',  line:'rgba(58,104,168,.36)'};  // carpet
const OFF_DESK = {fill:'rgba(34,66,120,.3)',  line:'rgba(88,142,208,.6)'};   // a working counter

/* ---------- the face of something too big to type ----------
   `parts` is one glyph per cell, which is fine for a forklift and absurd for
   fourteen tiles by twelve: an AI core is a hundred and sixty-eight glyphs,
   and a literal that size is a thing nobody can read a change to. So the
   large plant draws its own face — a welded border, ribs down it at whatever
   interval it was built with, and one mark at the middle of it — and the
   entry says how big the thing is rather than what every square of it looks
   like. It is still `parts`: the block turns with its `dir` exactly as a
   desk does, because the grid is read off the footprint either way. */
function faceParts(len, wide, mark, inner, rib){
  const rows = [];
  /* the middle of it, which is one cell across an odd side and two across an
     even one — a mark has to sit in the middle of the face or the thing
     reads as though it were pointed somewhere */
  const mi0 = Math.floor((len-1)/2),  mi1 = Math.ceil((len-1)/2);
  const mj0 = Math.floor((wide-1)/2), mj1 = Math.ceil((wide-1)/2);
  for(let j=0;j<wide;j++){
    const row = [];
    for(let i=0;i<len;i++){
      const top = j === 0, bot = j === wide-1, lf = i === 0, rt = i === len-1;
      row.push(top&&lf ? '\u2554' : top&&rt ? '\u2557'
             : bot&&lf ? '\u255a' : bot&&rt ? '\u255d'
             : top||bot ? '\u2550' : lf||rt ? '\u2551'
             /* the middle of it, which is the only square of the body that
                says what the body is */
             : (i >= mi0 && i <= mi1 && j >= mj0 && j <= mj1) ? mark
             : (rib && i % rib === 0) ? '\u25ae' : inner);
    }
    rows.push(row);
  }
  return rows;
}

const TILES = {
  ' ': {key:' ', id:'void',   name:'Unmapped',  walk:false, fill:null,
        bump:'Edge of mapped space. Nothing registers beyond.'},
  '.': {key:'.', id:'floor',  name:'Floor',     walk:true,  fill:'rgba(28,240,28,.045)', line:'rgba(28,240,28,.14)'},
  ',': {key:',', id:'debris', name:'Debris',    walk:true,  noisy:8,
        fill:'rgba(28,240,28,.085)', line:'rgba(28,240,28,.14)', glyph:'·',
        enter:'Loose material underfoot. Composition unlogged. It carries \u2014 a step taken on this is a step something heard.'},
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
  '~': {key:'~', id:'sludge', name:'Sludge',    walk:true,  slow:1.7,  noisy:7,
        fill:'rgba(79,133,112,.28)', line:'rgba(79,133,112,.5)', glyph:'~',
        enter:'Surface unstable. Traction reduced.'},
  '!': {key:'!', id:'hazard', name:'Hazard',    walk:true,  fill:'rgba(255,59,47,.18)',  line:'rgba(255,59,47,.55)', glyph:'!',
        enter:'WARNING: RADIOLOGICAL SPIKE. DO NOT LINGER.', alert:true},
  'o': {key:'o', id:'relay',  name:'Relay',     walk:false, fill:'rgba(255,180,74,.2)',  line:'rgba(255,180,74,.7)', glyph:'◉',
        bump:'Fixed structure. Origin unknown.'},
  'x': {key:'x', id:'fence',  name:'Fencing',   walk:false, fill:'rgba(28,240,28,.03)',  line:'rgba(28,240,28,.4)',  glyph:'╳',
        clear:true, bump:'Fencing. Mesh reads clear but holds.'},
  /* A wall that is not a wall of a room: it is the side of a vessel, and what
     it holds back is on the other side of it. Touching copies read as one
     body the way crating does, so a tank is as big as it is painted rather
     than a fixed size — which is the only way to draw a settling tank that
     takes up half a deck. */
  'W': {key:'W', id:'tank',   name:'Tank wall',  walk:false, fill:'rgba(79,133,112,.4)',  line:'rgba(140,214,182,.7)', glyph:'▨',
        merge:true, sized:true,
        bump:'Tank wall. Welded plate, seams weeping. Nothing reads through the volume behind it.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},
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
               desktop:{type:'bool',label:'Has desktop', def:false},
               /* what the desktop holds, if it has one. One row is one file;
                  the folder it names is made by its being in it */
               files:Object.assign({}, FILE_SLOTS, {label:'Desktop holds'}),
               /* what the segment ends on when the locked file gives way */
               card:{type:'text',   label:'Words the locked file ends on', def:''},
               cardsub:{type:'text',label:'Line under them',               def:''}}},
  'u': {key:'u', id:'fusebox',name:'Fusebox',   walk:false, fill:'rgba(255,180,74,.14)',
        line:'rgba(255,180,74,.6)', glyph:'⊞',
        clear:true, press:'fusebox',
        bump:'Distribution box. [E] opens the ways.',
        props:{ways:{type:'slots', label:'Ways it feeds', def:[],
                     fields:{circuit:{type:'text', label:'Circuit', def:''},
                             rating:{type:'pick', label:'Takes', def:'a15', opts:FUSE_OPTS}}},
               supply:Object.assign({}, SUPPLY),
               label:{type:'text', label:'Stencilled', def:''}}},
  '^': {key:'^', id:'lift',   name:'Elevator',  walk:true,  fill:'rgba(255,59,47,.14)',  line:'rgba(255,59,47,.6)',  glyph:'⇕',
        beacon:true, press:'lift', signal:'lift', powered:true,
        link:{kind:'lift', noun:'carriage'},
        enter:'Transit link. Carrier plate reads live. [E] rides it.',
        props:{dest:{type:'map',  label:'Deck it serves',    def:''},
               arrive:{type:'text',label:'Comes out at car', def:''},
               fade:{type:'bool',  label:'Screen goes black across it', def:false},
               card:CARD, cardsub:CARDSUB,
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
               fade:{type:'bool',  label:'Screen goes black across it', def:false},
               card:CARD, cardsub:CARDSUB,
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
  ':': {key:':', id:'grate',  name:'Catwalk',   walk:true,  see:true, clear:true, noisy:9,
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
  /* ---------- making power, rather than distributing it ----------
     A fuse decides which way out of a box is live. It decides nothing at all
     about whether the box has anything to give: that is the supply behind it,
     and on most decks the supply is the ship and the question never comes up.
     Stencil a box with a supply and it comes up: the box carries nothing,
     whatever is seated in it, until a generator stencilled the same name is
     turning. Which makes a dark deck two errands instead of one — find the
     fuel, then find the fuse — and makes the loudest thing an operator can
     do to a deck something it has to do on purpose. */
  'ƒ': {key:'ƒ', id:'fuel', name:'Fuel canister', walk:true, clear:true,
        fill:'rgba(255,180,74,.12)', line:'rgba(255,180,74,.52)', glyph:'▬',
        press:'take', take:{kind:'fuel'},
        enter:'Canister on the deck, and there is still weight in it. [E] lifts it.',
        spent:{fill:'rgba(255,180,74,.03)', line:'rgba(255,180,74,.2)', glyph:'▫',
               enter:'Empty cradle. Whatever stood in it has been lifted.'},
        props:{label:{type:'text', label:'Stencilled', def:''}}},
  /* Six tiles by three of it, and nothing about it answers a control: a
     generator is started by hand, with a canister, and it goes on turning
     from then on. What it costs is noise — it catches loudly and it runs
     loudly, every few seconds, for as long as the deck needs the power. */
  'ĝ': {key:'ĝ', id:'generator', name:'Generator', walk:false,
        foot:{len:6, wide:3},
        parts:[['╔','═','═','═','═','╗'],
               ['║','◉','≡','≡','▤','║'],
               ['╚','═','═','═','═','╝']],
        fill:'rgba(255,180,74,.12)', line:'rgba(255,180,74,.45)',
        press:'generator',
        bump:'Generator set. Six tiles of it, cold, and the tank dry. [E] puts a canister in and turns it over.',
        run:{fill:'rgba(255,180,74,.26)', line:'rgba(255,210,120,.9)',
             bump:'Generator set, turning over. Everything on its supply reads live, and the whole deck can hear it.'},
        props:{dir:{type:'dir',  label:'Runs', def:'right'},
               supply:Object.assign({}, SUPPLY, {label:'Supply it feeds'}),
               run:{type:'bool', label:'Starts turning', def:false},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* The box that is not a box on a post: four squares of panel let into the
     bulkhead. Everything a fusebox is — the same ways, the same fuses, the
     same screen — in the size a compartment that mattered got. */
  'ü': {key:'ü', id:'panel', name:'Distribution panel', walk:false, clear:true,
        foot:{len:2, wide:2},
        parts:[['⊞','⊞'],['⊞','⊞']],
        fill:'rgba(255,180,74,.14)', line:'rgba(255,180,74,.6)',
        press:'fusebox',
        bump:'Distribution panel, four squares of it let into the bulkhead. [E] opens the ways.',
        props:{dir:{type:'dir', label:'Runs', def:'right'},
               ways:{type:'slots', label:'Ways it feeds', def:[],
                     fields:{circuit:{type:'text', label:'Circuit', def:''},
                             rating:{type:'pick', label:'Takes', def:'a15', opts:FUSE_OPTS}}},
               supply:Object.assign({}, SUPPLY),
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
  'X': {key:'X', id:'bones',  name:'Bones', walk:true, merge:true, noisy:8,
        fill:'rgba(214,226,220,.1)', line:'rgba(214,226,220,.4)', glyph:'\u2021',
        enter:'Scattered bone, long and picked clean. It cracks underfoot.'},
  'Y': {key:'Y', id:'body',   name:'Dead body', walk:true, slow:2.6,
        foot:{len:3}, parts:['\u2620','\u2263','\u2261'],
        fill:'rgba(150,18,18,.22)', line:'rgba(255,59,47,.45)',
        enter:'Crew remains, full length across the deck. The chassis climbs rather than walks.',
        props:{dir:{type:'dir', label:'Lies', def:'right'}}},
  /* What is left of one that has been out here long enough. Two tiles rather
     than three, because there is less of it than there was, and it cracks:
     stepping over a skeleton is quieter than wading and louder than walking. */
  'ś': {key:'ś', id:'skeleton', name:'Skeleton', walk:true, slow:1.9, noisy:7,
        foot:{len:2}, parts:['☠','‡'],
        fill:'rgba(214,226,220,.12)', line:'rgba(214,226,220,.45)',
        enter:'Articulated remains, picked clean and still lying the way they went down. The chassis steps over, and something under it gives.',
        props:{dir:{type:'dir', label:'Lies', def:'right'}}},

  /* ---------- what the deck came down as ----------
     Five blocks of wreckage, and the difference between them is the only
     thing worth knowing about wreckage: how much of it there is, whether it
     can be crossed, and what crossing it costs. Loose material is walked
     through loudly; a door off its hinges is driven over slowly and more
     loudly still; what came out of a bulkhead is not crossed at all. A deck
     drawn out of these is a deck an operator routes round by ear rather
     than by eye, which is the whole reason for having them. */
  /* Debris as big as it is painted: one square of grit, or half a bay of
     collapse. Touching copies are one drift and the log says how much of it
     the unit has walked into. */
  'ð': {key:'ð', id:'rubble', name:'Debris field', walk:true, merge:true, sized:true,
        slow:1.3, noisy:9, glyph:'⁂',
        fill:'rgba(28,240,28,.09)', line:'rgba(28,240,28,.26)',
        enter:'Collapse debris underfoot, and it shifts. Every square of this is a square something heard the chassis cross.'},
  /* Plating that has gone, without going through. It carries the chassis and
     complains about it — which is all a fracture is: ground that costs
     nothing to cross and tells the deck you crossed it. */
  '\'': {key:'\'', id:'fracture', name:'Fractured floor', walk:true, noisy:6, glyph:'↯',
        fill:'rgba(28,240,28,.07)', line:'rgba(28,240,28,.3)',
        enter:'Plating fractured clean across. It takes the weight, flexes, and rings when it settles.'},
  /* A door is either a way or a wall. This one is neither: it is down, it is
     in the way, and the chassis drives over it at a crawl with the whole of
     the deck listening to the plate ring under it. */
  'ď': {key:'ď', id:'downdoor', name:'Broken door', walk:true, slow:2.4, noisy:13,
        glyph:'╱',
        fill:'rgba(255,180,74,.12)', line:'rgba(255,180,74,.45)',
        enter:'Door off its hinges and down flat across the way. The chassis drives over it slowly, and it rings the length of the deck.'},
  /* Out of the deckhead, glass first. */
  'ł': {key:'ł', id:'fallenlight', name:'Fallen light fixture', walk:true, slow:1.4, noisy:11,
        glyph:'¤',
        fill:'rgba(191,247,220,.1)', line:'rgba(191,247,220,.42)',
        enter:'Light fitting down out of the deckhead, tube and housing together. It goes under the chassis in pieces.'},
  /* And what a bulkhead becomes when it stops being one: as big as it is
     painted, and not crossed. Sight stops in it the way it stops in the wall
     this used to be. */
  'ŵ': {key:'ŵ', id:'walldebris', name:'Wall debris', walk:false, merge:true, sized:true,
        glyph:'▓',
        fill:'rgba(28,240,28,.17)', line:'rgba(28,240,28,.38)',
        bump:'Structure down across the way — plate, insulation and frame, in a heap. Nothing reads through it and nothing climbs it.'},

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
               fade:{type:'bool',  label:'Screen goes black across it', def:false},
               card:CARD, cardsub:CARDSUB,
               label:{type:'text', label:'Stencilled',       def:''}}},

  /* ---------- paper ----------
     A console needs a circuit; a note needs nothing at all, and reads the
     same on a dead deck as on a live one. */
  'n': {key:'n', id:'note',   name:'Note', walk:true,
        fill:'rgba(255,230,180,.13)', line:'rgba(255,230,180,.55)', glyph:'\u00b6',
        press:'note', enter:'A scrap of paper on the deck. [E] reads it.',
        props:{title:{type:'text', label:'Header', def:'HANDWRITTEN NOTE'},
               text:{type:'lines', label:'Text',   def:'The ink has run. Nothing legible.'}}},

  /* ---------- contacts: what the deck was not left empty of ----------
     Neither of these is a block. The square is a starting mark: the run
     builds a contact on it and the mark is plain ground from then on, so
     nothing about a route changes by putting one down. What each of them
     does is read from FOES above. */
  'E': {key:'E', id:'stalker', name:'Stalker', walk:true, foe:'stalker',
        fill:'rgba(255,180,74,.09)', line:'rgba(255,180,74,.4)', glyph:'\u03a8',
        enter:'Plating scuffed in a circle. Something stood here a long while.',
        props:{wake:{type:'int',  label:'Takes an interest within', def:18, min:2, max:40},
               range:{type:'int', label:'Wanders within (0: the whole deck)', def:0, min:0, max:60},
               label:{type:'text', label:'Stencilled', def:''}}},
  'e': {key:'e', id:'hunter',  name:'Hunter',  walk:true, foe:'hunter',
        fill:'rgba(255,59,47,.09)', line:'rgba(255,59,47,.4)', glyph:'\u039b',
        enter:'Deep scoring across the plate, in fours. Nothing on the manifest scores plate.',
        props:{wake:{type:'int',  label:'Takes an interest within', def:14, min:2, max:40},
               range:{type:'int', label:'Wanders within (0: the whole deck)', def:0, min:0, max:60},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* An emplacement rather than a contact: it is painted where it stands and
     it stands there. `wake` and `range` mean nothing to something that never
     walks, so it carries neither \u2014 what it reaches is the line it fires
     down, and that is set on the kind rather than copy by copy. */
  '<': {key:'<', id:'turret',  name:'Sentry turret', walk:true, foe:'turret',
        fill:'rgba(150,205,255,.1)', line:'rgba(150,205,255,.45)', glyph:'\u2295',
        enter:'Mounting ring set into the plate. Cable still live under it.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},
  'z': {key:'z', id:'drone',   name:'Security drone', walk:true, foe:'drone',
        fill:'rgba(96,170,255,.1)', line:'rgba(96,170,255,.45)', glyph:'\u25c8',
        enter:'Charging cradle, empty. Whatever sat in it is not in it now.',
        props:{wake:{type:'int',  label:'Takes an interest within', def:16, min:2, max:40},
               range:{type:'int', label:'Wanders within (0: the whole deck)', def:0, min:0, max:60},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* Three tiles by three of it, and the mark is the middle one: leave the
     eight squares round it clear or it has nowhere to start from. */
  '0': {key:'0', id:'block',   name:'Block', walk:true, foe:'block',
        fill:'rgba(255,120,80,.09)', line:'rgba(255,120,80,.4)', glyph:'\u25a0',
        enter:'Guide rail worn bright in a long straight line. Something heavy runs this way.',
        props:{wake:{type:'int',  label:'Takes an interest within', def:12, min:2, max:40},
               range:{type:'int', label:'Wanders within (0: the whole deck)', def:0, min:0, max:60},
               label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- open land ----------
     A dome is not a deck. What the unit crosses out here is ground rather
     than plating, and it reads as ground: earth, growth, and the ruts
     something with wheels left in it. None of it stops anything. What it does
     is tell the operator where it is standing, because a field with no
     landmark in it is the easiest place on a map to be lost. */
  'd': {key:'d', id:'dirt',   name:'Dirt',        walk:true,
        fill:'rgba(166,124,72,.13)',  line:'rgba(166,124,72,.32)',
        enter:'Open earth underfoot. Turned once, and a long time ago.'},
  'g': {key:'g', id:'grass',  name:'Grass',       walk:true,
        fill:'rgba(120,200,96,.1)',   line:'rgba(120,200,96,.27)', glyph:'\u2591',
        enter:'Growth underfoot. Something in this dome is still alive.'},
  'p': {key:'p', id:'path',   name:'Path',        walk:true,
        fill:'rgba(200,168,112,.16)', line:'rgba(200,168,112,.36)',
        enter:'Beaten track. Something came this way often enough to wear it.'},
  'r': {key:'r', id:'ruts',   name:'Tire tracks', walk:true,  merge:true,
        fill:'rgba(166,124,72,.18)',  line:'rgba(200,168,112,.4)', glyph:'\u2550',
        enter:'Tread pressed into the earth. Wide gauge. Nothing the chassis leaves.'},
  '_': {key:'_', id:'boards', name:'Wooden floor',walk:true,
        fill:'rgba(186,140,84,.14)',  line:'rgba(186,140,84,.36)', glyph:'\u2261',
        enter:'Board floor. It gives under the chassis, and holds.'},
  /* Water, drawn the way a tank is: touching copies are one body, so a pond
     is exactly as big as it is painted. Sight crosses it — open water is the
     one thing out here the unit can see all the way over — and the chassis
     does not, because it is not sealed for it. */
  'P': {key:'P', id:'pond',   name:'Pond',        walk:false, merge:true, sized:true, clear:true,
        fill:'rgba(79,133,112,.34)',  line:'rgba(140,214,182,.55)', glyph:'\u2248',
        bump:'Standing water. Depth unread. The chassis is not sealed for it.'},

  /* ---------- what is built out of timber ----------
     A farm is not a ship: its walls are boards, its windows are glass, and
     the one door that matters is locked rather than sealed. */
  'H': {key:'H', id:'timber', name:'Wooden wall', walk:false,
        fill:'rgba(186,140,84,.22)',  line:'rgba(186,140,84,.52)', glyph:'\u2593',
        bump:'Board wall. Dry timber, and no route through it.'},
  'h': {key:'h', id:'rail',   name:'Wooden fencing', walk:false, clear:true,
        fill:'rgba(186,140,84,.05)',  line:'rgba(186,140,84,.45)', glyph:'\u2016',
        bump:'Post and rail. It holds, and the ground reads clear over it.'},
  'i': {key:'i', id:'window', name:'Window',      walk:false, clear:true,
        fill:'rgba(191,247,220,.1)',  line:'rgba(191,247,220,.5)',  glyph:'\u25eb',
        bump:'Glazing, intact. The room reads clear through it and stays shut.'},
  'Q': {key:'Q', id:'silo',   name:'Silo wall',   walk:false, merge:true, sized:true,
        fill:'rgba(200,168,112,.3)',  line:'rgba(230,196,102,.6)',  glyph:'\u25a7',
        bump:'Silo wall. Curved plate, riveted. Whatever it holds is overhead.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},
  /* A door with a lock rather than a circuit. `keyed` says the block is held
     shut by something the unit has to be carrying: the key named in `opens`,
     and no other. Nothing else will do it — a control wired to it presses
     against the lock the same as the chassis does. Once the lock has been
     turned the door is an ordinary door and stays turned. */
  'K': {key:'K', id:'lockdoor', name:'Locked door', walk:false,
        fill:'rgba(186,140,84,.26)',  line:'rgba(230,196,102,.62)', glyph:'\u25a5',
        signal:'toggle', press:'keydoor', keyed:true,
        bump:'Door, shut, and the lock turned. [E] tries the manipulator against it.',
        open:{fill:'rgba(186,140,84,.06)', line:'rgba(186,140,84,.32)', glyph:'\u2595'},
        props:{opens:{type:'pick', label:'Takes', def:'barn', opts:KEY_OPTS},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* The key itself: a small object, lifted and carried the way a fuse is. */
  'k': {key:'k', id:'key',    name:'Key',         walk:true,  clear:true,
        fill:'rgba(230,196,102,.1)',  line:'rgba(230,196,102,.5)',  glyph:'\u2310',
        press:'take', take:{kind:'key', from:'opens'},
        enter:'Something small on a hook by the door. [E] lifts it.',
        spent:{fill:'rgba(230,196,102,.03)', line:'rgba(230,196,102,.2)', glyph:'\u25cc',
               enter:'Empty hook. Whatever hung on it has been lifted.'},
        props:{opens:{type:'pick', label:'Cut for', def:'barn', opts:KEY_OPTS},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* A board on a post. It is read the way a note is — paper and paint need no
     circuit — but it stands in the way, which is the whole point of a sign. */
  '?': {key:'?', id:'sign',   name:'Sign',        walk:false, clear:true,
        fill:'rgba(230,196,102,.12)', line:'rgba(230,196,102,.5)',  glyph:'\u00a7',
        press:'note',
        bump:'Board on a post. [E] reads it.',
        props:{title:{type:'text', label:'Header', def:'PAINTED SIGN'},
               text:{type:'lines', label:'Text',   def:'The paint has gone. Nothing legible.'}}},
  /* ---------- a gate that takes its time ----------
     A cargo gate is open or shut the instant it is signalled. This one runs:
     `slide` says the body opens a tile at a time, from the end it is pointed
     at toward the far one, and shuts again the same way in reverse. It is as
     wide as it is painted, it answers a control and nothing else — there is
     no handle on a gate this size — and the unit can walk in behind it while
     it is still running. */
  '>': {key:'>', id:'slidegate', name:'Sliding gate', walk:false,
        fill:'rgba(199,148,74,.2)',   line:'rgba(255,180,74,.6)',  glyph:'\u25a5',
        signal:'toggle', slide:true, merge:true, powered:true,
        bump:'Gate, shut across the way. It runs on a track. Find the control.',
        open:{fill:'rgba(199,148,74,.05)', line:'rgba(255,180,74,.3)', glyph:'\u2595'},
        lock:{fill:'rgba(199,148,74,.3)',  line:'rgba(255,180,74,.85)', glyph:'\u25a6',
              bump:'Gate, shut across the way. Locked out. Nothing drives it.'},
        props:{dir:{type:'dir',  label:'Runs open toward', def:'right'},
               open:{type:'bool',label:'Starts open', def:false},
               locked:{type:'bool', label:'Locked \u2014 cannot be driven', def:false}}},

  /* ---------- what is parked, and what turns ---------- */
  /* Seven tiles by three of ground vehicle. `parts` gives it a glyph per cell
     rather than per tile along its length, so it is drawn as a body with
     wheels at its corners rather than as a row of the same mark. It turns
     with its `dir` like anything else that covers more than its own tile. */
  'R': {key:'R', id:'car',    name:'Car',         walk:false,
        foot:{len:7, wide:3},
        parts:[['\u25cf','\u2550','\u2550','\u2550','\u2550','\u2550','\u25cf'],
               ['\u2550','\u25ad','\u25ad','\u2550','\u25a6','\u25a6','\u2550'],
               ['\u25cf','\u2550','\u2550','\u2550','\u2550','\u2550','\u25cf']],
        fill:'rgba(255,180,74,.14)',  line:'rgba(255,180,74,.5)',
        bump:'Ground car. Seven tiles of it, tyres flat and cell long dead.',
        props:{dir:{type:'dir',  label:'Faces', def:'right'},
               label:{type:'text',label:'Stencilled', def:''}}},
  /* Three by three, and the only thing in the dome still doing its work. */
  '@': {key:'@', id:'windmill', name:'Windmill',  walk:false,
        foot:{len:3, wide:3},
        parts:[['\u2572','\u2502','\u2571'],
               ['\u2500','\u25c9','\u2500'],
               ['\u2571','\u2502','\u2572']],
        fill:'rgba(186,140,84,.16)',  line:'rgba(230,196,102,.58)',
        bump:'Windmill. The sails are turning. Nothing else on this deck is.',
        props:{dir:{type:'dir',  label:'Faces', def:'right'},
               label:{type:'text',label:'Stencilled', def:''}}},

  /* ---------- what furnishes a house ----------
     All of it stops the unit and none of it stops sight: a room read from
     overhead is its furniture, and furniture is low. */
  'Z': {key:'Z', id:'bed',    name:'Bed',         walk:false, clear:true,
        foot:{len:2}, parts:['\u25ad','\u2592'],
        fill:'rgba(28,240,28,.1)',    line:'rgba(28,240,28,.34)',
        bump:'Bed, made up. Whoever it was made up for is not in it.',
        props:{dir:{type:'dir', label:'Runs', def:'right'}}},
  'a': {key:'a', id:'chair',  name:'Chair',       walk:false, clear:true, glyph:'\u2293',
        fill:'rgba(28,240,28,.11)',   line:'rgba(28,240,28,.36)',
        bump:'Chair, pushed back from the table.'},
  'U': {key:'U', id:'sofa',   name:'Sofa',        walk:false, clear:true,
        foot:{len:2}, parts:['\u2293','\u2293'],
        fill:'rgba(28,240,28,.12)',   line:'rgba(28,240,28,.38)',
        bump:'Long seat. The upholstery has gone to powder.',
        props:{dir:{type:'dir', label:'Runs', def:'right'}}},
  't': {key:'t', id:'table',  name:'Table',       walk:false, clear:true,
        foot:{len:2, wide:2},
        parts:[['\u250c','\u2510'],['\u2514','\u2518']],
        fill:'rgba(28,240,28,.1)',    line:'rgba(28,240,28,.34)',
        bump:'Table. Places laid at it, and dust in every one of them.',
        props:{dir:{type:'dir', label:'Runs', def:'right'}}},
  /* Domestic glass. It is read like a note and it draws power like a console,
     so a house with the circuit pulled has a screen in it saying nothing. */
  'm': {key:'m', id:'screen', name:'Television',  walk:false, clear:true, glyph:'\u25a2',
        fill:'rgba(191,247,220,.14)', line:'rgba(191,247,220,.55)',
        press:'note', powered:true,
        bump:'Domestic screen. [E] reads what is on it.',
        props:{title:{type:'text', label:'Header',    def:'BROADCAST'},
               text:{type:'lines',label:'On screen',  def:'Colour bars. Nothing behind them.'},
               label:{type:'text',label:'Stencilled', def:''}}},

  /* ---------- the rest of what furnishes a room ----------
     Five blocks that are the sizes the first five were not. A room is read
     from overhead as its furniture, and furniture that only ever comes one
     tile square or two tiles long makes every room on the ship the same
     room: this is a seat wide enough for two, a table small enough for one,
     a table as long as it is painted, something growing in a pot, and the
     thing on the bulkhead that was keeping the compartment warm. */
  '5': {key:'5', id:'planter', name:'Potted plant', walk:false, clear:true, glyph:'✿',
        fill:'rgba(120,200,96,.12)', line:'rgba(120,200,96,.44)',
        bump:'Planter. Dry to the bottom of the pot, and the stem in it still standing up.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},
  /* Two tiles across its facing rather than two along it: a bench seat faces
     a way and seats two, where a sofa runs a length and faces nowhere. */
  '6': {key:'6', id:'widechair', name:'Wide chair', walk:false, clear:true,
        foot:{len:1, wide:2}, parts:[['⊓'],['⊓']],
        fill:'rgba(28,240,28,.11)', line:'rgba(28,240,28,.36)',
        bump:'Bench seat, two places of it, facing something that is not there any more.',
        props:{dir:{type:'dir', label:'Faces', def:'right'}}},
  '7': {key:'7', id:'stand',  name:'Side table', walk:false, clear:true, glyph:'⊡',
        fill:'rgba(28,240,28,.1)', line:'rgba(28,240,28,.34)',
        bump:'Side table, one square of it. A cup ring, and nothing standing in it.'},
  /* The table with no size of its own: touching copies are one top, so a
     refectory bench down the length of a mess is painted rather than fitted
     together out of two-by-twos. */
  '8': {key:'8', id:'longtable', name:'Long table', walk:false, clear:true,
        merge:true, sized:true, glyph:'≡',
        fill:'rgba(28,240,28,.1)', line:'rgba(28,240,28,.34)',
        bump:'Table top, run the length of the room and low enough to read over.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},
  /* On the bulkhead rather than on the deck, and on a circuit like anything
     else that draws: a compartment with the power pulled has a cold panel on
     the wall of it, and from overhead that is the whole of what tells an
     operator the heating went with the lights. */
  '9': {key:'9', id:'heater', name:'Wall heater', walk:false, clear:true, glyph:'♨',
        fill:'rgba(255,180,74,.13)', line:'rgba(255,180,74,.5)', powered:true,
        bump:'Bulkhead heater. Element behind a grille, and the grille furred with dust.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- what is grown here ----------
     Crop is ground the unit can walk into, and the only ground on a deck that
     costs it something to cross. Corn is `dense`: it is walkable and sight
     stops dead in it, so a field is cover — the unit cannot read out of it
     and nothing reads into it. That is the whole of what a crop is for. */
  '|': {key:'|', id:'corn',   name:'Corn stalk',  walk:true,  merge:true, sized:true,
        dense:true, slow:1.5,
        fill:'rgba(163,222,96,.14)',  line:'rgba(163,222,96,.42)', glyph:'\u2551',
        enter:'Standing crop, well over the chassis. Nothing reads through it \u2014 in or out.'},
  'w': {key:'w', id:'wheat',  name:'Wheat',       walk:true,  merge:true, sized:true, slow:1.2,
        fill:'rgba(230,196,102,.13)', line:'rgba(230,196,102,.38)', glyph:'\u2592',
        enter:'Cereal crop, waist high. It parts, and closes again behind the chassis.'},
  '&': {key:'&', id:'tomato', name:'Tomatoes',    walk:true,  merge:true, slow:1.3,
        fill:'rgba(255,59,47,.1)',    line:'rgba(255,120,80,.4)',  glyph:'\u25cb',
        enter:'Staked vines. Fruit on them, and none of it picked.'},
  'y': {key:'y', id:'hay',    name:'Hay bale',    walk:false, merge:true, sized:true, clear:true,
        fill:'rgba(230,196,102,.18)', line:'rgba(230,196,102,.46)', glyph:'\u2263',
        bump:'Baled straw. Too heavy to shift, low enough to read over.'},
  'j': {key:'j', id:'scarecrow', name:'Scarecrow',walk:false, clear:true, glyph:'\u2020',
        fill:'rgba(186,140,84,.12)',  line:'rgba(186,140,84,.48)',
        bump:'Figure on a cross-post. Sacking, straw and a coat. It read as a contact until the optics resolved it.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- the offices ----------
     Three blocks and a colour. Carpet underfoot, paint on the bulkhead and a
     counter across the way: what a deck looks like where the ship was
     administered rather than run. The carpet is worth more than its colour —
     it is the quietest ground on the ship, and on a deck with something
     listening that is the difference between a route and a mistake. */
  '`': {key:'`', id:'carpet', name:'Carpet', walk:true, noisy:2,
        fill:OFF_SOFT.fill, line:OFF_SOFT.line,
        enter:'Carpet tile, dark blue, laid square and still flat. It takes the sound out of a step.'},
  ']': {key:']', id:'paint',  name:'Painted wall', walk:false,
        fill:OFF_DEEP.fill, line:OFF_DEEP.line, glyph:'▓',
        bump:'Bulkhead under dark blue paint, rolled on by hand and gone chalky. No route through it.'},
  /* A counter rather than a desk: it is as long as it is painted, one body,
     and low enough that the room behind it reads clear over the top. */
  ')': {key:')', id:'reception', name:'Reception desk', walk:false, clear:true,
        merge:true, sized:true,
        fill:OFF_DESK.fill, line:OFF_DESK.line, glyph:'▄',
        bump:'Reception counter. Run the length of the lobby, and low enough to read over.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- somewhere to be that is not the deck ----------
     Two fixtures the unit can get inside rather than walk round. They are
     the locker and the desk with their backs taken out, and what they do is
     the one thing nothing else on a deck does: while the unit is folded into
     one, nothing hunting the deck can find it at all. It is solid the whole
     time — a hiding place is not a hole — and the optics read the slats and
     almost nothing else, so hiding is also the operator giving up the feed.  */
  '{': {key:'{', id:'hollowlocker', name:'Hollow locker', walk:false, hide:true,
        press:'hide', fill:'rgba(28,240,28,.13)', line:'rgba(28,240,28,.42)', glyph:'▯',
        bump:'Crew locker, and the back panel of it is out. [E] folds the chassis inside.',
        inside:{fill:'rgba(28,240,28,.26)', line:'rgba(191,247,220,.8)', glyph:'▮',
                bump:'The locker is occupied. [E] climbs back out of it.'},
        props:{label:{type:'text', label:'Stencilled', def:''}}},
  '}': {key:'}', id:'hollowdesk', name:'Hollow desk', walk:false, hide:true, clear:true,
        press:'hide', foot:{len:3}, parts:['≡','⊓','≡'],
        fill:'rgba(28,240,28,.12)', line:'rgba(28,240,28,.38)',
        bump:'Work surface with the modesty panel gone and the well clear under it. [E] folds the chassis in.',
        inside:{fill:'rgba(28,240,28,.24)', line:'rgba(191,247,220,.75)'},
        props:{dir:{type:'dir', label:'Runs', def:'right'},
               label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- what is coming out of the walls ----------
     A burst feed line and the water it is putting on the deck. The pipe is
     what spreads it: `reach` is how far out of it the flood works, it runs
     only while its own circuit is live, and killing that supply drains the
     deck back again. Water already painted on the deck is wet from the start
     and spreads nothing by itself — what it does is carry a pipe's reach
     across itself for nothing, so a pool is a thing that makes a burst line
     reach further than it otherwise would. */
  '$': {key:'$', id:'pipe',   name:'Broken pipe', walk:false, clear:true,
        pipe:true, powered:true,
        fill:'rgba(96,170,255,.18)', line:'rgba(150,205,255,.62)', glyph:'╦',
        bump:'Feed line, burst at the coupling. It is still pushing water out onto the deck.',
        spent:{fill:'rgba(96,170,255,.05)', line:'rgba(150,205,255,.26)', glyph:'╥',
               bump:'Feed line, burst at the coupling. Nothing behind it. It has stopped running.'},
        props:{reach:{type:'int', label:'Floods within', def:6, min:0, max:40},
               label:{type:'text', label:'Stencilled', def:''}}},
  '1': {key:'1', id:'water',  name:'Water', walk:true, merge:true, sized:true,
        wet:true, slow:1.6, noisy:10,
        fill:'rgba(52,116,214,.2)', line:'rgba(96,170,255,.5)', glyph:'≈',
        enter:'Standing water across the plating. The chassis wades, and wading is the loudest thing it does.'},
  /* Alight, and as solid as anything on the deck while it is. Nothing crosses
     a fire — the unit turns back at one and so does everything walking about
     — and the only thing that answers it is water. What is left once the
     flood reaches it is wet ash, which is walked over like any other ground. */
  '2': {key:'2', id:'fire',   name:'Fire', walk:false, clear:true, burn:true, alert:true,
        fill:'rgba(255,120,80,.26)', line:'rgba(255,180,74,.8)', glyph:'▲',
        bump:'OPEN FLAME ACROSS THE WAY. The chassis will not cross it.',
        spent:{fill:'rgba(120,116,110,.16)', line:'rgba(170,166,160,.42)', glyph:'▒',
               enter:'Wet ash where the fire was. It is out, and the deck is walkable again.'}},
  /* A beam across the way, and the one block on a deck that does nothing at
     all until it is walked through. Armed, it sounds the deck; a control
     disarms it, on a wall or filed on a console, and `signal:'arm'` is how
     both of them reach it. It is as wide as it is painted and one body, so a
     beam across a corridor is disarmed by one press. */
  '3': {key:'3', id:'alarm',  name:'Laser alarm', walk:true, clear:true, merge:true,
        alarm:true, signal:'arm', powered:true, alert:true,
        fill:'rgba(255,59,47,.12)', line:'rgba(255,59,47,.62)', glyph:'╎',
        enter:'A beam across the way, and the unit is standing in it.',
        spent:{fill:'rgba(255,59,47,.03)', line:'rgba(255,59,47,.2)', glyph:'╌',
               enter:'Emitter dark. The beam is down and the way is clear.'},
        props:{armed:{type:'bool', label:'Starts armed', def:true},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* The mark something blind starts on. It takes `hears` rather than a wake:
     nothing about how near the unit is reaches it, and what it goes to is
     whatever the deck was last heard doing. */
  '4': {key:'4', id:'ravager', name:'Ravager', walk:true, foe:'ravager',
        fill:'rgba(214,226,220,.08)', line:'rgba(214,226,220,.4)', glyph:'Ω',
        enter:'Plating scoured smooth in a wide arc, and not a mark on the walls either side of it. Whatever did this never touched them.',
        props:{hears:{type:'int',  label:'Hears within', def:26, min:2, max:60},
               range:{type:'int',  label:'Wanders within (0: the whole deck)', def:0, min:0, max:60},
               label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- the command deck ----------
     Eight blocks that are the same eight blocks as everywhere else on the
     ship — a desk, a barrier, a console, a car — built to a standard nobody
     applied anywhere below. They are worth having as their own family rather
     than as a blue coat of paint on the old ones because they are read
     together: a deck laid out of these is a deck the crew ran the ship from,
     and the operator is meant to know that from the colour before it has
     pressed anything. */
  'J': {key:'J', id:'cmddesk', name:'Command Desk',  walk:false, clear:true,
        foot:{len:3}, parts:['\u25a4','\u2550','\u25a4'],
        fill:CMD_BLUE.fill, line:CMD_BLUE.line,
        bump:'Command desk. Three stations of it, chairs pushed back, and the glass dark.',
        props:{dir:{type:'dir', label:'Runs', def:'right'},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* A bar down across the way. It has no handle — a blockade is dropped and
     lifted from somewhere else, which is the whole of what it is for: a
     button on a wall, or a control filed on a console's desktop. */
  '-': {key:'-', id:'blockade', name:'Command Blockade', walk:false,
        fill:CMD_DEEP.fill, line:CMD_DEEP.line, glyph:'\u2550',
        signal:'toggle', merge:true, powered:true,
        bump:'Blockade bar, down across the way. It lifts to a control \u2014 on a wall, or filed on a console.',
        open:{fill:'rgba(18,48,116,.06)', line:'rgba(74,132,214,.3)', glyph:'\u2594'},
        lock:{fill:'rgba(18,48,116,.5)',  line:'rgba(150,205,255,.85)', glyph:'\u2593',
              bump:'Blockade bar, down across the way. Locked out. No control on this deck lifts it.'},
        props:{open:{type:'bool',   label:'Starts lifted', def:false},
               locked:{type:'bool', label:'Locked \u2014 cannot be lifted', def:false}}},
  /* Filled bags, stacked where somebody wanted cover in a hurry. As big as it
     is painted, and low enough to read over \u2014 which is the difference
     between cover for the unit and cover for whatever is on the far side. */
  '(': {key:'(', id:'sandbag', name:'Command Sandbags', walk:false,
        merge:true, sized:true, clear:true,
        fill:'rgba(74,132,214,.24)', line:'rgba(96,170,255,.52)', glyph:'\u25ac',
        bump:'Filled bags, stacked two high. Too heavy to shift, low enough to read over.'},
  /* A relay with a console in its foot. It is the one block on the deck that
     is both: the mast carries the signal and the glass at the bottom of it is
     read exactly the way a terminal is, desktop, filing, controls and all. */
  'q': {key:'q', id:'cmdrelay', name:'Command Relay', walk:false,
        fill:CMD_PALE.fill, line:CMD_PALE.line, glyph:'\u2299',
        press:'terminal', powered:true,
        bump:'Command relay. The mast is dead and the glass in its foot is not. [E] to read.',
        props:{title:{type:'text',  label:'Header',  def:'COMMAND RELAY'},
               text:{type:'lines',  label:'Text',    def:'Carrier lost. No traffic held.'},
               desktop:{type:'bool',label:'Has desktop', def:false},
               files:Object.assign({}, FILE_SLOTS, {label:'Desktop holds'}),
               card:{type:'text',   label:'Words the locked file ends on', def:''},
               cardsub:{type:'text',label:'Line under them',               def:''},
               label:{type:'text',  label:'Stencilled', def:''}}},
  /* Three tiles by three of dish and mast. While it is live it transmits, and
     the unit reads it through structure the way it reads a beacon \u2014 so an
     antenna is what a command deck is navigated by, and it goes quiet once
     the unit has walked up to it and there is nothing left to steer by. */
  'l': {key:'l', id:'antenna', name:'Command Antenna', walk:false,
        foot:{len:3, wide:3},
        parts:[['\u256d','\u2500','\u256e'],
               ['\u2502','\u25c9','\u2502'],
               ['\u2570','\u2534','\u256f']],
        fill:CMD_BLUE.fill, line:CMD_BLUE.line,
        ping:true, powered:true,
        bump:'Antenna array. The dish still turns, and the carrier under it still reads.',
        spent:{fill:'rgba(52,116,214,.05)', line:'rgba(96,170,255,.26)',
               bump:'Antenna array. Carrier dropped. Nothing transmitting.'},
        props:{dir:{type:'dir',  label:'Faces', def:'right'},
               range:{type:'int',  label:'Goes quiet within', def:3, min:0, max:20},
               armed:{type:'bool', label:'Starts transmitting', def:true},
               objective:{type:'text', label:'Objective while lit', def:''},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* The command deck's own car. It is a car like any other \u2014 it pairs with
     an ordinary elevator at the far end, because a shaft is a shaft. */
  '[': {key:'[', id:'cmdlift', name:'Command Elevator', walk:true,
        fill:CMD_PALE.fill, line:CMD_PALE.line, glyph:'\u21c5',
        beacon:true, press:'lift', signal:'lift', powered:true,
        link:{kind:'lift', noun:'carriage'},
        enter:'Command carriage. Plate reads live, and the call panel is lit. [E] rides it.',
        props:{dest:{type:'map',  label:'Deck it serves',    def:''},
               arrive:{type:'text',label:'Comes out at car', def:''},
               fade:{type:'bool',  label:'Screen goes black across it', def:false},
               card:CARD, cardsub:CARDSUB,
               label:{type:'text', label:'Stencilled',       def:''}}},
  /* Painted board, bolted to the bulkhead. Read the way a sign is: paint
     needs no circuit, so it says the same thing on a dead deck. */
  'N': {key:'N', id:'cmdsign', name:'Command Signage', walk:false, clear:true,
        fill:CMD_PALE.fill, line:CMD_PALE.line, glyph:'\u25e9',
        press:'note',
        bump:'Command signage, stencilled on steel. [E] reads it.',
        props:{title:{type:'text', label:'Header', def:'COMMAND SIGNAGE'},
               text:{type:'lines', label:'Text',   def:'The lettering has gone under corrosion.'}}},
  /* The glass the deck was actually run from. Everything a terminal does,
     desktop and filing included \u2014 and a control filed on one lifts a
     blockade from across the room. */
  'I': {key:'I', id:'cmdterm', name:'Command Terminal', walk:false, clear:true,
        fill:CMD_BLUE.fill, line:CMD_BLUE.line, glyph:'\u25a9',
        press:'terminal', powered:true,
        bump:'Command console. Heavier glass than the crew decks carry. [E] to read.',
        props:{title:{type:'text',  label:'Header',  def:'COMMAND CONSOLE'},
               text:{type:'lines',  label:'Text',    def:'No readable record.'},
               desktop:{type:'bool',label:'Has desktop', def:false},
               files:Object.assign({}, FILE_SLOTS, {label:'Desktop holds'}),
               card:{type:'text',   label:'Words the locked file ends on', def:''},
               cardsub:{type:'text',label:'Line under them',               def:''}}},

  /* ---------- the plant the command deck was built round ----------
     Everything above is furniture beside these two. A deck with a core on it
     is a deck the ship was thinking with, and a deck with a reactor on it is
     a deck that can be taken off the ship entirely — and both of them are
     drawn at the size that actually means, rather than at the size a tile
     happens to be. Fourteen by twelve and twenty-seven by six: an operator
     walks the length of either one before it has read what is stencilled on
     it, which is the whole reason for building them this big. */
  /* Fourteen tiles by twelve of it, and one press anywhere along it opens the
     thing to be talked to. It is not a terminal: a terminal hands over a
     record and a core answers questions, one at a time, in whatever order
     the operator thinks to ask them — and a question may be wired to blocks
     the way a control filed on a desktop is, so asking for a door is how a
     door gets opened. */
  'ĉ': {key:'ĉ', id:'aicore', name:'AI Core', walk:false,
        foot:{len:14, wide:12},
        parts:faceParts(14, 12, '◉', '·', 3),
        fill:CMD_DEEP.fill, line:CMD_BLUE.line,
        press:'aicore', powered:true,
        bump:'Core housing. Fourteen tiles of it, and something behind the glass is still answering. [E] opens a channel.',
        spent:{fill:'rgba(18,48,116,.1)', line:'rgba(74,132,214,.3)',
               bump:'Core housing. The lattice is dark end to end. Nothing in there is answering.'},
        props:{dir:{type:'dir', label:'Runs', def:'right'},
               title:{type:'text', label:'Header', def:'CORE INTELLIGENCE'},
               greet:{type:'lines', label:'Opens with',
                      def:'The channel opens. Something on the other side of it was already waiting.'},
               /* one row is one thing it will answer to. `ask` is the line
                  the operator puts to it, `reply` is what comes back, and
                  `targets` are the blocks the asking drives — which is what
                  makes a core a control as well as a voice. `after` is the
                  question that has to have been put to it first: a row with
                  nothing in it is on the list from the moment the channel
                  opens, and a row with a question in it is not there at all
                  until that question has been asked. An answer is therefore
                  a thing that can open another thread, which is how a core
                  holds a conversation rather than a menu */
               talk:{type:'slots', label:'It will answer', def:[],
                     fields:{ask:{type:'text',  label:'Asked',   def:''},
                             after:{type:'text', label:'Opens after', def:''},
                             reply:{type:'lines',label:'Answers', def:''},
                             targets:{type:'points', label:'Asking presses', def:[]}}},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* Twenty-seven tiles by six, and shut. The face of it opens to an operator
     key and to nothing else — no control reaches a reactor and no circuit
     wakes one — and what is behind the face is two sockets and a count. Two
     sacrifice keys go in, neither of them comes out, and from the moment the
     second one is turned the deck has as long as its author gave it. */
  'ř': {key:'ř', id:'reactor', name:'Fusion Reactor', walk:false,
        foot:{len:27, wide:6},
        parts:faceParts(27, 6, '◎', '≡', 4),
        fill:'rgba(150,205,255,.12)', line:'rgba(190,228,255,.5)',
        press:'reactor', powered:true,
        bump:'Fusion plant. Twenty-seven tiles of it, holding, and the operator face is shut. [E] tries the manipulator against it.',
        run:{fill:'rgba(255,59,47,.3)', line:'rgba(255,120,80,.95)',
             bump:'Fusion plant, and the sequence is running. Nothing on this deck stops it now.'},
        props:{dir:{type:'dir', label:'Runs', def:'right'},
               opens:{type:'pick', label:'Face opens to', def:'operator', opts:KEY_OPTS},
               arms:{type:'pick', label:'Sockets take',   def:'sacrifice', opts:KEY_OPTS},
               count:{type:'int', label:'Seconds on the count', def:120, min:10, max:900},
               card:{type:'text', label:'Words the count ends on', def:''},
               cardsub:{type:'text', label:'Line under them', def:''},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* The door furniture the rest of the command deck is shut with. A keypad is
     a button with conditions on it: a word typed, a hand held up to a plate,
     an eye held up to a lens — any of the three, all of the three, or none of
     them, which is a button. What it does once it is satisfied is what a
     button does: it drives whatever lines run out of it, and it stays
     satisfied for the rest of the run. */
  'ķ': {key:'ķ', id:'keypad', name:'Keypad', walk:false, clear:true,
        fill:'rgba(255,180,74,.15)', line:'rgba(255,180,74,.65)', glyph:'⌸',
        press:'keypad', powered:true,
        bump:'Security keypad, and the lamp on it is red. [E] works it.',
        spent:{fill:'rgba(28,240,28,.14)', line:'rgba(28,240,28,.6)', glyph:'⌷',
               bump:'Security keypad, cleared. The lamp on it is green and it presses like any other control.'},
        props:{code:{type:'text', label:'Code', def:'0000'},
               pass:{type:'bool',  label:'Asks for the code',  def:true},
               finger:{type:'bool',label:'Fingerprint scan',   def:false},
               retina:{type:'bool',label:'Retina scan',        def:false},
               targets:{type:'points', label:'Signals blocks at', def:[]},
               label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- what a scanner wants, and where it is lying ----------
     A dead body is read on the way past. This one is worked: three tiles of
     crew with a hand and an eye still on it, and a keypad two rooms away that
     will not open for anything else. What it costs to take them is nothing at
     all, which is the point — the deck asks the operator to do it rather than
     to solve it. */
  'ÿ': {key:'ÿ', id:'corpse', name:'Corpse', walk:true, slow:2.6,
        foot:{len:3}, parts:['◍','≣','≡'],
        fill:'rgba(150,18,18,.24)', line:'rgba(255,120,80,.5)',
        press:'scavenge',
        enter:'Crew remains, and recent enough to still be worth something to a scanner. [E] takes what is left on it.',
        spent:{fill:'rgba(150,18,18,.1)', line:'rgba(255,59,47,.28)',
               enter:'Crew remains, stripped of everything a scanner would read.'},
        props:{dir:{type:'dir',  label:'Lies', def:'right'},
               hand:{type:'bool', label:'A hand still on it', def:true},
               eye:{type:'bool',  label:'An eye still in it', def:true},
               label:{type:'text',label:'Stencilled', def:''}}},
  /* The sample itself, lying on the deck: lifted, carried and set down the
     way a fuse and a key are, and read by a scanner the way a lock reads a
     cut. An author may paint one straight onto a deck — somebody else got
     here first — or leave the corpse to hand them over. */
  'ø': {key:'ø', id:'organ', name:'Tissue sample', walk:true, clear:true,
        fill:'rgba(255,120,80,.12)', line:'rgba(255,120,80,.5)', glyph:'❀',
        press:'take', take:{kind:'organ', from:'part'},
        enter:'Something on the deck that came off somebody. [E] lifts it.',
        spent:{fill:'rgba(255,120,80,.03)', line:'rgba(255,120,80,.2)', glyph:'◌',
               enter:'A mark on the plating where something was lying. It has been lifted.'},
        props:{part:{type:'pick', label:'Which', def:'hand', opts:PART_OPTS},
               label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- what is on the deck that should not be ----------
     Fuel out of a drum, spreading as far as the author painted it. It is
     ordinary ground until something sets light to it: then the whole of the
     body goes up, a square at a time, and burns until there is nothing left
     of it. Water reaching a spill washes it away before it ever catches,
     which is the only answer to one that does not involve being somewhere
     else. */
  'ş': {key:'ş', id:'spill', name:'Fuel spill', walk:true, merge:true, sized:true,
        spill:true, slow:1.4, noisy:6, alert:true,
        fill:'rgba(199,148,74,.22)', line:'rgba(255,180,74,.45)', glyph:'≈',
        enter:'Fuel across the plating, ankle deep and still spreading. The chassis wades it, and anything alight anywhere near it is a problem.',
        spent:{fill:'rgba(120,116,110,.14)', line:'rgba(170,166,160,.4)', glyph:'▒',
               enter:'Scorched plating where the fuel was. It has burnt out, or the water got to it first.'},
        props:{label:{type:'text', label:'Stencilled', def:''}}},
  /* And what it came out of. A drum is a drum: it stands where it was rolled
     to, it stops the unit, and whatever is in it is not coming out for
     anything the chassis can do. */
  'ƀ': {key:'ƀ', id:'barrel', name:'Barrel', walk:false,
        fill:'rgba(255,180,74,.16)', line:'rgba(255,180,74,.55)', glyph:'◙',
        bump:'Steel drum, banded and standing. Too heavy to shift, and whatever is in it stays in it.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},

  /* ---------- the other side of the hull ----------
     A deck that runs out into space is not a deck with a wall at the end of
     it. Vacuum is ground: the chassis is rated for it and crosses it exactly
     as it crosses plating — and nothing it does out there makes a sound,
     because there is nothing out there to carry one. On a deck with
     something listening on it that is not a detail. It is the route. */
  'ṽ': {key:'ṽ', id:'vacuum', name:'Vacuum', walk:true, silent:true, airless:true, alert:true,
        fill:'rgba(6,10,22,.86)', line:'rgba(150,205,255,.28)', glyph:'·',
        enter:'ATMOSPHERE READS NIL. The chassis is rated for it — and out here it makes no sound at all.'},
  /* The glass that holds the last of it in. Rated for the pressure it stands
     against and as big as the author paints it: one body, solid, and the only
     thing on the ship worth looking through. */
  'ï': {key:'ï', id:'astrowindow', name:'Astro-Grade Window', walk:false, clear:true,
        merge:true, sized:true,
        fill:'rgba(150,205,255,.09)', line:'rgba(190,228,255,.55)', glyph:'◧',
        bump:'Astro-grade glazing, laminated and rated for the pressure it is holding back. It reads clear and it holds.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},
  /* ---------- the comms array ----------
     The far end of the command deck, and the thing the whole of it was built
     to keep pointed. Six blocks, and between them they are a deck out on the
     hull: a mast too big to read from one square, the plate it is bolted to,
     the rock that came through the roof of it, the current laid across the
     way, the platform that runs whether anything called it or not, and the
     ports that fire into the deck because the ship is still trying to hold an
     attitude nobody has asked it for in a very long time. */
  /* Twelve tiles by twelve of dish, gearing and counterweight. It is an
     antenna and it is the same antenna \u2014 it transmits through structure
     the way a beacon does, and goes quiet once the unit has walked up on it.
     What twelve by twelve buys is that an operator crosses the deck to read
     it: a mast that fits inside the optics is scenery, and one that does not
     is somewhere to be going. */
  'ā': {key:'ā', id:'commsarray', name:'Comms Array', walk:false,
        foot:{len:12, wide:12},
        parts:faceParts(12, 12, '\u25ce', '\u00b7', 3),
        fill:CMD_DEEP.fill, line:CMD_BLUE.line,
        ping:true, powered:true,
        bump:'Array housing. Twelve tiles by twelve of dish and gearing, the drive still holding it on its bearing, and a carrier under it that reads from anywhere on this deck.',
        spent:{fill:'rgba(18,48,116,.08)', line:'rgba(74,132,214,.28)',
               bump:'Array housing. Twelve tiles of it, cold end to end. The bearing is where it stopped, and nothing is going out.'},
        props:{dir:{type:'dir', label:'Runs', def:'right'},
               range:{type:'int', label:'Goes quiet within', def:4, min:0, max:20},
               armed:{type:'bool', label:'Starts transmitting', def:true},
               objective:{type:'text', label:'Objective while lit', def:''},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* Structural plate, laid straight onto the frame rather than over a void.
     It is the ground an author puts down where there is nothing under the
     deck but the outside, and it is honest about the trade: it holds, and it
     rings. A step on it carries half again as far as a step on plating, so
     the safe footing across the hull line is also the loud way across it. */
  'ħ': {key:'ħ', id:'hullsteel', name:'Hull Steel Flooring', walk:true,
        fill:'rgba(122,152,190,.13)', line:'rgba(164,198,240,.42)', glyph:'\u2550',
        noisy:6,
        enter:'Hull steel. Structural plate bolted straight onto the frame, with nothing under it but the outside \u2014 and every step the chassis takes on it goes the length of the deck.'},
  /* What came through the deckhead and stopped. It is as big as it is
     painted, one body, and it is not going anywhere: the ship was built round
     it after the fact. Solid, and sight stops in it. */
  'ǒ': {key:'ǒ', id:'asteroid', name:'Stuck Asteroid', walk:false,
        merge:true, sized:true,
        fill:'rgba(118,108,102,.32)', line:'rgba(178,168,158,.6)', glyph:'\u25cf',
        bump:'Rock. It came through the deckhead at speed, buried itself in the plating and stopped there. Whatever was holding the hull shut is holding it in place now.',
        props:{label:{type:'text', label:'Stencilled', def:''}}},
  /* A bus line laid across the way, and the one block on a deck whose circuit
     decides whether it is ground or wall. Dead, the unit steps over the run
     of it; live, nothing crosses it at all. Which makes a fusebox somewhere
     else on the deck into a door \u2014 and makes seating a fuse something an
     operator does knowing where the unit is standing, because a line that
     wakes under a chassis is a line that kills it. */
  'ẋ': {key:'ẋ', id:'powerline', name:'Power Line', walk:false,
        clear:true, merge:true, powered:true, alert:true,
        charged:'CURRENT ACROSS THE PLATING. THE LINE WOKE UNDER THE CHASSIS.',
        fill:'rgba(255,180,74,.22)', line:'rgba(255,214,120,.85)', glyph:'\u2261',
        bump:'Bus line, live. There is current down the whole run of it, and the chassis will not put a foot on any of it.',
        spent:{fill:'rgba(255,180,74,.05)', line:'rgba(255,214,120,.24)', glyph:'\u2500',
               enter:'Bus line, cold. The run is dead and the way across it is open \u2014 for as long as it stays dead.'},
        props:{label:{type:'text', label:'Stencilled', def:''}}},
  /* A platform that was never waiting to be called. It runs its rail end to
     end on its own time, stands at each end for as long as its author gave
     it, and sets off again \u2014 so it is a piece of the deck's timing
     rather than a control the operator works. A button still reaches one, and
     all that does is turn it round early. */
  'ť': {key:'ť', id:'autotram', name:'Automatic Tram', walk:true,
        fill:'rgba(191,247,220,.16)', line:'rgba(191,247,220,.62)', glyph:'\u25a4',
        enter:'Platform plating. This one is not waiting to be called \u2014 it is on its way from one end of its rail to the other, and the unit is on it.',
        signal:'move', auto:true, powered:true,
        away:'Bare rail. The platform is somewhere along it, and it is coming back on its own.',
        props:{dir:{type:'dir',  label:'Travels',           def:'right'},
               dist:{type:'int', label:'Distance',          def:6, min:1, max:60},
               dwell:{type:'int',label:'Waits at each end', def:3, min:0, max:60}}},
  /* An attitude port firing into the deck. The ship is still trying to hold a
     bearing, the array is still being pointed, and the ports that do the
     pointing open into a walkway nobody was ever meant to be standing in.

     It runs a cycle, and nothing about the cycle waits on the unit: cold,
     then building \u2014 which is the whole of the warning \u2014 then
     burning, which is open flame and ends whatever is standing on it. An
     author staggers a row of them with `phase`, and what that builds is not a
     hazard but a rhythm to be crossed on. */
  'ṁ': {key:'ṁ', id:'thruster', name:'Micro Thruster', walk:true,
        powered:true, thruster:true, alert:true,
        fill:'rgba(96,170,255,.12)', line:'rgba(150,205,255,.45)', glyph:'\u2299',
        enter:'Attitude port. Cold at the moment, and the scoring round the rim of it says that is not what it usually is.',
        run:{fill:'rgba(255,120,80,.34)', line:'rgba(255,180,74,.95)', glyph:'\u25b2',
             bump:'PORT FIRING. There is open flame coming out of the deck.'},
        props:{every:{type:'int', label:'Fires every (s)',      def:7, min:2, max:90},
               warn:{type:'int',  label:'Seconds of build',     def:2, min:1, max:15},
               burn:{type:'int',  label:'Seconds it burns',     def:2, min:1, max:15},
               phase:{type:'int', label:'Seconds before the first firing', def:0, min:0, max:90},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* A track something comes through. What is painted is the ground, and the
     ground is ordinary: the rock is not on the deck at all until it arrives,
     and it is gone again a second later. It runs the block's heading from the
     square it was painted on, as far as the ground stays open \u2014 a
     bulkhead, a stuck asteroid, anything solid stops it, so cover is cover
     and an author builds shelter by putting something in the way.

     It needs no circuit. Nothing aboard is driving it. */
  'ǎ': {key:'ǎ', id:'sweep', name:'Asteroid Sweep', walk:true, alert:true,
        sweep:true,
        fill:'rgba(118,108,102,.12)', line:'rgba(178,168,158,.48)', glyph:'\u21e2',
        enter:'Track. The plating along this line is scoured back to bare metal in one direction, and nothing has worn it but whatever keeps coming through.',
        props:{dir:{type:'dir',  label:'Runs',                 def:'right'},
               dist:{type:'int', label:'Squares it crosses',   def:14, min:1, max:80},
               every:{type:'int',label:'Comes round every (s)',def:11, min:3, max:180},
               warn:{type:'int', label:'Seconds of warning',   def:2, min:1, max:15},
               phase:{type:'int',label:'Seconds before the first pass', def:0, min:0, max:180},
               label:{type:'text', label:'Stencilled', def:''}}},
  /* The mark a spectre starts on. It takes a `wake` and a `range` like
     anything else that walks; everything that makes it a spectre rather than
     a stalker is in FOES. */
  'ż': {key:'ż', id:'spectre', name:'Spectre', walk:true, foe:'spectre',
        fill:'rgba(168,130,255,.09)', line:'rgba(200,172,255,.42)', glyph:'\u03a6',
        enter:'Scuffing on the plating in one tight arc, and clean deck either side of it. Whatever stands here does not stand anywhere long.',
        props:{wake:{type:'int',  label:'Notices within', def:17, min:0, max:60},
               range:{type:'int', label:'Wanders within (0: the deck)', def:0, min:0, max:60},
               label:{type:'text',label:'Stencilled', def:''}}},
};

/* ---------- palette categories ----------
   Only the editor's palette reads these: they are how a list of thirty blocks
   stays legible, not a second vocabulary. A tile named in none of them still
   shows up, under "Other", so adding a tile can never lose it. */
const CATS = [
  {id:'ground',    name:'Ground',      keys:' .,=+~!v/:`ħ'},
  {id:'land',      name:'Open land',   keys:'dgpr_P'},
  {id:'structure', name:'Structure',   keys:'#%oxWG]ïǒẋ'},
  {id:'building',  name:'Buildings',   keys:'HhiQK>'},
  {id:'controls',  name:'Controls',    keys:'bcun?üĝ'},
  {id:'transit',   name:'Transit',     keys:'Tť^sVO'},
  {id:'fixtures',  name:'Fixtures',    keys:'LBACFDR){}ƀ'},
  {id:'home',      name:'Furnishings', keys:'ZaUtm56789'},
  {id:'farm',      name:'Farm',        keys:'|w&yj@'},
  {id:'remains',   name:'Remains',     keys:';SXYśÿ'},
  {id:'wreck',     name:'Wreckage',    keys:'ð\'ďłŵ'},
  {id:'kit',       name:'Unit & kit',  keys:'M*fkƒø'},
  {id:'command',   name:'Command deck', keys:'J-(qlāNI[ĉřķ'},
  {id:'hazard',    name:'Hazards',     keys:'$123şṽṁǎ'},
  {id:'contacts',  name:'Contacts',    keys:'Ee<z04ż'},
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
    carriage: !!opts.carriage,
    dark: !!opts.dark,
    under: opts.under || null,
    rows: opts.rows || Array.from({length:h}, ()=>fill.repeat(w)),
    props: opts.props || {},
    os: opts.os || null,
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
  /* a deck that is a carriage in its own right — the inside of a car, rather
     than a deck with one parked on it. It needs no car drawn on it, because
     the unit riding in is already aboard the moment the deck loads */
  map.carriage = !!map.carriage;
  /* a deck with nothing lighting it. The optics are the same optics; there is
     simply nothing out there for them to read, so sight closes to the couple
     of squares the chassis lights for itself and the rest of the deck is
     walked into rather than looked at. A floodlamp opens it back up. */
  map.dark = !!map.dark;
  /* a deck that is the seam between two chapters: the intermission the unit
     crosses to get from one into the next, and the only place a run is
     written down. `n` is the order the chapters run in and `name` is what
     the one this seam opens is called. A deck that names no chapter is
     ordinary ground, and crossing it keeps nothing. */
  const c = map.chapter;
  map.chapter = (c && String(c.name||'').trim())
              ? {n:Math.max(0, c.n|0), name:String(c.name).trim()} : null;
  /* the deck this one is stacked on: an id and where its origin sits in this
     deck's own squares, so two decks of different sizes still line up */
  const u = map.under;
  map.under = (u && u.deck) ? {deck:String(u.deck), dx:u.dx|0, dy:u.dy|0} : null;
  normalizeProps(map);
  normalizeOS(map);
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

/* ---------- a console's filing ----------
   What a desktop holds, tidied: a row with no name on it is not a file, and
   the folder a file names is trimmed so that "LOGS" and "LOGS " are the one
   folder rather than two. `folders` is what a desktop shows at its top level
   — every folder something is in, in the order the author wrote them — and
   `inFolder` is what is inside one, the root being the empty name. */
function cleanFiles(rows){
  return (rows||[]).filter(r=>String(r.name||'').trim())
                   .map(r=>({kind:FILE_KINDS[r.kind] ? r.kind : 'doc',
                             name:String(r.name).trim(),
                             folder:String(r.folder||'').trim(),
                             pass:String(r.pass||''),
                             /* only a control drives anything, but the list is
                                tidied the same way wherever it was written */
                             targets:coerce(FILE_SLOTS.fields.targets, r.targets),
                             text:String(r.text||'')}));
}
const filesOf = (map,x,y) => cleanFiles((propsAt(map,x,y)||{}).files);
/* What a core will answer to, tidied the way filing is: a row with nothing
   asked on it is not a question, and the blocks a question drives are the
   same list of squares a control on a desktop carries. A row also says which
   question opens it, and one question is the same question as another when
   the words match — a thread is named by what is asked, the way a circuit is
   named by what is stencilled on it, so both ends are compared alike. */
const talkKey = ask => String(ask||'').trim().toLowerCase();
const talkOf = (map,x,y) => (((propsAt(map,x,y)||{}).talk) || [])
  .filter(r=>String(r.ask||'').trim())
  .map(r=>({ask:String(r.ask).trim(), reply:String(r.reply||''),
            after:String(r.after||'').trim(),
            targets:coerce(FILE_SLOTS.fields.targets, r.targets)}));
/* The questions a core will take at a given moment: one that opens after
   nothing is there from the start, and one that opens after another is there
   only once that other has been put to it. `asked` says what has been. */
const talkOpen = (map,x,y,asked) => talkOf(map,x,y)
  .filter(w=>!w.after || (asked && asked(talkKey(w.after))));
/* Which of a core's rows can ever be reached, worked the way the channel
   works them: start with the rows nothing gates, and open what those open,
   until nothing more opens. Whatever is left over is a thread with no way
   in — a question that names one the core will not answer, or a pair that
   wait on each other for ever. */
function talkReach(talk){
  const have = new Set(), open = new Set();
  for(const w of talk) have.add(talkKey(w.ask));
  for(let more=true; more;){
    more = false;
    for(const w of talk){
      if(open.has(talkKey(w.ask))) continue;
      if(w.after && !open.has(talkKey(w.after))) continue;
      open.add(talkKey(w.ask)); more = true;
    }
  }
  return {have, open};
}
const foldersOf = files => {
  const out = [];
  for(const f of files) if(f.folder && !out.includes(f.folder)) out.push(f.folder);
  return out;
};
const inFolder = (files,folder) => files.filter(f=>f.folder === folder);

/* ---------- what can press ----------
   Every control on this deck that runs to a block. A button on a wall is one.
   So is a control filed on a console's desktop, and so is one carried in the
   unit's own store — the glass is the wall in those two, and the survey has to
   count all three or a bulkhead driven off a desktop reads as a bulkhead
   nothing drives. A store control has no square of its own: it is pressed
   wherever the unit is standing. */
function signalSources(map){
  const out = [];
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++){
    const t = def(tileAt(map,x,y));
    if(t.press === 'button')
      out.push({x, y, what:'Button', targets:signalTargets(map,x,y)});
    if(t.press === 'terminal')
      for(const f of filesOf(map,x,y))
        if(f.kind === 'app') out.push({x, y, what:'Control "'+f.name+'"', targets:f.targets});
    /* a keypad is a button with conditions on it, and a core answers a
       question by driving whatever the question was wired to: both of them
       press, so both of them are counted, or a bulkhead opened by one reads
       as a bulkhead nothing opens */
    if(t.press === 'keypad')
      out.push({x, y, what:'Keypad', targets:signalTargets(map,x,y)});
    if(t.press === 'aicore')
      for(const w of talkOf(map,x,y))
        if((w.targets||[]).length) out.push({x, y, what:'Core, asked "'+w.ask+'"', targets:w.targets});
  }
  for(const f of osOf(map))
    if(f.kind === 'app')
      out.push({x:null, y:null, what:'Control "'+f.name+'" in the local store', targets:f.targets});
  return out;
}

/* Every block a control points at, as "x,y" -> [{x,y} of each control]. */
function signalIndex(map){
  const out = {};
  for(const s of signalSources(map))
    for(const t of s.targets || [])
      (out[pk(t.x,t.y)] || (out[pk(t.x,t.y)] = [])).push({x:s.x, y:s.y});
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
/* …and which boxes those are, because a circuit made up with the right fuse
   can still read dead: the box holding it may be waiting on a supply. */
const boxesFor = (map,name) => boxes(map).filter(b=>b.ways.some(w=>w.circuit === name));
/* The supply a block declares — a box waiting on one, a generator feeding
   one. Blank on a box is the ship's own supply, which has never been off. */
const supplyOf = (map,x,y) => String((propsAt(map,x,y)||{}).supply || '').trim();
/* Every generator on this deck, the way boxes() is every box. */
function gens(map){
  const out = [];
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++)
    if(def(tileAt(map,x,y)).press === 'generator') out.push({x, y, supply:supplyOf(map,x,y)});
  return out;
}
/* Is there so much as a set on this deck stencilled for this supply? A box on
   a supply nothing feeds is a box that will never carry, however it is made up. */
const supplyFed = (map,name) => gens(map).some(g=>g.supply === name);

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

/* The squares a rock crosses, the square it comes in over first. The track
   is as long as its author gave it, and no longer than the ground stays open:
   `clear` is asked of every square in turn and the path stops at the first
   one that says no, so anything solid on the line is shelter behind it. The
   game hands in its own notion of clear, because what is solid on a deck
   changes while the unit is standing on it. */
function sweepPath(map,x,y,clear){
  const p = propsAt(map,x,y) || {};
  const [dx,dy] = DIRS[p.dir] || DIRS.right;
  const out = [];
  for(let i=0;i<=(p.dist|0);i++){
    const cx = x+dx*i, cy = y+dy*i;
    if(!inside(map,cx,cy)) break;
    if(i && clear && !clear(cx,cy)) break;
    out.push({x:cx, y:cy});
  }
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
  if(end) return {x:end.x, y:end.y, car:true};
  /* a deck that is the carriage has none drawn on it to step into: the unit
     rides in already aboard, so its landing record is the car */
  if(kind === 'lift' && map.carriage) return {x:map.spawn.x, y:map.spawn.y, car:true};
  return {x:map.spawn.x, y:map.spawn.y, car:false};
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
  /* a bus line is passable in exactly the sense a sealed bulkhead is: it is
     not ground now, and there is a way of making it ground. "Can the unit get
     there at all" counts both */
  const pass  = (x,y) => walkable(map,x,y) ||
                         (powered && !!at(map,x,y).charged) ||
                         (powered && !!at(map,x,y).signal && !lockedShut(map,x,y));
  /* a jump comes down on ground, never on a pit or a breach: it sails over one */
  const land  = (x,y) => pass(x,y) && !bodyAt(map,x,y).deadly;
  const over  = (x,y) => vaultable(map,x,y) ||
                         (powered && !!at(map,x,y).charged) ||
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
  /* whatever filing this is, it wants the same things of it */
  checkFiles(out, 'The deck store', osOf(map), map.os && map.os.card, 'the store', map);
  /* two seams claiming one chapter is not an error the game can trip over —
     each keeps its own record, under its own deck — but a chapter select
     would list them both under the same number, and the author meant one */
  if(map.chapter){
    const clash = Object.keys(MAPS).filter(id => id !== map.id &&
                    MAPS[id].chapter && MAPS[id].chapter.n === map.chapter.n);
    if(clash.length)
      out.issues.push('This deck opens chapter '+map.chapter.n+', and so does '+
                      clash.join(', ')+'. A chapter select would list them under one number.');
    /* the record is written by crossing into the seam, so a seam nothing
       crosses into is a chapter no run ever reaches */
    const into = Object.keys(MAPS).filter(id => id !== map.id &&
      Object.keys(MAPS[id].props || {}).some(k => MAPS[id].props[k].dest === map.id));
    if(!into.length)
      out.issues.push('This deck opens chapter '+map.chapter.n+
                      ', but no other deck crosses into it, so the run is never written down here. '+
                      'Point a car, a flight of steps or a breach at it.');
  }
  /* a dark deck asks for a lamp the way a locked door asks for a key: the
     unit can cross it without one, two squares at a time, but an author who
     meant it to be crossed with one wants to know the record holds none */
  if(map.dark){
    const lamped = m => { for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){
      const p = propsAt(m,x,y) || {};
      if(at(m,x,y).press === 'station' && p.ability === 'flashlight') return true;
    } return false };
    if(!lamped(map) && !Object.keys(MAPS).some(id => id !== map.id && lamped(MAPS[id])))
      out.issues.push('This deck is dark, and no modification station anywhere in the record '+
                      'stocks a floodlamp. The unit crosses it two squares at a time.');
  }
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
  /* every small object placed anywhere in the record, by kind and variant:
     a way with no fuse cut for it and a lock with no key cut for it are the
     same mistake, and this is what both are checked against */
  const tally = m => { for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){
    const it = itemAt(m,x,y);
    /* keyed by kind and variant both, and an object that comes in no variants
       — a canister is a canister — is tallied under its kind alone */
    if(it){ const k = it.kind+':'+(it.variant||''); stock[k] = (stock[k]|0) + 1 }
    /* a corpse is somewhere a sample comes from, so it counts as one placed:
       a scanner wanting an eye is answered by a body with an eye in it as
       readily as by an eye lying on the deck */
    if(def(tileAt(m,x,y)).press === 'scavenge'){
      const q = propsAt(m,x,y) || {};
      for(const part in PARTS)
        if(q[part]) stock['organ:'+part] = (stock['organ:'+part]|0) + 1;
    }
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
    if(t.press === 'terminal'){
      const files = filesOf(map,x,y);
      if(!files.length && !String(p.text||'').trim())
        out.issues.push(t.name+where+' has no text to display.');
      if(files.length && !p.desktop)
        out.issues.push(t.name+where+' has '+files.length+' file(s) filed on it but no desktop, '+
                        'so nothing on it can be opened or pressed. Turn its desktop on.');
      if(p.desktop && !files.length)
        out.issues.push(t.name+where+' is marked as having a desktop and nothing is filed on it. '+
                        'It reads as a plain record.');
      checkFiles(out, t.name+where, files, p.card, 'the desktop', map);
    }
    /* a card is words written on the black a crossing makes. Without a fade
       there is no black to write them on */
    if(t.link || t.fall){
      if(String(p.card||'').trim() && !p.fade)
        out.issues.push(t.name+where+' carries a card, but the screen does not go black across it. '+
                        'Turn its fade on, or the words have nothing to sit on.');
      if(!String(p.card||'').trim() && String(p.cardsub||'').trim())
        out.issues.push(t.name+where+' has a line for under its card and no card to put it under.');
    }
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
         only runs one way, which is almost never what an author drew — unless
         the far deck is the carriage, which has no carriage inside it */
      else if(known && MAPS[p.dest] && !links(MAPS[p.dest], t.link.kind).length &&
              !(t.link.kind === 'lift' && MAPS[p.dest].carriage))
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
      out.issues.push(t.name+where+' has nothing written on it.');
    /* a lock is only as good as the key cut for it: a door whose key is on no
       deck in the record is a door that never opens, and reads from the
       canvas exactly like one that does */
    if(t.keyed){
      const want = KEYS[p.opens];
      if(!want)
        out.issues.push(t.name+where+' takes no key the record knows of.');
      else if(!stock['key:'+p.opens])
        out.issues.push(t.name+where+' takes the '+want.name.toLowerCase()+
                        ', and no key of that cut is placed on any deck.');
    }
    /* ---------- the plant ----------
       A core with nothing to answer is a channel that opens on an empty
       list, and a question wired to a square that answers nothing is the
       same mistake a button's line is. */
    if(t.press === 'aicore'){
      const talk = talkOf(map,x,y);
      if(!talk.length)
        out.issues.push(t.name+where+' will answer nothing. Give it something to be asked.');
      if(!String(p.greet||'').trim())
        out.issues.push(t.name+where+' opens on nothing. Give it a line to open with.');
      /* a thread opens after another, and a thread that opens after one the
         core does not answer — or after one that never opens itself, which is
         what two rows waiting on each other come to — is a question nothing
         on the deck can ever put to it */
      const reach = talkReach(talk);
      for(const w of talk){
        if(!w.after) continue;
        if(!reach.have.has(talkKey(w.after)))
          out.issues.push(t.name+where+', asked "'+w.ask+'", opens after "'+w.after+
                          '", which it will not answer.');
        else if(!reach.open.has(talkKey(w.ask)))
          out.issues.push(t.name+where+', asked "'+w.ask+
                          '", opens after a question that never opens itself.');
      }
      if(talk.length && !talk.some(w=>!w.after))
        out.issues.push(t.name+where+' opens on an empty list: every question on it '+
                        'waits on another. Leave one of them opening after nothing.');
      for(const w of talk) for(const c of w.targets){
        if(!inside(map,c.x,c.y))
          out.issues.push(t.name+where+', asked "'+w.ask+'", presses a square outside the record.');
        else if(!at(map,c.x,c.y).signal)
          out.issues.push(t.name+where+', asked "'+w.ask+'", presses '+at(map,c.x,c.y).name+
                          ' at '+c.x+','+c.y+', which does not answer signals.');
      }
    }
    /* A reactor asks for three keys and gets nowhere without all three: one
       to open the face, and two of the cut its sockets take. Two is not a
       setting — it is what the sockets are — so the record has to hold two. */
    if(t.press === 'reactor'){
      const face = KEYS[p.opens], arm = KEYS[p.arms];
      if(!face) out.issues.push(t.name+where+' opens to no key the record knows of.');
      else if(!stock['key:'+p.opens])
        out.issues.push(t.name+where+' opens to the '+face.name.toLowerCase()+
                        ', and no key of that cut is placed on any deck. The face never opens.');
      if(!arm) out.issues.push(t.name+where+' takes no key the record knows of in its sockets.');
      else if((stock['key:'+p.arms]|0) < 2)
        out.issues.push(t.name+where+' takes two '+arm.name.toLowerCase()+'s, and '+
                        (stock['key:'+p.arms]|0)+' of that cut is placed across the record. '+
                        'The sequence can never be begun.');
      if(p.arms && p.arms === p.opens)
        out.issues.push(t.name+where+' opens to the same cut its sockets take, so the key that '+
                        'opened the face is one of the two that go into it.');
      if(String(p.cardsub||'').trim() && !String(p.card||'').trim())
        out.issues.push(t.name+where+' has a line for under its card and no card to put it under.');
    }
    /* A keypad with nothing wired to it is a door furniture that opens
       nothing, and a scanner with nothing on any deck to read is a measure
       nothing clears — the same mistake as a lock with no key cut for it. */
    if(t.press === 'keypad'){
      const targets = signalTargets(map,x,y);
      if(!targets.length) out.issues.push(t.name+where+' signals nothing.');
      for(const c of targets){
        if(!inside(map,c.x,c.y))
          out.issues.push(t.name+where+' signals a square outside the record.');
        else if(!at(map,c.x,c.y).signal)
          out.issues.push(t.name+where+' signals '+at(map,c.x,c.y).name+
                          ' at '+c.x+','+c.y+', which does not answer signals.');
      }
      if(p.pass && !String(p.code||'').trim())
        out.issues.push(t.name+where+' asks for a code and has none set, so anything typed opens it.');
      if(p.finger && !stock['organ:hand'])
        out.issues.push(t.name+where+' reads a fingerprint, and there is no hand placed on any deck '+
                        'and no corpse with one still on it.');
      if(p.retina && !stock['organ:eye'])
        out.issues.push(t.name+where+' reads a retina, and there is no eye placed on any deck '+
                        'and no corpse with one still in it.');
      if(!p.pass && !p.finger && !p.retina)
        out.issues.push(t.name+where+' has every measure turned off. It is a button with a screen on it.');
    }
    /* A body nothing is left on is a body the unit walks to for nothing. */
    if(t.press === 'scavenge' && !p.hand && !p.eye)
      out.issues.push(t.name+where+' has nothing left on it to take.');
    if(t.press === 'generator'){
      const s = supplyOf(map,x,y);
      if(!s)
        out.issues.push(t.name+where+' feeds no supply. Stencil it, and stencil the boxes '+
                        'that wait on it to match, or nothing on this deck reads it.');
      else if(!boxes(map).some(b=>supplyOf(map,b.x,b.y) === s))
        out.issues.push(t.name+where+' feeds supply "'+s+'", which no fusebox on this deck waits on. '+
                        'Starting it changes nothing.');
      if(!p.run && !stock['fuel:'])
        out.issues.push(t.name+where+' starts cold, and there is no fuel placed on any deck '+
                        'to start it with.');
    }
    if(t.press === 'fusebox'){
      const ways = waysOf(map,x,y);
      if(!ways.length) out.issues.push(t.name+where+' feeds nothing. Give it a way.');
      /* a box on a supply no set feeds carries nothing, whatever is seated in
         it — and from the canvas it reads exactly like a box that works */
      const sup = supplyOf(map,x,y);
      if(sup && !supplyFed(map,sup))
        out.issues.push(t.name+where+' waits on supply "'+sup+'", which no generator on this deck feeds. '+
                        'Nothing seated in it will ever read live.');
      ways.forEach((w,i)=>{
        const way = ' way '+(i+1);
        if(!w.circuit)
          out.issues.push(t.name+where+way+' is stencilled with no circuit, so nothing reads from it.');
        else if(!onCircuit[w.circuit])
          out.issues.push(t.name+where+' feeds circuit "'+w.circuit+'", which nothing on this deck is on.');
        if(!stock['fuse:'+w.rating])
          out.issues.push(t.name+where+way+' takes a '+((FUSES[w.rating]||{}).name || w.rating)+
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
    /* a burst line with no reach is a fixture rather than a flood: it is
       drawn dripping and the deck never gets wet */
    if(t.pipe && !(p.reach|0))
      out.issues.push(t.name+where+' floods within 0 squares, so it puts no water on the deck at all.');
    /* a hiding place with nothing beside it is a hiding place the unit can
       never press: [E] is worked from an adjacent square */
    if(t.hide){
      const cells = footprint(map,x,y), beside = new Set();
      for(const c of cells) for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])
        if(walkable(map, c.x+dx, c.y+dy)) beside.add(pk(c.x+dx, c.y+dy));
      if(!beside.size)
        out.issues.push(t.name+where+' has no ground beside it to work [E] from, so nothing ever gets into it.');
    }
    /* a gate the unit can drive itself does not need a control. One that is
       painted from several tiles is one body and one control: a line run to
       any tile of it drives the whole, so the body is asked once, from the
       tile it starts at, rather than tile by tile */
    if((t.signal === 'toggle' || t.signal === 'arm') && !t.press && !p.locked){
      const body = t.merge ? cluster(map,x,y).cells : [{x, y}];
      const head = body.reduce((a,b)=>(b.y<a.y || (b.y===a.y && b.x<a.x)) ? b : a);
      if(head.x === x && head.y === y && !body.some(c=>wired[pk(c.x,c.y)]))
        out.issues.push(t.name+where+(t.alarm
          ? ' has no control wired to it, so there is no disarming it. Every route through it sounds the deck.'
          : ' has no button wired to it.'));
    }
    if(t.signal && lockedShut(map,x,y) && wired[pk(x,y)])
      out.issues.push(t.name+where+' is locked, so the control wired to it cannot open it.');
    if(t.signal && t.merge){
      /* one body, one answer: report from the tile the body starts at */
      const body = cluster(map,x,y);
      const head = body.cells.reduce((a,b)=>(b.y<a.y || (b.y===a.y && b.x<a.x)) ? b : a);
      const setting = c => { const q = propsAt(map,c.x,c.y) || {};
                             /* a gate that runs answers with one direction as
                                well as with one state */
                             return (q.locked?'L':'-')+(q.open?'O':'-')+
                                    (t.slide ? '/'+(q.dir||'') : '') };
      if(head.x===x && head.y===y && new Set(body.cells.map(setting)).size > 1)
        out.issues.push(t.name+where+' is one body, but its tiles are set differently. '+
                        'It answers as a whole: locked anywhere means locked.');
    }
    /* one body, one name: a tank is painted from forty tiles and stencilled on
       whichever of them the author clicked, so two names on one body is an
       author expecting two tanks and having drawn one */
    if(t.merge && t.props && t.props.label){
      const body = cluster(map,x,y);
      const head = body.cells.reduce((a,b)=>(b.y<a.y || (b.y===a.y && b.x<a.x)) ? b : a);
      const names = new Set(body.cells.map(c=>String((propsAt(map,c.x,c.y)||{}).label || ''))
                                      .filter(n=>n));
      if(head.x===x && head.y===y && names.size > 1)
        out.issues.push(t.name+where+' is one body stencilled '+names.size+' different ways ('+
                        [...names].join(', ')+'). It reads as one, and answers to the first name on it.');
    }
    /* a contact the size of a room needs the room: the mark is the middle of
       it, and every square of the body has to be ground it could stand on or
       it can never take a single heading */
    if(t.foe && FOES[t.foe] && FOES[t.foe].bulk){
      const b = FOES[t.foe].bulk|0;
      let blocked = 0;
      for(let j=-b;j<=b;j++)for(let i=-b;i<=b;i++){
        if(!i && !j) continue;
        if(!inside(map,x+i,y+j) || !walkable(map,x+i,y+j) ||
           bodyAt(map,x+i,y+j).deadly || bodyAt(map,x+i,y+j).fall) blocked++;
      }
      if(blocked)
        out.issues.push(t.name+where+' is '+(b*2+1)+' tiles by '+(b*2+1)+
                        ', and '+blocked+' square(s) of where it stands are not ground it can hold. '+
                        'It starts wedged and never moves.');
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
      /* one that runs its rail on its own time is not waiting on anything: a
         button turns it round early and that is all one is ever for */
      if(!t.auto && !wired[pk(x,y)]) out.issues.push(t.name+where+' has no button wired to it.');
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
/* What any filing has to be true of, wherever it is kept: a name is how a
   file is opened, so two of them in one folder is one file the operator can
   never get at, and a card wants something sealed to bring it up. */
function checkFiles(out, who, files, card, place, map){
  const seen = new Set();
  for(const f of files){
    const k = f.folder+'/'+f.name.toUpperCase();
    if(seen.has(k))
      out.issues.push(who+' files two things called "'+f.name+'"'+
                      (f.folder ? ' in folder "'+f.folder+'"' : ' on '+place)+'.');
    seen.add(k);
    /* a control is not read, so it is allowed to say nothing. Everything
       else on a desktop is there to be read and an empty one is a mistake */
    if(!String(f.text||'').trim() && f.kind !== 'app')
      out.issues.push(who+' files "'+f.name+'", which has nothing in it.');
    if(f.kind === 'locked' && !String(f.pass||'').trim())
      out.issues.push(who+' files "'+f.name+'" as sealed with no word set, '+
                      'so anything at all opens it.');
    /* a control filed on a desktop is wired the way a button on a wall is,
       and goes wrong in the same three ways */
    if(f.kind === 'app' && map){
      const to = f.targets || [];
      if(!to.length)
        out.issues.push(who+' files "'+f.name+'" as a control that signals nothing.');
      for(const c of to){
        if(!inside(map, c.x, c.y))
          out.issues.push(who+' files "'+f.name+'", which signals a square outside the record.');
        else if(!at(map, c.x, c.y).signal)
          out.issues.push(who+' files "'+f.name+'", which signals '+at(map,c.x,c.y).name+
                          ' at '+c.x+','+c.y+', which does not answer signals.');
      }
    }
  }
  const sealed = files.filter(f=>f.kind === 'locked');
  if(String(card||'').trim() && !sealed.length)
    out.issues.push(who+' ends the segment on a card, but nothing filed on it is sealed, '+
                    'so the card never comes up.');
  if(sealed.length > 1 && String(card||'').trim())
    out.issues.push(who+' files '+sealed.length+' sealed things and ends the segment on a card. '+
                    'Whichever gives way first ends it.');
}

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
    (map.carriage ? '  "carriage": true,\n' : '')+
    (map.dark ? '  "dark": true,\n' : '')+
    (map.chapter ? '  "chapter": {"n": '+map.chapter.n+
                   ', "name": '+JSON.stringify(map.chapter.name)+'},\n' : '')+
    (map.under ? '  "under": {"deck": '+JSON.stringify(map.under.deck)+
                 ', "dx": '+map.under.dx+', "dy": '+map.under.dy+'},\n' : '')+
    (map.os ? '  "os": {\n'+
              '    "card": '+JSON.stringify(map.os.card)+',\n'+
              '    "cardsub": '+JSON.stringify(map.os.cardsub)+',\n'+
              '    "files": [\n'+
              map.os.files.map(f=>'      '+JSON.stringify(f)).join(',\n')+
              '\n    ]\n  },\n' : '')+
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
/* One cell's mark out of a block's `parts`: a flat list is read along the
   block's facing, and a list of lists is read across it as well, so a car is
   drawn cell by cell and a forklift still reads the way it always did. */
function partGlyph(parts, i, j){
  const row = parts[j];
  return (Array.isArray(row) ? row[i] : parts[i]) || null;
}
/* An open block shows its open look; a block locked shut shows its locked one,
   which is how a gate nothing will ever move reads differently from one that
   is merely sealed. Open wins: a gate locked open is an opening. */
function lookOf(t, state){
  if(state && state.open   && t.open)  return Object.assign({}, t, t.open);
  if(state && state.locked && t.lock)  return Object.assign({}, t, t.lock);
  if(state && state.inside && t.inside)return Object.assign({}, t, t.inside);
  /* a set that is turning reads as one, which is the whole of how an operator
     tells a generator it has started from one it has walked past twice */
  if(state && state.run    && t.run)   return Object.assign({}, t, t.run);
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
    const glyph = t.parts ? partGlyph(t.parts, f.i, f.j)
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

global.ISO = {TILES, ORDER, VOID, DIRS, CATS, ABILITIES, JUMP, FOES, FUSES, KEYS, ITEMS, CARRY, NOISE,
               circuitOf, waysOf, boxes, circuitFed, boxesFor, supplyOf, gens, supplyFed, itemAt,
               FILE_KINDS, OS_SCHEMA, filesOf, talkOf, talkOpen, talkKey, osOf, osCard,
               foldersOf, inFolder,
               PARTS,
               chapterOf, chapters,
               def, MAPS, register, makeMap, normalize, resize, trim,
               inside, tileAt, at, bodyAt, walkable, vaultable, setTile, reachable, audit,
               schemaOf, defaults, propsAt, setProp, signalIndex, signalSources, signalTargets,
               tramPath, sweepPath, key:pk,
               links, linkLanding, linkNoun, lifts, liftLanding, stencilled, dropLanding,
               underOf, underAt, seeThrough, dropAt,
               footprint, partAt, coveredBy, cluster, lockedShut,
               toJSON, toModule, parse, drawTile, drawCell};
})(typeof globalThis!=='undefined'?globalThis:this);
