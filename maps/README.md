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
  "under": {"deck": "cargo-bay",     // the deck this one is stacked on, and
            "dx": 0, "dy": 0},       //   where its 0,0 sits in these squares.
                                     //   Leave it out and the deck stands
                                     //   alone, the way every deck used to
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
| `~`  | Sludge    | yes  | Slower to cross. Logs a line the first time  |
| `!`  | Hazard    | yes  | Logs a warning the first time                |
| `o`  | Relay     | no   |                                              |
| `x`  | Fencing   | no   | Blocks like a wall; you can see through it   |
| `v`  | Pit       | yes  | Walk in and the run ends — or drops to the deck below, if the map is stacked on one |
| `T`  | Tram      | yes  | Platform that a button calls along a rail    |
| `b`  | Button    | no   | `[E]` from an adjacent tile signals its targets |
| `c`  | Terminal  | no   | `[E]` opens a small window of text           |
| `u`  | Fusebox   | no   | `[E]` opens the fusebox screen — seat a fuse, wake a circuit |
| `^`  | Elevator  | yes  | A car to another deck. `[E]` rides it, and so does a button |
| `L`  | Locker    | no   | Decoration                                   |
| `B`  | Box       | no   | Decoration                                   |
| `A`  | Filing cabinet | no | Decoration                                 |
| `/`  | Broken wall | yes | Reads as wall, but the gap is walkable      |
| `:`  | Catwalk   | yes  | Open grating. The deck below reads through it |
| `C`  | Cargo container | no | Touching copies become one container — as big as you paint it |
| `F`  | Forklift  | no   | Two tiles long; turns with its `dir`         |
| `D`  | Desk      | no   | Three tiles long; turns with its `dir`       |
| `G`  | Cargo gate | no  | Sealed. `[E]` drives it, and so does a button. Touching copies open together, and `locked` makes one nothing will open |
| `V`  | Vent      | yes  | `[E]` crawls through to the square it is linked to |
| `M`  | Modification Station | no | `[E]` fits the unit with an ability, once. Then it is spent |
| `*`  | Signal beacon | yes | Transmits through walls until the unit gets close, then goes quiet |
| `f`  | Fuse      | yes  | Small enough to carry off. `[E]` lifts it, `[Q]` sets it down |
| `;`  | Blood     | yes  | Touching copies pool into one stain                 |
| `S`  | Skull     | yes  |                                              |
| `X`  | Bones     | yes  | Touching copies scatter as one                      |
| `Y`  | Dead body | yes  | Three tiles long; turns with its `dir`. Crossed slowly |
| `O`  | Hull breach | yes | Three tiles by three. Walk in and the unit drops to the deck below — one way |
| `n`  | Note      | yes  | `[E]` reads it. Paper: it needs no circuit   |

To add a tile type, add one entry to `TILES` in `tiles.js`. It shows up in the
editor palette on its own and the game obeys it straight away — walkability,
colour, glyph and the line it writes to the message log all come from there.
Name it in one of the `CATS` groups in the same file to say which heading it
files under in the palette; a tile named in none of them still appears, under
**Other**, so a block can never go missing by being forgotten.

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
| Dead body | `dir`         | Which way it lies                              |
| Hull breach | `dest`       | The deck under the hole — another map's `id`. Blank: the deck the map is stacked on |
| Hull breach | `arrive`     | The stencil on that deck it comes down at      |
| Hull breach | `label`      | Stencilled name — also the stencil `arrive` falls back to |
| Note     | `title`, `text`| What the scrap says                            |
| Elevator | `dest`         | The deck this car serves — another map's `id`   |
| Elevator | `arrive`       | Which car it comes out at over there (blank: one stencilled the same) |
| Elevator | `label`        | Stencilled name — the shaft's name on both decks |
| Fusebox  | `ways`         | The circuits it feeds, and the fuse each way takes |
| Fusebox  | `label`        | Name shown in the message log and on the screen |
| Fuse     | `rating`       | Which fuse this one is — a way only wakes for its own |
| Fuse     | `label`        | Name shown in the message log                  |
| *anything powered* | `circuit` | The circuit it waits on. Blank — the default — means it is live from the start |

