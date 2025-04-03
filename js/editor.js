// Mission editor
"use strict";
// global: document, window, setTimeout, console, alert, prompt
// linter: ngspicejs-linter

var SC = window.SC || {};

SC.editor = null;
SC.missionName = SC.storage.readString('CA_RECENT_CUSTOM', 'Custom');
SC.missionData = SC.storage.readString('CA_CUSTOM_' + SC.missionName, '');

SC.onSave = function () {
    // Save current mission, run linter and show errors
    var compiled, errors, custom_missions;
    //SC.editor.innerHTML = Prism.highlight(SC.editor.textContent, Prism.languages.javascript, 'javascript');
    SC.missionData = SC.editor.value; //SC.editor.textContent;
    SC.storage.writeString('CA_CUSTOM_' + SC.missionName, SC.missionData);
    console.log('Saved ' + SC.missionData.length + ' bytes as ' + SC.missionName);
    SC.loadMissionsCombo();
    // compile
    compiled = SC.compileCustomMission(SC.missionName);
    window.compiled = compiled;
    // check if all CA stuff is there
    if (!compiled) {
        SC.showToast('Not compiled!');
        return;
    }
    if (compiled.category !== 'Custom missions') {
        SC.showToast('self.category must be "Custom missions"!');
        return;
    }
    if (typeof compiled.title !== 'string') {
        SC.showToast('self.title must be string');
        return;
    }
    if (typeof compiled.summary !== 'string') {
        SC.showToast('self.summary must be string');
        return;
    }
    if (typeof compiled.description !== 'string') {
        SC.showToast('self.description must be string');
        return;
    }
    if (typeof compiled.init !== 'function') {
        SC.showToast('self.init is not a function!');
        return;
    }
    // beautifier
    SC.editor.value = SC.beautifyJs(SC.editor.value);
    //SC.editor.textContent = SC.beautifyJs(SC.editor.textContent);
    // linter
    errors = SC.lintJsTextarea(SC.editor);
    if (errors.length > 0) {
        return;
    }
    // save name/title/summary for custom pinboard
    custom_missions = SC.storage.readObject('CA_PINBOARD_CUSTOM_MISSIONS', {});
    custom_missions[SC.missionName] = {
        category: compiled.category,
        title: compiled.title,
        summary: compiled.summary,
        description: compiled.description
    };
    SC.storage.writeObject('CA_PINBOARD_CUSTOM_MISSIONS', custom_missions);
    // ok
    document.getElementById('save').style.color = 'green';
    setTimeout(function () {
        document.getElementById('save').style.color = '';
    }, 500);
    return true;
};

SC.onBack = function () {
    // Go back to main menu
    document.location = 'index.html';
};

SC.onRun =  function () {
    // Run this missions
    SC.shared.set(JSON.stringify({mission: SC.missionName, mode: 'custom'}));
    document.location = 'fly.html';
};

SC.onHamburger = function () {
    // Handle menu
    SC.popup([
        'Run',
        //'Syntax highlight',
        'Help',
        'Create new mission',
        'Rename mission',
        'Delete mission',
        'Edit existing mission',
        'Wrap/Unwrap lines',
        'Close editor'
    ], function (aButton) {
        switch (aButton) {
        case "Run":
            if (!SC.onSave()) {
                return;
            }
            return SC.onRun();
        //case "Syntax highlight":
        //    return SC.editor.innerHTML = Prism.highlight(SC.editor.textContent, Prism.languages.javascript, 'javascript');
        case "Wrap/Unwrap lines":
            SC.editor.style.whiteSpace = SC.editor.style.whiteSpace === 'nowrap' ? 'initial' : 'nowrap';
            return;
        case "Create new mission":
            return SC.onNewMission();
        case "Rename mission":
            return SC.onRenameMission();
        case "Delete mission":
            return SC.onDeleteMission();
        case "Edit existing mission":
            return SC.onEditExistingMission();
        case "Help":
            document.location = 'editor_help.html';
            return;
        case "Close editor":
            return SC.onBack();
        }
    });
};

SC.getMissionSource = function (aMission, aCallback) {
    // Get mission source
    SC.fetch('js/mission/' + SC.missions[aMission].filename, function (aSrc) {
        var lines = aSrc.split('\n'),
            a = lines.map((s) => s.trim()).indexOf('// source begin'),
            b = lines.map((s) => s.trim()).indexOf('// source end'),
            indent = 999;
        lines = lines.slice(a + 1, b - 0);
        // find shortest indentation, should be 4
        lines.filter((s) => s !== '').forEach((s) => indent = Math.min(indent, s.match(/^[ ]+/)[0].length));
        // remove indentation
        if (indent % 4 === 0) {
            lines = lines.map((s) => s.substr(indent));
        }
        aCallback(lines.join('\n'));
    });
};

