// Bulletin board with missions
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.bulletin = (function () {
    var self = {};
    self.boards = [];
    self.items = [];
    self.current = SC.storage.readNumber('CA_BULLETIN_CURRENT', 0);

    self.update = function () {
        // show current board, hide others
        var i;
        for (i = 0; i < self.boards.length; i++) {
            if (i < self.current) {
                self.boards[i].classList.remove('hideRight');
                self.boards[i].classList.add('hideLeft');
            }
            if (i === self.current) {
                self.boards[i].classList.remove('hideLeft');
                self.boards[i].classList.remove('hideRight');
            }
            if (i > self.current) {
                self.boards[i].classList.add('hideRight');
                self.boards[i].classList.remove('hideLeft');
            }
        }
        // hide buttons at edges
        if (self.current === 0) {
            document.getElementById('previous').classList.add('hide');
        } else {
            document.getElementById('previous').classList.remove('hide');
        }
        if (self.current === self.boards.length - 1) {
            document.getElementById('next').classList.add('hide');
        } else {
            document.getElementById('next').classList.remove('hide');
        }
    };

    self.onPrevious = function () {
        // previous board
        if (self.current === 0) {
            return;
        }
        self.current--;
        self.update();
        SC.storage.writeNumber('CA_BULLETIN_CURRENT', self.current);
    };

    self.onNext = function () {
        // next board
        if (self.current === self.boards.length - 1) {
            return;
        }
        self.current++;
        self.update();
        SC.storage.writeNumber('CA_BULLETIN_CURRENT', self.current);
    };

    // bind swipe gestures
    SC.swipe(self.onPrevious, self.onNext);

    function onItemClick(event) {
        // Show closeup of paper with mission details
        var k = event.target.dataMission;
        document.getElementById('paper_title').textContent = SC.missions[k].title;
        document.getElementById('paper_title').scrollIntoView();
        document.getElementById('paper_summary').textContent = SC.missions[k].summary;
        document.getElementById('paper_description').textContent = SC.missions[k].description;
        document.getElementById('dialog').classList.remove('hide');
        try {
            if (document.getElementById('paper').scrollTo) {
                document.getElementById('paper').scrollTo(0, 0);
            }
        } catch (e) {
            console.warn(e);
        }
        // accept
        document.getElementById('accept').onclick = function () {
            if (SC.customAccept) {
                SC.customAccept(k);
                return;
            }
            SC.shared.set(JSON.stringify({mission: k, mode: SC.missions[k].custom ? 'custom' : 'accept'}));
            document.location = 'fly.html';
        };
        // hide dialog
        document.getElementById('decline').onclick = function () {
            document.getElementById('dialog').classList.add('hide');
            SC.back.pop();
        };
        // hide by clicking oustide paper
        document.getElementById('dialog').onclick = function (event) {
            if (event.target.id === 'dialog') {
                document.getElementById('dialog').classList.add('hide');
            }
            SC.back.pop();
        };
        // hide by back button
        SC.back.push(function () {
            document.getElementById('dialog').classList.add('hide');
        });
    }
    SC.back.push(function () {
        document.location.reload();
    });

    self.addMission = function (aMissionKey, aMission) {
        // Add single mission to correct board
        var parent = document.getElementById(aMission.category.toLowerCase().replace(/ /g, '_')), item, title, p, angle;
        // item
        item = document.createElement('div');
        self.items.push(item);
        item.classList.add('item');
        if (SC.storage.keyExists('CA_MISSION_SCORE_' + aMissionKey)) {
            item.classList.add('done');
        }
        // prng for item angle
        angle = (aMissionKey + aMission.title).split('').map(function (a) { return a.charCodeAt(0); }).reduce(function (a, b) { return a + b; });
        angle = 3 * (angle % 100 - 50) / 50;
        //angle = 8 * (Math.random() - Math.random());
        item.style.transform = 'rotate(' + angle.toFixed(1) + 'deg)';
        item.dataMission = aMissionKey;
        item.addEventListener('click', onItemClick);
        item.title = "Start mission";
        parent.appendChild(item);
        // title
        title = document.createElement('h2');
        title.textContent = aMission.title;
        title.dataMission = aMissionKey;
        item.appendChild(title);
        // p
        p = document.createElement('p');
        p.textContent = aMission.summary;
        p.dataMission = aMissionKey;
        item.appendChild(p);
    };

    self.onEditor = function () {
        // Load editor
        document.location = 'editor.html';
    };

    self.onBugReport = function () {
        // Open github's issues
        window.open('https://github.com/dvhx/game-callisto-space-simulator/issues', '_blank');
    };

    window.addEventListener('DOMContentLoaded', function () {
        if (window.innerWidth < window.innerHeight) {
            SC.showToast('This game can only be played in landscape mode!');
        }
        self.boards = document.getElementsByClassName('bulletin');
        // buttons
        document.getElementById('previous').addEventListener('click', self.onPrevious, true);
        document.getElementById('next').addEventListener('click', self.onNext, true);
        // home
        document.getElementById('btn_missions').addEventListener('click', self.onNext, true);
        document.getElementById('btn_editor').addEventListener('click', self.onEditor, true);
        document.getElementById('btn_bug_report').addEventListener('click', self.onBugReport, true);
        // add missions
        var k, cm;
        for (k in SC.missions) {
            if (SC.missions.hasOwnProperty(k)) {
                self.addMission(k, SC.missions[k]);
            }
        }
        // add custom missions
        cm = SC.storage.readObject('CA_PINBOARD_CUSTOM_MISSIONS', {});
        for (k in cm) {
            if (cm.hasOwnProperty(k)) {
                if (SC.storage.keyExists('CA_CUSTOM_' + k)) {
                    self.addMission(k, cm[k]);
                    cm[k].custom = true;
                    SC.missions[k] = cm[k];
                }
            }
        }
        self.update();
    });


    return self;
}());