The palette is filed under headings — **Ground**, **Structure**, **Controls**,
**Transit**, **Fixtures**, **Remains**, **Unit & kit** — and each heading folds away with a
click, so a room is laid out from the six or seven blocks it actually uses
rather than from a list of thirty. Which headings are folded is kept between
visits, like the draft is. The number keys still reach the first ten blocks
wherever they are filed, and a brush loaded out of a folded section marks its
heading amber so it is never a mystery where the block went.

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

## Power, and the fuses that wake it

Every block is live unless you say otherwise, so a map that never mentions
power behaves exactly the way maps always have. Saying otherwise is one
setting: put a block **on a circuit** by writing a name in its `circuit` field,
and from then on it waits. A control on a dead circuit does not answer the
press. A bulkhead does not move, whichever control reaches it. A console is
dark, a station's arm is dead, a platform stays where it is, a car will not
ride, and a beacon does not transmit at all. What a dead block never becomes is
a hole in the deck: it stands exactly where it stood, as solid as it ever was.

A circuit is a name and nothing else. What makes it live is a **Fusebox** (`u`)
somewhere on the same deck with a **way** stencilled with that name, holding a
fuse of the rating that way takes. Each way is two things — the circuit it
feeds, and the fuse it takes — and a box has as many ways as you give it.

So the errand a fusebox creates is: find a fuse, carry it back, seat it in the
right way. Seating the wrong rating is allowed and does nothing — the screen
says `WRONG RATING` and the circuit stays dead, which is the whole reason each
way says what it takes. Pulling a fuse back out kills the circuit again
wherever on the deck it runs, so one fuse shared between two ways is a real
decision rather than a puzzle with one answer.

`[E]` on a fusebox opens the **fusebox screen**, which takes the message log's
place in the column until it is closed — it is the same sort of thing, a panel
the operator reads. One row per way, with what is seated in it and whether it
reads `LIVE`, `EMPTY` or `WRONG RATING`, and under them whatever the
manipulator is holding. `[↑]`/`[↓]` move between ways, `[←]`/`[→]` choose which
carried fuse is in hand, `[ENTER]` seats it — or pulls out what is already
there, because a way only ever wants one of the two. The number keys work the
ways directly, and `[E]` or `[ESC]` closes the screen and gives the log back.
Everything that happens in there is written to the log as well, so closing it
leaves a record rather than a gap.

A block on a circuit **no fusebox on the deck feeds** is off for good, which is
how a block is switched off permanently — Survey says as much, because from the
canvas it looks exactly like a block that works. The canvas draws the supply
the way it draws the wiring: a dotted mint line from each box to every block on
a circuit it feeds, each way's circuit written under the box, and the circuit
written over each block that waits on one — in red when nothing feeds it.
In the game a block waiting on a dead circuit draws faint, with a small red
mark in its corner, so an operator can tell a console that is off from one that
is merely quiet.

Fuses come in ratings, listed in `FUSES` in `tiles.js`: **5A**, **15A** and
**30A** so far. A new rating is one entry there — the editor's pickers and the
fusebox screen are both built from that list.

Power crosses decks the way everything else does: each deck keeps the fuses
seated in its own boxes, so a car that goes back comes back to the circuits it
left live. `[R]` puts every deck back to how it started, fuses included.

## Small objects, and carrying them

Some things are small enough for the unit to pick up. `[E]` lifts one into the
manipulator and `[Q]` sets the last one down on the square the unit is standing
on — or a tap on the CARRYING line, which is where what is being held is
listed. The manipulator holds six objects.

