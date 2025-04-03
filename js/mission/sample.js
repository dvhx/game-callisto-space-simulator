// Sample mission, used as preset in editor
"use strict";
// globals: document, window, Vector

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.S = (function () {
    // source begin
    var self = SC.commonMission(),
        player;

    self.filename = 'sample.js';
    self.category = 'Custom missions';
    self.title = '{MISSION_TITLE}';
    self.summary = 'Here write short summary.';
    self.description = 'Here write long description of the mission!';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places("C1", "C2", "C3");

        // Player
        player = self.place("Player", "Callisto", 6000, 220);
        player.teleport('C1', 15);

        // Make time speed adjustable
        self.clockEditable(true);

        // refueling will end the mission
        self.event = self.eventRefuel('C1');

        // Guide
        self.guide('Here write what user should do.', ['Continue', 'Abort', 'Edit']);
        self.guide('Or some steps or something.', 'Continue');
    };

    return self;
    // source end
}());
