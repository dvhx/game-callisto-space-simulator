// Training compass and horizon
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.T3 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        sun;

    self.filename = 'training_compass_horizon.js';
    self.category = 'Training missions';
    self.title = 'Compass + horizon';
    self.summary = 'How to use solar compass and attitude indicator to orient ship in ecliptical plane.';
    self.description = 'In this mission you will learn how to orient ship on ecliptic plane using only solar compass and attitude indicator (also known as artificial horizon). Proper sun orientation is important for maximum solar panel output. There will be a few small tasks you have to complete. The final assignment will be to rotate your ship towards sun without seeing main display only using solar compass and artificial horizon.';

    // Warning: training missions looks very complex because player's ship is often manipulated in weird ways, normal missions are simpler, I'm leaving training missions editable as well for educational purposes

    function sunAngle() {
        return SC.radToDeg(player.dir.angleFrom(sun.pos.subtract(player.pos)));
    }

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Saturn', 'Uranus', 'Neptune', 'Pluto');
        sun = self.find('Sun');

        // Player
        player = self.place("Player", "Callisto", 6000, 220);
        SC.target = null;
        player.face(sun);

        // guide
        self.guide('In this third training mission you will learn how to use solar compass and artificial horizon to properly orient ship towards sun.', ['Continue', 'Abort'], function () {
            player.face(sun);
        });

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
            //SC.panel.hideGauge('rel');
            //SC.panel.hideGauge('con');
            SC.panel.hideGauge('board');
            SC.panel.hideGauge('photo');
            SC.panel.hideGauge('srb');
        });

        self.guide('Right now you are facing towards sun and solar compass also pointing directly up.', ['Continue'], function () {
            player.face(sun);
            player.stop();
        });

        self.guide('As I rotate ship left, red hand of solar panel moves right.', null, function () {
            player.face(sun);
            player.stop();
            SC.peekLeft(2000, self.guideNext);
        });

        self.guide('Artificial horizon is not affected because we are still in the plane of ecliptic.', ['Continue']);

        self.guide('Please rotate ship back so that if faces sun again. You can use ORTO button to rotate only horizontally.', null, function () {
            self.checker = function () {
                if (sunAngle() < 5) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Perfect. Now watch what happen when the ship is away from ecliptic.', null, function () {
            player.face(sun);
            player.stop();
            SC.peekLeft(undefined, function () {
                SC.peekUp(undefined, function () {
                    SC.rotateRight(0.5, 500, 1);
                    self.guideNext();
                });
            });
        });

        self.guide('Watch the solar compass. It will never point directly up because you are away from ecliptic.', null, function () {
            setTimeout(function () {
                player.stop();
                self.guideNext();
            }, 10000);
        });

        self.guide('Please rotate ship back so that it points directly to the sun. You need to rotate both pitch and yaw so make sure ORTO is off, or do it one by one.', null, function () {
            self.checker = function () {
                if (sunAngle() < 5) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Perfect. Now I will rotate the ship randomly, and you should be able to point it back to the sun even without seeing display.', ['Continue'], function () {
            player.face(sun);
            player.stop();
        });

        self.guide('Rotate ship so that it faces the sun perfectly and steadily. First roll to be flat on ecliptic, then pitch to zero, then yaw towards sun.', null, function () {
            SC.panel.display.display.canvas.style.opacity = 0;
            var p = sun.pos
                .add(player.right.multiply((Math.random() > 0.5 ? 1 : -1) * (Math.random() + 0.9) * SC.solarSystem.data.Jupiter.distance))
                .add(player.up().multiply((Math.random() > 0.5 ? 1 : -1) * (Math.random() + 0.9) * SC.solarSystem.data.Jupiter.distance));
            player.face({
                pos: p
            });
            player.rollDegrees(45 + 90 * Math.random());
            player.stop();
            self.counter = 0;
            self.checker = function () {
                if (sunAngle() < 5) {
                    self.counter++;
                    if (self.counter >= 10) {
                        self.checker = null;
                        self.guideNext();
                    }
                } else {
                    self.counter = 0;
                }
            };
        });

        self.guide('Excellent. You can now orient your ship towards sun without display.', null, function () {
            self.missionComplete();
            SC.panel.display.display.canvas.style.opacity = 1;
        });
    };

    return self;
    // source end
}());
