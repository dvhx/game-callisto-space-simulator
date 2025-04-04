// Main panel with all major avionics
"use strict";
// globals: document, window, setInterval, Vector, setTimeout, FontFace

var SC = window.SC || {};

SC.path = '';

SC.mainPanel = function () {
    var self = {}, player, l;

    self.compass = SC.gaugeCompass('compass');
    self.clock = SC.gaugeClock('clock');
    self.fuel = SC.gaugeFuel('fuel');
    self.rotation = SC.gaugeRotation('rotation');
    self.thrusters = SC.gaugeThrust('thrusters');
    self.lidar = SC.gaugeLidar('lidar');
    self.horizon = SC.gaugeHorizon('horizon'); //horizon

    self.linsim = SC.gaugeLinsim('linsim');
    self.linsim.m.updateValue(SC.player.mass);
    self.linsim.mf.updateValue(SC.player.fuel);
    self.linsim.f.updateValue(SC.player.thrustMax);
    self.linsim.fc.updateValue(SC.player.fuelConsumption * 1000);
    self.linsim.update();

    self.radio = SC.gaugeRadio('radio');
    self.radio.freq.updateValue(500);
    self.radio.state = {
        ship: Vector.create([0, 0, 0]),
        forward: Vector.create([0, 1, 0]),
        sources: {
            '513MHz': Vector.create([0, 11, 3]),
            '495MHz': Vector.create([12, -34, -56])
        }
    };

    self.battery = SC.gaugeBattery('battery');
    self.battery.update({voltage: 11.5, current: 0.8});
    self.display = SC.gaugeDisplay('display');
    self.display_mode = '3D';

    // display digits handler
    self.display.displayDigitsHandler(self.linsim.m, self.linsim.update);
    self.display.displayDigitsHandler(self.linsim.mf, self.linsim.update);
    self.display.displayDigitsHandler(self.linsim.f, self.linsim.update);
    self.display.displayDigitsHandler(self.linsim.fc, self.linsim.update);
    self.display.displayDigitsHandler(self.linsim.v0, self.linsim.update);
    self.display.displayDigitsHandler(self.linsim.t, self.linsim.update);
    self.display.displayDigitsHandler(self.radio.freq, function () {
        SC.panel.radio.onFreqChange(SC.panel.radio.freq.state);
    });
    self.display.displayDigitsHandler(self.radio.angle, function () {
        SC.panel.radio.onAngleChange(SC.panel.radio.angle.state);
    });

    // label cache
    for (l = 0; l < SC.gos.items.length; l++) {
        SC.fasttext.prepare(SC.gos.items[l].name, SC.gos.items[l].color, 10);
    }

    self.pan = SC.gaugeJoystick('pan', 'green', {h: 'yellow', v: 'pink'});
    self.thrust = SC.gaugeJoystick('thrust', 'red');
    self.fb = SC.gaugeLever('fb', 'F', 'B', 'white');
    self.roll = SC.gaugeLever('roll', 'CCW', 'CW', '#f12');

    self.orto = 0; // 0=all, 1=h, 2=v

    self.clipboard = document.getElementById('clipboard');
    self.clipboard.container = self.clipboard;
    self.clipboard.style.backgroundImage = "url(image/clipboard.png)";
    self.clipboard.onclick = function () {
        if (!SC.mission.clipboard) {
            SC.mission.createClipboard();
        }
        SC.mission.clipboard.show();
    };

    self.buttons = {
        d3d: SC.button('display_right', '3D', 'green', true, function (aOn) {
            self.display_mode = aOn ? '3D' : '2D';
            self.buttons.zoom_in.light(!aOn);
            self.buttons.zoom_out.light(!aOn);
        }, true),
        zoom_in: SC.button('display_right', 'ZOOM+', 'white', false, function (aOn) {
            if (aOn) {
                SC.render2d.zoom *= 2;
            }
        }, false),
        zoom_out: SC.button('display_right', 'ZOOM-', 'white', false, function (aOn) {
            if (aOn) {
                SC.render2d.zoom /= 2;
            }
        }, false),
        ldra: SC.button('display_left', 'LDRA', 'green', false, function () {
            // lidar target acquisition (nearest object in front)
            setTimeout(function () {
                var t = SC.render3d.findTarget(player, true);
                SC.target = t.target;
                if (SC.target) {
                    self.lidar.extraLabel(SC.target && SC.target.name);
                }
                self.buttons.ldra.light(false);
            }, 1000);
        }, true),
        sld: SC.button('display_left', 'SLD', 'blue', false, SC.sayLidarDistance.onClick, true),
        cpy: SC.button('display_left', 'CPY', 'blue', false, SC.cpy.onClick, true),
        ctr: SC.button('display_left', 'CTR', 'blue', false, SC.ctr.onClick, true),
        abr: SC.button('display_left', 'ABR', 'blue', false, SC.abr.onClick, true),
        ref: SC.button('display_left', 'REF', 'green', false, SC.ref.onClick, true),
        board: SC.button('display_left', 'BOARD', 'green', false, SC.boardNearest, false),
        s10: SC.button('display_right', 'S/10', 'blue', false, function (aOn) {
            var sensitivity = aOn ? 0.1 : 1;
            self.pan.sensitivity = sensitivity;
            self.thrust.sensitivity = sensitivity;
        }, true),
        orto: SC.button('display_right', 'ORTO', 'white', true, function (aOn, aButton) {
            self.orto = (self.orto + 1) % 3;
            console.log(aOn, self.orto);
            if (self.orto === 0) {
                aButton.color('white');
            }
            if (self.orto === 1) {
                aButton.color('yellow');
            }
            if (self.orto === 2) {
                aButton.color('pink');
            }
            var h = self.orto === 0 || self.orto === 1,
                v = self.orto === 0 || self.orto === 2;
            self.pan.state.h = h;
            self.pan.state.v = v;
            self.pan.render();
            self.thrust.state.h = h;
            self.thrust.state.v = v;
            self.thrust.render();
        }, false),
        photo: SC.button('display_right', 'PHOTO', 'white', true, function () { SC.mission.event('photo'); }, false),
        srb: SC.button('display_right', 'SRB', 'green', false, SC.srb.onClick, false)
    };

    if (SC.storage.readBoolean('CA_DEBUG', false)) {
        self.buttons.rel = SC.button('display_right', 'REL', 'white', true, function () {
            document.location.reload();
        }, false);
        self.buttons.con = SC.button('display_right', 'CON', 'white', true, function () {
            alert('Console not available');
        }, false);
        self.buttons.perf = SC.button('display_left', 'PERF', 'white', true, function () {
            SC.perf.show();
        }, false);
        self.buttons.cheat = SC.button('display_left', 'CHEAT', 'red', SC.mission.cheats.length > 0, function (aOn, aButton) {
            console.log(aOn);
            var f = SC.mission.cheats.shift();
            if (!f || SC.mission.cheats.length <= 0) {
                aButton.light(false);
            }
            if (f) {
                SC.mission.cheated = true;
                f();
            }
        }, false);
    }

    self.update = function (aPlayer) {
        // update all avionics using player's GO
        player = aPlayer;
        var a, p, s;

        // inputs
        SC.perf.begin('player');
        // player rotation
        aPlayer.rot.elements[0] += 0.01 * self.roll.state.value / SC.time.speed;
        aPlayer.rot.elements[1] += 0.01 * self.pan.state.y / (1 + (SC.time.speed - 1) / 2);
        aPlayer.rot.elements[2] += 0.01 * self.pan.state.x / (1 + (SC.time.speed - 1) / 2);

        // player thrust
        if (!SC.srb.update()) {
            aPlayer.thrust = Vector.create([0, 0, 0]);
            aPlayer.thrust = aPlayer.thrust
                .add(aPlayer.dir.multiply(-aPlayer.thrustMax * self.fb.state.value))
                .add(aPlayer.right.multiply(aPlayer.thrustMax * self.thrust.state.x))
                .add(aPlayer.up().multiply(aPlayer.thrustMax * self.thrust.state.y));
            SC.perf.end('player');
        }

        // outputs

        // thrusters
        if (self.thrusters.old()) {
            SC.perf.begin('thrusters');
            if (aPlayer.fuel <= 0) {
                s = {};
            } else {
                s = {
                    max: aPlayer.thrust.modulus() / aPlayer.thrustMax,
                    l: self.thrust.state.x > 0,
                    r: self.thrust.state.x < 0,
                    u: self.thrust.state.y > 0,
                    d: self.thrust.state.y < 0,
                    b: self.fb.state.value < 0,
                    f: self.fb.state.value > 0
                };
            }
            self.thrusters.update(s);
            SC.perf.end('thrusters');
        }
        // fuel
        if (self.fuel.old()) {
            SC.perf.begin('fuel');
            self.fuel.update({fuel: aPlayer.fuel, max: aPlayer.fuelMax});
            SC.perf.end('fuel');
        }
        // compass
        if (self.compass.old()) {
            SC.perf.begin('compass');
            a = self.compass.calculate(aPlayer.pos, aPlayer.dir, aPlayer.right, SC.sun.pos);
            self.compass.update({azimuth: a});
            SC.perf.end('compass');
        }
        // clock
        if (self.clock.old()) {
            SC.perf.begin('clock');
            self.clock.update({time: SC.time.s}, true);
            SC.perf.end('clock');
        }
        // lidar
        if (self.lidar.enabled) {
            SC.perf.begin('lidar');
            if (SC.target) {
                SC.perspectiveCache(aPlayer.pos, aPlayer.dir, aPlayer.right, aPlayer.up());
                p = SC.perspective(aPlayer.pos, aPlayer.dir, aPlayer.right, aPlayer.up(), SC.target.pos);
                self.lidar.state = {x: p[0], y: p[1], distance: p[2]};
                self.lidar.update(self.lidar.state, true);
            } else {
                self.lidar.update({}, true);
            }
            SC.perf.end('lidar');
        }
        // display
        switch (self.display_mode) {
        case '2D':
            SC.perf.begin('display2d');
            self.display.display.clear();
            SC.render2d.render(self.display.display, aPlayer);
            SC.perf.end('display2d');
            break;
        case '3D':
            SC.perf.begin('display3d');
            self.display.display.clear();
            SC.render3d.render(self.display.display, aPlayer);
            SC.perf.end('display3d');
            break;
        }
        // rotation
        if (self.rotation.old()) {
            SC.perf.begin('rotation');
            self.rotation.update({
                yaw: aPlayer.rot.elements[2],
                pitch: aPlayer.rot.elements[1],
                roll: aPlayer.rot.elements[0]
            }, true);
            SC.perf.end('rotation');
        }
        // horizon
        if (self.horizon.old()) {
            SC.perf.begin('horizon');
            self.horizon.update({
                pitch: aPlayer.dir.angleFrom(Vector.k) - Math.PI / 2,
                roll: aPlayer.right.angleFrom(Vector.k) - Math.PI / 2
            }, true);
            SC.perf.end('horizon');
        }
        // linsim
        if (self.linsim.old()) {
            SC.perf.begin('linsim');
            self.linsim.mf.state.value = Math.round(aPlayer.fuel);
            self.linsim.mf.update(self.linsim.mf.state, true);
            self.linsim.update();
            SC.perf.end('linsim');
        }
        // radio
        if (SC.panel.radio.band.state.value > 0) {
            SC.perf.begin('radio');
            if (SC.mission.radio) {
                SC.mission.radio();
            }
            SC.perf.end('radio');
        }
    };

    self.guideShow = function (aMessage, aButtons) {
        // Show guide at the beginning of the mission
        SC.panel.display.dialog(aMessage, aButtons, function (aButton) {
            if (aButton === 'Abort' || aButton === 'Return to pinboard') {
                document.location = 'pinboard.html';
                return;
            }
            if (aButton === 'Edit' || aButton === 'Editor') {
                document.location = 'editor.html';
                return;
            }
            var g = SC.mission.intro.shift();
            if (g) {
                g(aButton);
            }
        });
    };

    self.guideNext = function () {
        // Show next intro item
        var g = SC.mission.intro.shift();
        if (typeof g === 'function') {
            g();
        } else {
            console.warn('SC.panel.guideNext g is not function but ', g);
        }
    };

    self.hideGauge = function (aName) {
        // Hide one gauge or button, used in training missions
        // button?
        if (self.buttons.hasOwnProperty(aName)) {
            self.buttons[aName].button.style.visibility = 'hidden';
            return;
        }
        // gauge
        self[aName].hide(true);
        if (typeof self[aName].enable === 'function') {
            self[aName].enable(false);
        }
    };

    self.unhideGauge = function (aName) {
        // unhide previously hidden gauge
        if (self.buttons.hasOwnProperty(aName)) {
            self.buttons[aName].button.style.visibility = 'visible';
            return;
        }
        if (typeof self[aName].hide !== 'function') {
            console.log(aName + ' has no hide function!');
            return;
        }
        self[aName].hide(false);
        if (typeof self[aName].enable === 'function') {
            self[aName].enable(true);
        }
    };

    self.redraw = function () {
        // redraw all gauges (e.g. after boarding ship with broken battery indicator)
        var k;
        for (k in self) {
            if (self.hasOwnProperty(k)) {
                if (typeof self[k] === 'object' && typeof self[k].render === 'function') {
                    self[k].render();
                }
            }
        }
    };

    // redraw everything when fonts are loaded
    SC.crystal = new FontFace('Crystal', 'url(font/CrystalItalic.ttf)');
    SC.crystal.load().then(function (aFont) {
        document.fonts.add(aFont);
        self.redraw();
    });

    // hide loading label
    document.getElementById('loading').style.display = 'none';
    return self;
};

