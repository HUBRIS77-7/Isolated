/* ISOLATION map — edit by hand, or open editor.html and load this file. */
ISO.register({
  "id": "ENG-COMMAND",
  "name": "ENGINEERING COMMAND",
  "w": 44,
  "h": 18,
  "spawn": {"x": 1, "y": 1},
  "beacons": [],
  "props": {
    "1,1": {"dest":"ENGLVL2","arrive":"","label":"ENGINEERING COMMAND ELEVATOR"},
    "9,1": {"targets":[{"x":10,"y":3}],"label":"VESTIBULE BULKHEAD"},
    "13,1": {"title":"Engineering Command: Standing Order 4","text":"Engineering Command is a restricted deck. Clearance is checked at the vestibule bulkhead, not at the car.\n\nAll maintenance traffic is to be logged against a work order before it comes up the primary shaft.","desktop":false},
    "30,1": {"title":"Reactor Stability Watch","text":"Travel Year 12\n-------------------------\nEngineering Level 2 continues to report Tokamak decay ahead of projection.\n\nExo-Engineering has cleared the rear sensor array twice. The readings did not move.\n\nCommand position: the array is sound. The source is external.","desktop":false},
    "1,3": {"targets":[{"x":1,"y":1}],"label":""},
    "10,3": {"open":false},
    "20,16": {"title":"Deck Roster (Partial)","text":"ENGINEERING COMMAND \u2014 ON DECK\n\n* Cmdr. Iyer ......... not at station\n* Lt. Okonkwo ....... not at station\n* Lt. Vasquez ....... not at station\n\nLast roster sweep did not complete.","desktop":false}
  },
  "rows": [
    "############################################",
    "#^.......b#..c................c.....LLL....#",
    "#.........#................................#",
    "#b........%................................#",
    "#.........#................................#",
    "#.........#................................#",
    "###########................................#",
    "#..........................................#",
    "#..........================================#",
    "#..........................................#",
    "#..........................................#",
    "#........................CC................#",
    "#........................CC................#",
    "#..........................................#",
    "#..........................................#",
    "#.............BB...........................#",
    "#...................c......................#",
    "############################################"
  ]
});
