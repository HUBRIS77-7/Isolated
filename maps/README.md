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
                                     // reachable tile ≥6 steps away. A car
                                     // or a flight of steps counts as a
                                     // beacon spot too.
  "carriage": true,                  // this deck IS the inside of a car rather
                                     //   than a deck with one parked on it.
                                     //   Draw no `^` on it. See Decks
  "dark": true,                      // nothing lights this deck: sight closes
                                     //   to two squares unless the unit has a
                                     //   floodlamp struck. See A deck with
                                     //   nothing lighting it
  "chapter": {"n": 1,                // this deck is the intermission that opens
              "name": "Chapter One"},//   chapter 1, and crossing into it is
                                     //   where the run is kept. Leave it out
                                     //   and the deck keeps nothing. See
                                     //   Chapters
  "os": {"card": "", "cardsub": "",  // the unit's own store on this deck, which
         "files": []},               //   [O] brings up. Leave it out and [O]
                                     //   says it is empty. See Desktops
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
| `W`  | Tank wall | no   | The side of a vessel, not of a room. Touching copies become one tank — as big as you paint it |
| `v`  | Pit       | yes  | Walk in and the run ends — or drops to the deck below, if the map is stacked on one |
| `T`  | Tram      | yes  | Platform that a button calls along a rail    |
| `b`  | Button    | no   | `[E]` from an adjacent tile signals its targets |
| `c`  | Terminal  | no   | `[E]` opens a small window of text           |
| `u`  | Fusebox   | no   | `[E]` opens the fusebox screen — seat a fuse, wake a circuit |
| `^`  | Elevator  | yes  | A car to another deck. `[E]` rides it, and so does a button |
| `s`  | Stairway  | yes  | Steps to another deck. `[E]` climbs them. No power, no control — and slow, because the chassis climbs |
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
| `E`  | Stalker   | yes  | Where a contact starts, not a block. It paces the unit and never closes |
| `e`  | Hunter    | yes  | Where a contact starts. It hunts by movement, it closes, and it will not pass a doorway |
| `<`  | Sentry turret | yes | Where an emplacement stands. It never moves, and it fires on anything not of its own side |
| `z`  | Security drone | yes | Where a contact starts. It follows the unit, lifts it off the deck and carries it somewhere else |
| `0`  | Block     | yes  | Where a contact starts, and the middle of it. Three tiles by three, sliding, and it kills what it arrives over |
| `d`  | Dirt      | yes  | Open earth                                   |
| `g`  | Grass     | yes  |                                              |
| `p`  | Path      | yes  | Beaten track                                 |
| `r`  | Tire tracks | yes | Touching copies run as one set of ruts      |
| `_`  | Wooden floor | yes | Boards, for what is built out of timber    |
| `P`  | Pond      | no   | Water. Touching copies become one pond — as big as you paint it. Sight crosses it; the chassis does not |
| `H`  | Wooden wall | no |                                              |
| `h`  | Wooden fencing | no | Blocks like a wall; you can see over it  |
| `i`  | Window    | no   | Blocks like a wall; the room reads clear through it |
| `Q`  | Silo wall | no   | Touching copies become one silo — as big as you paint it |
| `K`  | Locked door | no | Held by a lock, not a circuit. Only the key it names opens it, and `[E]` is what tries it |
| `k`  | Key       | yes  | Small enough to carry off. `[E]` lifts it, `[Q]` sets it down |
| `?`  | Sign      | no   | `[E]` reads it. Paint: it needs no circuit   |
| `>`  | Sliding gate | no | Runs open a tile at a time when a button signals it, from the end its `dir` points at. Touching copies run as one gate |
| `R`  | Car       | no   | Seven tiles by three; turns with its `dir`   |
| `@`  | Windmill  | no   | Three tiles by three; turns with its `dir`   |
| `Z`  | Bed       | no   | Two tiles long; turns with its `dir`         |
| `a`  | Chair     | no   | Decoration. Sight passes over it             |
| `U`  | Sofa      | no   | Two tiles long; turns with its `dir`         |
| `t`  | Table     | no   | Two tiles by two; turns with its `dir`       |
| `m`  | Television | no  | `[E]` reads what is on it — and it draws power, so a dark circuit is a dark screen |
| `\|`  | Corn stalk | yes | Standing crop. Walkable, slow, and sight stops dead in it — a field is cover |
| `w`  | Wheat     | yes  | Crop. Slower to cross, and low enough to read over |
| `&`  | Tomatoes  | yes  | Crop. Slower to cross                        |
| `y`  | Hay bale  | no   | Touching copies stack as one. Low enough to read over |
| `j`  | Scarecrow | no   | Decoration. Sight passes over it             |
| `J`  | Command Desk | no | Three tiles long; turns with its `dir`. Low enough to read over |
| `-`  | Command Blockade | no | A bar down across the way. Nothing on it answers `[E]`: a control lifts it, on a wall or filed on a console. Touching copies lift together |
| `(`  | Command Sandbags | no | Touching copies stack as one. Low enough to read over |
| `q`  | Command Relay | no | `[E]` reads it. A mast with a console in its foot: everything a terminal is, desktop and all |
| `l`  | Command Antenna | no | Three tiles by three; turns with its `dir`. Transmits through walls while it is live, the way a beacon does |
| `[`  | Command Elevator | yes | A car to another deck, and the command deck's own. `[E]` rides it, and so does a button |
| `N`  | Command Signage | no | `[E]` reads it. Paint on steel: it needs no circuit |
| `I`  | Command Terminal | no | `[E]` opens it. Everything a terminal is, in command blue |
| `` ` `` | Carpet   | yes  | Dark blue tile. The quietest ground on the ship          |
| `]`  | Painted wall | no | Bulkhead under dark blue paint                          |
| `)`  | Reception desk | no | Counter. Touching copies become one desk — as long as you paint it. Low enough to read over |
| `{`  | Hollow locker | no | The back is out of it. `[E]` folds the unit inside, where nothing can find it |
| `}`  | Hollow desk  | no  | Three tiles long; turns with its `dir`. The well under it is clear — `[E]` folds the unit in |
| `$`  | Broken pipe | no   | It is putting water on the deck. Floods as far as its `reach`, and only while its circuit is live |
| `1`  | Water     | yes  | Standing water. Slower to cross, and the loudest ground there is. Touching copies become one pool |
| `2`  | Fire      | no   | Nothing crosses it. Water puts it out, and what is left is ash the unit walks over |
| `3`  | Laser alarm | yes | A beam across the way. Walk through an armed one and the deck sounds. A control disarms it. Touching copies are one beam |
| `4`  | Ravager   | yes  | Where a contact starts. It is blind, and it hunts the deck by sound |

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
| Terminal | `desktop`      | This console opens its filing rather than one record |
| Terminal | `files`        | What is filed on that desktop — one row per file, a control among them |
| Terminal | `card`, `cardsub` | The words the segment ends on when the sealed file gives way |
| Forklift | `dir`          | Which way it faces, so which tile its second half covers |
| Desk     | `dir`          | Which way it runs                              |
| Cargo gate | `open`       | Starts open rather than sealed                 |
| Cargo gate | `locked`     | Nothing drives it — no control, no `[E]`       |
| Tank wall | `label`        | Stencilled name — read from anywhere on the one tank |
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
| Stairway | `dest`         | The deck the steps climb to — another map's `id` |
| Stairway | `arrive`       | Which flight it comes out at over there (blank: one stencilled the same) |
| Stairway | `label`        | Stencilled name — the companionway's name on both decks |
| Fusebox  | `ways`         | The circuits it feeds, and the fuse each way takes |
| Fusebox  | `label`        | Name shown in the message log and on the screen |
| Fuse     | `rating`       | Which fuse this one is — a way only wakes for its own |
| Fuse     | `label`        | Name shown in the message log                  |
| Stalker  | `wake`         | Squares of route at which it takes an interest |
| Stalker  | `range`        | Squares from its mark it will wander. `0` — the default — turns it loose on the whole deck |
| Stalker  | `label`        | Name shown in the message log                  |
| Hunter   | `wake`         | Squares of route at which it takes an interest |
| Hunter   | `range`        | Squares from its mark it will wander. `0` — the default — turns it loose on the whole deck |
| Hunter   | `label`        | Name shown in the message log                  |
| Elevator, Stairway, Hull breach | `fade` | The screen goes black across the crossing rather than cutting |
| Elevator, Stairway, Hull breach | `card`, `cardsub` | Words held on that black, and the line under them |
| Silo wall | `label`       | Stencilled name — read from anywhere on the one silo |
| Locked door | `opens`     | Which key turns it. No other does, and no control does |
| Locked door | `label`     | Name shown in the message log                  |
| Key      | `opens`        | Which lock this one is cut for                 |
| Key      | `label`        | Name shown in the message log                  |
| Sign     | `title`, `text`| What the board says                            |
| Sliding gate | `dir`      | Which end it runs open from, and back toward when it shuts |
| Sliding gate | `open`     | Starts open rather than shut                   |
| Sliding gate | `locked`   | Nothing drives it — there is no `[E]` on one either |
| Television | `title`, `text` | What is on the screen                     |
| Television | `label`      | Name shown in the message log                  |
| Car, Windmill | `dir`     | Which way it faces, so which tiles it covers   |
| Car, Windmill | `label`   | Stencilled name                                |
| Bed, Sofa, Table | `dir`  | Which way it runs                              |
| Scarecrow | `label`       | Stencilled name                                |
| Command Desk, Command Antenna | `dir` | Which way it runs, so which tiles it covers |
| Command Desk, Command Antenna, Command Relay | `label` | Stencilled name |
| Command Blockade | `open`    | Starts lifted rather than down                 |
| Command Blockade | `locked`  | Nothing lifts it — no control, and there is no `[E]` on one either |
| Command Antenna | `range`, `armed`, `objective` | Read exactly as a signal beacon's are |
| Command Relay, Command Terminal | `title`, `text`, `desktop`, `files`, `card`, `cardsub` | Read exactly as a terminal's are |
| Command Signage | `title`, `text` | What the board says                       |
| Command Elevator | `dest`, `arrive`, `label`, `fade`, `card`, `cardsub` | Read exactly as an elevator's are |
| Sentry turret | `label`      | Name shown in the message log                  |
| Reception desk, Hollow locker, Hollow desk | `label` | Stencilled name     |
| Hollow desk | `dir`         | Which way it runs                              |
| Broken pipe | `reach`      | Squares of ground the flood works out to       |
| Broken pipe | `label`      | Stencilled name                                |
| Laser alarm | `armed`      | Starts with the beam across the way            |
| Laser alarm | `label`      | Name shown in the message log                  |
| Ravager  | `hears`        | Squares a noise carries to it                  |
| Ravager  | `range`        | Squares from its mark it will wander. `0` — the default — turns it loose on the whole deck |
| Ravager  | `label`        | Name shown in the message log                  |
| Security drone, Block | `wake` | Squares of route at which it takes an interest |
| Security drone, Block | `range` | Squares from its mark it will wander. `0` — the default — turns it loose on the whole deck |
| Security drone, Block | `label` | Name shown in the message log                |
| *anything powered* | `circuit` | The circuit it waits on. Blank — the default — means it is live from the start |

The palette is filed under headings — **Ground**, **Open land**, **Structure**,
**Buildings**, **Controls**, **Transit**, **Fixtures**, **Furnishings**, **Farm**,
**Remains**, **Unit & kit**, **Command deck**, **Hazards**, **Contacts** — and each heading folds away with a
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

## Drawing with something other than the brush

**Brush** (`B`) paints a square of tiles, as many across as the **size**
control says. **Rect** (`E`) and **Circle** (`C`) are both a drag: press at one
corner, release at the other, and the block fills the box or the ellipse that
fits inside it. A square drag makes a circle and anything else makes an
ellipse, so there is one tool rather than two. **Fill** (`F`) floods everything
of one kind that touches where you clicked. All of them lay the loaded block
with the left button and clear back to unmapped with the right, and all of them
are one step of `Ctrl+Z`.

A circle comes two ways, and the **circle** switch under the size control says
which — `Ring` for the wall of something, `Solid` for a floor. **`O`** flips
it. A ring is the disc with its middle taken out, and it is left two tiles
thick where the curve turns a corner on purpose: nothing that merges reads as
one body through a corner join, so a ring joined only corner-to-corner would
come out as four separate walls rather than one tank. Which makes the circle
tool and the tank wall the pair they look like — drag a square with `W` loaded
and the vessel is drawn, stencilled and merged in one gesture.

While the drag is open the canvas draws the tiles the release would actually
lay, inside a dashed box, because a bounding box on its own says nothing about
where a curve is going to land. A drag that swings off the edge of the record
lays the part of the curve that is on it and drops the rest.

The canvas draws the wiring while you work: amber from each button to every
block it drives, a finer amber from each console to whatever its filed
controls drive (see **Desktops**), and a pale line along the rail each
platform runs.

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

A **Key** (`k`) is the second, and it works the same way with one difference:
what it answers to is a lock rather than a circuit. Which lock is `opens`, on
the key and on the door alike — see **A lock, rather than a circuit** below.

To add another kind of small object, add one entry to `ITEMS` in `tiles.js` and
one tile that says it holds that kind — the lifting, the carrying, the setting
down and the drawing all follow from there.

## What the unit is fitted with

The unit picks abilities up over the course of a game, one at a time, at a
**Modification Station** (`M`). `[E]` from an adjacent tile docks with it: the
station hands over whatever it was stocked with and is spent from then on. An
ability outlives a re-initialise — the chassis is rebuilt, the package is not —
so `[R]` after a fall costs progress on the map and nothing else.

There are three packages so far:

| Ability | Stocked as | What it does |
|---------|------------|--------------|
| `jump`  | Vault servos | Hold `[SPACE]` to wind up, release to leap |
| `motion`| Motion tracker | `[M]` raises a screen that reads movement through structure |
| `flashlight` | Chassis floodlamp | `[F]` strikes a lamp on the housing, and `[F]` kills it |

The jump is held, not tapped. The longer the wind-up, the further it carries —
one square, two, three, or the four the servos are rated for — and the movement
keys aim it while it is held rather than walking the unit off the ledge it is
lining up on. The feed draws the arc while the key is down: every square the
jump would cross, the one it would come down on, and how far along the charge
has got, so nothing is committed blind.

What it clears is ground of any kind, the empty space the record does not reach
into, fire, and anything low enough to see over — mesh, a console, a desk. A wall, a
sealed bulkhead or a stack of crating is as high as it is solid, and turns a
jump back the way it turns a step back. **A pit is cleared, never landed on:**
the unit sails over one and comes down on the far side, so the widest gap a
jump will cross is three squares. If the wind-up is longer than the ground will
take, the unit lands on the last square that reads solid; if there is nothing
to come down on at all, it holds its ground and says so.

The **motion tracker** is the other kind of package: it changes what the
operator can read rather than what the chassis can do. `[M]` raises it into
the right-hand column, under the message log, and `[M]` stows it again — or a
tap on the `M` chip in the key row, and on the tracker's own footer, for a
screen with no keyboard behind it. It stays up while the unit walks: it is
meant to be read on the move, not consulted like a console.

What it reads is movement, and only movement. Every contact that has taken a
step in the last few seconds draws as a return, at its true range and bearing,
through as much structure as stands between — and a contact standing perfectly
still draws as nothing at all. It cannot say what any return is, only how far
off and which way, so a screen with two returns on it is not a screen that
knows which of them is the dangerous one. The footer counts what is showing
and gives the nearest range; `NO MOTION` means nothing has moved, which is not
the same as nothing being there.

Because every contact is out walking the deck whether it has noticed anything
or not, the tracker is usually reading something. That is the point of it: the
operator learns the difference between a return that wanders and a return that
closes.

The **chassis floodlamp** is the third, and the plainest: a lamp on the
housing, struck and killed with the same key. `[F]` turns it on, `[F]` turns it
off — or a tap on the `F` chip in the key row, which lights while the lamp
burns. It stays struck across a car and across `[R]`: it is fitted to the
chassis, not to the deck.

On a deck with light on it the lamp adds nothing. The optics were already
reading the nine squares they are rated for, and striking the lamp says so. It
is on a deck marked `dark` that it is the whole of the difference — see below.

To add an ability, add one entry to `ABILITIES` in `tiles.js`. Every station's
picker in the editor is built from that list. `index.html?abilities=jump` fits
one before the run starts, which is how a map built around a jump is playtested
without walking to the station that hands it over. More than one is a list:
`?abilities=jump,motion,flashlight`.

## A deck with nothing lighting it

A deck whose record carries `"dark": true` — the **is dark** box in the
editor's RECORD panel — has no light on it at all. Nothing about the chassis
changes: the optics are the same optics, the line of sight is worked out the
same way, and what is solid still stops it. There is simply nothing out there
for them to read, so what they resolve closes from nine squares to **two**, and
the rest of the deck is walked into rather than looked at.

The last reading is still held the way it always is: a square the unit has
lit and left stays on the record for five seconds and then fades. So a dark
deck is not crossed blind — it is crossed by memory, two squares at a time,
and the memory runs out behind the unit.

A **chassis floodlamp** undoes all of it. With the lamp struck the deck reads
at the full nine squares, exactly as a lit deck does; kill it and sight closes
again where the unit stands. That is the whole of the modifier: a dark deck is
a deck the operator wants a lamp on, and one an author can make the unit cross
without one if that is what the deck is for.

Crossing onto a dark deck says so in the log, and says whether anything fitted
throws light. The editor's survey says so too: mark a deck dark with no station
anywhere in the record stocking a floodlamp and it flags it, the same way it
flags a lock with no key cut for it. That is a note about the record, not an
error — a dark deck with no lamp in the game is a deck crossed two squares at a
time, which is a perfectly good thing to build, and playtesting one with a lamp
in hand is `index.html?map=my-dark-deck&abilities=flashlight`.

## What else is walking about

A **contact** is the one thing on a deck the record will not hold still for.
It is placed like a block and is not one: the square is a starting mark, the
run builds the creature on it, and the mark is plain ground from then on — so
putting one down never changes what a route is. It walks over ground the unit
could stand on and is no better over a pit than the chassis is, and it keeps
whatever it changed about a deck when the unit rides away and comes back.
`[R]` puts them back on their marks along with everything else.

Neither of them waits on the unit to exist. A contact that has not noticed
anything goes looking: it picks somewhere on the deck it can get to, walks
there, stands a moment, and picks somewhere else. It does that whether the
unit is moving, standing still, or on another deck entirely — so a deck with
something on it is never a deck holding its breath. Give one a `range` and it
wanders only that far from the mark it was painted on, which is how a contact
is made to hold a stretch of corridor rather than the whole ship; one that
finds itself outside its range heads back towards the mark. Leave `range` at
`0` and it has the run of the deck.

It will not step onto a platform, or onto the rail one runs along. A tram is
ground only the unit trusts, which makes riding one a way off a deck that
nothing follows it onto.

A kind may also be barred outright from blocks the unit walks over without
thinking, by naming their tile ids in `bars`. **A hunter is barred from
doorways.** It cannot pass a `+` in either direction, wandering or hunting, so
a room reached only through a door is a room no hunter ever enters and none
ever leaves. That makes where an author puts a door part of what a deck is —
and it is worth checking, before placing one, that a hunter shut in with no
door-free way out is a hunter that was meant to stay there.

Nothing about a contact is square. The unit stands in one square at a time and
a contact does not: it holds a real position on the deck, in tiles, and
crosses the ground at its own `speed` in tiles a second, choosing the next
square to steer for the moment it reaches the last one. So it is as often
across the line between two squares as inside one, and it is drawn round
rather than as a plate — everything the deck is built out of is square, and
none of this was built. It is also why one that is stopped can be stopped
halfway.

| Char | Kind    | Moves | Closes | What it is |
|------|---------|-------|--------|------------|
| `E`  | Stalker | At a pace of its own, whenever the range is wrong | Never | It closes to three squares, holds there, and follows for as long as the unit is inside its range. It cannot hurt the unit at all — and it is shy: walk up on it, or walk into it, and it breaks and runs |
| `e`  | Hunter  | At a pace of its own, always — wandering or hunting | Onto the unit, and strikes it if it is moving, which ends the run | It hunts by movement and nothing else: it finds the unit by it, loses the unit without it, and can only strike a unit that has it. Holding still is the whole of the defence — but it has to be done early. It is barred from doorways |
| `<`  | Sentry turret | Never. It is bolted where it was painted | It does not have to: it shoots | Command side. It lays onto anything not of its own side — a stalker, a hunter, a block — and onto the unit whatever happens, and puts a round through it. What it never fires at is a security drone |
| `z`  | Security drone | At a pace of its own, always | Onto the unit, and lifts it | Command side, and it cannot end a run. It takes hold of the chassis, carries it off, and sets it down wherever it was going. The movement keys become the struggle while it has hold |
| `0`  | Block | Along one heading until the whole of it is stopped | It does not steer: it arrives | Three tiles by three of freight. Whatever it comes over is under it, and that ends the run. It needs the whole of its body's width, so a doorway is somewhere it can never be |
| `4`  | Ravager | At a pace of its own, always — casting about or coming | Onto whatever it heard, and strikes it if it is still making a noise, which ends the run | It cannot see. Nothing about where the unit is standing reaches it: what it has is the last square the deck made a noise at, and it walks to that. Holding still is no answer to it — being quiet is |

### Hunting by movement

A contact with `hunts: 'motion'` in `FOES` — the hunter — has no other way
of finding anything. That shows up in three places, and it is the same rule
each time.

It **notices** by movement: a unit that has not covered ground for a few
seconds is a unit it never takes an interest in, however close it walks past.

It **loses** by movement: once it is following, a unit that stops leaves the
trail to go cold, and a few seconds later it gives up, says so, and wanders
off to look somewhere else.

It **strikes** by movement, and this is the tight one: it closes whether the
unit is moving or not, and when it arrives it has the unit under it either
way — but it can only place a chassis that is moving. A unit that has been
perfectly still for half a second is one it stands over, and cannot hit, until
the trail goes cold and it leaves.

Which makes stopping the answer, and makes *when* to stop the whole of the
skill. It crosses better than three squares inside the window in which the
unit still reads as moving, so:

| Stop with it this far off | What happens |
|---------------------------|--------------|
| Four squares or more | It arrives, stands over the unit, cannot place it, loses the trail and wanders off |
| Three or fewer | It reaches the unit while the unit still reads as moving, and that is the run |

Stopping is not the only answer. It is slower than the chassis, so open ground
outruns it, a jump puts four squares between them in a fifth of a second, and
a doorway shuts it out altogether.

A shy contact — one with a `shy` distance in `FOES` — will not be walked up
to. Come inside that distance and it drops whatever it was doing and runs, at
`bolt` times its ordinary speed, until it has `calm` squares of route between
itself and the unit. Then it holds that ground for several seconds before it
will come back in to the distance it ordinarily paces at, because something
that bolts and returns in the same breath never bolted. Walking into one
counts as walking up to it. Only the stalker is shy; nothing rattles a hunter.

Both of them take an interest once the unit is within `wake` squares of
walkable route — not of open air, so a contact on the far side of a sealed
bulkhead is a contact that has not noticed anything — and hold that interest a
good way past the same number, so one does not switch on and off while the
unit paces the edge of its range. The log writes one line the first time each
takes an interest, and the feed draws one only where the optics actually reach
it: a contact is never held on the record the way ground is, because it has
moved by the time the reading would be redrawn. Reading one through a wall is
what the tracker is for.

Where a contact is is worked out in tiles, but how far off it is is counted in
squares of route — so `wake`, `keep`, `shy` and `calm` are all distances
along ground something could actually walk, never straight lines through a
wall. Reaching the unit is the one thing measured in tiles: a contact has
arrived when it is standing in the unit's square, wherever the grid says
either of them is.

The two of them are a pair on purpose, and the tracker is where the pair pays
off. Everything on a deck is walking about, so the screen is rarely empty and
a return on it means very little by itself. What means something is a return
that is *closing* — one that keeps getting nearer sweep after sweep is one
that has the unit, and it is the only thing on the screen that does that.
Stop, and watch it turn away: the operator who has learned to read that has
learned the whole of the instrument, and the hunter is the reason the
instrument is worth carrying.

To add a creature, add one entry to `FOES` in `tiles.js` and one tile that
names it in `foe`. Everything else — how fast it crosses the deck, how far it
notices, how close it comes, whether it kills, how it draws — is read from
that entry.

### Sides, and who fires at whom

The stalker and the hunter came aboard on their own and belong to nobody. The
two things the command deck left running do not: a `side` in `FOES` says whose
a contact is, and both the turret and the drone are `command`.

What reads a side is a gun. **It fires on anything whose side is not its own,
and on the unit whatever happens** — so a turret and a drone stand in the same
room and leave each other alone, while a stalker that wanders across the same
room does not get to the other side of it. Nothing else in the vocabulary
consults a side, which is the whole of the rule: two things of one side never
trade rounds, and everything else is a target.

That makes an emplacement a piece of ground rather than a creature. A room
with a turret in it is a room the operator can walk something *into* — lead a
hunter past one and the hunter is the turret's problem, which is the only way
in the game to be rid of one.

### An emplacement, rather than a contact — the turret

A **Sentry turret** (`<`) is painted like a contact and behaves like nothing
else that is. It crosses no ground at all: it is bolted where the mark was
put, it has no `wake` and no `range` because neither means anything to
something that never walks, and a route past one is exactly the route it
always was, except that the turret is standing in it and will not give
ground.

What it does instead is lay onto whatever it can see and put a round through
it. The line has to be as clear as a reading would be — **what stops sight
stops a round**, and what sight crosses (mesh, a console, a desk, sandbags) it
fires straight over. Because the optics are symmetric, a barrel the operator
can watch coming round is a barrel coming round onto the unit: the swing, and
the `warm` it holds a mark for before firing, are the whole of the warning
anything gets.

| Setting | Means |
|---------|-------|
| `gun.range` | Tiles it reaches |
| `gun.warm`  | Seconds it holds a mark before the round goes |
| `gun.cool`  | Seconds between rounds |
| `gun.spin`  | Radians a second it lays round onto a new mark |
| `hull`      | Rounds it takes to put *it* down — a turret is worth three |

A round takes `hull` off whatever it hits, and what runs out of hull is off
the deck. The unit has no hull: a round that reaches it ends the run.

The tracker reads movement, and a turret does not move — **so nothing on a
deck is more dangerous to walk up on, and none of it shows on the screen.**
Corners, doorways and anything solid are the answer to one; so is the other
end of a long room, because `gun.range` runs out.

### Picked up, and put down somewhere else — the drone

A **Security drone** (`z`) follows like a hunter and cannot end a run. It
takes hold of the chassis instead and carries it about the deck for
`carries.hold` seconds — a leg at a time, picking somewhere new each time it
arrives — and sets it down wherever that runs out. Seven to twenty squares of
deck, in practice, and quite possibly the far side of a door the unit spent
five minutes getting through. Walking into one is every bit the invitation
that letting it come to you is.

While it has hold, the movement keys stop being movement and become the
**struggle**: press them and the grip gives, `carries.struggle` presses and it
breaks where the unit hangs. Holding a key down does nothing — the struggle
counts presses, so shaking one off is the operator doing something rather than
leaning on an arrow key. `[E]` and the jump answer nothing at all while the
deck is not under the chassis.

Everything else still runs. The tracker stays up and still reads, the lamp
stays struck, and **being carried reads as movement** to anything that hunts by
it — so a deck with a drone and a hunter on it is a deck where being picked up
is what gets the unit found.

It sets the unit down on ground it could have walked to: a drone is no better
over a pit than the chassis is, so it never drops anything into one, and with
nowhere worth carrying the unit to it does not lift at all. Once it lets go it
keeps `carries.rest` seconds of distance before it will come in again, and it
is command side, so the turret in the corner never touches it.

### Nine squares of it — the block

A **Block** (`0`) is three tiles by three of freight that stopped answering
whatever used to steer it. The mark is the **middle** of it, so the eight
squares round the mark have to be ground it can hold — Survey says so when
they are not.

It does not steer and it does not chase. It takes a heading and runs along it
until the whole of its body is stopped, then it takes another; noticing the
unit changes only which heading it picks when it next has to pick one, and how
fast it runs. Whatever it arrives over is under it, and that is the run.

Because it needs the whole of its width, **a doorway is somewhere a block can
never be**, and so is anything a wall comes within a tile of. A deck built
with one on it is a deck with pockets in it — and crossing the open part of
that deck is a matter of watching which way the thing is pointed, which the
feed draws as a bar across its leading face.

`range` holds one to a stretch of deck the way it holds anything else, and it
holds it the way a block understands: the edge of the range is something it
**turns at**, exactly as it turns at a wall. So a block given a range of four
works a bay nine squares across and never comes out of it, and one left at `0`
has the run of everything its body fits down.

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

### A deck that is the car

Sometimes the car is not a tile on the deck — it is the deck. A map with
`"carriage": true` is the inside of one, and it has no `^` drawn on it, because
there is nothing in there to step into: the doors are already shut. A car
elsewhere that calls it sets the unit down on its `spawn`, aboard, and Survey
does not count the missing car against either end. Nothing rides back out —
whatever ends the segment does that — so it is the shape for a crossing the
unit spends time inside rather than passes through.

### The screen going black between them

A car, a flight of steps and a breach all carry a `fade`. Left off — the
default — a crossing cuts: the log writes `TRANSIT LINK ENGAGED` and the far
deck is simply there. Turned on, the screen goes to black across the crossing,
the deck is swapped behind it, and it comes back up on the other side. Nothing
answers the keys while the black is up, so it is also the way to give a
crossing weight: an ordinary shaft between two rooms should cut, and the one
that takes the unit off a deck for good should not.

### Words held on that black

A crossing that ends something wants more than a fade. `card` is what is
written on the black, and `cardsub` is the smaller line under it. While a card
is up the whole console goes with the deck — bars, feed, message log,
objective, coordinates, the lot — and what is left is the words on nothing and
a prompt. Any key brings the console back on the far side.

`card` only reads on a link whose `fade` is on. There is no black to write on
without one, and Survey says so rather than letting the words go missing.

Each card is shown **once in a run**, by its words. A shaft that reads
`PROLOGUE COMPLETE` is still a shaft: the unit may ride back up it and come
down again, and what it rode out of does not end twice.

The exit from `WaterTreatmentBottom` carries one:

```js
"0,27": {"dest":"Intermission", "fade":true,
         "card":"PROLOGUE COMPLETE", "cardsub":"Chapter One — Intermission",
         "label":"WATER-TREATMENT-EXIT"}
