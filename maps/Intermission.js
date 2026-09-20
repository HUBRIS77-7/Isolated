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
  "spawn": {"x": 1, "y": 6},
  "beacons": [],
  "os": {
    "card": "THE CAR STOPS",
    "cardsub": "Chapter One — the deck beyond it is not yet built",
    "files": [
      {"kind":"doc","name":"READ ME FIRST.DOC","folder":"","pass":"","text":"RECOVERY UNIT 07 — LOCAL STORE\n----\nThis is everything the chassis came down with. It is not much. Long-term travel took the rest of it.\n----\nOne file on this store will not open. It was sealed before the unit was woken, by something with the clearance to seal it.\n\nThe word that opens it is not kept on this store. Whoever sealed it was not careless. But they were in a hurry, and a hurry leaves things lying about in the other files.\n\nRead everything. The word is in here somewhere, written down by someone who did not know they were writing it down."},
      {"kind":"locked","name":"CYGNUS.SEALED","folder":"","pass":"UBC-1","text":"ATTACHED TO RECOVERY UNIT 07 PRIOR TO WAKE. ORIGIN NOT ON FILE.\n----\nYou were not sent to recover the ship.\n\nThe ship is not recoverable. Everyone who could have told you that is in the water you just walked out of, and has been for some time.\n\nYou were sent to recover what came aboard with it. It is still aboard. It has had twenty-five years and it has not been idle.\n\nIt knows the unit is awake. It has known since the pumps came back on.\n\nKeep walking.\n- Cygnus"},
      {"kind":"doc","name":"SERVICE RECORD.DOC","folder":"PERSONNEL","pass":"","text":"RECOVERY UNIT 07 — SERVICE RECORD\n----\nCHASSIS: intact. Long-term travel damage minimal.\nOPTICS: line of sight only. Last reading held five seconds.\nCARRIER: no long-range signal. Nothing leaves this hull.\n----\nSERVO BAY: empty.\nSENSOR BAY: empty.\n----\nBoth bays were stocked on departure. Neither was stocked on arrival. The manifest for the difference is on a deck this unit has not been to."},
      {"kind":"doc","name":"NIGHT SHIFT MANIFEST.DOC","folder":"PERSONNEL","pass":"","text":"WATER TREATMENT — NIGHT SHIFT, TRAVEL YEAR 25\n----\n14 assigned.\n14 reported for shift.\n0 reported off it.\n----\nNo transfer requests on file. No leave on file. No bodies logged to Medical.\n\nThe shift is still marked ON DUTY. Twenty-five years is a long shift."},
      {"kind":"doc","name":"SEAL NOTICE.DOC","folder":"LOGS","pass":"","text":"AUTOMATED: FILE SEALED ON THIS STORE\n----\nFILE: CYGNUS.SEALED\nSEALED BY: ENGINEERING COMMAND, CLEARANCE WITHHELD\n----\nPER STANDING ORDER, A SEAL SET IN TRANSIT TAKES ITS WORD FROM THE LAST ANOMALY DESIGNATION ON THE REPORT THAT PROMPTED IT.\n\nTHE REPORT IS FILED WITH THIS STORE. THE DESIGNATION IS PRINTED ON IT.\n\nENGINEERING COMMAND RECOMMENDS THE WORD BE COMMITTED TO MEMORY AND THE REPORT DESTROYED.\n----\nThe report was not destroyed."},
      {"kind":"doc","name":"DESCENT LOG.DOC","folder":"LOGS","pass":"","text":"CAR 14 — DESCENT\n----\n00:00  Doors seal. Car departs Water Treatment, lower deck.\n00:04  Car passes a deck. Board has no number for it.\n00:11  Car passes a deck. Board has no number for it.\n00:19  Car passes a deck. Board has no number for it.\n----\nThe log is still writing. The unit is going to be in here a while."},
      {"kind":"image","name":"PURITY REPORT 721.IMG","folder":"IMAGERY","pass":"","text":"  +------------------------------------------+\n  |  L.S.V MARE  /  WATER TREATMENT PLANT    |\n  |  PURITY REPORT 721   -   NIGHT SHIFT     |\n  +------------------------------------------+\n  |  TANK 07 ......................... PASS  |\n  |  TANK 09 ......................... PASS  |\n  |  TANK 11 ......................... PASS  |\n  |  TANK 12 ......................... HOLD  |\n  |                                          |\n  |  ANOMALY DESIGNATION ........... UBC-1   |\n  |  CLASSIFIED BY ....... ENGINEERING CMD   |\n  |                                          |\n  |  HANDWRITTEN, IN THE MARGIN:             |\n  |     \"it is not a contaminant\"            |\n  +------------------------------------------+"},
      {"kind":"image","name":"CHASSIS SCHEMATIC.IMG","folder":"IMAGERY","pass":"","text":"        RECOVERY UNIT 07  /  CHASSIS\n     +----------------------------------+\n     |            [ OPTIC ]             |\n     |     ________________________     |\n     |    |  MANIPULATOR ....... 1  |    |\n     |    |  SERVO BAY ........ --  |    |\n     |    |  SENSOR BAY ....... --  |    |\n     |    |  CARRIER .......... --  |    |\n     |    |________________________|    |\n     |          |          |            |\n     |        [ T ]      [ T ]          |\n     +----------------------------------+\n         TRACK ASSEMBLY  /  4 SEGMENT"}
    ]
  },
  "props": {
    "11,0": {"title":"CAR 14 — FLOOR INDICATOR","text":"SERVICE CAR 14\n----\nDEPARTED: WATER TREATMENT, LOWER DECK\nDESCENDING.\n----\nDOORS: SEALED FOR TRANSIT\nCALL PLATE: NO ANSWER UNTIL THE CAR IS STOPPED\n----\nThe indicator counts nothing. Whatever deck this car is passing, it is not one the board has a number for.","desktop":false,"files":[],"card":"","cardsub":"","circuit":""},
    "0,6": {"dest":"WaterTreatmentBottom","arrive":"WATER-TREATMENT-EXIT","fade":true,"card":"","cardsub":"","label":"WATER-TREATMENT-EXIT","circuit":""},
    "22,6": {"title":"CAR 14 — MAINTENANCE PANEL","text":"MAINTENANCE PANEL, SERVICE CAR 14\n----\nNO FAULTS LOGGED. NO FAULTS LOGGABLE: THE PANEL WAS NEVER WIRED TO ANYTHING BUT ITSELF.\n----\nThere is nothing on this glass worth the walk. Whatever the unit has to read on the way down, it brought with it. [O] brings the local store up.","desktop":false,"files":[],"card":"","cardsub":"","circuit":""},
    "13,8": {"title":"HANDWRITTEN NOTE","text":"Whoever reads this after me: the lift only runs the one way once the pumps are down. Sit tight in the hold.\nIt is not a long wait. It only feels like one.\nIf you have got something to read, read it."}
  },
  "rows": [
    "###########c###########",
    "#==LLL============AA==#",
    "#=====================#",
    "#=====================#",
    "#=====================#",
    "#=====================#",
    "^=====================c",
    "#=====================#",
    "#============n========#",
    "#====================,#",
    "#===================,,#",
    "#===BB===========B====#",
    "#######################"
  ]
});
