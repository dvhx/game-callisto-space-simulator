// Mission 1 - reach C1 station on callisto orbit
"use strict";
// globals: document, window, Vector

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.H3 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        st = 'G1';

    self.filename = 'hard_refuel_g1.js';
    self.category = 'Transfer missions';
    self.title = 'Callisto/C1 to Ganymede/G1';
    self.summary = 'Fly to Ganymede\'s G1 station and refuel there. Distance 2158672km, deltaV 13km/s.';
    self.description = 'Transfer missions are always the same. They are also very hard. You start somewhere and your goal is to get to your destination. In the beginning of the mission you can choose how many boosters you use. There are two types of thrusters: Smaller have 73kN thrust, weights 100kg + 1380kg fuel, they last for 25s but you can stop them sooner than that. Bigger thrusters have 914kN, weights 470kg + 27000kg fuel and lasts for 170s. Booster fires in the same direction of recently used forward/back thruster. If you want to accelerate shortly tap thrust forward then press SRB button. After use SRB is discarded with unspent fuel as well.';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io',
            'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea',
            'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Place stations
        self.places('C1', 'C2', 'C3', 'I1', 'E1', 'G1');

        // Player
        player = self.place("Player", "Callisto", 6000, 220);
        player.face(st);
        SC.target = self.find(st);

        // Make time speed adjustable
        self.clockEditable(true);

        // refueling will end the mission
        self.event = self.eventRefuel(st);

        // Guide
        self.guide(self.summary, ['Continue', 'Abort']);
        self.guide(SC.srb.dialog);

        // Cheats
        self.cheatTarget(st);
    };

    return self;
    // source end
}());
