// Compile custom mission
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.compileCustomMission = function (aMissionName) {
    var code = SC.storage.readString('CA_CUSTOM_' + aMissionName),
        lines = [],
        m;

    // wrapper
    lines.push('(function () {');
    //lines.push('    var self = SC.common();');
    lines.push('    ' + code.split('\n').join('\n    '));
    lines.push('    return self;');
    lines.push('}())');

    console.log(lines.join('\n'));
    try {
        m = eval(lines.join('\n'));
    } catch (e) {
        console.error('Compile error:', e);
        window.e = e;
        SC.showToast(e.message);
    }
    window.m = m;
    return m;
};

