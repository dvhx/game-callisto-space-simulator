// Common functions for missions
"use strict";
// globals: document, window, setTimeout, Vector, Line, setInterval, clearInterval

var SC = window.SC || {};

SC.commonMission = function () {
    // Common mission
    var self = {};
    self.category = 'Training missions';
    self.title = 'Common mission';
    self.summary = 'Very common mission';
    self.summary = 'Description of very common mission';
    self.intro = [];
    self.cheats = [];
    self.cheated = false;

    self.event = function (aEvent) {
        // Only log event
        console.log('mission event', aEvent);
    };

    self.eventRefuel = function (aStationName) {
        // End mission on successfull refuel
        return function (aEvent, aTarget) {
            if (aEvent === 'refuel' && aTarget && (aTarget.name === aStationName)) {
                self.missionComplete();
            }
        };
    };

    self.defaultShipParams = function (aShip) {
        // Set default ship params
        aShip.rot = Vector.create([0, 0, 0.0]);
        //aShip.face(SC.jupiter); // SC.c1
        aShip.thrust = Vector.create([0, 0, 0.0]);
        aShip.thrustMax = 1200;
        aShip.mass = 1000;
        aShip.fuel = 500;
        aShip.fuelMax = 500;
        aShip.fuelConsumption = 0.3;
        aShip.model = 'delta';
        aShip.boardable = true;
    };

    self.init = function () {
        // Init solar system
        console.error('SC.mission.init not set');
    };

    self.postGosInit = function () {
        // code after solar system init (player exists)
        SC.sun = SC.gos.findByName('Sun');
        SC.player = SC.gos.findByName('Player');
        if (SC.render2d) {
            SC.render2d.center('Player');
        }
        SC.panel = SC.mainPanel();
        //console.log('Panel created');
        // Standard checker interval that checks mission progress
        self.checkerInterval = setInterval(function () {
            if (self.checker) {
                self.checker();
            }
        }, 500);
    };

    self.radio = function () {
        // Standard radio stations update
        SC.panel.radio.state.ship = SC.player.pos;
        SC.panel.radio.state.forward = SC.player.dir;
        SC.panel.radio.state.sources = self.radioSources;
        /*
        if (SC.c1) {
            SC.panel.radio.state.sources['513MHz'] = SC.c1.pos;
        }
        */
        // add single radio source
        if (SC.mission.customRadioSource) {
            SC.panel.radio.state.sources[SC.mission.customRadioSource.freq] = SC.mission.customRadioSource.obj;
        }
        SC.panel.radio.update(SC.panel.radio.state, true);
    };

    self.frequencies = function () {
        // Return radio frequencies and names
        var f = [], k, s = SC.gos.radioSources();
        for (k in s) {
            if (s.hasOwnProperty(k)) {
                if (!s[k].frequencySecret) {
                    f.push({
                        Frequency: s[k].frequency,
                        Source: s[k].name
                    });
                }
            }
        }
        if (self.customRadioSource && self.customRadioSource.obj) {
            f.push({
                Frequency: self.customRadioSource.clipboardFreq || self.customRadioSource.freq,
                Source: self.customRadioSource.clipboardSource || self.customRadioSource.obj.name
            });
        }
        return f;
    };

    self.createClipboard = function (aCallback) {
        // Create common clipboard, with center part optionally created with callback
        var c = SC.clipboard(), f;
        if (aCallback) {
            aCallback(c);
        }
        f = self.frequencies();
        if (f.length > 0) {
            c.h1('Frequencies');
            c.table(f);
        } else {
            c.h1('Frequencies');
            c.p('None available');
        }
        c.stats();
        c.avionics();
        if (SC.keys) {
            c.keyboard();
        }
        self.clipboard = c;
        return c;
    };

    self.submitHighScore = function (aScore, aCallback) {
        // Submit high score to the server, pass summary to callback
        if (SC.mission.cheated) {
            console.log('Score not submitted, mission cheated');
            return;
        }
        var o = SC.missionStats[SC.missionKey], s;
        o.player_score = aScore;
        o.player_time = SC.time.s;
        s = [];
        try {
            s.push('This mission was played ' + o.plays + ' times and finished ' + o.finished + ' times');
            s.push('Your time for this mission is ' + SC.time.hms(SC.time.s));
            s.push('Best time for this mission is ' + SC.time.hms(o.min_time));
            aCallback(s.join('. '));
        } catch (e) {
            aCallback('Mission completed!');
        }
        SC.storage.writeObject('CA_MISSION_STATS_' + SC.missionKey, o);
    };

    self.missionFailed = function (aReason) {
        // Show mission failed dialog and return to pinboard
        self.checker = null;
        SC.panel.display.dialog('Mission failed!' + (aReason ? ' ' + aReason : ''), 'Return to pinboard', function () {
            document.location = 'pinboard.html';
        });
    };

    self.missionComplete = function (aReason, aScore) {
        // Show mission completed and return to pinboard
        self.checker = null;
        SC.storage.writeObject('CA_MISSION_SCORE_' + SC.missionKey, {score: aScore, time: SC.time.s});
        var dlg = SC.panel.display.dialog('Mission completed in ' + SC.time.hms(SC.time.s) + '! ' + (aReason || ''), 'Return to pinboard', function () {
            document.location = 'pinboard.html';
        });
        self.submitHighScore(aScore, function (aStats) {
            dlg.msg.textContent += ' ' + aStats;
        });
    };

    self.cheat = function (aCallback) {
        // add one chat
        self.cheats.push(aCallback);
    };

    self.cheatTarget = function (aTarget, aDistance) {
        // Add standard cheat for mission where we approach target
        // face target
        self.cheat(function () {
            SC.player.face(aTarget);
        });
        // get to 100m
        self.cheat(function () {
            SC.player.teleport(aTarget, 100);
        });
        // get to distance or 3m
        self.cheat(function () {
            SC.player.teleport(aTarget, aDistance || 3);
        });
    };

    // functions for simpler editor

    self.place = function (aName, aParent, aDistance, aPhase) {
        // Place custom object
        var s = SC.solarSystem.data[aName] || {},
            o = SC.gos.placeCustom({
                name: aName,
                parent: aParent || s.parent,
                distance: (aDistance * 1000) || s.distance,
                phase: aPhase || s.phase,
                mass: s.mass || 1,
                radius: s.radius || 1,
                color: s.color || 'lime',
                refuel: s.refuel || false,
                model: s.model || undefined,
                frequency: s.frequency
            });
        //console.warn(o, s);
        if (aName === 'Player') {
            self.defaultShipParams(o);
            self.postGosInit();
            SC.ship = o;
        }
        return o;
    };

    self.places = function () {
        // Place objects from the arguments
        var i, o = {};
        for (i = 0; i < arguments.length; i++) {
            self.place(arguments[i]);
        }
        return o;
    };

    self.find = function (aName) {
        return SC.gos.findByName(aName);
    };

    self.guide = function (aText, aButtons, aCallback) {
        // Show one guide message
        if (typeof aText === 'function') {
            aCallback = aText;
            aText = null;
        }
        self.intro.push(function (aButton) {
            if (aText) {
                SC.panel.guideShow(aText, aButtons);
            }
            if (aCallback) {
                aCallback(aButton);
            }
        });
    };

    self.clockEditable = function (aEditable) {
        // Make clock editable or not
        SC.panel.clock.editable = aEditable;
        SC.panel.clock.render();
    };

    self.guideChecker = function (aMessage, aCallback, aMilliseconds) {
        function f() {
            var i = setInterval(function () {
                console.log('guideCheckerInterval');
                if (aCallback()) {
                    clearInterval(i);
                    self.guideNext();
                }
            }, aMilliseconds || 1000);
        }
        if (!aMessage) {
            self.guide(f);
            self.guideNext();
        } else {
            self.guide(aMessage, null, f);
        }
    };

    self.crashChecker = function (aObjects, aIntervalSeconds) {
        // Check crashing on objects (mostly planets)
        var objects = aObjects.map(function (aName) { return self.find(aName); }), interval;
        interval = setInterval(function () {
            var i;
            for (i = 0; i < objects.length; i++) {
                if (SC.player.distanceTo(objects[i]) <= objects[i].radius) {
                    clearInterval(interval);
                    self.missionFailed('You crashed on ' + objects[i].name);
                    return;
                }
            }
        }, (aIntervalSeconds || 5) * 1000);
        return interval;
    };

    self.guideNext = function () {
        // Move to next guide
        SC.panel.guideNext();
    };

    self.guideClear = function () {
        // Clear guide
        SC.panel.guideShow('');
    };

    self.guideShow = function (aText, aButtons) {
        // Clear guide
        SC.panel.guideShow(aText || '', aButtons);
    };

    self.cheatCompassBack = function () {
        // Click on compass will go back to editor
        SC.panel.compass.container.onclick = function () {
            document.location = 'editor.html';
        };
    };

    return self;
};

