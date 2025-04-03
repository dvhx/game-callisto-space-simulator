// Training autopilot (sld, cpy, str, abr)
"use strict";
// globals: document, window, Vector, setInterval, setTimeout

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.T7 = (function () {
    // source begin
    var self = SC.commonMission(),
        player,
        c1;

    self.filename = 'training_autopilot.js';
    self.category = 'Training missions';
    self.title = 'Autopilot';
    self.summary = 'How to use SLD, CPY, CTR, ABR functions of autopilot.';
    self.description = 'In this mission you will learn how to use four buttons that control all functions of autopilot. The functions are: saying lidar distance, centering using pitch and yaw, centering using thrusters, automatic breaking. There will be no rotation and thrust controls available, all you can use are only autopilot functions. Your task will be to approach target using automatic centering and then stop using auto breaker.';

    // Warning: training missions looks very complex because player's ship is often manipulated in weird ways, normal missions are simpler, I'm leaving training missions editable as well for educational purposes

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');
        c1 = self.find('C1');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        SC.target = null;
        player.face(c1);
        player.stop();
        c1.pos = player.pos
            .add(player.dir.multiply(800))
            .add(player.right.multiply(80))
            .add(player.up().multiply(30));
        c1.speed = player.speed.dup();

        // guide
        self.guide('In this training mission you will learn how to use autopilot functions SLD, CPY, CTR, ABR.', ['Continue', 'Abort']);

        self.guide('You not gonna need all these instruments so I\'ll remove them.', 'Continue', function () {
            player.face(c1);
            player.stop();
            c1.pos = player.pos
                .add(player.dir.multiply(800))
                .add(player.right.multiply(80))
                .add(player.up().multiply(30));
            c1.speed = player.speed.dup();
            player.stop();
            SC.panel.hideGauge('thrust');
            //SC.panel.hideGauge('thrusters');
            SC.panel.hideGauge('fb', true);
            SC.panel.hideGauge('fuel');
            //SC.panel.hideGauge('lidar');
            SC.panel.hideGauge('battery', true);
            SC.panel.hideGauge('radio', true);
            SC.panel.hideGauge('linsim', true);
            SC.panel.hideGauge('pan');
            //SC.panel.hideGauge('rotation');
            SC.panel.hideGauge('roll', true);
            SC.panel.hideGauge('clock');
            //SC.panel.hideGauge('ldra');
            //SC.panel.hideGauge('sld');
            //SC.panel.hideGauge('cpy');
            //SC.panel.hideGauge('ctr');
            //SC.panel.hideGauge('abr');
            SC.panel.hideGauge('compass');
            SC.panel.hideGauge('horizon');
            SC.panel.hideGauge('s10');
            SC.panel.hideGauge('orto');
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

        self.guide('Press LDRA to add C1 to the lidar.', null, function () {
            self.checker = function () {
                if (SC.target) {
                    self.guideClear();
                    self.checker = null;
                    setTimeout(self.guideNext, 4000);
                }
            };
        });

        self.guide('Press SLD. It will Say Lidar Distance.', null, function () {
            self.checker = function () {
                if (SC.panel.buttons.sld.light()) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('You can see that C1 is off center, to auto rotate ship to point to C1 pres CPY (Center Pitch Yaw)', null, function () {
            self.checker = function () {
                if (SC.panel.buttons.cpy.light()) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Now wait few seconds until autopilot centers on C1', null, function () {
            setTimeout(self.guideNext, 15000);
        });

        self.guide('As you saw it takes some time. But now C1 will be in the center while CPY is on.', 'Continue');

        self.guide('Let\'s move forward.', null, function () {
            SC.panel.fb.state.value = -1;
            setTimeout(self.guideNext, 10000);
        });

        self.guide('Now press ABR. It will engage Auto BReaking feature.', null, function () {
            SC.panel.fb.state.value = 0;
            self.checker = function () {
                if (SC.panel.buttons.abr.light()) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('ABR will measure distance and speed and will slowly stop in front of the target. Just wait and watch lidar distance and speed. You will hear thrusters breaking.', null, function () {
            self.checker = function () {
                if (SC.panel.lidar.distance < 15 || SC.panel.lidar.speed < 0) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('That was CPY. Now let\'s try using thrusters from the same distance.', 'Continue');

        self.guide('Press CTR (Center ThRusters).', null, function () {
            player.stop();
            player.face(c1);
            if (SC.panel.buttons.cpy.light()) {
                SC.panel.buttons.cpy.light(false);
                SC.cpy.onClick(false, SC.panel.buttons.cpy);
            }
            c1.pos = player.pos
                .add(player.dir.multiply(800))
                .add(player.right.multiply(80))
                .add(player.up().multiply(30));
            c1.speed = player.speed.dup();
            self.checker = function () {
                if (SC.panel.buttons.ctr.light()) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('Let\'s move forward.', null, function () {
            SC.panel.fb.state.value = -1;
            setTimeout(self.guideNext, 10000);
        });

        self.guide('Make sure ABR is on.', null, function () {
            SC.panel.fb.state.value = 0;
            self.checker = function () {
                if (SC.panel.buttons.abr.light()) {
                    self.checker = null;
                    self.guideNext();
                }
            };
        });

        self.guide('You will now hear both breaking thrusters and left/right/up/down thrusters.', null, function () {
            self.checker = function () {
                if (SC.panel.lidar.distance < 15 || SC.panel.lidar.speed < 0) {
                    self.checker = null;
                    self.missionComplete('That\'s it. Now you can use autopilot.');
                }
            };
        });
    };

    return self;
    // source end
}());
