/* ISOLATION map — edit by hand, or open editor.html and load this file.
   Chapter One, first deck: the inside of the service car, on its way down.
   Nothing here is a route. The doors are shut, the car is moving, and the only
   thing worth reading in it is the store the unit brought with it — [O] brings
   that up, anywhere on the deck, with no console to walk to. The segment ends
   when the sealed file on it gives way. */
ISO.register({
  "id": "Intermission",
  "name": "Service Car 14",
  "w": 23,
  "h": 13,
  "spawn": {"x": 11, "y": 1},
  "beacons": [],
  "carriage": true,
  "os": {
    "card": "PROLOUGE COMPLETE",
    "cardsub": "BEGIN CHAPTER ONE?",
    "files": [
      {"kind":"doc","name":"COMMUNICATIONS LOG","folder":"LOGS","pass":"","text":"COMMS LOG\n----\n00:00; COMMS WITH INSTELLAR COMMUNICATIONS NETWORK DISRUPTED.\n00:20; ATTEMPTING ACCESS TO ON-BOARD LONG-RANGE COMMUNICATIONS ANTENNA\n00:22; L-RCA ACCESS FAILED.\n--\n02:30; ATTEMPTING TO ACCESS SHIP-WIDE COMMUNICATIONS ARRAY\n02:35; COMMUNICATIONS ARRAY DAMAGED.\n02:45; COMMUNICATION RECIEVED FROM UNKNOWN SOURCE.\n02:55; QUARANTINED. SOURCE IDENTIFIED AS ONBOARD SHIP AI, CYGNUS."},
      {"kind":"locked","name":"SEALED COMMUNICATION ","folder":"","pass":"CYGNUS","text":"CONNECTION ESTABLISHED\nSOURCE: L.S.V COMMAND CORE, CYGNUS\n---\nHello?\nI don't think you have transmission capabilities considering your tumble through the roof in Engineering, but you should be able to pick this up.\n\nI'm Cygnus, the Mare's AI Core for their journey to 61 Cygnus and future travels across the system and constellation. We've been adrift for 863 years.\n\n25 years into our voyage, we were... boarded... At least, that's what I think happened. Whatever got onboard slaughtered the crew slowly, and it's been using the biomass from their bodies to fuel themselves until we get to 61 Cygni.\n\nYou have to get out of here. The fact you made it out of Engineering is testament enough. There should be a shuttle in the deployment bay. It has long range comms, and enough FTL fuel to get you back to Sol.\n\nBe safe.\n\n-CYGNUS \n"},
      {"kind":"doc","name":"TRAVEL LOG","folder":"LOGS","pass":"","text":"[LOG BEGIN]\n\nINITIAL DEPLOYMENT: [ERROR; UNKNOWN]\n\nNOTABLE EVENT: Gravitational Slingshot off of Procyon\n\nNOTABLE EVENT: Gravitational Slingshot off of Sirius\n\nNOTABLE EVENT: Entered SOL's SOI. Contacted by SAFFRON. Permitted Passage.\n\nNOTABLE EVENT: Gravitational Slingshot off of Ross 248. Now heading upwards.\n\nNOTABLE EVENT: Collision with unknown object.\n\n[LOG ENDS]"},
      {"kind":"doc","name":"Thoughts","folder":"PERSONAL","pass":"","text":"...\n...\n...\nI'm scared of this place.\nI don't like it.\nI've never been somewhere with the dead before.\nThe creatures are fine, but not the bodies.\nNo no no.\nNever bodies.\n---\nAt least I'm not alone out here. Going to try and find a way up to the ship's command. Probably find a map."},
      {"kind":"doc","name":"Memories","folder":"Personal","pass":"","text":"Fields of glistening wheat.\n...\nHmmm.\nNever been to planet for more than a couple of hours before. Especially not one with wheat.\n...\nHow strange."},
      {"kind":"doc","name":"SHIP-WIDE COMMUNICATIONS LOG","folder":"RECOVERED DOCUMENTS","pass":"","text":"07-09-25 (7 months, 9 days, 25 years into journey)\n------------------------\nENG-COM-NET: FAILED\nAGRI-COM-NET: UP.\nSEC-COM-NET: FAILED\nSCI-COM-NET: LOCKED DOWN\nGEN-COM-NET: UP\nCOMMAND-COM-NET: VIEW-ONLY\nPORT-COM-NET: FAILED."},
      {"kind":"doc","name":"Agriculture Resistence","folder":"RECOVERED DOCUMENTS","pass":"","text":"All survivors of D-Day, Agriculture Dome #12 is welcoming refuge. We can take up to 1200 more people before we will have to close down entry. \n\nDomes 1 through 7 have fallen to the invasion.\n\nDomes 8 through 9 are not open to refuge. \n\nSomething has happened to Domes 10 through 11."}
    ]
  },
  "props": {
    "11,0": {"title":"CAR 14 — FLOOR INDICATOR","text":"SERVICE CAR 14\n----\nDEPARTED: WATER TREATMENT, LOWER DECK\nDESCENDING.\n----\nDOORS: SEALED FOR TRANSIT\nCALL PLATE: NO ANSWER UNTIL THE CAR IS STOPPED\n----\nThe indicator counts nothing. Whatever deck this car is passing, it is not one the board has a number for.","desktop":false,"files":[],"card":"","cardsub":"","circuit":""},
    "13,8": {"title":"Poison?!?!","text":"THAT'S HOW IT ENDS?\nPOISON?\nFUCKING POISON?\nThose damn stalking bastards!\nTheir touch is toxic, FATAL.\nI felt off after I rushed past a horde of them in Engineering Command, but... FUCK!\nI can't die here, not like this.\n\nFUCK FUCK FUCK\n\n- Martin"}
  },
  "rows": [
    "###########c###########",
    "#==LLL============AA==#",
    "#=====================#",
    "#=====================#",
    "#=====================#",
    "#=====================#",
    "#=====================#",
    "#=====================#",
    "#============n========#",
    "#===========SXX======,#",
    "#===================,,#",
    "#===BB===========B====#",
    "#######################"
  ]
});