SC.rotateLeft = function (aSpeed, aDuration, aDelay, aCallback) {
    // slowly rotate ship left
    setTimeout(function () {
        setTimeout(function () {
            SC.panel.pan.state.x = -(aSpeed || 0.5);
            SC.panel.pan.update(SC.panel.pan.state, true);
            setTimeout(function () {
                SC.panel.pan.state.x = 0;
                SC.panel.pan.update(SC.panel.pan.state, true);
                if (aCallback) {
                    aCallback();
                }
            }, aDuration || 1000);
        }, 1000);
    }, aDelay || 0);
};

SC.rotateRight = function (aSpeed, aDuration, aDelay, aCallback) {
    // rotate ship right
    SC.rotateLeft(-(aSpeed || 0.5), aDuration, aDelay, aCallback);
};

SC.rotateUp = function (aSpeed, aDuration, aDelay, aCallback) {
    // rotate ship up
    setTimeout(function () {
        setTimeout(function () {
            SC.panel.pan.state.y = -(aSpeed || 0.5);
            SC.panel.pan.update(SC.panel.pan.state, true);
            setTimeout(function () {
                SC.panel.pan.state.y = 0;
                SC.panel.pan.update(SC.panel.pan.state, true);
                if (aCallback) {
                    aCallback();
                }
            }, aDuration || 1000);
        }, 1000);
    }, aDelay || 0);
};

