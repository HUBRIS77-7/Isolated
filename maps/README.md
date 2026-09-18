# Maps

Everything the unit can walk on lives here. A map is plain text — one character
per tile — so it reads fine in a diff and can be edited by hand or with the
editor.

## Making one

Open **`editor.html`** in a browser (no server needed). Draw, then
**Download .js** and drop the file into this folder. Register it by adding one
line to `index.html` next to the others — and the same line to `editor.html`,
which is what puts the map in the **Load** list and offers it as a deck an
elevator can serve:

```html
<script src="maps/tiles.js"></script>
<script src="maps/tutorial.js"></script>
<script src="maps/my-new-map.js"></script>   <!-- this -->
```

Play it with `index.html?map=my-new-map`. While you are still drawing, the
editor's **Playtest** button opens the game on your unsaved draft
(`index.html?draft=1`) — no download or script tag needed.

The editor keeps your work in `localStorage`, so closing the tab does not lose
it. **Open file…** loads any map back in for another pass.

## The format

```js
ISO.register({
  "id": "tutorial",                  // filename and ?map= value
  "name": "Landing Site — Node 77",  // shown nowhere yet; for your own use
  "w": 41, "h": 27,
  "spawn": {"x": 26, "y": 22},       // where the unit starts
  "beacons": [{"x": 7, "y": 8}],     // tutorial beacon spots; one is picked at
                                     // random. If empty, the game picks any
                                     // reachable tile ≥6 steps away. Elevator
                                     // tiles count as beacon spots too.
  "props": {                         // per-instance settings, keyed "x,y"
    "48,13": {"targets": [{"x": 47, "y": 12},
                          {"x": 47, "y": 13}], "label": "LANDING"}
  },
  "rows": ["  ,,,.....  ", ...]      // exactly h strings of exactly w chars
});
```

## Tiles

| Char | Tile      | Walk | Notes                                        |
|------|-----------|------|----------------------------------------------|
| ` `  | Unmapped  | no   | Negative space — gives a map its shape        |
| `.`  | Floor     | yes  |                                              |
| `,`  | Debris    | yes  |                                              |
| `=`  | Plating   | yes  |                                              |
| `+`  | Doorway   | yes  |                                              |
| `#`  | Wall      | no   |                                              |
| `%`  | Bulkhead  | no   | Sealed until a button drives it open         |
| `~`  | Sludge    | yes  | Logs a line the first time it is crossed     |
| `!`  | Hazard    | yes  | Logs a warning the first time                |
| `o`  | Relay     | no   |                                              |
| `x`  | Fencing   | no   | Blocks like a wall; you can see through it   |
| `v`  | Pit       | yes  | Walk in and the run ends. `[R]` re-initialises |
| `T`  | Tram      | yes  | Platform that a button calls along a rail    |
| `b`  | Button    | no   | `[E]` from an adjacent tile signals its targets |
| `c`  | Terminal  | no   | `[E]` opens a small window of text           |
| `^`  | Elevator  | yes  | A car to another deck. `[E]` rides it, and so does a button |
| `L`  | Locker    | no   | Decoration                                   |
| `B`  | Box       | no   | Decoration                                   |
| `A`  | Filing cabinet | no | Decoration                                 |
| `/`  | Broken wall | yes | Reads as wall, but the gap is walkable      |
| `C`  | Cargo container | no | Touching copies become one container — as big as you paint it |
| `F`  | Forklift  | no   | Two tiles long; turns with its `dir`         |
| `D`  | Desk      | no   | Three tiles long; turns with its `dir`       |
| `G`  | Cargo gate | no  | Sealed. `[E]` drives it, and so does a button. Touching copies open together, and `locked` makes one nothing will open |
| `V`  | Vent      | yes  | `[E]` crawls through to the square it is linked to |
| `M`  | Modification Station | no | `[E]` fits the unit with an ability, once. Then it is spent |
| `*`  | Signal beacon | yes | Transmits through walls until the unit gets close, then goes quiet |

To add a tile type, add one entry to `TILES` in `tiles.js`. It shows up in the
editor palette on its own and the game obeys it straight away — walkability,
colour, glyph and the line it writes to the message log all come from there.

## Blocks that need setting up

A block that has to be configured copy by copy declares a `props` schema in its
`TILES` entry. Each placed copy keeps its own values under `map.props["x,y"]`,
and the editor builds its inspector straight from that schema — a new setting
costs one line in `tiles.js` and nothing anywhere else.

