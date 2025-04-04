// Mission clipboard
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.clipboard = function () {
    var self = {}, anchor = 0;

    self.div = document.createElement('div');
    self.div.className = 'mission_clipboard';
    self.board = document.createElement('div');
    self.board.className = 'board';
    self.top = document.createElement('div');
    self.top.className = 'top';
    self.middle = document.createElement('div');
    self.middle.className = 'middle';
    self.bottom = document.createElement('div');
    self.bottom.className = 'bottom';
    self.div.appendChild(self.board);
    self.board.appendChild(self.top);
    self.board.appendChild(self.middle);
    self.board.appendChild(self.bottom);

    self.show = function () {
        // show clipboard
        self.div.style.display = '';
        SC.back.push(self.hide);
    };

    self.hide = function () {
        // hide clipboard
        self.div.style.display = 'none';
    };
    self.hide();

    self.div.addEventListener('click', function (event) {
        // click on background will hide clipboard
        if (event.target === self.div) {
            self.hide();
            SC.back.pop();
        }
    }, true);

    self.h1 = function (aText) {
        // section title, also adds it to contents
        var e = document.createElement('h1'), li, a;
        e.textContent = aText;
        anchor++;
        e.id = 'anchor' + anchor;
        self.middle.appendChild(e);
        if (self.contents) {
            li = document.createElement('li');
            a = document.createElement('a');
            a.href = '#anchor' + anchor;
            a.textContent = aText;
            li.appendChild(a);
            self.contents.appendChild(li);
        }
        return e;
    };

    self.pair = function (aKey, aValue) {
        // add "key: value" pair
        var e = document.createElement('div');
        e.textContent = aKey + ': ' + aValue;
        self.middle.appendChild(e);
        return e;
    };

    self.p = function (aText) {
        // add paragraph
        var e = document.createElement('p');
        e.textContent = aText;
        self.middle.appendChild(e);
        return e;
    };

    // contents
    self.contentsTitle = self.h1('Contents');
    self.contents = document.createElement('ul');
    self.middle.appendChild(self.contents);

    // standard mission header
    self.h1('Summary');
    self.pair('Codename', SC.mission.title);
    self.pair('Category', SC.mission.category);
    self.p(SC.mission.summary);
    self.h1('Description');
    self.p(SC.mission.description);

    self.signature = function (aCallback, aData) {
        // add signature
        var s = document.createElement('div'),
            c = document.createElement('div'),
            i = document.createElement('img'),
            b = document.createElement('div');
        s.className = 'signature';
        c.className = 'container';
        i.src = 'image/signature-empty.png';
        c.onclick = function () {
            if (aCallback(aData || 'signature')) {
                c.onclick = null;
                i.src = 'image/signature.png';
                setTimeout(self.hide, 500);
            }
        };
        b.className = 'bot';
        b.textContent = 'signature';
        s.appendChild(c);
        c.appendChild(i);
        c.appendChild(b);
        self.middle.appendChild(s);
        return {div: s, container: c, img: i, label: b};
    };

    self.h1('Abort mission');
    self.p('Sign here to abort this mission');
    self.signature(function () {
        window.setTimeout(function () {
            document.location = 'pinboard.html';
        }, 1000);
        return true;
    }, 'abort');

    self.table = function (aData, aOldTable) {
        // add table or replace old table, data is [{col1: val1, col2: val2, ...}, {col1: val3, col2: val4, ...}, ...]
        var i, k, table = document.createElement('table'), tr, th, td;

        // replace old table
        if (aOldTable) {
            aOldTable.insertAdjacentElement('afterEnd', table);
            aOldTable.parentElement.removeChild(aOldTable);
        } else {
            self.middle.appendChild(table);
        }

        // first row with headers
        tr = document.createElement('tr');
        table.appendChild(tr);
        for (k in aData[0]) {
            if (aData[0].hasOwnProperty(k)) {
                th = document.createElement('th');
                th.textContent = k;
                tr.appendChild(th);
            }
        }

        // all rows
        for (i = 0; i < aData.length; i++) {
            tr = document.createElement('tr');
            table.appendChild(tr);
            // all column
            for (k in aData[i]) {
                if (aData[i].hasOwnProperty(k)) {
                    td = document.createElement('td');
                    if (typeof aData[i][k] === 'string' || typeof aData[i][k] === 'number' || typeof aData[i][k] === 'boolean') {
                        // simple cell
                        td.textContent = aData[i][k];
                    } else {
                        // html cell
                        //console.log('td', i, k, aData[i][k]);
                        td.appendChild(aData[i][k]);
                    }
                    tr.appendChild(td);
                }
            }
        }
        return table;
    };

    self.radios = function (aName, aValues) {
        // add bunch of radios
        var p = document.createElement('div'),
            l,
            r,
            i,
            o = {div: p, radio: {}};
        function onInputRadio(event) {
            o.value = event.target.dataValue;
        }
        for (i = 0; i < aValues.length; i++) {
            l = document.createElement('label');
            l.style.whiteSpace = 'nowrap';
            p.appendChild(l);
            p.appendChild(document.createTextNode(' '));
            r = document.createElement('input');
            r.type = 'radio';
            r.name = aName;
            r.dataValue = aValues[i];
            r.addEventListener('click', onInputRadio);
            o.radio[aName + i] = r;
            //r.setAttribute('name', aName);
            l.appendChild(r);
            l.appendChild(document.createTextNode(aValues[i]));
        }
        return o;
    };

    self.signature = function (aCallback, aData) {
        // add signature
        var s = document.createElement('div'),
            c = document.createElement('div'),
            i = document.createElement('img'),
            b = document.createElement('div');
        s.className = 'signature';
        c.className = 'container';
        i.src = 'image/signature-empty.png';
        c.onclick = function () {
            if (aCallback(aData || 'signature')) {
                c.onclick = null;
                i.src = 'image/signature.png';
                setTimeout(self.hide, 500);
            }
        };
        b.className = 'bot';
        b.textContent = 'signature';
        s.appendChild(c);
        c.appendChild(i);
        c.appendChild(b);
        self.middle.appendChild(s);
        return {div: s, container: c, img: i, label: b};
    };

    self.blink = function (aElement, aTextContent) {
        // Blink element, used to show which part of the report is incomplete and shortly show the hint, e.g. "Fill the form"
        var old = aElement.textContent;
        if (aTextContent) {
            aElement.textContent = aTextContent;
        }
        aElement.style.opacity = 0.5;
        setTimeout(function () { aElement.style.opacity = 1; }, 200);
        setTimeout(function () { aElement.style.opacity = 0.5; }, 400);
        setTimeout(function () {
            aElement.style.opacity = 1;
            if (aTextContent) {
                aElement.textContent = old;
            }
        }, 600);
    };

    self.stats = function () {
        // add mission stats
        self.h1('Statistics');
        var t = self.table([{'Statistics': 'Not available'}]), o;
        o = SC.missionStats[SC.missionKey];
        if (!o) {
            return;
        }
        self.table([{
            'Attribute': 'Number of players',
            'Value': o.unique_players
        }, {
            'Attribute': 'Number of plays',
            'Value': o.plays
        }, {
            'Attribute': 'Successfull missions',
            'Value': o.finished
        }, {
            'Attribute': 'Success rate',
            'Value': (100 * o.finished / o.plays).toFixed(0) + '%'
        }, {
            'Attribute': 'Best time',
            'Value': SC.time.hms(o.min_time)
        }, {
            'Attribute': 'Average time',
            'Value': SC.time.hms(o.avg_time)
        }, {
            'Attribute': 'Worst time',
            'Value': SC.time.hms(o.max_time)
        }], t);
    };

    self.keyboard = function () {
        self.h1('Keyboard');
        self.p('If you have keyboard attached you can use following keys to control the ship. You can use mouse wheel to rotate knobs and LCDs.');
        self.table([
            {
                Key: 'a',
                Description: 'Yaw left'
            },
            {
                Key: 'd',
                Description: 'Yaw right'
            },
            {
                Key: 'w',
                Description: 'Pitch up'
            },
            {
                Key: 's',
                Description: 'Pitch down'
            },
            {
                Key: 'q',
                Description: 'Roll counter clockwise'
            },
            {
                Key: 'e',
                Description: 'Roll clockwise'
            },
            {
                Key: 'Arrow left',
                Description: 'Move left using thrusters'
            },
            {
                Key: 'Arrow right',
                Description: 'Move right using thrusters'
            },
            {
                Key: 'Arrow up',
                Description: 'Move up using thrusters'
            },
            {
                Key: 'Arrow down',
                Description: 'Move down using thrusters'
            },
            {
                Key: 'f',
                Description: 'Move forward using thrusters'
            },
            {
                Key: 'b',
                Description: 'Move backward using thrusters'
            },
            {
                Key: 'o',
                Description: 'Orto'
            },
            {
                Key: 'i',
                Description: 'S10'
            }
        ]);
    };

    self.avionics = function () {
        // add avionics table (images and description)
        self.h1('Avionics');

        function instrument(aName, aLabel) {
            // add single instrument label and image
            var div = document.createElement('div'),
                h3 = document.createElement('b'),
                img = document.createElement('img');
            h3.textContent = aLabel || aName;
            h3.style.display = 'block';
            h3.style.textAlign = 'center';
            h3.style.textTransform = 'capitalize';
            img.src = 'image/avionics_manual/' + aName + '.png';
            img.style.width = '25vw';
            div.appendChild(h3);
            div.appendChild(img);
            return div;
        }

        function button(aName, aLabel) {
            // add display button
            var div = document.createElement('div'),
                but = document.createElement('button');
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            but.textContent = aLabel || aName;
            but.className = 'push';
            but.style.fontSize = 'large';
            but.style.minWidth = '2cm';
            div.appendChild(but);
            return div;
        }

        // table with descriptions
        self.table([
            {
                Instrument: instrument('compass', 'Solar compass'),
                Description: 'Solar compass points red hand towards sun. When sun is directly on front of the ship red arrow will point up. It only works correctly if ship is oriented normally on ecliptic. If ship is pointing away from ecliptic it will not point to the sun. Use artificial horizon to orient ship in the plane of ecliptic first, then point towards the sun using compass.'
            },
            {
                Instrument: instrument('horizon', 'Artificial horizon'),
                Description: 'Attitude indicator (or artificial horizon) shows ship orientation relative to ecliptic plane. Blue half is north of ecliptic, brown half is south of ecliptic.'
            },
            {
                Instrument: instrument('lidar', 'Lidar'),
                Description: 'Lidar is similar to radar but uses laser instead of radio waves. Target first must be acquired using LDRA button (see below). Target is displayed as a small green dot, regardless of the size and distance. Lidar can only display one target. Number on the top is distance in meters. Number on bottom is approaching speed in m/s, negative number means target is getting farther away. Time on the bottom is estimated time of arrival (assuming constant speed and measured distance). Sensitivity is adjusted with the knob on upper left corner. Minimal sensitivity is 1, maximum is 1000. When the target become out of range (distance or angle wise) it dissapears and no numbers are displayed. Please note that autopilot requires target to be on the lidar. Zoom should be set to such value that it is sensitive enough, yet there is no risk of target falling out of range.'
            },
            {
                Instrument: instrument('display', 'Main display'),
                Description: 'Main display shows feed from ship\'s front camera in 3D mode and top view of your ship in 2D view. Zoom only works in 2D view. It also displays textual information, for example after target acquisition it displays it\'s name and distance. It also displays walkthrough and other important mission informations. It is touch sensitive and it can display buttons that can be pressed.'
            },
            {
                Instrument: instrument('linsim', 'Linear simulator'),
                Description: 'LinSim is linear simulator. It can simulate one dimensional newtonian movement. Together with lidar, this is the most important piece of avionics. It can be used to accurately estimate fuel consumption, distance, time and delta V. Every parameter can be adjusted by rotating knob (also by sliding across LCD surface or using up/down buttons on main display). If ship has working fuel indicator, fuel mass is updated automatically. Displayed parameters are: m - ship mass (kg), mf - fuel mass (kg), F - thrusters force (N), fc - fuel consumption (g/s), V0 - initial speed (m/s), T - time (s), s - final distance (m), V - final speed (s). For example if you are approaching target at 20km/s and you want to know the fastest way to break, move T knob until V is 20. Then you know what distance in front of the target to start breaking and how long it will take.'
            },
            {
                Instrument: instrument('radio', 'Radio receiver'),
                Description: 'Radio receiver can receive in 3 bands (kHz, MHz, and GHz). The available frequencies are in the table above, but may differ in each mission. Adjust frequency knob to find radio station. Then you can decrease angle until station dissapear. Slowly rotate ship in different directions until the station appears again. Decrease angle again and continue. When you reach 5 degrees angle or so the target should be somewhere in front of you.'
            },
            {
                Instrument: instrument('battery', 'Battery indicator'),
                Description: 'Battery indicator shows voltage and current of battery.'
            },
            {
                Instrument: instrument('thrusters', 'Active thrusters'),
                Description: 'Active thrusters indicator shows number of active thrusters (1-3) using yellow arrow. Green arrow shows amount of thrust. If you are moving forward half thrust it will be somewhere in the middle. If you moving forward in full speed it will be on the left. If you are moving diagonally at max. speed it will go slightly behind the corner.'
            },
            {
                Instrument: instrument('fuel', 'Fuel gauge'),
                Description: 'Fuel gauge shows remaining fuel. Exact numerical value of remaining fuel is shown in linsim (mf). Your ship has 500kg of fuel but it can be increased using SRB.'
            },
            {
                Instrument: instrument('rotation', 'Rotation indicator'),
                Description: 'Rotation indicator shows relative rotation in three axes. Yaw (yellow), pitch (pink) and roll (red). To stop ship\'s rotation simply rotate in opposite direction until it stops completely.'
            },
            {
                Instrument: instrument('clock', 'Mission clock'),
                Description: 'Mission clock displays time elapsed from the start of the mission. Certain long missions allow to speed up time. Use + button in upper right corner to increase speed, use - button in bottom right corner to decrease speed. To set normal speed press 1x button in upper left corner. In the bottom left corner is small display that shows current speed. Small windows near center show AM/PM and elapsed days for very long missions.'
            },
            {
                Instrument: instrument('pan', 'Rotation joystick'),
                Description: 'Rotation joystick changes yaw (yellow) a and pitch (pink) rotation. If you want to rotate only one direction use ORTO. Use S/10 for finer adjustment of rotation. LED diodes in upper right corner shows which axis is active. Rotation is performed using reaction wheels and therefore does not consume fuel.'
            },
            {
                Instrument: instrument('roll', 'Roll lever'),
                Description: 'Roll lever rotates ship in forward direction clockwise (down) or counter clockwise (up). Current relative rotation is in rotation indicator (red). Roll is performed using reaction wheel and therefore does not consume fuel.'
            },
            {
                Instrument: instrument('fb', 'Forward/Backward lever'),
                Description: 'Forward/back thruster lever moves ship forward (up) and back (down). It is also used to decide which way will SRB fire.'
            },
            {
                Instrument: instrument('thrust', 'Thrusters'),
                Description: 'Thrusters joystick moves ship left, right, up and down using engines. You can use ORTO button to lock it in one axis. Use S/10 to decrease sensitivity for fine adjustments.'
            },
            {
                Instrument: button('ldra', 'LDRA'),
                Description: 'LiDaR Acquisition button adds target that is closes to the center of the display to lidar.'
            },
            {
                Instrument: button('sld', 'SLD'),
                Description: 'SLD (Say Lidar Distance) activates saying lidar distance using text-to-speech system. This is usefull when you approaching long-distance target but you need to do something else meanwhile.'
            },
            {
                Instrument: button('cpy', 'CPY'),
                Description: 'Center Pitch Yaw will try to center your ship towards the target using rotation only, without consuming fuel. If the target\'s movement is too fast it will go out of lidar range and CPY will stop. It is usefull for approaching target.'
            },
            {
                Instrument: button('ctr', 'CTR'),
                Description: 'Center ThRusters will use left/right/up/down thrusters to center target into center of the screen. It consumes fuel but unlike CPY it is able to keep up with moving target. If the target moves out of lidar range CTR will stop.'
            },
            {
                Instrument: button('abr', 'ABR'),
                Description: 'Auto BReaking will measure approaching speed to the target and at certain distances will gradually slow down approach. It is quite conservative so the aproach is not fastest but it is relatively reliable. It must be paired with CPY or CTR otherwise target will slowly goes out of lidar range.'
            },
            {
                Instrument: button('ref', 'REF'),
                Description: 'Refuel ship. If you are within 3m of refueling station (e.g. C1, C2, C3, G1, E1, I1, ISS) and it is in lidar and you press REF button your fuel will be slowly replenished. You must remain in the 3m distance otherwise the refueling will stop.'
            },
            {
                Instrument: button('board', 'BOARD'),
                Description: 'Board the ship. When you press this button you will board the closest boardable ship. Not all ships can be boarded. Press it again and you will return to your original ship (if it is still within boarding distance).'
            },
            {
                Instrument: button('3D', '3D'),
                Description: 'Turn off/on 3D display. If 3D is off 2D top view is displayed instead with your ship centered in the display.'
            },
            {
                Instrument: button('zoom_in', 'ZOOM+'),
                Description: 'Increase zoom in 2D mode.'
            },
            {
                Instrument: button('zoom_out', 'ZOOM-'),
                Description: 'Decrease zoom in 2D mode.'
            },
            {
                Instrument: button('s10', 'S/10'),
                Description: 'Sensitivity/10 will decrease sensitivity of rotation and thrusters joysticks by factor of 10. When you press it again normal sensitivity will be restored. CPY/CTR are not affected by sensitivity.'
            },
            {
                Instrument: button('orto', 'ORTO'),
                Description: 'Lock joystick to one orthogonal axis. If you press ORTO it will become yellow. This indicate that rotation joystick is changing only yaw and thrusters only works left/right. If you press ORTO again it will change color to pink. This means that rotation joystick only works in pitch axis and thrusters only in up/down axis. If you press ORTO again it will enable both axes. Which axis is enabled is indicated by LED diodes in upper right corner of joysticks.'
            },
            {
                Instrument: button('photo', 'PHOTO'),
                Description: 'Create one photograph of space in front of the ship. Photographic missions requires you to press this button to obtain photograph of the target. After you take all photos open mission clipboard and sign the report.'
            },
            {
                Instrument: button('srb', 'SRB'),
                Description: 'Solid Rocket Booster is special rocket. It weights 500kg plus 1380kg of fuel which gives you additional 73kN of thrust for 25s. After this time it is detached. If you want to detach SRB sooner than 25s press SRB and currently firing SRB will be detached. In certain missions you can choose how many SRB to equip your ship. In certain missions you can choose if SRB fires forward or backward. To do so shortly press F/B lever in desired direction and press SRB button.'
            }
        ]);
    };


    document.body.appendChild(self.div);

    return self;
};
