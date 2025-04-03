// Models data
"use strict";
// globals: window, Vector, document

var SC = window.SC || {};

SC.modelData = {
    // player's ship
    delta: {
        vertices: [
            Vector.create([-1.0, -1.0, 0.3]),    // 0 right tip
            Vector.create([2.0, 0.0, 0.0]),     // 1 left tip
            Vector.create([-1.0, 1.0, 0.3]),      // 2 front tip
            Vector.create([-0.7, 0.0, -0.5])      // 3 upper tip
        ],
        lines: [
            // bottom
            [0, 1],
            [1, 2],
            [2, 0],
            // back
            [0, 3],
            [1, 3],
            // front
            [2, 3]
        ]
    },
    // cube
    cube: {
        vertices: [
            // cube
            Vector.create([-1.000, -1.000, 1.000 ]),      // 0
            Vector.create([1.000, -1.000, 1.000 ]),       // 1
            Vector.create([-1.000, 1.000, 1.000 ]),       // 2
            Vector.create([1.000, 1.000, 1.000 ]),        // 3
            Vector.create([1.000, -1.000, -1.000 ]),      // 4
            Vector.create([-1.000, -1.000, -1.000 ]),     // 5
            Vector.create([1.000, 1.000, -1.000 ]),       // 6
            Vector.create([-1.000, 1.000, -1.000 ])       // 7
        ],
        lines: [
            // front face
            [0, 1],
            [1, 3],
            [3, 2],
            [2, 0],
            // back face
            [5, 4],
            [4, 6],
            [6, 7],
            [7, 5],
            // bars
            [0, 5],
            [1, 4],
            [2, 7],
            [3, 6]
        ]
    },
    // virtual gate for deorbit
    gate: {
        vertices: [
            Vector.create([0, -1.000, -1.000]),      // 0
            Vector.create([0, 1.000, -1.000]),       // 1
            Vector.create([0, -1.000, 1.000]),       // 2
            Vector.create([0, 1.000, 1.000]),        // 3
            Vector.create([0, -0.100, 0]),           // 4 center left
            Vector.create([0, 0.100, 0]),            // 5 center right
            Vector.create([0, 0, -0.100]),           // 6 center down
            Vector.create([0, 0, 0.100])             // 7 center up
        ],
        lines: [
            // front face
            [0, 1],
            [1, 3],
            [3, 2],
            [2, 0],
            [4, 5],
            [6, 7]
        ]
    },
    // radio beacon
    beacon: {
        vertices: [
            Vector.create([-0.500, 0.500, 0.000 ]),     // 0 mid 7
            Vector.create([0.500, 0.500, 0.000 ]),      // 1 mid 9
            Vector.create([0.000, 0.000, 1.000 ]),      // 2 top
            Vector.create([0.500, -0.500, 0.000 ]),     // 3 mid 3
            Vector.create([-0.500, -0.500, 0.000 ]),    // 4 mid 1
            Vector.create([0.000, 0.000, -1.000 ])      // 5 bottom
        ],
        lines: [
            // top
            [2, 0],
            [2, 1],
            [2, 3],
            [2, 4],
            // bottom
            [5, 0],
            [5, 1],
            [5, 3],
            [5, 4],
            // mid square
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 0]
        ]
    },
    // refueling station
    station: {
        vertices: [
            // cube
            Vector.create([-1.000, -1.000, 1.000 ]),      // 0
            Vector.create([1.000, -1.000, 1.000 ]),       // 1
            Vector.create([-1.000, 1.000, 1.000 ]),       // 2
            Vector.create([1.000, 1.000, 1.000 ]),        // 3
            Vector.create([1.000, -1.000, -1.000 ]),      // 4
            Vector.create([-1.000, -1.000, -1.000 ]),     // 5
            Vector.create([1.000, 1.000, -1.000 ]),       // 6
            Vector.create([-1.000, 1.000, -1.000 ]),      // 7
            // left panel
            Vector.create([0, 1.000, 0.700]),        // 8
            Vector.create([0, 1.000, -0.700]),       // 9
            Vector.create([0, 6.000, 0.700]),        // 10
            Vector.create([0, 6.000, -0.700]),       // 11
            // right panel
            Vector.create([0, -6.000, 0.700 ]),       // 12
            Vector.create([0, -6.000, -0.700 ]),      // 13
            Vector.create([0, -1.000, 0.700 ]),       // 14
            Vector.create([0, -1.000, -0.700 ])       // 15
        ],
        lines: [
            // front face
            [0, 1],
            [1, 3],
            [3, 2],
            [2, 0],
            // back face
            [5, 4],
            [4, 6],
            [6, 7],
            [7, 5],
            // bars
            [0, 5],
            [1, 4],
            [2, 7],
            [3, 6],
            // left panel
            [8, 9],
            [9, 11],
            [11, 10],
            [10, 8],
            // right panel
            [12, 13],
            [13, 15],
            [15, 14],
            [14, 12]
        ]
    },
    // relay satellite, like station but one extra line pointing forward
    relay: {
        vertices: [
            // cube
            Vector.create([-1.000, -1.000, 1.000 ]),      // 0
            Vector.create([1.000, -1.000, 1.000 ]),       // 1
            Vector.create([-1.000, 1.000, 1.000 ]),       // 2
            Vector.create([1.000, 1.000, 1.000 ]),        // 3
            Vector.create([1.000, -1.000, -1.000 ]),      // 4
            Vector.create([-1.000, -1.000, -1.000 ]),     // 5
            Vector.create([1.000, 1.000, -1.000 ]),       // 6
            Vector.create([-1.000, 1.000, -1.000 ]),      // 7
            // left panel
            Vector.create([0, 1.000, 0.700]),        // 8
            Vector.create([0, 1.000, -0.700]),       // 9
            Vector.create([0, 6.000, 0.700]),        // 10
            Vector.create([0, 6.000, -0.700]),       // 11
            // right panel
            Vector.create([0, -6.000, 0.700 ]),      // 12
            Vector.create([0, -6.000, -0.700 ]),     // 13
            Vector.create([0, -1.000, 0.700 ]),      // 14
            Vector.create([0, -1.000, -0.700 ]),     // 15
            // yagi
            Vector.create([1, 0, 0]),                // 16
            Vector.create([6, 0, 0])                 // 17
        ],
        lines: [
            // front face
            [0, 1],
            [1, 3],
            [3, 2],
            [2, 0],
            // back face
            [5, 4],
            [4, 6],
            [6, 7],
            [7, 5],
            // bars
            [0, 5],
            [1, 4],
            [2, 7],
            [3, 6],
            // left panel
            [8, 9],
            [9, 11],
            [11, 10],
            [10, 8],
            // right panel
            [12, 13],
            [13, 15],
            [15, 14],
            [14, 12],
            // yagi
            [16, 17]
        ]
    },
    // fighter
    fighter: {
        vertices: [
            Vector.create([2.700, 0.000, 0.000 ]),   // 0 tip
            Vector.create([1.700, 0.000, 0.700 ]),   // 1 front top
            Vector.create([1.700, -0.700, 0.000 ]),  // 2 front right
            Vector.create([1.700, 0.000, -0.700 ]),  // 3 front bottom
            Vector.create([1.700, 0.700, 0.000 ]),   // 4 front left
            Vector.create([-2.300, 0.000, 0.700 ]),  // 5 back top
            Vector.create([-2.300, -0.700, 0.000 ]), // 6 back right
            Vector.create([-2.300, 0.000, -0.700 ]), // 7 back bottom
            Vector.create([-2.300, 0.700, 0.000 ]),  // 8 back left
            Vector.create([-1.400, 0.700, 0.000 ]),  // 9 wing back
            Vector.create([-1.400, 2.000, 0.000 ]),  // 10 wing tip
            Vector.create([0.900, 0.700, 0.000 ]),   // 11 wing front
            Vector.create([-1.400, -0.700, 0.000 ]), // 12 wing back
            Vector.create([-1.400, -2.000, 0.000 ]), // 13 wing tip
            Vector.create([0.900, -0.70, 0.000 ]),   // 14 wing front
            Vector.create([-2.000, 0.000, 1.200 ]),  // 15 tail tip
            Vector.create([-1.200, 0.000, 0.700 ])   // 16 tail front
        ],
        lines: [
            // front face
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
            // front round
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 1],
            // body
            [1, 5],
            [2, 6],
            [3, 7],
            [4, 8],
            // back
            [5, 6],
            [6, 7],
            [7, 8],
            [8, 5],
            // left wing
            [9, 10],
            [10, 11],
            [11, 9],
            // right wing
            [12, 13],
            [13, 14],
            [14, 12],
            // tail
            [15, 16],
            [15, 5]
        ]
    },
    // large space station
    octagon: {
        vertices: [
            Vector.create([0.000, 3.000, 8.000 ]),      // 0 front (CW, 12 o'clock is 0, last is 7)
            Vector.create([2.000, 2.000, 8.000 ]),      // 1
            Vector.create([3.000, 0.000, 8.000 ]),      // 2
            Vector.create([2.000, -2.000, 8.000 ]),     // 3
            Vector.create([0.000, -3.000, 8.000 ]),     // 4
            Vector.create([-2.000, -2.000, 8.000 ]),    // 5
            Vector.create([-3.000, 0.000, 8.000 ]),     // 6
            Vector.create([-2.000, 2.000, 8.000 ]),     // 7
            Vector.create([0.000, 3.000, -8.000 ]),     // 8 back (same as front)
            Vector.create([2.000, 2.000, -8.000 ]),     // 9
            Vector.create([3.000, 0.000, -8.000 ]),     // 10
            Vector.create([2.000, -2.000, -8.000 ]),    // 11
            Vector.create([0.000, -3.000, -8.000 ]),    // 12
            Vector.create([-2.000, -2.000, -8.000 ]),   // 13
            Vector.create([-3.000, 0.000, -8.000 ]),    // 14
            Vector.create([-2.000, 2.000, -8.000 ]),    // 15
            Vector.create([0.000, 0.000, 8.000 ]),      // 16 center of front (unused)
            Vector.create([0.000, 0.000, -8.000 ])      // 17 center of back (unused)
        ],
        lines: [
            // front
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 0],
            // back
            [8, 9],
            [9, 10],
            [10, 11],
            [11, 12],
            [12, 13],
            [13, 14],
            [14, 15],
            [15, 8],
            // sides
            [0, 8],
            [1, 9],
            [2, 10],
            [3, 11],
            [4, 12],
            [5, 13],
            [6, 14],
            [7, 15]
        ]
    },
    // whale
    whale: {
        vertices: [
            Vector.create([2.702, 0.021, 0.09]),
            Vector.create([2.646, 0, -0.09]),
            Vector.create([1.683, 0, 0.381]),
            Vector.create([1.613, 0, -0.301]),
            Vector.create([-0.862, 0, 0.43]),
            Vector.create([-0.356, 0, -0.477]),
            Vector.create([-1.094, 0, 0.486]),
            Vector.create([-1.094, 0, -0.294]),
            Vector.create([-1.138, 0, 0.35]),
            Vector.create([-2.53, 0, -0.012]),
            Vector.create([1.64, -0.361, 0.066]),
            Vector.create([1.659, 0.464, 0.066]),
            Vector.create([0.619, -0.483, 0.066]),
            Vector.create([0.609, 0.512, 0.066]),
            Vector.create([-0.609, -0.445, 0.066]),
            Vector.create([-0.712, 0.445, 0.066]),
            Vector.create([-2.184, -0.108, 0.066]),
            Vector.create([-2.221, 0.061, 0.026]),
            Vector.create([-2.521, -0.23, 0.066]),
            Vector.create([-2.54, 0.136, 0.066]),
            Vector.create([-2.943, -0.886, -0.086]),
            Vector.create([-2.962, 0.727, -0.086]),
            Vector.create([1.099, -0.359, 0.066]),
            Vector.create([0.424, -0.969, -0.088]),
            Vector.create([-0.345, -1.306, -0.584]),
            Vector.create([0.443, -0.584, -0.088]),
            Vector.create([1.099, 0.391, 0.066]),
            Vector.create([0.424, 1, -0.088]),
            Vector.create([-0.345, 1.337, -0.584]),
            Vector.create([0.443, 0.616, -0.088]),
            Vector.create([0.614, 0.001, 0.506])
        ],
        lines: [
            [16, 18],
            [17, 19],
            [18, 20],
            [20, 21],
            [19, 21],
            [22, 23],
            [24, 25],
            [23, 24],
            [12, 25],
            [26, 27],
            [27, 28],
            [28, 29],
            [13, 29],
            [0, 2],
            [0, 1],
            [1, 11],
            [1, 3],
            [1, 10],
            [4, 6],
            [6, 8],
            [11, 13],
            [3, 5],
            [13, 15],
            [14, 16],
            [8, 16],
            [8, 17],
            [15, 17],
            [5, 7],
            [7, 17],
            [12, 14],
            [10, 12],
            [4, 30],
            [2, 30]
        ]
    }
};

