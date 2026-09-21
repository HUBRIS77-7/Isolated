/* ISOLATION map — edit by hand, or open editor.html and load this file.
   Placeholder. Nothing is drawn here yet beyond four walls and a spawn. */
ISO.register({
  "id": "Intermission2",
  "name": "INTERMISSION 2 // INFORMATION THEORY",
  "w": 20,
  "h": 30,
  "spawn": {"x": 10, "y": 6},
  "beacons": [],
  "carriage": true,
  "chapter": {"n": 2, "name": "CYGNUS"},
  "os": {
    "card": "",
    "cardsub": "",
    "files": [
      {"kind":"doc","name":"CYGNUS 1-1","folder":"COMMUNICATIONS","pass":"","targets":[],"text":"CYG: Hello?\nCYG: I can tell you're picking up these messages, but it still seems that your transmitter is broken.\nCYG: You're coming up to the Command Tower now. This won't take you all the way up to the Plateau, though, the shaft is blocked. You'll have to get off mid-way.\n---\nCYG: There's nothing good at the mid-way."},
      {"kind":"doc","name":"ELEVATOR LOG","folder":"LOGS","pass":"","targets":[],"text":"07-27-25 (7 Months, 27 days, 25 years into journey)\n\nElevator called to Agri-Dome #11\n\n3 personnel board.\n\nElevated to Command Plateau.\n\n----------------------\n07-28-25 (7 Months, 28 days, 25 years into journey)\n\nElevator called to Agri-Dome #11\n\n9 Unknown Biological Organisms board\n\nElevated to Command Plateau.\n\nDescended to Mid-Way\n----------------------\n07-30-25 (7 Months, 30 days, 25 years into journey)\n\nElevator called to Agri-Dome #11\n\n1 Personnel board, identified as Patricia McEngle.\n\nElevated to Midway."}
    ]
  },
  "props": {
    "10,0": {"title":"COMMAND CONSOLE","text":"No readable record.","desktop":true,"files":[{"kind":"app","name":"ELEVATORDOOR","folder":"","pass":"","targets":[{"x":7,"y":11}],"text":""}],"card":"","cardsub":"","circuit":""},
    "3,5": {"dir":"down","label":""},
    "16,5": {"dir":"down","label":""},
    "7,11": {"dir":"right","open":false,"locked":false,"circuit":""},
    "8,11": {"dir":"right","open":false,"locked":false,"circuit":""},
    "9,11": {"dir":"right","open":false,"locked":false,"circuit":""},
    "10,11": {"dir":"right","open":false,"locked":false,"circuit":""},
    "11,11": {"dir":"right","open":false,"locked":false,"circuit":""},
    "12,11": {"dir":"right","open":false,"locked":false,"circuit":""},
    "13,11": {"dir":"right","open":false,"locked":false,"circuit":""},
    "14,11": {"dir":"right","open":false,"locked":false,"circuit":""},
    "5,27": {"dest":"CommandMidTower","arrive":"","fade":true,"card":"","cardsub":"","label":""}
  },
  "rows": [
    "##########I#########",
    "#..................#",
    "#..................#",
    "#..................#",
    "#..................#",
    "#..J............J..#",
    "#..................#",
    "#..................#",
    "#..................#",
    "#......((....((....#",
    "#....((........((..#",
    "#######>>>>>>>>#####",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "      #........#    ",
    "    ###........#    ",
    "    #s#........#    ",
    "    #.+........#    ",
    "    ############    "
  ]
});
