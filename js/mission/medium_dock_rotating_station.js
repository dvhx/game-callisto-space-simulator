// Mission - Board rotating station
"use strict";
// globals: document, window, Vector, setInterval, setTimeout, clearInterval

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.M2 = (function () {
    // source begin
    var self = SC.commonMission(),
        c1,
        player,
        rot;

    self.filename = 'medium_dock_rotating_station.js';
    self.category = 'Medium missions';
    self.title = 'Board rotating station';
    self.summary = 'Can you board to the rotating refuel station? You can only board from the back and your rotation speed must be the same.';
    self.description = 'Try to board to a rotating station. You must approach it from the back, be in the center line within one meter, you must be pointng in the same direction, and your rotation speed must be similar. This is very hard mission.';

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');
        c1 = self.find('C1');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        player.teleportNear('C1', 25, 30);
        player.fuel = 250;

        // rotating station near c1
        rot = self.place('Rot', 'C1', 0, 0);
        rot.pos = c1.pos
            .add(player.dir.multiply(30))
            .add(player.right.multiply(15 * (Math.random() - Math.random())))
            .add(player.up().multiply(15 * (Math.random() - Math.random())));
        rot.model = 'relay';
        rot.face(c1);
        rot.boardable = true;
        rot.fuel = 500;
        rot.fuelConsumption = 0.3;
        rot.fuelMax = 500;
        rot.thrust = Vector.create([0, 0, 0]);
        rot.thrustMax = 1200;
        rot.rot = Vector.create([2, 0, 0]);

        // only allow dock if rotation and angle matches
        rot.perfectBoard = true;
        SC.target = rot;
        self.customRadioSource = {
            freq: '533MHz',
            obj: rot,
            clipboardSource: 'Rotating station'
        };

        // guide
        self.guide('Board nearby rotating station. You can only board from back, must be aligned correctly and rotate in same speed.', ['Continue', 'Abort']);

        // checker
        self.checker = function () {
            if (SC.ship === rot) {
                self.checker = null;
                self.missionComplete('You successfully boarded rotating station!');
            }
        };

        // Cheats
        self.cheat(function () {
            player.pos = rot.pos.add(rot.dir.multiply(-2));
            player.face(rot);
            player.yawDegrees(7);
            player.pos.add(player.right.multiply(0.5));
        });
    };

    return self;
    // source end
}());