SC.rotateDown = function (aSpeed, aDuration, aDelay, aCallback) {
    // rotate ship down
    SC.rotateUp(-(aSpeed || 0.5), aDuration, aDelay, aCallback);
};

SC.peekLeft = function (aDuration, aCallback) {
    // Shortly rotate left and stop
    SC.rotateLeft(0.5, 1000, 1000, function () {
        SC.rotateRight(0.5, 1000, (aDuration || 1000), function () {
            SC.player.rot.elements[2] = 0;
            if (aCallback) {
                aCallback();
            }
        });
    });
};

SC.peekUp = function (aDuration, aCallback) {
    // Shortly rotate left and stop
    SC.rotateUp(0.5, 1000, 1000, function () {
        SC.rotateDown(0.5, 1000, (aDuration || 1000), function () {
            SC.player.rot.elements[1] = 0;
            if (aCallback) {
                aCallback();
            }
        });
    });
};

SC.randomPos = function (aPos, aMinDistance, aMaxDistance) {
    // Return random position near aPos at least aMinDistance but at most aMaxDistance
    var x = (Math.random() > 0.5 ? 1 : -1) * (aMinDistance + (aMaxDistance - aMinDistance) * Math.random()),
        y = (Math.random() > 0.5 ? 1 : -1) * (aMinDistance + (aMaxDistance - aMinDistance) * Math.random()),
        z = (Math.random() > 0.5 ? 1 : -1) * (aMinDistance + (aMaxDistance - aMinDistance) * Math.random());
    return Vector.create([aPos.elements[0] + x, aPos.elements[1] + y, aPos.elements[2] + z]);
};

