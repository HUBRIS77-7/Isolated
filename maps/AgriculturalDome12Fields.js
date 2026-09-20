/* ISOLATION map — edit by hand, or open editor.html and load this file.
   Agriculture Dome #12, where the breach in the floor of Service Car 14 comes
   down. The car names this deck and fades into it, and the deck has a poem
   filed under its id in index.html, which is read out on that black before the
   dome is looked at — see **A poem held on that black** in this folder's README.

   What is drawn here is the dome and nothing else: the wall it curves round,
   the floor inside it, the plating that came down with the unit, and the
   landing plate the breach aims at, so the fall has somewhere real to end. The
   fields themselves, and the way on out of them, are not drawn yet.

   The plate at 22,14 is a beacon with its transmitter off: it says nothing and
   it does nothing, it is only stencilled DOME12-LANDING, which is the name the
   breach arrives at — that is what puts the unit down in the middle of the
   dome rather than at whatever the deck would otherwise call its landing. */
ISO.register({
  "id": "AgriculturalDome12Fields",
  "name": "Agriculture Dome #12//FIELDS",
  "w": 45,
  "h": 29,
  "spawn": {"x": 22, "y": 14},
  "beacons": [],
  "props": {
    "22,14": {"range":0,"armed":false,"objective":"","label":"DOME12-LANDING"}
  },
  "rows": [
    "                                             ",
    "                 ###########                 ",
    "             ####...........####             ",
    "          ###...................###          ",
    "        ##.........................##        ",
    "      ##.............................##      ",
    "     #.................................#     ",
    "    #...................................#    ",
    "   #.....................................#   ",
    "   #.....................................#   ",
    "  #.......................................#  ",
    "  #.......................................#  ",
    " #...................,.,...................# ",
    " #..................,...,..................# ",
    " #.................,..*....................# ",
    " #...................,.,.,.................# ",
    " #.........................................# ",
    "  #.......................................#  ",
    "  #.......................................#  ",
    "   #.....................................#   ",
    "   #.....................................#   ",
    "    #...................................#    ",
    "     #.................................#     ",
    "      ##.............................##      ",
    "        ##.........................##        ",
    "          ###...................###          ",
    "             ####...........####             ",
    "                 ###########                 ",
    "                                             "
  ]
});