| Block    | Setting        | Means                                          |
|----------|----------------|------------------------------------------------|
| Button   | `targets`      | The blocks this button signals — any number    |
| Button   | `label`        | Name shown in the message log                  |
| Bulkhead | `open`         | Starts open rather than sealed                 |
| Tram     | `dir`, `dist`  | Which way the platform runs, and how far       |
| Terminal | `title`, `text`| What the small window says                     |
| Terminal | `desktop`      | This console has a desktop behind it (not built yet) |
| Forklift | `dir`          | Which way it faces, so which tile its second half covers |
| Desk     | `dir`          | Which way it runs                              |
| Cargo gate | `open`       | Starts open rather than sealed                 |
| Cargo gate | `locked`     | Nothing drives it — no control, no `[E]`       |
| Vent     | `dest`         | The square it comes out at                     |
| Vent     | `label`        | Name shown in the message log                  |
| Modification Station | `ability` | Which package this one is stocked with |
| Modification Station | `label`   | Name shown in the message log       |
| Signal beacon | `range`     | How close the unit has to get before it goes quiet |
| Signal beacon | `armed`     | Starts transmitting rather than dark           |
| Signal beacon | `objective` | Objective line it puts up while it is lit      |
| Signal beacon | `label`     | Name shown in the message log                  |
| Elevator | `dest`         | The deck this car serves — another map's `id`   |
| Elevator | `arrive`       | Which car it comes out at over there (blank: one stencilled the same) |
| Elevator | `label`        | Stencilled name — the shaft's name on both decks |

In the editor, pick the **Select** tool (`S`, or `L` — it used to be called
Link) and click a block: its settings appear under **INSTANCE**, under a
**Block** dropdown holding every kind it could be instead. Changing that
dropdown — or clicking a surface in the palette while something is selected —
turns the block into that one where it stands, rather than reaching for the
brush and painting it again. `Delete` clears the selected square to unmapped.
A block that takes no settings still selects, so any square can be changed this
way. Wire a button up with **Pick ▸**, then click the
block it drives. The picker stays open, so keep clicking to wire a whole bank
to the one control — click a block a second time to drop it, `Esc` when done.
Each link is listed under the button with an `×` beside it. Painting a block
that takes settings selects it straight away, and painting over one throws its
settings out with it.

Anything with a `dir` — a forklift, a desk, a platform — also turns with
**`R`** while it is selected, which is quicker than reaching for the dropdown
while laying out a room.

The canvas draws the wiring while you work: amber from each button to every
block it drives, and a pale line along the rail each platform runs.

One press signals all of them at once — a bank of bulkheads opens together, and
a button may drive bulkheads and call a platform in the same press. Each block
answers for itself, so two bulkheads left in opposite states swap rather than
line up. The message log collapses the identical lines, so a bank of four reads
as one.

A map written before a button could drive more than one block still loads: its
single `target` is read as a list of one.

## What the unit is fitted with

The unit picks abilities up over the course of a game, one at a time, at a
**Modification Station** (`M`). `[E]` from an adjacent tile docks with it: the
station hands over whatever it was stocked with and is spent from then on. An
ability outlives a re-initialise — the chassis is rebuilt, the package is not —
so `[R]` after a fall costs progress on the map and nothing else.

There is one package so far:

| Ability | Stocked as | What it does |
|---------|------------|--------------|
| `jump`  | Vault servos | Hold `[SPACE]` to wind up, release to leap |

The jump is held, not tapped. The longer the wind-up, the further it carries —
one square, two, three, or the four the servos are rated for — and the movement
keys aim it while it is held rather than walking the unit off the ledge it is
lining up on. The feed draws the arc while the key is down: every square the
jump would cross, the one it would come down on, and how far along the charge
has got, so nothing is committed blind.

What it clears is ground of any kind, the empty space the record does not reach
into, and anything low enough to see over — mesh, a console, a desk. A wall, a
sealed bulkhead or a stack of crating is as high as it is solid, and turns a
jump back the way it turns a step back. **A pit is cleared, never landed on:**
the unit sails over one and comes down on the far side, so the widest gap a
jump will cross is three squares. If the wind-up is longer than the ground will
take, the unit lands on the last square that reads solid; if there is nothing
to come down on at all, it holds its ground and says so.

To add an ability, add one entry to `ABILITIES` in `tiles.js`. Every station's
picker in the editor is built from that list. `index.html?abilities=jump` fits
one before the run starts, which is how a map built around a jump is playtested
without walking to the station that hands it over.

## Beacons that steer

A **Signal beacon** (`*`) is a transmitter the unit reads through walls — the
same pulse the landing signal uses, but placed as a tile, as many times as a
map needs, each with its own settings. It goes quiet once the unit is within
its `range` (squares, in any direction; `0` means it has to be stood on), and
stays quiet for the rest of the run. Every beacon is armed again by `[R]`,
along with the doors and the stations, so a route can be walked a second time.

Give one an `objective` and it borrows the objective line while it is lit,
handing it back when it goes quiet. If more than one is transmitting, the
nearest one with something to say has the line. A beacon is also a landing
beacon spot, the way an elevator is, so the opening calibration may pick one.

