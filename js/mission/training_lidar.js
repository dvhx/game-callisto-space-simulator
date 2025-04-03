// Training thrust
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.T5 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        green;

    self.filename = 'training_lidar.js';
    self.category = 'Training missions';
    self.title = 'Lidar';
    self.summary = 'How to precisely track target\'s speed, direction and distance with lidar.';
    self.description = 'In this mission you will learn how to use lidar. You can use it to measure exact distance to the target and relative speed. It also shows estimated time of arrival. In this mission your task will be to approach target only using lidar without display. You will also learn about lidar sensitivity knob and how to adjust it so so that you can use lidar over longer distances.';

    // Warning: training missions looks very complex because player's ship is often manipulated in weird ways, normal missions are simpler, I'm leaving training missions editable as well for educational purposes

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');
        SC.target = null;

        // Green cube
        green = self.place('Green', 'Callisto', 6000, 220.00095);
        green.model = 'cube';
        green.radius = 0.5;

        // Player
        player = self.place("Player", "Callisto", 6000, 220);
        player.face(green);
        green.face(player);

        // Guide
        self.guide('In this training mission you will learn how to measure distance and movement of objects using lidar.', ['Continue', 'Abort']);

        self.guide('You not gonna need all these instruments so I\'ll remove them. You only need some instruments.', 'Continue', function () {
            //SC.panel.hideGauge('thrust');
            //SC.panel.hideGauge('thrusters');
            //SC.panel.hideGauge('fb', true);
            //SC.panel.hideGauge('fuel');
            //SC.panel.hideGauge('pan');
            //SC.panel.hideGauge('roll', true);
            //SC.panel.hideGauge('rotation');
            SC.panel.hideGauge('compass');
            SC.panel.hideGauge('horizon');
            //SC.panel.hideGauge('lidar');
            SC.panel.hideGauge('battery', true);
            SC.panel.hideGauge('radio', true);
            SC.panel.hideGauge('linsim', true);
            SC.panel.hideGauge('clock');
            //SC.panel.hideGauge('ldra');
            SC.panel.hideGauge('sld');
            SC.panel.hideGauge('cpy');
            SC.panel.hideGauge('ctr');
            SC.panel.hideGauge('abr');
            SC.panel.hideGauge('ref');
            //SC.panel.hideGauge('perf');
            SC.panel.hideGauge('d3d');
            SC.panel.hideGauge('zoom_in');
            SC.panel.hideGauge('zoom_out');
            //SC.panel.hideGauge('rel');
            //SC.panel.hideGauge('con');
            SC.panel.hideGauge('board');
            SC.panel.hideGauge('photo');
            SC.panel.hideGauge('srb');
        });

        self.guide('100 meters in front of you is green cube. Your lidar is empty now. To add target to the lidar press LDRA button. It adds object closest to the center of the display to lidar.', null, function () {
            SC.outlineFlash(SC.panel.buttons.ldra.button, 1, 1, 1, 1);
            self.checker = function () {
                if (SC.target) {
                    self.guideClear();
                    self.checker = null;
                    setTimeout(self.guideNext, 500);
                }
            };
        });

        self.guide('Perfect. You could see on display name of the acquired target (green). On top of the lidar is it\'s distance in meters (100).', 'Continue');

        self.guide('At the bottom of lidar is relative speed. It is zero because we are not moving. Move gently forward so that speed is 2-3 m/s.', null, function () {
            SC.outlineFlash(SC.panel.fb.container, 1, 1, 1, 1);
            self.checker = function () {
                if (SC.panel.lidar.speed >= 2 && SC.panel.lidar.speed <= 3) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Excellent. Now wait until you get to 50-60m, then stop there (dV < 1 m/s).', null, function () {
            self.checker = function () {
                if (SC.panel.lidar.distance >= 50 && SC.panel.lidar.distance <= 60 && Math.abs(SC.panel.lidar.speed) <= 1) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Perfect. Now I\'m gonna turn of display. Rotate ship randomly and then you try to move towards target only using lidar.', 'Continue', function () {
            player.pos = green.pos.add(green.dir.multiply(55));
            player.speed = green.speed.dup();
        });

        self.guide('Move as close as 5m towards target using only lidar and stop there (dV < 0.5 m/s). You can rotate then stop and move forward or you can use only thrusters.', '', function () {
            SC.panel.display.display.canvas.style.visibility = 'hidden';
            player.pos = green.pos.add(green.dir.multiply(55));
            player.speed = green.speed.dup();
            player.dir = player.dir
                .add(player.right.multiply(0.1 + 0.1 * Math.random()))
                .add(player.up().multiply(0.1 + 0.1 * Math.random())).toUnitVector();
            player.right = player.dir.cross(player.up());
            self.checker = function () {
                if (SC.panel.lidar.distance <= 5 && Math.abs(SC.panel.lidar.speed) <= 0.5) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Excellent. Now, let\'s move much farther away from the target, say 5km, and let\'s talk about Lidar sensitivity.', 'Continue', function () {
            player.speed = green.speed.dup();
            player.stop();
            player.face(green);
            SC.panel.display.display.canvas.style.visibility = 'visible';
        });

        self.guide('In the upper left corner of lidar is round knob. When you touch it and slide right it will increase lidar sensitivity', 'Continue', function () {
            player.speed = green.speed.dup();
            player.stop();
            player.face(green);
            player.pos = player.pos.add(player.dir.multiply(-5000)).add(player.right.multiply(100));
        });

        self.guide('Increase the lidar sensitivity to 100-150', null, function () {
            self.checker = function () {
                if (SC.panel.lidar.sensitivity >= 100 && SC.panel.lidar.sensitivity <= 150) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('After increasing sensitivity you see that we are not facing exactly on target. When you try to pan it is probably too fast. Use S/10 and rotate directly on target while having sensitivity >= 100.', null, function () {
            self.checker = function () {
                if (SC.panel.lidar.sensitivity >= 100 && Math.abs(SC.panel.lidar.rx) < 0.05 && Math.abs(SC.panel.lidar.ry) < 0.05) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Perfect. Now you know how to use lidar.', null, function () {
            player.stop();
            player.face(green);
            player.speed = green.speed.dup();
            self.missionComplete();
        });
    };

    return self;
    // source end
}());
