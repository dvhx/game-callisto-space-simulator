// Generate TOS for help
"use strict";
// globals: document, window

var SC = window.SC || {};

window.addEventListener('DOMContentLoaded', function () {
    var ul = document.getElementById('tos'),
        li,
        a,
        h2 = document.getElementsByTagName('h2'),
        i;
//        js = 'javascript';
    for (i = 0; i < h2.length; i++) {
        h2[i].setAttribute('id', 'anchor' + i);
        li = document.createElement('li');
        a = document.createElement('a');
        a.href = '#' + 'anchor' + i;
        a.textContent = h2[i].textContent;
        li.appendChild(a);
        ul.appendChild(li);
    }
    document.getElementById('solar_names').textContent = Object.keys(SC.solarSystem.data).join(', ');
    document.getElementById('model_names').textContent = Object.keys(SC.modelData).join(', ');
    SC.back.push(SC.onBack);
});
