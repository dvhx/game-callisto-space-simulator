// Static data of solar system data (sun, planets, moons, asteroids), units are m, kg, m/s, °
"use strict";
// globals: window, Vector

var SC = window.SC || {};

SC.solarSystem = (function () {
    var self = {};

    self.data = {
        Sun: { radius: 696342000, mass: 1988550000e21, color: 'yellow', parent: 'Sun', distance: 0, speed: 0, phase: 360 },

        Mercury: { radius: 2439700, mass: 330.2e21, color: 'gray', parent: 'Sun', distance: 57909175000, speed: 47872.5, phase: 0 },
        Venus: { radius: 6051000, mass: 4868.5e21, color: 'white', parent: 'Sun', distance: 108208930000, speed: 35021.4, phase: 90 },
        Earth: { radius: 6371000, mass: 5973.6e21, color: 'skyblue', parent: 'Sun', distance: 149597890000, speed: 29785.9, phase: 270 },
        Mars: { radius: 3389500, mass: 641.85e21, color: 'red', parent: 'Sun', distance: 227936640000, speed: 24130.9, phase: 270 },
        Jupiter: { radius: 69911000, mass: 1898600e21, color: 'brown', parent: 'Sun', distance: 778412010000, speed: 13069.7, phase: 330 },
        Saturn: { radius: 58232000, mass: 568460e21, color: 'yellow', parent: 'Sun', distance: 1426725400000, speed: 9672.4, phase: 90 },
        Uranus: { radius: 25362000, mass: 86832e21, color: 'cyan', parent: 'Sun', distance: 2870972200000, speed: 6835.2, phase: 120 },
        Neptune: { radius: 24622000, mass: 102430e21, color: 'blue', parent: 'Sun', distance: 4498252900000, speed: 5477.8, phase: 270 },

        Pluto: { radius: 1184000, mass: 13.105e21, color: 'yellow', parent: 'Sun', distance: 5874000000000, speed: 4700, phase: 10 },
        Charon: { radius: 603500, mass: 1.52e21, color: 'yellow', parent: 'Pluto', distance: 17536000, speed: 199, phase: 0 },
        Styx: { radius: 10000, mass: 0, color: 'yellow', parent: 'Pluto', distance: 42000000, speed: 152, phase: 90 },
        Nix: { radius: 45000, mass: 70e15, color: 'yellow', parent: 'Pluto', distance: 48700000, speed: 147, phase: 180 },
        Kerberos: { radius: 10000, mass: 0, color: 'yellow', parent: 'Pluto', distance: 59000000, speed: 134, phase: 270 },
        Hydra: { radius: 35000, mass: 0, color: 'yellow', parent: 'Pluto', distance: 64800000, speed: 123, phase: 0 },

        Moon: { radius: 1737100, mass: 73.5e21, color: 'silver', parent: 'Earth', distance: 384000000, speed: 1023, phase: 0 },

        Phobos: { radius: 11000, mass: 10.7e15, color: 'gray', parent: 'Mars', distance: 9380000, speed: 2137, phase: 0 },
        Deimos: { radius: 5000, mass: 1.48e15, color: 'gray', parent: 'Mars', distance: 23460000, speed: 1351, phase: 90 },

        Ceres: { radius: 476200, mass: 0.95e21, color: 'gray', parent: 'Sun', distance: 414010000000, speed: 17905000, phase: 0 },
        Pallas: { radius: 270000, mass: 0.211e21, color: 'gray', parent: 'Sun', distance: 0, speed: 0, phase: 90 },
        Vesta: { radius: 262700, mass: 0.259076e21, color: 'gray', parent: 'Sun', distance: 0, speed: 0, phase: 180 },

        Io: { radius: 1821600, mass: 89.3e21, color: 'yellow', parent: 'Jupiter', distance: 421700000, speed: 17317, phase: 270 },
        Europa: { radius: 1560800, mass: 48e21, color: 'pink', parent: 'Jupiter', distance: 671034000, speed: 13739, phase: 180 },
        Ganymede: { radius: 2634000, mass: 148.2e21, color: 'gray', parent: 'Jupiter', distance: 1070412000, speed: 10881, phase: 90 },
        Callisto: { radius: 2410300, mass: 107.6e21, color: 'gray', parent: 'Jupiter', distance: 1882709000, speed: 8199, phase: 45 },
        Himalia: { radius: 85000, mass: 4.19e18, color: 'gray', parent: 'Jupiter', distance: 11461000000, speed: 3324, phase: 90 },
        Amalthea: { radius: 84000, mass: 2.08e18, color: 'white', parent: 'Jupiter', distance: 181400000, speed: 26476, phase: 170 },
        Thebe: { radius: 50000, mass: 0, color: 'gray', parent: 'Jupiter', distance: 0, speed: 0, phase: 360 },
        Elara: { radius: 45000, mass: 0, color: 'gray', parent: 'Jupiter', distance: 0, speed: 0, phase: 360 },
        Pasiphae: { radius: 30000, mass: 0, color: 'gray', parent: 'Jupiter', distance: 0, speed: 0, phase: 360 },
        Carme: { radius: 25000, mass: 130e15, color: 'gray', parent: 'Jupiter', distance: 0, speed: 0, phase: 360 },
        Metis: { radius: 20000, mass: 36e15, color: 'pink', parent: 'Jupiter', distance: 127974000, speed: 31501, phase: 270 },
        Sinope: { radius: 20000, mass: 76e15, color: 'gray', parent: 'Jupiter', distance: 0, speed: 0, phase: 360 },
        Lysithea: { radius: 20000, mass: 63e15, color: 'gray', parent: 'Jupiter', distance: 0, speed: 0, phase: 360 },
        Ananke: { radius: 15000, mass: 60e15, color: 'gray', parent: 'Jupiter', distance: 0, speed: 0, phase: 360 },
        Leda: { radius: 10000, mass: 11e15, color: 'gray', parent: 'Jupiter', distance: 0, speed: 0, phase: 360 },
        Adrastea: { radius: 8200, mass: 2e15, color: 'gray', parent: 'Jupiter', distance: 129000000, speed: 31378, phase: 90 },
        Callirrhoe: { radius: 5000, mass: 0, color: 'gray', parent: 'Jupiter', distance: 0, speed: 0, phase: 360 },
        Themisto: { radius: 5000, mass: 0.69e15, color: 'gray', parent: 'Jupiter', distance: 0, speed: 0, phase: 360 },

        Titan: { radius: 2576000, mass: 134.5e21, color: 'yellow', parent: 'Saturn', distance: 1221870000, speed: 5568, phase: 360 },
        Rhea: { radius: 763000, mass: 2.3166e21, color: 'gray', parent: 'Saturn', distance: 527070000, speed: 8479, phase: 360 },
        Iapetus: { radius: 734500, mass: 1.9739e21, color: 'gray', parent: 'Saturn', distance: 3560840000, speed: 3262, phase: 360 },
        Dione: { radius: 561400, mass: 1.096e21, color: 'gray', parent: 'Saturn', distance: 377420000, speed: 10022, phase: 360 },
        Tethys: { radius: 531100, mass: 0.6173e21, color: 'gray', parent: 'Saturn', distance: 294670000, speed: 11344, phase: 360 },
        Enceladus: { radius: 252000, mass: 0.108e21, color: 'pink', parent: 'Saturn', distance: 238040000, speed: 12629, phase: 360 },
        Mimas: { radius: 198200, mass: 37.49e18, color: 'gray', parent: 'Saturn', distance: 185540000, speed: 14316, phase: 360 },
        Hyperion: { radius: 135000, mass: 5.58e18, color: 'gray', parent: 'Saturn', distance: 1500880000, speed: 5126, phase: 360 },
        Phoebe: { radius: 106500, mass: 8.29e18, color: 'gray', parent: 'Saturn', distance: 12947780000, speed: 1711, phase: -360 },
        Janus: { radius: 89500, mass: 1.912e18, color: 'gray', parent: 'Saturn', distance: 151460000, speed: 15840, phase: 360 },

        Epimetheus: { radius: 58000, mass: 0.5304e18, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Prometheus: { radius: 45000, mass: 156e15, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Pandora: { radius: 40000, mass: 135.6e15, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Siarnaq: { radius: 20000, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Albiorix: { radius: 15000, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Atlas: { radius: 15100, mass: 66e15, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Pan: { radius: 14100, mass: 1.95e15, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Telesto: { radius: 10000, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Paaliaq: { radius: 10000, mass: 8.2e15, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Calypso: { radius: 10000, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Ymir: { radius: 10000, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Kiviuq: { radius: 10000, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Tarvos: { radius: 10000, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Bestla: { radius: 5000, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Ijiraq: { radius: 5000, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Erriapus: { radius: 5000, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Daphnis: { radius: 3900, mass: 0.084e15, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Pallene: { radius: 4000, mass: 0.043e15, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Methone: { radius: 1600, mass: 0.019e15, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },
        Aegaeon: { radius: 250, mass: 0, color: 'gray', parent: 'Saturn', distance: 0, speed: 0, phase: 360 },

        Helene: { radius: 17600, mass: 25e15, color: 'gray', parent: 'Dione', distance: 0, speed: 0, phase: 360 },
        Polydeuces: { radius: 3000, mass: 0.03e15, color: 'gray', parent: 'Dione', distance: 0, speed: 0, phase: 360 },

        Titania: { radius: 788400, mass: 3.526e21, color: 'gray', parent: 'Uranus', distance: 436300000, speed: 3642, phase: 360 },
        Oberon: { radius: 761400, mass: 3.014e21, color: 'gray', parent: 'Uranus', distance: 583500000, speed: 3150, phase: 360 },
        Umbriel: { radius: 584700, mass: 1.2e21, color: 'gray', parent: 'Uranus', distance: 266000000, speed: 4665, phase: 360 },
        Ariel: { radius: 578900, mass: 1.35e21, color: 'brown', parent: 'Uranus', distance: 190900000, speed: 5506, phase: 360 },
        Miranda: { radius: 235800, mass: 0.0659e21, color: 'brown', parent: 'Uranus', distance: 129900000, speed: 6682, phase: 360 },
        Puck: { radius: 81000, mass: 0, color: 'brown', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Sycorax: { radius: 75000, mass: 2.3e18, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Portia: { radius: 68000, mass: 1.7e18, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Juliet: { radius: 45000, mass: 1.7e18, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Belinda: { radius: 40000, mass: 0, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Cressida: { radius: 40000, mass: 0, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Rosalind: { radius: 35000, mass: 0, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Caliban: { radius: 35000, mass: 0, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Desdemona: { radius: 30000, mass: 0, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Bianca: { radius: 25000, mass: 92e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Prospero: { radius: 25000, mass: 85e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Setebos: { radius: 25000, mass: 75e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Ophelia: { radius: 20000, mass: 53e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Cordelia: { radius: 20000, mass: 44e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Stephano: { radius: 15000, mass: 22e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Perdita: { radius: 15000, mass: 13e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Francisco: { radius: 10000, mass: 7.2e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Ferdinand: { radius: 10000, mass: 5.4e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Margaret: { radius: 10000, mass: 5.4e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Trinculo: { radius: 10000, mass: 3.9e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Cupid: { radius: 10000, mass: 3.8e15, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },
        Mab: { radius: 5000, mass: 0, color: 'gray', parent: 'Uranus', distance: 0, speed: 0, phase: 360 },

        Triton: { radius: 1737100, mass: 21.5e21, color: 'pink', parent: 'Neptune', distance: 354800000, speed: 4388, phase: 360 },
        Proteus: { radius: 210000, mass: 0.044e21, color: 'gray', parent: 'Neptune', distance: 117647000, speed: 7621, phase: 360 },
        Nereid: { radius: 170000, mass: 0, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },
        Larissa: { radius: 97000, mass: 6e18, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },
        Galatea: { radius: 88000, mass: 2.12e18, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },
        Despina: { radius: 75000, mass: 0, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },
        Thalasa: { radius: 40000, mass: 0, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },
        Naiad: { radius: 35000, mass: 0, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },
        Halimede: { radius: 30000, mass: 0, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },
        Neso: { radius: 30000, mass: 0, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },
        Sao: { radius: 20000, mass: 0, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },
        Laomedeia: { radius: 20000, mass: 0, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },
        Psamathe: { radius: 20000, mass: 37e15, color: 'gray', parent: 'Neptune', distance: 0, speed: 0, phase: 360 },

        // stations
        C1: { radius: 1.5, mass: 1000, color: 'lime', parent: 'Callisto', distance: 6000000, speed: 0, phase: 220.1, model: 'station', refuel: true, frequency: '513MHz' },
        C2: { radius: 1.5, mass: 1000, color: 'lime', parent: 'Callisto', distance: 5000000, speed: 0, phase: 235, model: 'station', refuel: true, frequency: '523MHz' },
        C3: { radius: 1.5, mass: 1000, color: 'lime', parent: 'Callisto', distance: 4000000, speed: 0, phase: 190, model: 'station', refuel: true, frequency: '525MHz' },
        G1: { parent: 'Ganymede', distance: 6000000, phase: 0, mass: 1000, radius: 1.5, color: 'brown', model: 'station', refuel: true, frequency: '527MHz'},
        E1: { parent: 'Europa', distance: 5000000, phase: 45, mass: 1000, radius: 1.5, color: 'white', model: 'station', refuel: true, frequency: '521MHz'},
        I1: { parent: 'Io', distance: 4000000, phase: 180, mass: 1000, radius: 1.5, color: 'red', model: 'station', refuel: true, frequency: '529MHz'},
        ISS: { parent: 'Earth', distance: 6371000 + 405000, phase: 15, mass: 1000, radius: 1.5, color: 'lime', model: 'station', refuel: true, frequency: '531MHz'}
    };

    // guess mass for objects with unknown mass, assume muddy ice
    (function () {
        var k;
        for (k in self.data) {
            if (self.data.hasOwnProperty(k)) {
                if (self.data[k].mass === 0) {
                    self.data[k].mass = (4 / 3) * Math.PI * self.data[k].radius * self.data[k].radius * 2000;
                }
            }
        }
    }());

    return self;
}());

