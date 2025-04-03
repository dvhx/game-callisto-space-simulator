// Mission 1 - reach C1 station on callisto orbit
"use strict";
// globals: document, window, Vector

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.E1 = (function () {
    // source begin
    var self = SC.commonMission(),
        c1,
        c2,
        c3,
        player;

    self.filename = 'easy_refuel_c1.js';
    self.category = 'Easy missions';
    self.title = 'Refuel at C1';
    self.summary = 'Fly to nearby C1 station and refuel there.';
    self.description = 'This is your first real mission. You are on 6000 km orbit around Jupiter\'s moon Callisto and you need to find and reach the C1 refueling station, it should be about 10km away. Park within 3 meter distance and refuel using REF button until the tank is full. Station must remain in the lidar during refuel and you must stay within 3m of the station! Don\'t confuse C1, C2 and C3, you can only refuel at C1!';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        c1 = self.place("C1", "Callisto", 6000, 220.1);
        c1.refuel = true;
        c1.model = 'station';
        c2 = self.place("C2", "Callisto", 5000, 235);
        c2.refuel = true;
        c3 = self.place("C3", "Callisto", 4000, 190);
        c3.refuel = true;

        // Player
        player = self.place("Player", "Callisto", 6000, 220);
        player.face('Jupiter');

        // Make time speed adjustable
        self.clockEditable(true);

        // refueling will end the mission
        self.event = self.eventRefuel('C1');

        // Guide
        self.guide('You are on 6000km Callisto orbit near C1 refueling station. Find it, get within 3m and fully refuel your ship.', ['Continue', 'Abort']);

        // Cheats
        self.cheatTarget(c1);
    };

    return self;
    // source end
}());