SC.board = function (aTarget) {
    // Board other ship
    var i, k, a, centerline, d,
        gauges = ["compass", "clock", "fuel", "rotation", "thrusters", "lidar", "horizon",
            "linsim", "radio", "battery", "display", "pan", "thrust", "fb", "roll",
            "clipboard", "ldra", "sld", "cpy", "ctr", "abr", "ref", "d3d",
            "zoom_in", "zoom_out", "s10", "orto"],
        cap = ["linsim", "roll", "fb", "radio", "battery", "board"];
    if (!aTarget) {
        console.error('Cannot board undefined target');
    }
    // is perfect boarding required (distance, centerline offset, relative rotation)
    if (aTarget.perfectBoard) {
        a = SC.radToDeg(SC.player.dir.angleFrom(aTarget.dir));
        centerline = Line.create(aTarget.pos, aTarget.dir);
        d = SC.player.pos.distanceFrom(centerline);
        // the alignment must be perfect
        if (a > 10) {
            SC.sound.sayMeters(Math.ceil(a), 'degrees');
            return;
        }
        // off center distance must be within limit
        if (d > 0.5) {
            SC.sound.sayMeters(Math.ceil(100 * d), 'centimeters off center');
            return;
        }
        // rotation must match
        if (aTarget.rot.subtract(SC.player.rot).modulus() > 0.1) {
            SC.sound.say('Match rotation!');
            return;
        }
    }

    SC.target = null;
    // stop original player so that it won't drift away
    SC.player.speed = aTarget.speed.dup();
    // switch ships
    SC.oldPlayer = SC.player;
    SC.player = aTarget;
    SC.player.unboardTo = SC.oldPlayer;
    SC.ship = aTarget;
    // make sure new ship can be rotated
    aTarget.rot = aTarget.rot || Vector.create([0, 0, 0]);
    // show/hide gauges
    for (i = 0; i < gauges.length; i++) {
        if (!aTarget.gauges || aTarget.gauges.indexOf(gauges[i]) >= 0) {
            SC.panel.unhideGauge(gauges[i]);
        } else {
            SC.panel.hideGauge(gauges[i], cap.indexOf(gauges[i]) >= 0);
        }
    }
    // break gauges
    console.log('breaking', aTarget.broken);
    for (k in SC.panel) {
        if (SC.panel.hasOwnProperty(k)) {
            if (SC.panel[k].hasOwnProperty('broken')) {
                SC.panel[k].broken = aTarget.broken && (aTarget.broken.indexOf(k) >= 0);
            }
        }
    }
    // break buttons
    for (k in SC.panel.buttons) {
        if (SC.panel.buttons.hasOwnProperty(k)) {
            if (SC.panel.buttons[k].hasOwnProperty('broken')) {
                SC.panel.buttons[k].broken = aTarget.broken && (aTarget.broken.indexOf(k) >= 0);
            }
        }
    }
    // update panel and re-render
    SC.panel.update(SC.player);
    SC.panel.redraw();
};

SC.boardNearest = function () {
    // Find nearest boardable object within 3m and board it
    var i, n = SC.gos.findNearestFrom(SC.player), d3 = false, b = false;
    for (i = 0; i < n.length; i++) {
        if (n[i].d <= 3) {
            d3 = true;
            if (n[i].o.boardable) {
                b = true;
                SC.board(n[i].o);
                return true;
            }
        }
    }
    if (!d3) {
        SC.sound.say('Nothing to board within 3 meters!');
        return;
    }
    if (!b) {
        SC.sound.say('No boardable object within 3 meters!');
        return;
    }
};

SC.gosRemove = function (aNames) {
    // Remove items from gos, usually in special missions for performance reason
    var i, j;
    aNames = Array.isArray(aNames) ? aNames : aNames.split(',');
    for (i = 0; i < aNames.length; i++) {
        for (j = SC.gos.items.length - 1; j > 0; j--) {
            if (SC.gos.items[j].name === aNames[i]) {
                SC.gos.items.splice(j, 1);
            }
        }
    }
};