A **Fuse** (`f`) is the first of them: the fuse a fusebox way is waiting for,
placed as a tile wherever the map wants the unit to have to go. Lifting one
leaves the empty clip behind, drawn as such, so a room remembers what was taken
out of it. Anything set down lies on the deck where it was left and can be
lifted again, by the unit that left it or after it has walked the long way
round.

What is being carried crosses between decks, the way a fitted package does.
What it does not survive is `[R]`: the deck is rebuilt around the unit, clips
and all, so anything it was holding is back where it was found rather than held
twice.

To add another kind of small object, add one entry to `ITEMS` in `tiles.js` and
one tile that says it holds that kind — the lifting, the carrying, the setting
down and the drawing all follow from there.

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

## A hole instead of a car

A **Hull breach** (`O`) is the other way down: three tiles by three of missing
plating, painted from one anchor the way a desk is. The unit walks into it and
goes down — and nothing on the deck below carries it back up, so a breach is a
route an author can send the unit along exactly once. It is a door that only
opens one way, and it costs no control, no circuit and no fuse to build.

Where it drops to is `dest`, the same as a car's: another map's `id`, and that
map has to be registered in `index.html`. Where the unit comes down is not a
coordinate either, but a breach has no car at the bottom of it to aim at, so it
is stencilled instead. `arrive` names a stencil on the deck below and the unit
lands on whatever carries it — a signal beacon is the obvious marker, but any
block with a `Stencilled` field does: a control, a station, a vent, a car.
Where that block is not something to stand on, the unit comes down beside it
rather than inside it. With `arrive`
blank the breach falls back to its own `label`, and failing that to whatever a
car would have done.

A breach with **no deck registered under it** is what it looks like from
directly above: a hole. The unit goes in, and the run ends there — so `v` is a
hole the size of a tile and `O` is a hole three tiles across, until the moment
an author says what is underneath it.

A jump clears a breach the way it clears a pit: sailed over, never landed in.
Three squares across means a full wind-up gets over it and nothing shorter
does. `[R]` re-initialises the unit on the deck it fell to, at the square it
came down on — the fall is not undone by dying after it.

Survey flags a breach with no deck set, one dropping to a deck that is not
registered, one dropping to the deck it is cut into, one coming down at a
stencil the far deck has none of or at a stencil with nothing to stand on, and
one with no stencil at all, which leaves where the unit lands up to the far
deck. The canvas writes the deck and the stencil under the hole while you work.

## One deck drawn under another

A map is still one deck, and a map that says nothing about what is beneath it
is exactly the map it always was. Saying something is one setting on the record
rather than on a block: **below**, in the editor's RECORD panel, naming another
deck's `id`, with an **offset** saying where that deck's `0,0` sits in this
deck's squares. Two decks of the same size laid straight on top of one another
want `0,0`; a small platform over a large bay wants whatever lines the two up.

What that buys is what an operator would actually see. Wherever this deck is
**open** — a catwalk's grating, a pit, a hull breach — the square underneath is
drawn first and dimmer, and the opening is drawn over the top of it. Crating,
a forklift, a body on the bay floor all read through the hole they are under,
darker than the deck the unit is standing on, which is the whole point: the
unit is looking down at them. It follows the optics like everything else, so
the deck below is only drawn where the unit can see the opening, and it is let
go of on the same clock. A deck that has been walked is drawn as the unit left
it — the doors it opened down there stay open under the grating.

Three blocks are open in this sense:

| Block | Open because |
|-------|--------------|
| `:` Catwalk | Grating: it is walked on, and read straight through |
| `v` Pit | A hole one tile across |
| `O` Hull breach | A hole three tiles across |

Unmapped space is **not** one of them. Negative space is what gives a map its
shape, and a deck stacked on another would lose that shape entirely if every
blank square turned into a window. So the open air beside a catwalk is painted
as pit — which is what it is: somewhere the unit falls out of.