```

A console can end a segment on a card too — see **Desktops** below — which is
the other half of the same idea: the black is made by whatever ended the
thing, and the words sit on it either way.

A card is words, and nothing more: it is not where the run is kept. That is
the deck's `chapter`, and it is written on the way in rather than on the way
out — see **Chapters**.

### A poem held on that black

The run opens on a poem, on the same terminal the rest of the game is read
through. A deck can open on one too. Where a card is a few words a crossing
**ends** on, a poem is what the deck on the far side has to **say for itself**
before it is looked at: the unit crosses, the deck is swapped in behind the
black, and the poem is read out on that same black, a line at a time, with the
deck waiting behind it. Enter, Space or a press anywhere skips to the end of
it; nothing else answers while it is up, and the world on the far side is not
running yet, so nothing walks about while the operator is reading.

A poem is not a map field, because it is prose rather than a setting. It lives
in `index.html`, next to the one the run opens on, filed under the id of the
deck it belongs to:

```js
const POEMS = {
  AgriculturalDome12Fields: [
    'FIELD',
    '',
    'Fields of glistening wheat under a ceiling that pretends to be sky.',
    'Yet.',
    ...
  ],
};
```

One string per line, `''` for a stanza break, and the first line is the
heading. `CONFIG.poemLineMs` is how long the lines take to arrive and
`CONFIG.poemHoldMs` is how long the last one is held — both shared with the
opening poem, so the two read at the same pace.

Like a card, a poem wants a black to be written on, so it reads on a crossing
whose `fade` is on and on no other — a cut has nothing to hold. Any kind of
crossing will do: a car, a flight of steps or a **breach**, which is the one
that matters, because a deck the unit falls into is a deck it did not choose
and has never seen.

```js
"37,7": {"dest":"AgriculturalDome12Fields", "fade":true}
```

And like a card, each poem is read **once in a run**: a deck may be crossed
into twice and does not introduce itself twice. A card and a poem on the same
crossing both read, in that order — the words the last deck ended on, then the
words the next one begins with.

A poem is filed under a deck id, so the deck has to be registered in
`index.html` for the crossing to reach it at all. A breach naming a deck that
is not in the record is still a hole with nothing under it, and the fall ends
the run the way it always did.

## A flight of steps instead of a car

A **Stairway** (`s`) is the same route without the machinery. It joins two
decks exactly the way a car does — `[E]` from the steps or from the tile beside
them climbs, `dest` names the deck at the other end, and `arrive` and `label`
stencil it — but it runs on nothing. There is no circuit field on it, so no
fusebox can take it away, and no control drives it, because there is nothing
to drive: a button wired to a flight of steps signals a block that does not
answer, and Survey says so. That is the whole point of it. A deck whose power
the author has killed still has a way off it, and a car is a way off a deck
only while somebody has kept the lights on.

What it costs instead is time. The chassis climbs rather than walks, so a step
onto or off a flight takes about twice as long as an ordinary one — the same
`slow` a body across the deck carries.

A link only ever pairs with its own kind: a car comes out at a car and a flight
comes out at a flight, so two shafts stencilled alike never get crossed. Give
the flight on each deck the same `label` and the companionway runs both ways
with nothing else to keep in step. Failing that, the game takes a flight over
there whose own `dest` comes back here, then the first flight on the deck, and
finally the deck's landing record.

A flight of steps is also a landing beacon spot, the way a car is.

Survey flags a flight with no deck set, one climbing to a deck that is not
registered, one climbing to the deck it already stands on, one coming out at a
flight stencilled with a name the far deck has none of, and one coming out on
a deck with no flight on it at all — which is a companionway that only runs one
way. That last check reads cars too, so a car serving a deck with nothing to
arrive in is now flagged rather than quietly setting the unit down at that
deck's landing record.

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

## Chapters, and where a run is kept

A run is not written down square by square. It is written down at the seams.

A deck whose map carries a `chapter` is an **intermission**: the crossing
between one chapter and the next, and the only place the game keeps anything.

```js
"chapter": {"n": 1, "name": "Chapter One"}
```

`n` orders the chapters and `name` is what the one this seam opens is called.
A deck that names no chapter is ordinary ground, and crossing it keeps nothing.
`Intermission` — the service car at the bottom of Water Treatment — carries the
first of these, so the prologue ends by riding into a record.

The record is written the moment the unit is set down on the far deck, before
it has done anything there. So the car is kept with its sealed file still
sealed: beginning Chapter One again begins it with the reading still to do.

### What crosses the seam, and what does not

What is kept is what the game already says outlives the chassis — the same
things `[R]` does not take away:

* the name the operator registered,
* what the unit has been fitted with,
* what filing has given way, by console and file,
* what words a run has already ended on, so a card is not shown twice,
* which decks have already read their poem out, for the same reason,
* and whatever is in the manipulator.

The decks are **not** kept. A chapter begins as its author drew it: every door
shut, every fuse back in its clip, every contact back on its mark. This is the
whole reason the seam is the save point rather than the doorway between two
rooms — the decks behind a seam are not the decks in front of it, so there is
nothing to carry over and nothing to go stale.

It also means a chapter is played in one sitting. There is no halfway.

### Beginning a chapter again

The title screen offers the furthest chapter the browser has a record of:

```
PRESS ANY KEY
OR [C] TO CONTINUE — CHAPTER ONE
```

Any other key starts a new run, which is how the prologue is played — the
prologue sits in front of the first seam, so nothing was ever kept at it.

A record whose deck is no longer registered in `index.html`, one written by an
older build, and one the browser has mangled all read as no record at all: a
run that cannot be begun again honestly is not offered. A private window or a
full store means the run is simply not written down, and the log says so
rather than the game stopping.

`[R]` still re-initialises on the deck the unit is standing on, and after a
resume the seam **is** the deck the run began on — so `[R]` in the car puts the
unit back in the car.

### The chapter select that is not drawn yet

There is no chapter select screen. The data it needs is there:

| | |
|---|---|
| `ISO.chapters()` | every seam the game has, in chapter order — the whole shape, whatever a run has reached |
| `SAVE.chapters()` | every chapter this browser has a record of, in the same order, each row carrying its number, its name, the deck it begins on and when it was written |
| `SAVE.recent()` | the furthest of those, which is what the title screen offers |
| `SAVE.resume(deck)` | begin that chapter — from the title screen it takes the same dive a new run takes |
| `SAVE.clear()` | forget the lot |

A row on that screen is one entry from `SAVE.chapters()`, and picking it is one
call to `SAVE.resume(row.deck)`. Nothing else needs to be built for it to work.

Records are kept one per seam, under the deck that is the seam, so the record
of Chapter One is still there once Chapter Two has been reached — and a second
run reaching a seam overwrites that seam's record with its own, rather than
adding a row.

Survey flags two decks claiming the same chapter number, and a seam no other
deck crosses into — a chapter no run can reach is a chapter never written down.

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

## Desktops

One screen, opened two ways. A **Terminal** (`c`) with its `desktop` turned on
opens the machine behind the glass — the filing whoever sat here kept. A deck
with an `os` set lets `[O]` bring up the unit's own store, anywhere on it,
with nothing to walk to. Both hold the same kind of list and read the same
way; the rest of this section is true of either.

A terminal normally opens one small window holding one record. Turn its
`desktop` on and give it `files`, and `[E]` opens the machine instead, and the
unit goes through it the way whoever sat here did.

`files` is a list. One row is one file:

| Field     | Means                                                      |
|-----------|------------------------------------------------------------|
| `kind`    | `doc`, `image`, `locked` or `app`                          |
| `name`    | What it is called. A row with no name is not a file        |
| `folder`  | Which folder it sits in. Blank means loose on the desktop  |
| `pass`    | The word that opens it, on a `locked` file or an `app`     |
| `targets` | The blocks an `app` presses — any number                   |
| `text`    | What is in it, or the legend on a control's key            |

The editor keeps a row down to the fields its kind uses: a document has no
password box and nothing to wire, and the two appear as you change the kind.

**Folders are not rows.** A folder exists because something names it, and
stops existing when the last file naming it is renamed. That is the whole of
how deep a desktop goes — one folder, and a way back out. A crew terminal is
not a filesystem and the unit is not browsing for pleasure: it is looking for
one thing, and everything else on the desktop is what it has to read past to
find out there is one thing.

A **document** reads as text, in the same green as the log. An **image** is
kept column for column and drawn in a lighter phosphor, because the only ink
this machine has is characters — line a report or a schematic up in a monospace
editor and it comes out on the glass the way you drew it.

A **locked** file asks for its word and says nothing else. A wrong word is
rejected without a hint of how close it was. The word is never kept on the
machine holding the file — it is on something else the unit can reach, and
finding it is the work. Once a file gives way it stays given way for the run,
through a re-initialise as well: the word is the operator's now, and asking
twice is busywork.

`[W]`/`[S]` walk the list, `[E]` opens, `[ESC]` goes back out a folder and
then out of the desktop. While the desktop is up the keys belong to the
machine rather than to the chassis, and while it is asking for a word they are
letters — `[E]` types an `e`.

### A control filed on a desktop — `app`

A file that does rather than says. An **app** is a **Button** (`b`) that lives
on the glass instead of on a wall: it carries `targets`, the same list of
squares a button carries, and pressing it drives them through the same
drivers — bulkheads open and shut, platforms are called, a car is rung for.
One press, one line per thing that answered, exactly as a wall control reads.

Opening it does not press it. It opens on its key, with whatever its `text`
says as the legend above it and, under it, what the deck answered the last
time it was struck — the log is behind the desktop, and the operator is
looking at this. `[E]` presses, `[ESC]` backs out, and the key can be clicked
as readily as pressed.

| | Button on a wall | Control on a desktop |
|---|---|---|
| Pressed from | the square beside it | the console it is filed on, anywhere in its filing |
| Wants | nothing | its `pass`, if the author set one |
| Power | its own circuit | the console's — a dark console never opens at all |
| Reads as | `◎` amber on the deck | `◎` amber in the list, `CONTROL` beside it |

**Put a word on it and the press is what the operator has to earn.** A
`pass` on an `app` reads `LOCKED` in the list and asks the way a sealed file
does — the same prompt, the same flat rejection, the same word kept somewhere
else on the deck. What is behind it is a door rather than a page, which is the
whole difference: a sealed record is a thing to have read, and a locked
control is a thing to be able to do. Once released it stays released for the
run, a re-initialise included, and after that it is simply a key to press.

A control does **not** end a segment. A `card` on the console it is filed on
belongs to that console's sealed *record* — earning a control is the middle of
the work, and the run carries straight on to the press.

In the editor, wire one the way you wire a button: **Pick ▸** on the row, then
click the blocks. The list stays open so a bank of them goes in one pass, a
square clicked twice comes back out, and `Esc` ends it. The canvas draws the
lines from the console in a finer amber than a wall control's, because the
unit has to be at that glass — and past whatever word the file was shut with —
to use them. The survey checks them the way it checks a button's: a control
that signals nothing, or signals a square outside the record, or signals
something that does not answer signals, is reported.

A control **in the unit's own store** works the same and is pressed anywhere
on the deck, with no console to walk to and no circuit to wait on, because the
chassis is carrying it. That is a large key to hand an operator: it opens its
targets from across the deck. Give it a word, or keep it for the deck that
means it.

### The unit's own store — `[O]`

The same screen, brought up on nothing. A deck can carry an `os` of its own,
which is not a block at all: `[O]` opens it anywhere on that deck, with no
console to walk to and no circuit to wait on, because the chassis is carrying
it rather than the ship. `[O]` closes it again, and the key shows up in the
Objective row and the footer only on a deck that has one.

It sits at the top level of the map, beside `spawn` and `under`:

```js
"os": {
  "card": "THE CAR STOPS",
  "cardsub": "Chapter One — the deck beyond it is not yet built",
  "files": [ { "kind":"doc", "name":"READ ME FIRST.DOC", "folder":"", "pass":"", "text":"…" },
             { "kind":"locked", "name":"CYGNUS.SEALED", "folder":"", "pass":"UBC-1", "text":"…" } ]
}
```

`files` is exactly the list a console's desktop takes — controls included —
and opens exactly the same screen — dressed in the unit's paler phosphor rather than a crew
machine's green, because it is the unit's. What is different is the `card`:
when a sealed file on the **store** gives way, that is the end of the segment,
and the words are written on the black the way a link's card is.

**Most decks leave it empty**, and a deck that leaves it empty never mentions
it — `[O]` writes one line to the log and nothing else. It is for a segment
that shuts the unit in somewhere with time on its hands, not for the run at
large. In the editor it is a folded section low in the side pane, under
**LOCAL STORE**, which says on its heading how many files are in it.

That is how the **Intermission** car works. The car is sealed for transit and
there is nothing on its glass worth the walk: whatever the unit has to read on
the way down, it brought with it. The store holds eight files across three
folders; one of them is `CYGNUS.SEALED`, and the word that opens it is printed
on an image filed two folders away. Open it and the segment ends.

### A console that ends a segment

A terminal's `card` works the same way as the store's, for filing that belongs
to the ship rather than to the unit: give a console a `card` and the locked
file on its desktop becomes the end of something.

A card ends a segment; it does not keep the run. Those are two halves of the
same seam and they are set separately: the deck's `chapter` is what writes the
record down when the unit crosses in, and the card is what the segment ends
on once it has. The service car does both — see **Chapters**.

### What Survey asks of filing

Either kind, the same questions: files on a console with no desktop, a desktop
with nothing filed on it, two files with the one name in the one folder, a
file with nothing in it, a `locked` file with no word set — which anything at
all opens — and a `card` on filing that holds nothing sealed, so the card
could never come up.

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
tall opens as one door, whether the unit drives it or a button does. So does a
tank wall, which is what makes a vessel taking up half a deck drawable at all.

A block that states its own size can also state what each of its cells is drawn
as (`parts`). A flat list is one mark per cell along the block's facing, which
is what makes a forklift a body and a fork rather than two of the same square.
A list of lists is a row of marks per cell **across** it as well, which is what
a car needs: seven tiles by three, wheels at its corners, a cab and a bed. Both
turn with the block, because `parts` is read off the footprint rather than off
the map.

Survey flags a big block that reaches past the edge of the record, stands in a
wall, or overlaps another one.

## A tank, drawn as the wall round it

A **Tank wall** (`W`) is a wall that is not the wall of a room: it is the side
of a vessel, and what it holds back is on the other side of it. It stops the
unit and it stops the optics — welded plate reads as solid as it looks. What
makes it worth having rather than painting a settling tank out of `#` is that
it merges: draw the ring and the whole of it is one body, seams left out, so a
clarifier reads as a clarifier at any size instead of as a rectangle of
corridor wall. Meeting it says how big the copy is, the way crating does —
*Tank wall. Welded plate, seams weeping. Nothing reads through the volume
behind it. 8 × 6 units.*