SC.modelData.sphere = (function () {
    // Create sphere (planets)
    var self = {}, i, x, y, z, step = 10, ofs = 0, n;
    self.vertices = [];
    self.lines = [];

    n = self.vertices.length;
    for (i = 0; i < 360; i += step) {
        x = Math.sin(Math.PI * i / 180);
        y = 0;
        z = Math.cos(Math.PI * i / 180);
        self.vertices.push(Vector.create([x, y, z]));
        self.lines.push([ofs, ofs + 1]);
        ofs++;
    }
    self.lines.pop();
    self.lines.push([n, ofs - 1]);

    n = self.vertices.length;
    for (i = 0; i < 360; i += step) {
        x = Math.sin(Math.PI * i / 180);
        y = Math.cos(Math.PI * i / 180);
        z = 0;
        self.vertices.push(Vector.create([x, y, z]));
        self.lines.push([ofs, ofs + 1]);
        ofs++;
    }
    self.lines.pop();
    self.lines.push([n, ofs - 1]);

    n = self.vertices.length;
    for (i = 0; i < 360; i += step) {
        x = 0;
        y = Math.sin(Math.PI * i / 180);
        z = Math.cos(Math.PI * i / 180);
        self.vertices.push(Vector.create([x, y, z]));
        self.lines.push([ofs, ofs + 1]);
        ofs++;
    }
    self.lines.pop();
    self.lines.push([n, ofs - 1]);

    n = self.vertices.length;
    for (i = 0; i < 360; i += step) {
        x = 0.707 * Math.sin(Math.PI * i / 180);
        y = 0.707 * Math.sin(Math.PI * i / 180);
        z = Math.cos(Math.PI * i / 180);
        self.vertices.push(Vector.create([x, y, z]));
        self.lines.push([ofs, ofs + 1]);
        ofs++;
    }
    self.lines.pop();
    self.lines.push([n, ofs - 1]);

    n = self.vertices.length;
    for (i = 0; i < 360; i += step) {
        x = -0.707 * Math.sin(Math.PI * i / 180);
        y = 0.707 * Math.sin(Math.PI * i / 180);
        z = Math.cos(Math.PI * i / 180);
        self.vertices.push(Vector.create([x, y, z]));
        self.lines.push([ofs, ofs + 1]);
        ofs++;
    }
    self.lines.pop();
    self.lines.push([n, ofs - 1]);
    ofs += 36;

    return self;
}());

