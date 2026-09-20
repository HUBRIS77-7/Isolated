/* ISOLATION map — edit by hand, or open editor.html and load this file.
   Placeholder. A bare stretch of TAR between Agriculture Dome #12 and
   Agriculture Dome #11 — nothing is drawn here yet beyond the flight at
   each end. */
ISO.register({
  "id": "TunnelAccessRoute",
  "name": "Tunnel Access Route//TAR-12-11",
  "w": 13,
  "h": 7,
  "spawn": {"x": 6, "y": 2},
  "beacons": [],
  "props": {
    "0,3": {"dest":"AgriculturalDome12Fields","arrive":"","fade":true,"card":"","cardsub":"","label":""},
    "12,3": {"dest":"AgriculturalDome11","arrive":"","fade":true,"card":"","cardsub":"","label":""}
  },
  "rows": [
    "#############",
    "#...........#",
    "#...........#",
    "s...........s",
    "#...........#",
    "#...........#",
    "#############"
  ]
});