And it is not only cosmetic. A hole over a registered deck is a way down: step
into one and the unit comes down on the deck below **at the same square it went
through**, because the two are drawn in line and there is nothing else it could
mean. That is the one thing a stencil could never get right, and it is why a
pit over a deck stops being an ending and becomes a drop. A breach with its own
`dest` still goes where its author sent it — the hole's own setting is read
first — and a hole over nothing is exactly what it always was: the end of the
run.

What comes down on nothing to stand on is still a fall: an opening over crating
or a wall kills, and Survey counts those for you, along with openings hanging
past the edge of the deck below and a `below` naming a deck that is not
registered. The unit goes down and never up: an elevator or a long way round is
still the only way back, which is what keeps a stack of decks a route rather
than a free-for-all.

Everything else about decks is unchanged. Each one keeps what was changed on
it, fuses and all, and `[R]` re-initialises the unit on the deck it fell to, at
the square it came down on.

## What the crew left behind

Four blocks that are nothing but what they look like. **Blood** (`;`),
**Skull** (`S`) and **Bones** (`X`) are read on the way past and stop nothing;
blood and bone merge, so a stain is as big as it is painted and reads as one
pool rather than a row of squares.

A **Dead body** (`Y`) is three tiles long, painted from one anchor and turned
with its `dir` the way a desk is. It is the first block the unit can walk *onto*
rather than around — and it takes about two and a half times as long to cross
as plain deck, because the chassis climbs rather than walks. That is one
setting, `slow` in `tiles.js`: how much longer than an ordinary step a move
onto or off a block takes, so a step is as slow as the worse of the two squares
it joins. Sludge carries it too, which is what its log line has always
promised.

Because the whole of a body walks the way the tile it was painted on does, a
body lying across a pit is a bridge over it, the way a platform parked there
would be. That is deliberate: the only thing a walkable big block changes about
a route is how long the route takes.

A **Note** (`n`) is a scrap of paper on the deck. `[E]` reads it, in the same
small window a console opens into, dressed as paper rather than as a screen.
It is the one readable block that is not a console: paper carries no circuit,
so a note reads the same on a dark deck as on a live one, and Survey asks only
that something is written on it.

## Blocks bigger than one tile

A map is still one character per tile. A block that covers more than one works
two ways, because the two read differently to whoever is drawing:

**It states its own size** (`foot` in `tiles.js`). You paint one tile — the
anchor — and the block works out the rest from its own `dir`: a forklift is
always two tiles, a desk always three, a hull breach always three by three.
Turning it moves the tiles it covers, so rotating a desk is a change of setting
rather than a redraw. The far half reads exactly the way the tile you painted
does — as solid for a forklift, as walkable for a body — and meeting any of it
reads the whole block's name.

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
a wall — or on a pit or a breach, which is a run that ends or falls through the
deck the moment it begins — a beacon that cannot be reached, ground sealed off
from the rest (tinted red on the canvas), a button that signals nothing, a
terminal with no text, a note with nothing written on it, a bulkhead no button
opens, a tram whose rail runs into a wall, a vent with no far end or one that
comes out inside a wall, a station stocked with nothing, a beacon that spawn
already stands inside the range of, a car whose deck is not one the game will
have, a breach with nothing registered under it or nothing stencilled to come
down at, and a forklift, desk or body with nowhere to lie. On power it flags a fusebox that feeds nothing, a way stencilled with no
circuit, a way that feeds a circuit nothing on the deck is on, a way whose fuse
is placed on no deck at all, and a block waiting on a circuit no box on its
deck feeds — the one that would otherwise look exactly like a block that
works.

Survey checks reach twice: once for a unit that can only walk, and once for one
with vault servos fitted. Ground that only the jump opens up is **gated**, not
sealed — tinted amber rather than red, and reported as needing the servos. That
way a map built around the jump reads as deliberate, and ground that nothing
can reach still reads as a mistake.
