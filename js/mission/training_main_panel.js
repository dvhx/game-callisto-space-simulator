// Training mission - only shows what's what on main panel
"use strict";
// globals: document, window, Vector

var SC = window.SC || {};

SC.missions = SC.missions || {};

SC.missions.T1 = (function () {
    // source begin
    var self = SC.commonMission(),
        player;

    self.filename = 'training_main_panel.js';
    self.category = 'Training missions';
    self.title = 'Main panel';
    self.summary = 'Short introduction to ship\'s main control panel.';
    self.description = 'In your first training mission you will be introduced to all the instruments on the main panel. It is important to know all their names and their function. At the end there will be a short quiz where you have to show that you know all instruments by their names. This mission is very important because in later missions instruments will be only mentioned by their names so it is important for you to know that.';

    // Warning: training missions looks very complex because player's ship is often manipulated in weird ways, normal missions are simpler, I'm leaving training missions editable as well for educational purposes

    self.init = function () {
        // Init solar system
        self.places('Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Himalia', 'Amalthea', 'Adrastea', 'Metis', 'Saturn', 'Uranus', 'Neptune', 'Pluto');

        // Stations
        self.places('C1', 'C2', 'C3');
        SC.target = self.find('C1');

        // Player near C1
        player = self.place("Player", "Callisto", 6000, 220);
        player.face('Jupiter');

        // Guide
        self.guide('Welcome pilot! This is the main panel of your ship. Let me shortly get through all instruments.', ['Continue', 'Abort'], function () {
            SC.panel.display.display.canvas.style.opacity = 0;
        });

        self.guide('This is solar compass. The red hand points to the sun. When you are on the ecliptical plane and you are facing sun directly the red hand will point directly up.', 'Continue', function () {
            SC.panel.compass.outline(1, 1, 1, 1);
        });

        self.guide('This is attitude indicator, also known as artificial horizon. It shows your orientation on ecliptical plane.', 'Continue', function () {
            SC.panel.compass.outline();
            SC.panel.horizon.outline(1, 1, 1, 1);
        });

        self.guide('This is main display. You can see what\'s in front of you and other information.', 'Continue', function () {
            SC.panel.horizon.outline();
            SC.panel.display.outline(1, 1, 1, 1);
        });

        self.guide('These are various control buttons.', 'Continue', function () {
            SC.panel.display.outline();
            SC.outline('display_left', 1, 1, 1, 1);
            SC.outline('display_right', 1, 1, 1, 1);
        });

        self.guide('This is linear newtonian simulator, also called "linsim". It can calculate speed, time and distances in one direction.', 'Continue', function () {
            SC.outline('display_left');
            SC.outline('display_right');
            SC.outline(SC.panel.linsim.container, 1, 1, 1, 1);
        });

        self.guide('This is lidar. It shows distance and relative speed of one target.', 'Continue', function () {
            SC.outline(SC.panel.linsim.container);
            SC.panel.lidar.outline(1, 1, 1, 1);
        });

        self.guide('This is radio receiver. You can listen to various radio stations on it.', 'Continue', function () {
            SC.panel.lidar.outline();
            SC.outline(SC.panel.radio.container, 1, 1, 1, 1);
        });

        self.guide('This is battery status indicator.', 'Continue', function () {
            SC.outline(SC.panel.radio.container);
            SC.panel.battery.outline(1, 1, 1, 1);
        });

        self.guide('This is active thrusters indicator.', 'Continue', function () {
            SC.panel.battery.outline();
            SC.panel.thrusters.outline(1, 1, 1, 1);
        });

        self.guide('This is fuel gauge.', 'Continue', function () {
            SC.panel.thrusters.outline();
            SC.panel.fuel.outline(1, 1, 1, 1);
        });

        self.guide('This joystick controls yaw and pitch of the ship. It basically rotate ship vertically and horizontally.', 'Continue', function () {
            SC.panel.fuel.outline();
            SC.panel.pan.outline(1, 1, 1, 1);
        });

        self.guide('This lever controls roll of the ship. It basically rotate ship clockwise or counter clockwise.', 'Continue', function () {
            SC.panel.pan.outline();
            SC.panel.roll.outline(1, 1, 1, 1);
        });

        self.guide('This is relative rotation indicator. It doesn\'t tell you where are you facing but where and how fast are you rotating.', 'Continue', function () {
            SC.panel.roll.outline();
            SC.panel.rotation.outline(1, 1, 1, 1);
        });

        self.guide('This is mission clock. Every mission starts at 0. Certain longer missions will allow you to speed up time using buttons on the clock.', 'Continue', function () {
            SC.panel.rotation.outline();
            SC.panel.clock.outline(1, 1, 1, 1);
        });

        self.guide('This is forward and backward thrusters lever. It allows you to move ship forward and back.', 'Continue', function () {
            SC.panel.clock.outline();
            SC.panel.fb.outline(1, 1, 1, 1);
        });

        self.guide('This joystick move ships left, right, up and down.', 'Continue', function () {
            SC.panel.fb.outline();
            SC.panel.thrust.outline(1, 1, 1, 1);
        });

        self.guide('This is clipboard with mission details and objective.', 'Continue', function () {
            SC.panel.thrust.outline();
            SC.outline(SC.panel.clipboard, 1, 1, 1, 1);
        });

        self.guide('Btw if this message is too long and you can\'t see just tap on in and it will be hidden. Then click again and it will be displayed again.', 'Continue', function () {
            SC.outline(SC.panel.clipboard);
        });

        self.guide('That\'s it, in next training missions all instruments will be described in greater detail. Now let\'s see if you remember the names of all the tools.', 'Continue', function () {
            SC.outline(SC.panel.clipboard);
            SC.panel.display.display.canvas.style.opacity = 1;
            player.stop();
            player.face('Jupiter');
            // disable buttons
            SC.panel.buttons.ldra.broken = true;
            SC.panel.buttons.sld.broken = true;
            SC.panel.buttons.cpy.broken = true;
            SC.panel.buttons.ctr.broken = true;
            SC.panel.buttons.abr.broken = true;
            SC.panel.buttons.ref.broken = true;
            SC.panel.buttons.board.broken = true;
            SC.panel.buttons.d3d.broken = true;
            SC.panel.buttons.zoom_in.broken = true;
            SC.panel.buttons.zoom_out.broken = true;
            SC.panel.buttons.s10.broken = true;
            SC.panel.buttons.orto.broken = true;
            SC.panel.buttons.photo.broken = true;
            SC.panel.buttons.srb.broken = true;
        });

        self.guide(function () {
            var k,
                names = {
                    'lidar': 'lidar',
                    'attitude indicator': 'horizon',
                    'artificial horizon': 'horizon',
                    'clock': 'clock',
                    'compass': 'compass',
                    'main display': 'display',
                    'linsim': 'linsim',
                    'linear simulator': 'linsim',
                    'radio': 'radio',
                    'radio receiver': 'radio',
                    'battery indicator': 'battery',
                    'active thrusters indicator': 'thrusters',
                    'fuel gauge': 'fuel',
                    'left, right, up, down thrusters control': 'thrust',
                    'forward and back thrusters control': 'fb',
                    'relative rotation indicator': 'rotation',
                    'roll lever': 'roll',
                    'yaw and pitch control': 'pan',
                    'clipboard with mission details': 'clipboard'
                },
                a = SC.shuffleArray(Object.keys(names)),
                cur;

            SC.panel.display.handleDigits = false;

            function one() {
                cur = a.pop();
                self.guideShow('Touch the ' + cur + '!', '');
            }

            function onClick() {
                if (this.dataName === names[cur]) {
                    if (a.length > 0) {
                        one();
                    } else {
                        // remove onclick
                        var kk;
                        for (kk in names) {
                            if (names.hasOwnProperty(kk)) {
                                if (SC.panel.hasOwnProperty(names[kk]) && SC.panel[names[kk]].container) {
                                    SC.panel[names[kk]].container.onclick = null;
                                }
                            }
                        }
                        // enable joysticks
                        SC.panel.pan.enabled = true;
                        SC.panel.thrust.enabled = true;
                        SC.panel.fb.enabled = true;
                        SC.panel.roll.enabled = true;
                        // submit high score
                        self.missionComplete();
                    }
                } else {
                    self.guideShow('That is ' + this.dataAlias + '. Try again! Touch ' + cur, '');
                }
            }

            // disable joysticks
            SC.panel.pan.enabled = false;
            SC.panel.thrust.enabled = false;
            SC.panel.fb.enabled = false;
            SC.panel.roll.enabled = false;
            // on click on instrument check for correct answer
            for (k in names) {
                if (names.hasOwnProperty(k)) {
                    if (SC.panel.hasOwnProperty(names[k]) && SC.panel[names[k]].container) {
                        SC.panel[names[k]].container.dataAlias = k;
                        SC.panel[names[k]].container.dataName = names[k];
                        SC.panel[names[k]].container.onclick = onClick;
                    } else {
                        console.warn(k);
                    }
                }
            }
            one();
        });
    };

    return self;
    // source end
}());
