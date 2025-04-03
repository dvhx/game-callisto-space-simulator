// Training rotation
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.T2 = (function () {
    // source begin
    var self = SC.commonMission(),
        player;

    self.filename = 'training_rotation.js';
    self.category = 'Training missions';
    self.title = 'Rotation';
    self.summary = 'How to rotate ship in 3 axes and how to stop ship\'s rotation. Sensitivity control and single axis rotation.';
    self.description = 'In the second training mission you will learn everything about ship\'s rotation. You will learn how to rotate ship anywhere and how to stop ships rotation. The instruments that will be explained in this mission are rotation indicator, roll lever, rotation joystick, S/10 and ORTO buttons. During the mission you will be given simple tasks you must complete.';

    // Warning: training missions looks very complex because player's ship is often manipulated in weird ways, normal missions are simpler, I'm leaving training missions editable as well for educational purposes

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);

        // Guide
        self.guide('In this second training mission you will learn how to rotate the ship and how to stop the rotation.', ['Continue', 'Abort']);

        self.guide('You not gonna need all these instruments so I\'ll remove them. You only need rotation related instruments.', 'Continue', function () {
            SC.panel.hideGauge('thrust');
            SC.panel.hideGauge('thrusters');
            SC.panel.hideGauge('fb', true);
            SC.panel.hideGauge('fuel');
            SC.panel.hideGauge('lidar');
            SC.panel.hideGauge('battery', true);
            SC.panel.hideGauge('radio', true);
            SC.panel.hideGauge('linsim', true);
            SC.panel.hideGauge('clock');
            SC.panel.hideGauge('ldra');
            SC.panel.hideGauge('sld');
            SC.panel.hideGauge('cpy');
            SC.panel.hideGauge('ctr');
            SC.panel.hideGauge('abr');
            SC.panel.hideGauge('ref');
            //SC.panel.hideGauge('perf');
            SC.panel.hideGauge('d3d');
            SC.panel.hideGauge('zoom_in');
            SC.panel.hideGauge('zoom_out');
            SC.panel.hideGauge('board');
            SC.panel.hideGauge('photo');
            SC.panel.hideGauge('srb');
        });

        self.guide('To rotate ship left, move rotation joystick left. To stop rotation move joystick right. The longer you hold it, the faster it rotates.', null, function () {
            player.face('Jupiter');
            player.stop();
            SC.peekLeft(1000, self.guideNext);
        });

        self.guide('To rotate ship left, move rotation joystick left. To stop rotation move joystick right. The longer you hold it, the faster it rotates.', 'Continue');

        self.guide('Rotation in horizontal axis is called "yaw". When the ship is rotating horizontally, you can see the yellow yaw indicator rotating as well.', 'Continue', function () {
            player.face('Jupiter');
            player.stop();
            SC.rotateLeft(0.5, 1000, 0);
        });

        self.guide('Now, try to rotate in opposite direction until the rotation stops completely. I will watch your steps.', '', function () {
            self.checker = function () {
                if (player.rot.elements[2] > 0) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Perfect. Rotation in vertical axis is called pitch and it has pink color in rotation indicator. I\'ll rotate ship up and you try to stop by rotating in opposite direction.', 'Continue');

        self.guide('Try to stop by rotating in opposite direction.', '', function () {
            player.face('Jupiter');
            player.rot = Vector.create([0, -0.2, 0]);
            self.checker = function () {
                if (player.rot.elements[1] > 0) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Perfect. Now I\'m gonna rotate ship both vertically and horizontally, and you try to stop it completely. Easiest is to stop yaw first, then stop pitch rotation.', '', function () {
            player.face('Jupiter');
            player.rot = Vector.create([0, -0.2, 0.3]);
            self.checker = function () {
                if ((Math.abs(player.rot.elements[1]) < 0.02) && (Math.abs(player.rot.elements[2]) < 0.02)) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Excellent. Rotation along forward axis is called roll. You can roll clockwise or counter clockwise. To change roll you need to use roll lever.', 'Continue');

        self.guide('I\'ll rotate counter clockwise and you try to move roll lever down to stop the rotation.', null, function () {
            player.face('Jupiter');
            player.rot = Vector.create([-0.03, 0, 0]);
            setTimeout(function () {
                SC.panel.roll.state.value = -0.5;
                SC.panel.roll.update(SC.panel.roll.state, true);
            }, 1000);
            setTimeout(function () {
                SC.panel.roll.state.value = 0;
                SC.panel.roll.update(SC.panel.roll.state, true);
            }, 2000);
            self.checker = function () {
                if (Math.abs(player.rot.elements[0]) < 0.02) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Perfect. Sometimes it is hard to finely change rotation. You can decrease sensitivity of rotation joystick by pressing S/10 button.', 'Continue.', function () {
            player.face('Jupiter');
            player.stop();
            setTimeout(function () {
                SC.outlineFlash(SC.panel.buttons.s10.button, 1, 1, 1, 1);
            }, 1000);
        });

        self.guide('Other times you need to finely tune rotation in only 1 axis. Press button ORTO to check whether joystick is active in vertical, horizontal or both axes.', 'Continue.', function () {
            player.face('Jupiter');
            player.stop();
            setTimeout(function () {
                SC.outlineFlash(SC.panel.buttons.orto.button, 1, 1, 1, 1);
            }, 1000);
        });

        self.guide('You will see which one is active by led indicators in upper right corner of joystick and also by button\'s color.', 'Continue.');

        self.guide('If you double tap on rotation indicator (or other gauges) you can see zoomed up version. To go back double tap on it again.', 'Continue.');

        self.guide(function () {
            player.face('Jupiter');
            player.stop();
            self.missionComplete('That\'s it. Now you can rotate in all 3 directions.');
        });
    };

    return self;
    // source end
}());