SC.modelFromObjVertices = function (aVertices) {
    // Convert obj vertices to model data
    // # 16 Vertices^M
    // v -1,0 -1,0 1,0^M
    // v 1,0 -1,0 1,0^M
    // v -1,0 1,0 1,0^M
    // v 1,0 1,0 1,0^M
    aVertices = aVertices || prompt('Vertices');
    var i, lines = aVertices.split('\n'), line, par, comma, s = '';
    for (i = 0; i < lines.length; i++) {
        line = lines[i].trim().replace(/\^M$/, '').replace(/,/g, '.');
        if (!line.match('#')) {
            par = line.split(' ');
            if (par.length === 4 && par[0] === 'v') {
                comma = i < lines.length - 1 ? ',\n' : '\n';
                s += 'Vector.create([' + parseFloat(par[1]).toFixed(3) + ', ' + parseFloat(par[3]).toFixed(3) + ', ' + parseFloat(par[2]).toFixed(3) + ' ])' + comma;
            }
        }
    }
    console.log(s);
    return s;
};

SC.modelLinesDialog = function (aModel) {
    // Show side dialog with checkboxes where model developer can show/hide lines
    var ul = document.createElement('div'), lab, cb, j;
    ul.style = 'position: fixed; left: 0; top: 0; height: 100vh; background-color: white; color: black; margin: 0; overflow-y: scroll; user-select: none;';
    function onCheck(event) {
        SC.modelData[aModel].lines[event.target.dataIndex][2] = event.target.checked ? true : false;
        var i, a = [], m = SC.modelData[aModel].lines;
        for (i = 0; i < m.length; i++) {
            if (m[i][2] !== false) {
                a.push([m[i][0], m[i][1]]);
            }
        }
        SC.modelLastEdit = JSON.stringify(a).replace(/\],/g, '],\n').replace(/,/g, ', ').replace(/\ \n/g, '\n');
    }
    for (j = 0; j < SC.modelData[aModel].lines.length; j++) {
        lab = document.createElement('label');
        lab.style.display = 'block';
        ul.appendChild(lab);
        cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = true;
        cb.dataIndex = j;
        cb.oninput = onCheck;
        lab.appendChild(cb);
        lab.appendChild(document.createTextNode(j));
    }
    document.body.appendChild(ul);
};

/*
setTimeout(function () {
    SC.modelLinesDialog('whale');
}, 1500);
*/
