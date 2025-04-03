// Mission 2 - find lost radio beacon near c1
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.E5 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        eq;

    self.filename = 'easy_equipment_photos.js';
    self.category = 'Easy missions';
    self.title = 'Equipment photos';
    self.summary = 'A friend of mine wants to buy some decommissioned weather satellite. But first he wants to se the pictures of the equipment.';
    self.description = 'A friend of mine wants to buy some space equipment, he said it is some kind of decommissioned weather satellite but first he wants to see the pictures of it. Find it and create 6 photographs, each from one side (left, right, up, down, front, back). The photos must be directly from the side, not at angle, and not too far away or too close. Then submit the report. The equipment is kilometer or so from C1. Remember to sign the report.';

    self.photos = [{
        Side: "Front",
        Photo: "NOT TAKEN"
    }, {
        Side: "Back",
        Photo: "NOT TAKEN"
    }, {
        Side: "Left",
        Photo: "NOT TAKEN"
    }, {
        Side: "Right",
        Photo: "NOT TAKEN"
    }, {
        Side: "Up",
        Photo: "NOT TAKEN"
    }, {
        Side: "Down",
        Photo: "NOT TAKEN"
    }];

    self.event = function (aEvent) {
        // analyze mission events
        console.log(aEvent);
        if (aEvent === 'photo') {
            var to_eq = eq.pos.subtract(player.pos),
                dist = Math.abs(to_eq.modulus()),
                angle_to_eq = SC.radToDeg(player.dir.angleFrom(to_eq)),
                angle_dir = SC.radToDeg(eq.dir.angleFrom(to_eq)),
                angle_right = SC.radToDeg(eq.right.angleFrom(to_eq)),
                angle_up = SC.radToDeg(eq.up().angleFrom(to_eq)),
                side,
                side_index,
                side_angle;
            // smallest angle defines the side
            if (angle_dir <= 45 && angle_to_eq < 90) {
                side = 'Back';
                side_index = 1;
                side_angle = angle_dir;
            }
            if (angle_dir >= 135 && angle_to_eq < 90) {
                side = 'Front';
                side_index = 0;
                side_angle = 180 - angle_dir;
            }
            if (angle_right >= 135 && angle_to_eq < 90) {
                side = 'Right';
                side_index = 3;
                side_angle = 180 - angle_right;
            }
            if (angle_right <= 45 && angle_to_eq < 90) {
                side = 'Left';
                side_index = 2;
                side_angle = angle_right;
            }
            if (angle_up <= 45 && angle_to_eq < 90) {
                side = 'Down';
                side_index = 5;
                side_angle = angle_up;
            }
            if (angle_up >= 135 && angle_to_eq < 90) {
                side = 'Up';
                side_index = 4;
                side_angle = 180 - angle_up;
            }
            console.log('dist', dist.toFixed(1), 'a', angle_to_eq.toFixed(1), 'ad', angle_dir.toFixed(1), 'ar', angle_right.toFixed(1), 'au', angle_up.toFixed(1));
            console.log(side, side_index, side_angle);
            if (!side) {
                self.guideShow('I need more perpendicular photo');
                return;
            }
            if (dist < 2.5) {
                self.guideShow('You are too close!');
                if (self.photos[side_index].Photo !== 'GOOD') {
                    self.photos[side_index].Photo = 'TOO CLOSE (<3m)';
                    self.photosTable = self.clipboard.table(self.photos, self.photosTable);
                }
                return;
            }
            if (dist > 5) {
                if (self.photos[side_index].Photo !== 'GOOD') {
                    self.photos[side_index].Photo = 'TOO FAR AWAY (>5m)';
                    self.photosTable = self.clipboard.table(self.photos, self.photosTable);
                }
                self.guideShow('You are too far away!');
                return;
            }
            if (side && side_angle > 20) {
                if (self.photos[side_index].Photo !== 'GOOD') {
                    self.photos[side_index].Photo = 'BAD ANGLE';
                    self.photosTable = self.clipboard.table(self.photos, self.photosTable);
                }
                self.guideShow('Angle is too shallow, be more perpendicular!');
                return;
            }
            if (side && side_angle <= 20) {
                if (self.photos[side_index].Photo === 'GOOD') {
                    self.guideShow('You already took shot of ' + side + ' side!');
                } else {
                    self.guideShow('Perfect photo of ' + side + ' side!');
                    self.photos[side_index].Photo = 'GOOD';
                    self.photosTable = self.clipboard.table(self.photos, self.photosTable);
                }
                return;
            }
        }
    };

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');
        SC.c1 = self.find('C1');

        // Player
        player = self.place("Player", "Callisto", 6000, 220);
        player.teleport('C1', 10);
        player.face(SC.c1);

        // Equipment
        eq = self.place('Equipment', 'C1', 0, 0);
        eq.teleportNear('C1', 200, 500);
        eq.model = 'fighter';
        eq.boardable = true;
        eq.rollDegrees(360 * Math.random());
        eq.yawDegrees(360 * Math.random());
        eq.pitchDegrees(360 * Math.random());

        // radio
        self.customRadioSource = {
            freq: '521MHz',
            obj: eq
        };

        // player near c1
        player.pos = SC.c1.pos.add(SC.c1.dir.multiply(8)); // SC.randomPos(SC.c1.pos, 5, 10);

        // guide
        self.guide(self.summary, ['Continue', 'Abort']);
        self.guide('Reach the equipment and wait for my instructions.', null, function () {
            self.checker = function () {
                if (player.distanceTo(eq) <= 30) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });
        self.guide('You found it. Now make 6 photos, one from each side, from distance 3-5m.');

        // create clipboard content
        self.createClipboard(function (aClipboard) {
            var sig;
            aClipboard.h1('Report');
            aClipboard.p('Please take photos of the equipment. Remember to sign the finished report!');
            self.photosTable = aClipboard.table(self.photos);
            sig = aClipboard.signature(function () {
                // check if all photos are taken
                var i, good = 0;
                for (i = 0; i < self.photos.length; i++) {
                    if (self.photos[i].Photo === 'GOOD') {
                        good++;
                    }
                }
                if (good < 6) {
                    aClipboard.blink(self.photosTable);
                    aClipboard.blink(sig.label, 'Need ' + (6 - good) + ' more photos!');
                    return false;
                }
                aClipboard.hide();
                self.missionComplete();
                return true;
            }, {});
        });

        // Cheats
        self.cheatTarget(eq, 35);
        self.cheat(function () {
            player.teleport(eq);
            player.pos = eq.pos.add(eq.dir.multiply(4.8));
            player.face(eq);
        });
        self.cheat(function () {
            player.pos = eq.pos.add(eq.dir.multiply(-4.8));
            player.face(eq);
        });
        self.cheat(function () {
            player.pos = eq.pos.add(eq.right.multiply(4.8));
            player.face(eq);
        });
        self.cheat(function () {
            player.pos = eq.pos.add(eq.right.multiply(-4.8));
            player.face(eq);
        });
        self.cheat(function () {
            player.pos = eq.pos.add(eq.up().multiply(4.8));
            player.face(eq);
        });
        self.cheat(function () {
            player.pos = eq.pos.add(eq.up().multiply(-4.8));
            player.face(eq);
        });
    };

    return self;
    // source end
}());