Give it a `label` and the tank has a name. The stencil belongs to the **body**,
not to the tile it was clicked on, so a tank painted from forty tiles and named
on one of them answers to that name wherever the unit meets it — *…Stencilled
CLARIFIER 3.* A named tank is also somewhere a hull breach can `arrive` at,
like any other stencilled block; the unit comes down beside the wall rather
than inside it, plating being plating.

The **Circle** tool draws one in a gesture — load `W`, drag a square, and the
ring comes out closed and merged. What goes **inside** the ring is a decision,
and all three answers are reasonable:

| Inside | Reads as | Survey |
|--------|----------|--------|
| Unmapped (` `) | A sealed vessel — nothing in there is part of the deck | Quiet |
| Floor, ring closed | A room the author forgot to give a door | *N walkable tile(s) are sealed off from spawn* |
| Floor, with a `+` in the wall | A tank drained and opened up, that the unit can walk into | Quiet |

So an author who wants a tank that is simply *there* paints its inside out, and
an author who wants the unit to climb down into an empty one leaves a way in.
The middle row is the mistake, and Survey already names it.

One body, one name: Survey flags a tank stencilled two different ways, because
that is an author who meant to draw two tanks and drew one.

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

## A gate that runs

A cargo gate is shut or open the instant it is signalled. A **Sliding gate**
(`>`) is neither, for as long as it takes to cross itself: the press starts it
and the deck plays on, a tile at a time, from the end its `dir` points at
toward the far one. Shutting it runs the same way in reverse. The default is
`right`, which is a gate that opens left to right.

