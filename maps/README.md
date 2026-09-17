# Maps

Everything the unit can walk on lives here. A map is plain text — one character
per tile — so it reads fine in a diff and can be edited by hand or with the
editor.

## Making one

Open **`editor.html`** in a browser (no server needed). Draw, then
**Download .js** and drop the file into this folder. Register it by adding one
line to `index.html` next to the others:

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
                                     // reachable tile ≥6 steps away.
  "rows": ["  ,,,.....  ", ...]      // exactly h strings of exactly w chars
});
```

## Tiles

| Char | Tile     | Walk | Notes                                   |
|------|----------|------|-----------------------------------------|
| ` `  | Unmapped | no   | Negative space — gives a map its shape   |
| `.`  | Floor    | yes  |                                          |
| `,`  | Debris   | yes  |                                          |
| `=`  | Plating  | yes  |                                          |
| `+`  | Doorway  | yes  |                                          |
| `#`  | Wall     | no   |                                          |
| `%`  | Bulkhead | no   |                                          |
| `~`  | Sludge   | yes  | Logs a line the first time it is crossed |
| `!`  | Hazard   | yes  | Logs a warning the first time            |
| `o`  | Relay    | no   |                                          |

To add a tile type, add one entry to `TILES` in `tiles.js`. It shows up in the
editor palette on its own and the game obeys it straight away — walkability,
colour, glyph and the line it writes to the message log all come from there.

The editor's **Survey** panel flags the things that break a map: a spawn inside
a wall, a beacon that cannot be reached, ground sealed off from the rest
(tinted red on the canvas).
