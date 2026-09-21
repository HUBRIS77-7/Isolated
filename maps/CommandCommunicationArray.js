/* ISOLATION map — edit by hand, or open editor.html and load this file.
   The far end of the command deck: a gantry out onto the hull, a plate with a
   hole through it, and twelve tiles by twelve of mast at the end of it. */
ISO.register({
  "id": "CommandCommunicationArray",
  "name": "COMMAND COMMUNICATION ARRAY // THERE IS NO OTHER WAY",
  "w": 64,
  "h": 40,
  "spawn": {
    "x": 3,
    "y": 26
  },
  "beacons": [],
  "props": {
    "2,26": {
      "dest": "CommandPlateau",
      "arrive": "",
      "fade": true,
      "card": "",
      "cardsub": "",
      "label": ""
    },
    "4,15": {
      "ways": [
        {
          "circuit": "HULL",
          "rating": "a30"
        }
      ],
      "supply": "",
      "label": "HULL SERVICES"
    },
    "13,15": {
      "ability": "parry",
      "label": "REACTIVE PLATING"
    },
    "2,15": {
      "title": "COMMAND COMMUNICATION ARRAY",
      "text": "AIRLOCK 7 — HULL SERVICES BEYOND THIS POINT.\n\nNo atmosphere past the gantry. No sound past the gantry.\n\nATTITUDE PORTS ON THE GANTRY FIRE WITHOUT WARNING TO THE DECK. THEY ARE NOT ON HULL SERVICES AND THEY CANNOT BE SHUT OFF FROM HERE.\n\nThe array runs off its own panel, at the foot of the mast."
    },
    "14,26": {
      "title": "SCRATCHED INTO THE PAINT BESIDE THE BOX",
      "text": "Hull services runs the platforms AND the bus lines. One fuse, both.\n\nWith it in, ride across. With it out, walk the low bridge.\n\nDon't stand on a line and think about it."
    },
    "23,20": {
      "every": 7,
      "warn": 2,
      "burn": 2,
      "phase": 0,
      "label": "",
      "circuit": ""
    },
    "23,21": {
      "every": 7,
      "warn": 2,
      "burn": 2,
      "phase": 0,
      "label": "",
      "circuit": ""
    },
    "23,22": {
      "every": 7,
      "warn": 2,
      "burn": 2,
      "phase": 0,
      "label": "",
      "circuit": ""
    },
    "27,20": {
      "every": 7,
      "warn": 2,
      "burn": 2,
      "phase": 4,
      "label": "",
      "circuit": ""
    },
    "27,21": {
      "every": 7,
      "warn": 2,
      "burn": 2,
      "phase": 4,
      "label": "",
      "circuit": ""
    },
    "27,22": {
      "every": 7,
      "warn": 2,
      "burn": 2,
      "phase": 4,
      "label": "",
      "circuit": ""
    },
    "25,22": {
      "rating": "a30",
      "label": ""
    },
    "39,31": {
      "label": "LOW BRIDGE",
      "circuit": "HULL"
    },
    "40,31": {
      "label": "",
      "circuit": "HULL"
    },
    "37,21": {
      "dir": "right",
      "dist": 4,
      "dwell": 3,
      "circuit": "HULL"
    },
    "33,10": {
      "dir": "down",
      "dist": 21,
      "every": 11,
      "warn": 2,
      "phase": 0,
      "label": ""
    },
    "45,10": {
      "dir": "down",
      "dist": 21,
      "every": 13,
      "warn": 2,
      "phase": 6,
      "label": ""
    },
    "35,29": {
      "rating": "a15",
      "label": ""
    },
    "34,24": {
      "wake": 17,
      "range": 11,
      "label": ""
    },
    "48,29": {
      "label": "OBSERVATION GLAZING"
    },
    "48,12": {
      "dir": "right",
      "range": 4,
      "armed": true,
      "objective": "CARRIER RESTORED. THE ARRAY IS TRANSMITTING.",
      "label": "PRIMARY",
      "circuit": "ARRAY"
    },
    "49,26": {
      "dir": "right",
      "ways": [
        {
          "circuit": "ARRAY",
          "rating": "a15"
        }
      ],
      "supply": "",
      "label": "ARRAY PANEL"
    },
    "53,9": {
      "label": "NORTH WALK",
      "circuit": "HULL"
    },
    "53,10": {
      "label": "",
      "circuit": "HULL"
    },
    "53,11": {
      "label": "",
      "circuit": "HULL"
    },
    "54,9": {
      "label": "",
      "circuit": "HULL"
    },
    "54,10": {
      "label": "",
      "circuit": "HULL"
    },
    "54,11": {
      "label": "",
      "circuit": "HULL"
    },
    "55,9": {
      "label": "",
      "circuit": "HULL"
    },
    "55,10": {
      "label": "",
      "circuit": "HULL"
    },
    "55,11": {
      "label": "",
      "circuit": "HULL"
    },
    "56,9": {
      "label": "",
      "circuit": "HULL"
    },
    "56,10": {
      "label": "",
      "circuit": "HULL"
    },
    "56,11": {
      "label": "",
      "circuit": "HULL"
    },
    "60,9": {
      "label": ""
    },
    "47,9": {
      "title": "ARRAY CONTROL",
      "text": "MAST: PRIMARY. BEARING HELD.\n\nCARRIER: NONE.\n\nThe drive is still pointing it. It has been pointing it at nothing for a long time, and the ports on the gantry are what it is pointing it with.\n\nSeat the panel and it will have something to point.",
      "desktop": false,
      "files": [],
      "card": "",
      "cardsub": "",
      "circuit": ""
    },
    "57,26": {
      "wake": 17,
      "range": 10,
      "label": ""
    }
  },
  "rows": [
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                              ##################",
    "                                              #I=====ẋẋẋẋ===ǒǒ=#",
    "                               ṽṽǎṽṽṽṽ    ṽṽṽǎ#======ẋẋẋẋ====ǒ=#",
    "                               ṽṽṽṽṽṽṽ    ṽṽṽṽ#======ẋẋẋẋ======#",
    "                               ṽṽṽǒǒǒṽ    ṽṽṽṽ#=ā==============#",
    "                               ṽṽṽǒǒǒṽ    ṽṽṽṽ#================#",
    " ################              ṽṽṽǒǒǒṽ    ṽṽṽṽ#================#",
    " #N=u========M==#              ṽṽṽṽṽṽṽ    ṽṽṽṽ#================#",
    " #==============#              ħħħħħħħ    ħħħħ#================#",
    " #==============#              ħħħħħħħ    ħħħħ#================#",
    " #==============#              ħħħħħħħ    ħħħħ#================#",
    " #==============#              ħħħħħħħ    ħħħħ#================#",
    " #==============#ħħħħħħṁħħħṁħħħħħħħħħħ    ħħħħ#================#",
    " #==============+ħħħħħħṁħħħṁħħħħħħħħħť    ħħħħ+================#",
    " #==============#ħħħħħħṁħfħṁħħħħħħħħħħ    ħħħħ#================#",
    " #==============#              ħħħħħħħ    ħħħħ#================#",
    " #==============#              ħħħżħħħ    ħħħħ#================#",
    " #==============#              ħħħħħħħ    ħħħħ#================#",
    " #s===========n=#              ħħħħħħħ    ħħħħ#==ü=======ż=====#",
    " #==============#              ṽṽṽṽħṽṽ    ṽṽṽṽ#================#",
    " ################              ṽṽṽṽħṽṽ    ǒǒṽṽ#================#",
    "                               ṽṽṽṽfṽṽ    ǒǒṽṽ##ïïïïïïïïïïïïïï##",
    "                               ṽṽṽṽṽṽṽ    ṽṽṽṽ                  ",
    "                               ṽṽṽṽṽṽṽṽẋẋṽṽṽṽṽ                  ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                ",
    "                                                                "
  ]
});