It is as big as you paint it, the way a cargo gate is — touching copies are one
gate and run together — and it has no handle: a gate that size answers a
control and nothing else, so Survey asks for a button wired to it. Wire the
line to any tile of the body; the whole runs.

Nothing else about it is special, which is the point. Every tile it has opened
is an opened tile from the moment it opens: the unit can walk in behind the
leading edge while the rest is still running, sight follows through the gap as
it widens, and a contact can come the other way. Signal it again while it is
under way and it turns round from where it stands. Pull the supply mid-run and
it stops where it stands — and it will not close on the unit: it holds where it
has got to and says so.

`locked` works on it as on any gate: nothing drives it, and Survey stops
counting the ground behind it as reachable. One body, one track — Survey flags
a gate whose tiles are pointed different ways, because it runs as a whole.

## A lock, rather than a circuit

Most of what a deck withholds, it withholds with power: a fuse somewhere else,
a circuit that reads dead. A **Locked door** (`K`) withholds with a lock. It
takes no circuit and no control: `[E]` tries whatever is in the manipulator
against it, the **Key** (`k`) it was cut for turns it, and nothing else does.

The two halves name each other with the same setting — `opens` on the door is
which key turns it, `opens` on the key is which lock it was cut for — and the
cuts themselves live in `KEYS` in `tiles.js`, alongside the fuse ratings. A new
one costs one entry there; the editor's pickers are built from that list.

