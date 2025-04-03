// Mission 2 - find lost radio beacon near c1
"use strict";
// globals: document, window, Vector, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.M3 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        beacon;

    self.filename = 'medium_lost_radio_beacon.js';
    self.category = 'Medium missions';
    self.title = 'Find beacon';
    self.summary = 'Find lost radio beacon near C1 station.';
    self.description = 'We released one radio beacon (498MHz) but forget to mount retroreflector on it so it is not visible on radar. It is 1-2 km from C1 station, but you won\'t see it unless you are 500m or closer. Use radio receiver to locate it and get within 10m distance.';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        player.teleport('C1', 10);

        // Beacon
        beacon = self.place('Beacon', 'C1', 0, 0);
        beacon.teleportNear('C1', 1000, 2000);
        beacon.model = 'beacon';
        beacon.lidarable = false;
        beacon.maxRenderDistance = 500;
        self.customRadioSource = {
            freq: '498MHz',
            obj: beacon,
            clipboardSource: 'Lost radio beacon'
        };

        // check mission end
        self.checker = function () {
            if (beacon && player.distanceTo(beacon) <= 10) {
                self.checker = null;
                self.missionComplete('You found it!');
            }
        };

        // guide
        self.guide('Radio beacon was lost near C1 refueling station, can you help us finding it?', ['Continue', 'Abort']);
        self.guide('It transmit at 498MHz, it should be within 2km of the station?', ['Continue']);
        self.guide('Unfortunately it doesn\'t have retroreflector so you won\'t see it on lidar.', ['Continue']);
        self.guide('It is also very small so you will only see it when you are less than 500m from it.', ['Continue']);
        self.guide('Find it and get within 10m of it. Good luck!', 'Continue');

        // Cheats
        self.cheatTarget(beacon);
    };

    return self;
    // source end
}());