## Decks, and the cars between them

One map is one deck. An **Elevator** (`^`) is a car: a tile that stands on one
deck and serves another. `[E]` from the plate or from the tile beside it rides
it, and a button wired to it calls it — though a call only carries a unit that
is already aboard, so a control across the room reads *the unit is not aboard*
rather than pulling it in from a distance.

Which deck a car serves is its `dest`: another map's `id`, and that map has to
be registered in `index.html` for the game to have it. Where the unit is set
down over there is not a coordinate — a map never holds another map's
coordinates. It is worked out from the far deck's own cars: the one stencilled
with the name in `arrive`, or, when that is blank, one stencilled the same as
the car being ridden. So a shaft is **one name on two decks** — give both cars
the same `label` and the route runs both ways with nothing else to keep in
step. Failing that, the game takes a car over there whose own `dest` comes back
here, then the first car on the deck, and finally the deck's landing record.

What the unit is fitted with crosses with it. Each deck keeps whatever was
changed on it — doors driven open, stations spent, beacons gone quiet — so a
car that goes back arrives at the deck as it was left. What does not cross is
the optical record: the feed holds a reading for five seconds, so a deck is
walked into dark whichever visit it is.

`[R]` re-initialises the unit on the deck it is standing on, at the record it
set down on there — its landing record on the deck the run began on, and the
car it arrived at on any other. That reset is a full one: every deck goes back
to how it started, not just this one.

Survey flags a car with no deck set, one calling a deck that is not registered,
one calling the deck it already stands on, and one that comes out at a car
stencilled with a name the far deck has none of. The canvas writes each car's
deck under it while you work.

A car is also a landing beacon spot, the way a signal beacon is, so the opening
calibration may send the unit to one.

## Blocks bigger than one tile

A map is still one character per tile. A block that covers more than one works
two ways, because the two read differently to whoever is drawing:

**It states its own size** (`foot` in `tiles.js`). You paint one tile — the
anchor — and the block works out the rest from its own `dir`: a forklift is
always two tiles, a desk always three. Turning it moves the tiles it covers,
so rotating a desk is a change of setting rather than a redraw. The far half
is as solid as the tile you painted, and walking into it reads the whole
block's name.

**It is as big as you paint it** (`merge`). Tiles of the same kind that touch
draw as one body, with the seams between them left out and the block's glyph
repeated across every tile of it — so a container reads as crating and a gate
as slats at any size. A cargo container is however many tiles you gave it, and
the log says what size the unit found — *Cargo container. Hull seals read
intact. 3 × 2 units.* A cargo gate works the same way, so a gate four tiles
tall opens as one door, whether the unit drives it or a button does.

Survey flags a big block that reaches past the edge of the record, stands in a
wall, or overlaps another one.

## Two ways into the same block

A cargo gate answers a button the way a bulkhead does, and answers `[E]` from
an adjacent tile on its own — so it needs no control, and Survey does not ask
for one. A gate set **`locked`** answers nothing at all: not `[E]`, not a
control wired to it, and the log says so rather than pretending. A body is
locked if any tile of it is, because the body is one door — Survey says as much
when a body's tiles are set differently. Survey also stops treating a locked
gate as a way through, so ground behind one is reported sealed off (and tinted
red) the way a wall would be, and it points out a control wired to a gate that
can never answer it. `locked` with `open` is the other useful pair: an opening
nothing will ever shut.

A vent needs no control either: `[E]` from the cover, or from standing
on it, and the unit comes out at the square the vent is linked to. Link the far
end with **Pick ▸** under **INSTANCE**; point two vents at each other and the
route runs both ways. The canvas draws a dotted line to wherever each vent
comes out.

Buttons and terminals do not block signals — they block the unit, so put them
in a wall next to a tile it can stand on. A tram's rail may run over unmapped
space or a pit; the platform is the floor while it is there, and bare rail
when it is not.

The editor's **Survey** panel flags the things that break a map: a spawn inside
a wall, a beacon that cannot be reached, ground sealed off from the rest
(tinted red on the canvas), a button that signals nothing, a terminal with no
text, a bulkhead no button opens, a tram whose rail runs into a wall, a vent
with no far end or one that comes out inside a wall, a station stocked with
nothing, a beacon that spawn already stands inside the range of, a car whose
deck is not one the game will have, and a forklift or desk with nowhere to
stand.

Survey checks reach twice: once for a unit that can only walk, and once for one
with vault servos fitted. Ground that only the jump opens up is **gated**, not
sealed — tinted amber rather than red, and reported as needing the servos. That
way a map built around the jump reads as deliberate, and ground that nothing
can reach still reads as a mistake.