A turned lock stays turned. The key is not spent, so one key opens every door
cut for it, and a door that has given way is an ordinary door from then on:
`[E]` swings it shut and open again, and a control wired to it drives it like
any other. Before that, a control is no help at all — the signal reaches the
door and the log says the lock does not answer to one. That is the whole
difference between a lock and a circuit: a circuit is somewhere else on the
deck, and a lock is in the manipulator or it is not.

Survey checks a lock the way it checks a fusebox way: a door whose key is
placed on no deck in the record is a door that never opens, and it says so.

## The command deck

Eight blocks that are the same eight blocks as everywhere else on the ship — a
desk, a barrier, a console, a car — built to a standard nobody applied
anywhere below. They are a family rather than a blue coat of paint on the old
ones because they are read together: a deck laid out of these is a deck the
crew ran the ship from, and the operator is meant to know that from the colour
before it has pressed anything.

The colour is the whole of the convention. Plating is green, controls are
amber, transit is mint, timber is brown — and nothing else on the ship is
blue, so blue reads as command and nothing else does. Three shades of it,
declared once in `tiles.js` and shared out: the **deep** blue of structure,
the **blue** of a working surface, and the **pale** blue of glass and painted
lettering.

| Block | Blue | What it is |
|-------|------|------------|
| **Command Desk** (`J`) | working | Three tiles of console run, turned with its `dir` the way an ordinary desk is. Solid, and low enough to read over |
| **Command Blockade** (`-`) | deep | A bar down across the way. As wide as it is painted, and one body: touching copies lift together |
| **Command Sandbags** (`(`) | deep | Filled bags, as big as the stack is painted. Solid, and low enough to read over — cover for whatever is behind them as much as for the unit |
| **Command Relay** (`q`) | pale | A mast with a console in its foot. Everything a terminal is |
| **Command Antenna** (`l`) | working | Three tiles by three of dish and mast, turned with its `dir`. It transmits |
| **Command Elevator** (`[`) | pale | A car, and the command deck's own |
| **Command Signage** (`N`) | pale | A painted board. Read like a sign: paint needs no circuit |
| **Command Terminal** (`I`) | working | The glass the deck was actually run from |

