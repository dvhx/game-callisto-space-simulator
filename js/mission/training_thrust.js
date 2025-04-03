// Training thrust
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.T4 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        red,
        green,
        blue;

    self.filename = 'training_thrust.js';
    self.category = 'Training missions';
    self.title = 'Thrusters';
    self.summary = 'How to use 6 thrusters to move ship in any direction.';
    self.description = 'In this mission you will learn everything about engines (also known as thrusters) and how to move ship in 6 directions. You will also learn how to detect which thrusters are on and you will learn about fuel consumption. There will be few simple tasks you have to complete. In front of the ship will be placed three cubes that will help you perceive ship\'s movement in otherwise empty space.';

    // Warning: training missions looks very complex because player's ship is often manipulated in weird ways, normal missions are simpler, I'm leaving training missions editable as well for educational purposes

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        player.pitchDegrees(15);

        // disable pan and roll
        SC.panel.pan.enable(false);
        SC.panel.roll.enable(false);

        // green
        green = self.place('Green', 'Callisto', 6000, 220.1);
        green.pos = player.pos.add(player.dir.multiply(30)); //.add(player.right.multiply(0));
        green.speed = player.speed.dup();
        green.color = 'lime';
        SC.fasttext.prepare('Green', '#00ff00', 8);
        green.model = 'cube';
        green.radius = 0.5;

        // red
        red = self.place('Red', 'Callisto', 6000, 220.1);
        red.pos = player.pos.add(player.dir.multiply(30)).add(player.right.multiply(-5));
        red.speed = player.speed.dup();
        red.color = '#ff77aa';
        SC.fasttext.prepare('Red', '#ff77aa', 8);
        red.model = 'cube';
        red.radius = 0.5;

        // blue
        blue = self.place('Blue', 'Callisto', 6000, 220.1);
        blue.pos = player.pos.add(player.dir.multiply(30)).add(player.right.multiply(5));
        blue.speed = player.speed.dup();
        blue.color = '#77aaff';
        SC.fasttext.prepare('Blue', '#77aaff', 8);
        blue.model = 'cube';
        blue.radius = 0.5;

        // make cubes face same direction
        green.face(player);
        red.face(player);
        blue.face(player);

        // Guide
        self.guide('In this training mission you will learn everything about ship engines.', ['Continue', 'Abort']);

        self.guide('You not gonna need all these instruments so I\'ll remove them. You only need thrust related instruments.', 'Continue', function () {
            //SC.panel.hideGauge('thrust');
            //SC.panel.hideGauge('thrusters');
            //SC.panel.hideGauge('fb', true);
            //SC.panel.hideGauge('fuel');
            SC.panel.hideGauge('pan');
            SC.panel.hideGauge('roll', true);
            SC.panel.hideGauge('rotation');
            SC.panel.hideGauge('compass');
            SC.panel.hideGauge('horizon');
            //SC.panel.hideGauge('lidar');
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
            //SC.panel.hideGauge('rel');
            //SC.panel.hideGauge('con');
            SC.panel.hideGauge('board');
            SC.panel.hideGauge('photo');
            SC.panel.hideGauge('srb');
        });

        self.guide('Your ship has 18 thrusters, 3 on each side, together producing 1200N of thrust.', ['Continue']);

        self.guide('In empty space it\'s hard to perceive movement. But 30 meters in front of you are 3 cubes.', ['Continue']);

        self.guide('Use forward and back thrusters lever to move closer to the GREEN cube. Get at least 5m near it (distance is on the top of the lidar).', null, function () {
            SC.target = green;
            SC.outlineFlash(SC.panel.fb.container, 1, 1, 1, 1);
            self.checker = function () {
                if (player.distanceTo(green) <= 5) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Perfect. Now use thrusters joystick to move right where the blue cube is. Move right until the blue is in the center of display. Keep within 5m of blue cube.', null, function () {
            player.pos = green.pos.add(green.dir.multiply(4.5));
            player.speed = green.speed.dup();
            SC.target = blue;
            self.checker = function () {
                if (player.distanceTo(blue) <= 5) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Excellent. Now move back and further away until all three cubes are visible again (30m).', null, function () {
            player.speed = green.speed.dup();
            self.checker = function () {
                if (player.distanceTo(blue) > 30) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Cool. Now I will roll the ship few degrees, just wait...', null, function () {
            player.rot.elements[0] = 0.1;
            setTimeout(function () {
                player.rot.elements[0] = 0;
                self.guideNext();
            }, 3000 + 3000 * Math.random());
        });

        self.guide('And you try to get in front of the RED cube (less than 5m) and stay there without moving (dV < 0.5m/s).', null, function () {
            SC.target = red;
            var steady = 0;
            self.checker = function () {
                if (player.distanceTo(red) <= 5) {
                    if (player.speed.subtract(red.speed).modulus() <= 0.5) {
                        steady++;
                    } else {
                        steady = 0;
                    }
                    if (steady >= 5) {
                        self.checker = null;
                        self.guideNext();
                    }
                } else {
                    steady = 0;
                }
            };
        });

        self.d1 = 30;

        self.guide('Excellent. Now press back lever for few seconds to get away from cubes and watch active thrusters indicator.', ['Continue'], function () {
            player.speed = red.speed.dup();
            self.d1 = player.distanceTo(red);
            if (self.d1 < 30) {
                self.d1 = 30;
            }
            SC.outlineFlash(SC.panel.thrusters.container, 1, 1, 1, 1);
        });

        self.guide('Yellow hand shows how many thrusters are active. When you go back only one thruster is active.', ['Continue'], function () {
            player.pos = green.pos.add(green.dir.multiply(self.d1));
            player.speed = green.speed.dup();
        });

        self.guide('Now use joystick to move diagonally. You will see that 2 thrusters are active.', ['Continue']);

        self.guide('The thin green hand in active thrusters shows maximal current thrust. If you move forward in half speed it will be somewhere in the middle.', ['Continue']);

        self.guide('If you move diagonally at full speed it will go behind the corner.', ['Continue']);

        self.guide('At the bottom of active thruster are LED diodes that indicates which thursters are active.', ['Continue']);

        self.guide('If you need to gently move your ship you can use S/10 button. Very usefull when you need to slowly aproach target.', ['Continue'], function () {
            player.face(green);
            player.pos = green.pos.add(player.dir.multiply(-3));
            player.speed = green.speed.dup();
        });

        self.guide('ORTO button is when you want to move only in one axis. LED diodes in upper right corner of joystick indicate active direction.', ['Continue']);

        self.guide('Fuel gauge on the right measures remaining fuel. Fuel consumption is 300g/s for one thruster at maximum thrust.', ['Continue'], function () {
            SC.outlineFlash(SC.panel.fuel.container, 1, 1, 1, 1);
        });

        self.guide('You can see exact fuel weight (mf) in Linsim and fuel consumption (fc).', ['Continue'], function () {
            SC.panel.unhideGauge('linsim');
        });

        self.guide(function () {
            self.missionComplete('That\'s it for thrusters. You should be able to get your ship anywhere you want now.');
        });
    };

    return self;
    // source end
}());
