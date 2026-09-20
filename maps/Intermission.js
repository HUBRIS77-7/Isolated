/* ISOLATION map — edit by hand, or open editor.html and load this file.
   A placeholder: the deck the water treatment exit puts the unit down on
   until there is somewhere for it to go. */
ISO.register({
  "id": "Intermission",
  "name": "Intermission",
  "w": 31,
  "h": 15,
  "spawn": {
    "x": 3,
    "y": 7
  },
  "beacons": [],
  "props": {
    "1,7": {
      "dest": "WaterTreatmentBottom",
      "arrive": "WATER-TREATMENT-EXIT",
      "fade": true,
      "label": "INTERMISSION-CAR",
      "circuit": ""
    },
    "9,6": {
      "title": "HANDWRITTEN NOTE",
      "text": "Whoever reads this after me: the lift only runs the one way once the pumps are down. Sit tight in the hold.\nIt is not a long wait. It only feels like one."
    },
    "19,6": {
      "title": "TRANSIT HOLDING — SECTION 00",
      "text": "HOLDING BAY. NO CARGO ON MANIFEST.\n---\nSECTION NOT YET BUILT. THIS DECK STANDS IN FOR WHATEVER COMES NEXT.\n---\nThe carriage behind the unit still runs. [E] rides it back to WATERTREATMENTBOTTOM.",
      "desktop": false,
      "circuit": ""
    }
  },
  "rows": [
    "###############################",
    "#.............................#",
    "#.............................#",
    "#...L....................B....#",
    "#.............................#",
    "#.............................#",
    "#........n.........c..........#",
    "#^............................#",
    "#.............................#",
    "#.............................#",
    "#....B..................LL....#",
    "#.............................#",
    "#.............................#",
    "#.............................#",
    "###############################"
  ]
});