### The bar, and the two things that lift it

A **Command Blockade** has no handle. There is no `[E]` on one, the way there
is on a cargo gate: it is dropped and lifted from somewhere else, which is the
whole of what a blockade is for. Two things reach it, and they are the same
thing twice —

* a **Button** (`b`) on a wall, wired to it with **Pick ▸** like any other, and
* a **control filed on a console** — an `app` on a Command Terminal's or a
  Command Relay's desktop, which is a button that lives on the glass.

Both drive it through the same driver, so a bank of them opens as one press
and the log collapses to one line. Survey asks for one or the other, exactly
as it asks for a bulkhead, and reports a blockade nothing lifts. Painted from
several tiles it is **one body**: a line run to any tile of it lifts the whole,
and `locked` anywhere means locked everywhere.

### The mast that transmits

A **Command Antenna** carries a beacon's settings and behaves like one: while
its circuit is live it transmits, the unit reads it **through structure**, it
borrows the objective line if it has been given one, and it goes quiet once
the unit is within its `range` and there is nothing left to steer by. `[R]`
arms it again with everything else.

Which makes it the thing a command deck is navigated by. A dome has a
windmill; a command deck has three tiles by three of dish, transmitting from
wherever the author wanted the unit to end up.

### The rest of it

Nothing else in the family is new behaviour, and that is deliberate.