SC.onEditExistingMission = function () {
    // Edit existing missions
    var titles = {}, k, p;
    for (k in SC.missions) {
        if (SC.missions.hasOwnProperty(k)) {
            titles[k + ' - ' + SC.missions[k].title] = k;
        }
    }
    p = SC.popup(Object.keys(titles), function (aMission) {
        k = titles[aMission];
        SC.getMissionSource(k, function (aSrc) {
            SC.editor.value = aSrc;
            SC.missionName = titles[aMission];
            SC.loadMissionsCombo(SC.missionName).value = SC.missionName;
        });
    });
    p.style.overflowY = 'scroll';
    p.style.maxHeight = '75vh';
};

SC.onNewMission = function () {
    // Create new mission
    var s = prompt('Mission name', '');
    if (!s) {
        return;
    }
    s = s.trim();
    if (SC.storage.keyExists(s)) {
        SC.splash('Mission "' + s + '" already exists!');
        return;
    }
    SC.missionName = s;
    SC.getMissionSource('S')
    SC.missionData = SC.sources.S.replace('{MISSION_TITLE}', s);
    SC.editor.value = SC.missionData;
    //SC.editor.textContent = SC.missionData;
    SC.onSave();
    SC.loadMissionsCombo().value = SC.missionName;
    SC.storage.writeString('CA_RECENT_CUSTOM', SC.missionName);
};

SC.onRenameMission = function () {
    // Rename current mission
    var s = prompt('Rename mission', SC.missionName).trim(), p, c, old = SC.missionName;
    if (!s) {
        return;
    }
    if (SC.storage.keyExists('CA_CUSTOM_' + s)) {
        SC.splash('Mission "' + s + '" already exists!');
        return;
    }
    SC.storage.erase('CA_CUSTOM_' + SC.missionName);
    SC.missionName = s;
    c = SC.loadMissionsCombo();
    setTimeout(function () {
        c.value = SC.missionName;
    }, 500);
    SC.onSave();
    // delete old from pinboard
    p = SC.storage.readObject('CA_PINBOARD_CUSTOM_MISSIONS', {});
    delete p[old];
    SC.storage.writeObject('CA_PINBOARD_CUSTOM_MISSIONS', p);
};

SC.onDeleteMission = function () {
    SC.splash('Delete mission', ['Delete', 'Cancel'], 'pink', 'Are you sure you want to delete mission "' + SC.missionName + '"?', function (aButton) {
        if (aButton === 'Delete') {
            SC.storage.erase('CA_CUSTOM_' + SC.missionName);
            SC.missionName = 'Custom';
            SC.missionData = {};
            SC.loadMissionsCombo();
            //SC.storage.erase()
        }
    }, '60vw');
};

SC.loadMissionsCombo = function (aNewMissionName) {
    // Show custom missions in combo
    var i,
        keys = SC.storage.keys(),
        s = document.getElementById('missions'),
        o,
        v = s.value;
    // remove old
    o = s.getElementsByTagName('option');
    while (o.length > 1) {
        o[1].parentElement.removeChild(o[1]);
    }
    // add new
    var found = false;
    for (i = 0; i < keys.length; i++) {
        if (keys[i].match(/^CA_CUSTOM_/)) {
            o = document.createElement('option');
            //o.value = keys[i];
            o.textContent = keys[i].replace(/^CA_CUSTOM_/, '');
            s.appendChild(o);
            if (o.textContent === aNewMissionName) {
                found = true;
            }
        }
    }
    // new mission
    if (aNewMissionName) {
        o = document.createElement('option');
        o.textContent = aNewMissionName;
        s.appendChild(o);
    }
    s.value = v;
    return s;
};

SC.onMissionChange = function (event) {
    // Change combo with missions
    SC.missionName = event.target.value;
    SC.missionData = SC.storage.readString('CA_CUSTOM_' + SC.missionName, '{}');
    SC.editor.value = SC.missionData;
    //SC.editor.textContent = SC.missionData;
    SC.storage.writeString('CA_RECENT_CUSTOM', SC.missionName);
};

window.addEventListener('DOMContentLoaded', function () {
    SC.editor = document.getElementById('editor');
    SC.editor.contentEditable = true;

    // callbacks
    document.getElementById('back').addEventListener('click', SC.onBack, true);
    document.getElementById('save').addEventListener('click', SC.onSave, true);
    document.getElementById('hamburger').addEventListener('click', SC.onHamburger, true);
    document.getElementById('missions').addEventListener('change', SC.onMissionChange, true);

    // fill missions to combo
    SC.loadMissionsCombo().value = SC.missionName;
    SC.editor.value = SC.missionData;
    //SC.editor.textContent = SC.missionData;

    SC.back.push(SC.onBack);
});