* A **Command Relay** and a **Command Terminal** are terminals: `title` and
  `text` for a plain record, or a `desktop` with `files` on it — documents,
  images, sealed files and controls — and a `card` for filing that ends a
  segment. A console that is dark is a console that never opens, so a relay on
  a circuit with no fuse in it is a mast the unit has walked to for nothing.
* A **Command Elevator** is a car, and it pairs with an ordinary one: a shaft
  is a shaft, so `[` at this end and `^` at the other is one route with one
  name stencilled on both.
* A **Command Signage** is a sign, and **Command Sandbags** are a hay bale in
  a different coat — as big as they are painted, solid, and low enough that
  sight crosses them. Which is worth knowing where there is a turret about:
  cover that reads clear is cover the gun fires over.

## The offices

Three blocks and a colour, for the decks between the plating and the command
deck — where the ship was administered rather than run. **Carpet** (`` ` ``) is
ordinary ground, a **Painted wall** (`]`) is ordinary wall, and a **Reception
desk** (`)`) is a counter as long as it is painted, one body, solid and low
enough to read over.

They are blue, and command is blue, and that is not the collision it looks
like. Command is the lit blue of glass and steel; this is the dull, deep,
unlit blue of paint and carpet. An operator that has crossed a deck of each
knows which it is standing on before it has read a stencil, which was always
the whole of what the colour was for.

The carpet is the one that is not only a colour. It is the **quietest ground
on the ship** — a step taken on it carries two squares where a step on plating
carries four — and on a deck with something listening on it that is the
difference between a route and a mistake. See **A deck that can be heard**.

## Somewhere to be that is not the deck

A **Hollow locker** (`{`) and a **Hollow desk** (`}`) are the crew locker and
the work surface with their backs taken out. They are the only two blocks on a
deck the unit can get *inside* rather than round: `[E]` from an adjacent square
folds the chassis in, `[E]` climbs it back out, and so does any movement key,
which is what makes coming out of one a single press rather than a hunt for the
right one.

While it is in there the deck stops being able to find it. Nothing hunting
works out a route to a unit that is not standing on the deck — a hunter loses
the trail, a stalker has nothing to pace, a drone has nothing to lift, a
ravager has nothing to walk to — and a turret has nothing to lay its barrel
onto. It is not a disguise and it is not a chance: it is simply not there.

What it costs is the feed. **Sight closes to one square**, which is the slats
and nothing else, so the operator that hides gives up everything it can read
about the deck in exchange for not being read off it. A locker is somewhere to
wait, and the interesting question is never whether to get in but when to come
out — because from in there the only thing still working is the message log and
the tracker, and the tracker only reads what is moving.

The one thing it is no answer to is a **Block**: nine squares of freight
arriving over the top of a locker has the unit under it whether the locker is
shut or not.

A hollow desk is three tiles long and turns with its `dir`, and **any tile of
it is a way in** — the unit presses the tile it is standing beside, not the one
the block was painted on. Survey flags either of them painted somewhere with no
ground beside it to work `[E]` from, which is a hiding place nothing ever gets
into.

## Water, and the line that is putting it there

A flood is not painted square by square. What an author paints is a **Broken
pipe** (`$`) and, if the deck wants one, whatever **Water** (`1`) is already
lying about; the water that ends up on the plating is worked out from those.

A pipe sweeps outward over anything the flood could run across, as far as its
own `reach`, one square every half-second or so — so a deck fills while it is
being crossed rather than being wet from the start. What the flood runs across
is ground the unit could stand on **and fire**, which it puts out on the way
past. What it does not run across is a wall, a shut bulkhead or a hole in the
deck: a door is as good a dam as it looks, and a room the unit has not opened
yet is a room that stays dry.

Water already on the deck is wet from the start and spreads nothing by itself.
What it does is **cost a pipe nothing to cross** — so a pool already lying
between a burst line and a doorway carries that line's reach out past where
bare plating would have stopped it. That is the whole of "water spreads
depending on how close it is to a broken pipe": what decides how far the flood
gets is the reach of the nearest live pipe, and what a painted pool does is
lend that reach a running start.

A pipe is **powered**, which is the other half of it. Put one on a circuit and
the flood runs only while that circuit is live — pull the fuse and the deck
**drains back the way it came**, faster than it filled. So a flooded room is
not a fact about a deck, it is a state of one, and somewhere else on the deck
there is a fusebox that decides which state it is in.

Water underfoot costs the unit two things. It is **slower to cross** than plain
deck, the way sludge is, and it is the **loudest ground on the ship** — a step
taken through it carries ten squares. A deck with a ravager on it and a burst
line running is a deck where the water is doing the hunting.

## Fire

**Fire** (`2`) is as solid as a wall while it burns. The unit will not cross
one, and neither will anything walking about — a contact routes round a fire
exactly as it routes round a bulkhead, so a fire is a wall an author can put
across a room without building one. A jump clears it the way a jump clears a
pit: sailed over, never landed on.

The only thing that answers a fire is **water**. Where the flood reaches one it
goes out, loudly, and what is left is wet ash — ordinary ground the unit walks
over from then on. Which makes the two of them a pair: a fire is a door, and
somewhere on the deck there is a pipe, and between them is an author deciding
in what order the room is allowed to be crossed. `[R]` lights every fire again
along with everything else.

## The beam across the way

A **Laser alarm** (`3`) does nothing whatever until something walks through it.
Then it sounds, and goes on sounding for a quarter of a minute, and what it is
really doing while it sounds is making **the loudest noise on the deck** once
every couple of seconds. So the cost of tripping one is not a line in the log.
It is every blind thing on the deck walking to where the unit is standing.

A control takes it down. It answers a signal the way a bulkhead does — from a
**Button** (`b`) on a wall, or from a control filed on a console's desktop, both
through the same driver — and a beam is as wide as it is painted and one body,
so a line across a corridor is disarmed with one press. Disarming the emitter
that is screaming is also what stops the screaming. It runs on power like
anything else: a beam on a dead circuit is a beam that is not there.

Survey asks for a control the way it asks for one on a bulkhead, and says what
the absence means — an alarm nothing disarms is a route that always sounds.

## A deck that can be heard

Everything else on a deck is *read*: the optics resolve it, the tracker reads
it, the record already held it. Sound is the one thing that is not. It goes out
from wherever it was made, in every direction, **through whatever is standing
in the way**, and reaches whatever is listening whether or not that thing could
ever have seen the square it came from. A wall is no answer to a noise.

How loud each thing is lives in one table, `NOISE` in `tiles.js`, rather than
buried in the driver that does it:

| Squares | What makes it |
|---------|---------------|
| 2       | A step on carpet |
| 4       | A step on plating — the quiet one, on purpose |
| 6       | Something small lifted off the deck, or set down on it |
| 7–9     | A step on sludge, debris, bone or open grating |
| 9       | A control struck, and a fire going out under water |
| 10      | Coming down off a jump — and any step through water |
| 11      | A fuse seated in a way, or pulled back out of one |
| 13      | Machinery: a platform called, a car, a duct cover, a station's arm, a flight of steps |
| 15      | A door, a gate or a bar driven |
| 60      | A laser alarm, which is the whole deck and a good way past the edges of it |

A tile says how loud a step onto it is with `noisy`, so what a deck sounds like
underfoot is a property of what it is built out of. Carpet is the quiet one and
water is the loud one, and everything between them is a decision about where
the route through a room ought to go.

The feed draws a ring off every noise, as wide as the noise carried, without
reference to the optics — because a unit that has just given itself away should
never have to guess that it has.

## The one that cannot see — the Ravager

A **Ravager** (`4`) has no optics and nothing that stands in for them. Nothing
about where the unit is standing reaches it: it will walk straight past a unit
in the open, at any range, indefinitely. What it has is a **mark** — the last
square the deck was heard doing something at — and it walks to that, stands
over it, casts about for a couple of seconds, and gives it up.

Everything in the table above is a mark. A door driven two rooms away is a
mark. A fuse seated in a fusebox is a mark. A control struck, a duct crawled, a
platform called, a body of water waded through, an alarm tripped: all marks,
and the freshest one wins, so a deck that goes on making noise leads one along
rather than letting it settle.

`hears` is the furthest a noise is worth listening for, in squares and through
anything at all. A ravager with `hears: 26` on a deck forty squares across is
one that hears most of what happens on it, and one with `hears: 10` is one an
operator can work round.

It **strikes at noise**, and this is the tight one: it closes whether the unit
is making a sound or not, and when it arrives it is standing over the unit
either way — but it can only place a chassis that is **making a noise**. So the
answer to a ravager is to go quiet, and it is worth being clear about how that
differs from the hunter:

| | Hunter (`e`) | Ravager (`4`) |
|---|---|---|
| Finds by | movement | noise |
| Loses by | the unit holding still | the deck going quiet |
| Can be beaten by | stopping | not doing anything loud |
| A shut door | keeps it out altogether | is nothing to it, and driving one is what called it |
| Standing still | is the whole defence | does nothing by itself: an alarm sounding gives the unit away where it stands |

Which is what makes the two of them worth putting on one deck. Everything that
answers a hunter — bolting for a door, driving it shut behind you, seating a
fuse to get the lights on — is a thing a ravager hears. And everything that
answers a ravager — standing on carpet, leaving the door where it is, staying
out of the water — is a thing that leaves a hunter's trail exactly where it
was.

A **hollow locker** answers both. So does a turret: a ravager belongs to
nobody, so leading one past a gun is the same trick it always was.

## A field to walk into

Crop is the one ground the unit can walk into that costs it something. **Wheat**
(`w`) and **Tomatoes** (`&`) are slower to cross than open earth and low enough
to read over. **Corn stalk** (`|`) is neither: it is `dense`, which means
walkable and opaque at once — standing crop well over the chassis, that sight
stops dead in.

That makes a cornfield the one piece of cover on an open deck. The unit in it
reads nothing out of it, and nothing reads into it: what the operator has while
crossing one is the square the chassis is standing on and the memory of what it
saw going in. A contact that walks past a field does not find what is in it,
and neither does the operator.

All three merge, so a field is as big as it is painted and the log says what
size the unit walked into. Around them, **Dirt** (`d`), **Grass** (`g`),
**Path** (`p`) and **Tire tracks** (`r`) are ordinary ground: they stop nothing,
and what they are for is telling the operator where it is standing, because a
dome with no landmark in it is the easiest place on a map to be lost. A
**Pond** (`P`) is a tank wall's opposite number out here — one body, as big as
it is painted, that sight crosses and the chassis does not.

The editor's **Survey** panel flags the things that break a map: a spawn inside
a wall — or on a pit or a breach, which is a run that ends or falls through the
deck the moment it begins — a beacon that cannot be reached, ground sealed off
from the rest (tinted red on the canvas), a button that signals nothing, a
terminal with no text, a note with nothing written on it, a bulkhead no button
opens, a tram whose rail runs into a wall, a vent with no far end or one that
comes out inside a wall, a station stocked with nothing, a beacon that spawn
already stands inside the range of, a car whose deck is not one the game will
have, a breach with nothing registered under it or nothing stencilled to come
down at, a forklift, desk or body with nowhere to lie, a contact bigger
than a square whose mark has not the room to stand it up in, a laser alarm no
control disarms, a broken pipe with no reach to flood with, and a hiding place
with no ground beside it to work `[E]` from. On power it flags a fusebox that feeds nothing, a way stencilled with no
circuit, a way that feeds a circuit nothing on the deck is on, a way whose fuse
is placed on no deck at all, and a block waiting on a circuit no box on its
deck feeds — the one that would otherwise look exactly like a block that
works.

Survey checks reach twice: once for a unit that can only walk, and once for one
with vault servos fitted. Ground that only the jump opens up is **gated**, not
sealed — tinted amber rather than red, and reported as needing the servos. That
way a map built around the jump reads as deliberate, and ground that nothing
can reach still reads as a mistake.
