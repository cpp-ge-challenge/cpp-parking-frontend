mapReady = false;
mapCallback = function() {
    mapReady = true;
};

// var points = [];
// getPoints = function() {
//     console.log(JSON.stringify(points, null, 4));
//     return points;
// };

var app = angular.module('parking', ['ngWebSocket']);

app.controller('mainCtrl', ['$scope', '$http', '$websocket', '$sce', function($scope, $http, $websocket, $sce) {
    var vm = this;

    // TODO: move this to a webservice or something and preprocess points into latlng objects
    vm.lotStats = {
        'J': {
            'name': 'J',
            'prefix': 'Lot',
            'center': { 'lat': 34.058134924243184, 'lng': -117.82858371734619 },
            'points': [
                -117.828163,34.05888, -117.828255,34.058876, -117.828568,34.058815, -117.82885,34.058701, -117.829079,34.058567, -117.829262,34.058392, -117.829391,34.058205, -117.829483,34.05798, -117.829498,34.057796, -117.829483,34.057613, -117.829468,34.057503, -117.829407,34.057339, -117.829193,34.056931, -117.829155,34.05687, -117.829002,34.056602, -117.828941,34.056477, -117.828926,34.056431, -117.828728,34.056004, -117.828667,34.055992, -117.828629,34.055943, -117.828575,34.055923, -117.828156,34.056068, -117.827888,34.056164, -117.827843,34.056198, -117.827843,34.05624, -117.827873,34.056286, -117.82782,34.056293, -117.828278,34.057224, -117.828514,34.057659, -117.828522,34.057796, -117.828445,34.057949, -117.828346,34.058022, -117.828209,34.05806, -117.828079,34.058067, -117.827736,34.058067, -117.827721,34.058094, -117.8274,34.058083, -117.827347,34.058105, -117.827339,34.058548, -117.827385,34.058598, -117.827438,34.058601, -117.827469,34.058655, -117.827858,34.058659, -117.827904,34.058697, -117.828018,34.0588, -117.82814,34.05883, -117.828194,34.05883, -117.828163,34.05888
            ],
        },

        'M': {
            'name': 'M',
            'prefix': 'Lot',
            'center': { 'lat': 34.05539721702038, 'lng': -117.82980680465698 },
            'points': [
                -117.830688,34.056198, -117.83078,34.056095, -117.830788,34.055725, -117.830795,34.055389, -117.830788,34.055302, -117.830574,34.054855, -117.830521,34.054832, -117.829994,34.054832, -117.829994,34.054783, -117.829201,34.054775, -117.829208,34.054829, -117.82914,34.054829, -117.82914,34.055267, -117.829201,34.055271, -117.829193,34.055344, -117.828773,34.055351, -117.828781,34.055458, -117.828751,34.055496, -117.828598,34.05555, -117.82856,34.055542, -117.828491,34.0555, -117.828384,34.055473, -117.8283,34.05555, -117.828163,34.055622, -117.828133,34.055634, -117.828156,34.055672, -117.827469,34.055912, -117.827545,34.056065, -117.82756,34.05611, -117.827614,34.056103, -117.828354,34.055843, -117.828499,34.055775, -117.828598,34.055695, -117.828644,34.055656, -117.82872,34.055634, -117.828804,34.055573, -117.828865,34.055573, -117.828865,34.055592, -117.828819,34.055634, -117.828934,34.055862, -117.829033,34.055889, -117.829475,34.055874, -117.829514,34.05603, -117.829521,34.056194, -117.830688,34.056198
            ]
        },

        'S1': {
            'name': 'S1',
            'prefix': 'Structure',
            'center': { 'lat': 34.060272585448516, 'lng': -117.81686246395111 },
            'points': [
                -117.818184,34.060295, -117.818138,34.06031, -117.818062,34.060329, -117.818024,34.060276, -117.817291,34.06041, -117.817329,34.060474, -117.817291,34.060493, -117.817245,34.060425, -117.816879,34.060604, -117.816299,34.061092, -117.815887,34.060749, -117.815903,34.060722, -117.815872,34.060692, -117.816017,34.060574, -117.815964,34.060528, -117.815987,34.060505, -117.816025,34.060524, -117.816414,34.060204, -117.816452,34.06023, -117.81649,34.060188, -117.81646,34.060143, -117.816635,34.060074, -117.816628,34.060043, -117.816803,34.059967, -117.816818,34.059994, -117.817017,34.059898, -117.817039,34.05986, -117.817093,34.059845, -117.817123,34.059875, -117.817917,34.059738, -117.817947,34.05978, -117.81797,34.059784, -117.818092,34.060204, -117.818146,34.060219, -117.818184,34.060295
            ]
        },

        'S2': {
            'name': 'S2',
            'prefix': 'Structure',
            'points': [
                -117.8207972,34.0525717, -117.8209032,34.0524083, -117.8206611,34.0519066, -117.8172702,34.0506416, -117.817018,34.0509971, -117.8207972,34.0525717
            ]
        },

        'F1': {
            'name': 'F1',
            'prefix': 'Lot',
            'points': [
                -117.817047,34.062756, -117.816849,34.062683, -117.816704,34.062664, -117.816498,34.062607, -117.816719,34.062054, -117.816795,34.061893, -117.816895,34.061775, -117.817383,34.062023, -117.817375,34.06205, -117.817276,34.062206, -117.817223,34.062363, -117.817146,34.062538, -117.817093,34.062675, -117.817047,34.062756
            ]
        },

        'F2': {
            'name': 'F2',
            'prefix': 'Lot',
            'points': [
                -117.81749,34.061924, -117.817451,34.061893, -117.817345,34.061867, -117.817268,34.061821, -117.817169,34.061783, -117.817093,34.061733, -117.817009,34.061687, -117.816971,34.061665, -117.817177,34.061481, -117.817345,34.061371, -117.817551,34.061268, -117.817772,34.061192, -117.81797,34.061138, -117.818222,34.061108, -117.818268,34.061108, -117.818268,34.061153, -117.818306,34.061153, -117.818367,34.061588, -117.818329,34.061592, -117.818314,34.061611, -117.818123,34.061623, -117.817932,34.061661, -117.817818,34.061703, -117.817696,34.061764, -117.817589,34.061836, -117.81749,34.061924
            ]
        },

        'F3': {
            'name': 'F3',
            'prefix': 'Lot',
            'points': [
                -117.816422,34.062576, -117.816116,34.062481, -117.815887,34.062401, -117.816109,34.061867, -117.816185,34.061691, -117.816269,34.061562, -117.816338,34.061466, -117.816383,34.061485, -117.816414,34.061466, -117.816635,34.061592, -117.816635,34.061623, -117.81675,34.061695, -117.816727,34.061749, -117.816795,34.061783, -117.816704,34.061958, -117.816635,34.062073, -117.816559,34.062263, -117.816452,34.062538, -117.816422,34.062576
            ]
        },

        'F4': {
            'name': 'F4',
            'prefix': 'Lot',
            'points': [
                -117.816956,34.061584, -117.81691,34.061562, -117.816879,34.061596, -117.816727,34.061508, -117.816612,34.06147, -117.816452,34.061367, -117.816437,34.061337, -117.816673,34.061104, -117.816895,34.060959, -117.817116,34.060829, -117.817345,34.06073, -117.817604,34.060642, -117.817879,34.060593, -117.818085,34.060562, -117.818199,34.060555, -117.818199,34.060604, -117.818222,34.060604, -117.818253,34.060829, -117.818222,34.060856, -117.818253,34.061035, -117.818153,34.06105, -117.818001,34.061081, -117.817848,34.061115, -117.817703,34.061165, -117.817474,34.061249, -117.817291,34.061337, -117.817177,34.061417, -117.816956,34.061584
            ]
        },

        'F5': {
            'name': 'F5',
            'prefix': 'Lot',
            'points': [
                -117.816063,34.061348, -117.815994,34.061459, -117.815918,34.061569, -117.815842,34.061707, -117.815781,34.061844, -117.815712,34.062023, -117.815613,34.062263, -117.81546,34.062222, -117.815422,34.062183, -117.815285,34.062107, -117.814926,34.061905, -117.815063,34.061562, -117.81517,34.061337, -117.815224,34.061241, -117.81543,34.060951, -117.815483,34.06097, -117.815521,34.060947, -117.815895,34.061165, -117.81588,34.061188, -117.816078,34.061302, -117.816063,34.061348
            ]
        },

        'F8': {
            'name': 'F8',
            'prefix': 'Lot',
            'center': { 'lat': 34.05910821118644, 'lng': -117.81701803207397 },
            'points': [
                -117.817955,34.059383, -117.817955,34.059406, -117.817833,34.059422, -117.817657,34.059444, -117.81749,34.059479, -117.817284,34.059517, -117.817101,34.059563, -117.816856,34.059643, -117.816681,34.059708, -117.81665,34.059669, -117.816605,34.059692, -117.816498,34.059551, -117.81633,34.059284, -117.816299,34.059223, -117.816292,34.059204, -117.816864,34.058647, -117.81691,34.058617, -117.816933,34.058582, -117.816986,34.058552, -117.817413,34.058464, -117.817421,34.05851, -117.817451,34.058521, -117.817497,34.058502, -117.818016,34.059288, -117.818016,34.059341, -117.817955,34.059383
            ]
        },

        'F9': {
            'name': 'F9',
            'prefix': 'Lot',
            'points': [
                -117.8160019097591,34.05971099974258, -117.8158627373088,34.05963882382046, -117.8157627521897,34.05966591412717, -117.815713339433,34.05961549968519, -117.81546,34.059788, -117.815262,34.05994, -117.815086,34.060089, -117.814941,34.060242, -117.814796,34.060402, -117.815277,34.06065, -117.815315,34.060635, -117.815483,34.060467, -117.815636,34.060329, -117.815796,34.060207, -117.815964,34.060089, -117.816124,34.059982, -117.816269,34.059906, -117.816406,34.05983, -117.8160019097591,34.05971099974258
            ]
        },

        'F10': {
            'name': 'F10',
            'prefix': 'Lot',
            'points': [
                -117.815163,34.060825, -117.815117,34.060799, -117.81514,34.060764, -117.814713,34.060493, -117.81456,34.060696, -117.814445,34.060646, -117.814384,34.06073, -117.814323,34.060829, -117.814285,34.06086, -117.81424,34.060841, -117.814095,34.061104, -117.814026,34.061256, -117.814087,34.061275, -117.814087,34.061302, -117.814049,34.061321, -117.814552,34.061714, -117.814613,34.061653, -117.814697,34.06168, -117.814758,34.061516, -117.814873,34.061268, -117.814987,34.061058, -117.815163,34.060825
            ]
        },
    };

    // takes points in format [ lng, lat, lng, lat, .... ]
    // and returns array of objects
    var pointsToLatLng = function(points) {
        var l = [];
        for (i = 0; i < points.length; i += 2) {
            l.push({
                'lng': points[i],
                'lat': points[i + 1]
            });
        }
        return l;
    };

    var initMap = function() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            disableDefaultUI: true,
            center: {lat: 34.056, lng: -117.818},
            mapTypeId: 'terrain',
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ]
        });

        google.maps.event.addListener(map, 'click', function( event ){
            console.log("{ 'lat': " + event.latLng.lat() + ", 'lng': " + event.latLng.lng() + " }");
            // points.push({
            //     lat: event.latLng.lat(),
            //     lng: event.latLng.lng()
            // });
        });


        for (var lotName in vm.lotStats) {
            var lot = vm.lotStats[lotName];

            // get lot color
            var fullness = 0.0;
            if (typeof lot.occupancy !== 'undefined' && typeof lot.maxCapacity !== 'undefined') {
                fullness = lot.occupancy/lot.maxCapacity;
            }
            var color = colorFade('#00FF00', '#FF0000', 0.0);

            // Construct polygon
            var poly = new google.maps.Polygon({
                strokeColor: color,
                fillColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillOpacity: 0.2,
                clickable: false,
                paths: pointsToLatLng(lot.points),
                map: map
            });


            // get lot label text
            var text = lot.name;
            if (typeof lot.maxCapacity !== 'undefined' && typeof lot.occupancy !== 'undefined') {
                text += ' ' + (lot.maxCapacity - lot.occupancy) + '/' + lot.maxCapacity;
            }

            // draw label on map
            if (typeof lot.center !== 'undefined') {
                var label = new Label({
                    'text': text,
                    map: map,
                    position: new google.maps.LatLng(lot.center.lat, lot.center.lng)
                });
            }

           // attach map objects to lot
           lot.mapPoly = poly;
           lot.mapLabel = label;
        }
    };

    // c1, c2 = hex string colors
    // f = fade %, 0.0 - 1.0
    var colorFade = function(c1, c2, f) {
        if (c1.indexOf('#') === 0) {
            c1 = c1.substr(1);
        }

        if (c2.indexOf('#') === 0) {
            c2 = c2.substr(1);
        }

        // hex string to int
        function h2i(h) {
            return parseInt(h, 16);
        }

        // int to padded hex string
        function i2h(i) {
            var str = Math.round(i).toString(16);
            if (str.length === 1) {
                str = '0' + str;
            }
            return str;
        }

        var r1 = h2i(c1.substr(0,2));
        var g1 = h2i(c1.substr(2,2));
        var b1 = h2i(c1.substr(4,2));
        var r2 = h2i(c2.substr(0,2));
        var g2 = h2i(c2.substr(2,2));
        var b2 = h2i(c2.substr(4,2));

        var r3 = r1 * (1.0 - f) + r2 * f;
        var g3 = g1 * (1.0 - f) + g2 * f;
        var b3 = b1 * (1.0 - f) + b2 * f;

        return '#' + i2h(r3) + i2h(g3) + i2h(b3);
    };

    // wait for map to be come ready
    var listener = $scope.$watch(function() {
        return mapReady;
    }, function (oldVal, newVal) {
        // init the map
        initMap();
        // clear the listener
        listener();
    });

    var updateLotStats = function(lots) {
        var keys = Object.keys(lots);
        if (keys.length === 2 && keys.indexOf('lot') !== -1 && keys.indexOf('occupancy') !== -1) {
            var nlots = {};
            nlots[lots.lot] = {
                'occupancy': lots.occupancy
            };
            lots = nlots;
        }

        // loop over lots
        for (var lotName in lots) {
            // make sure lot exists
            if (lots.hasOwnProperty(lotName) && vm.lotStats.hasOwnProperty(lotName)) {
                // copy keys to internal lot state object
                var lot = lots[lotName];
                for (var key in lot) {
                    if (lot.hasOwnProperty(key)) {
                        vm.lotStats[lotName][key] = lot[key];
                    }
                }

                lot = vm.lotStats[lotName];

                // update color on map
                if (typeof lot.mapPoly !== 'undefined') {
                    var fullness = lot.occupancy/lot.maxCapacity;
                    var color = colorFade('#00FF00', '#FF0000', fullness);
                    lot.mapPoly.setOptions({ 'strokeColor': color, 'fillColor': color });
                }

                // update label on map
                if (typeof lot.mapLabel !== 'undefined') {
                    lot.mapLabel.setOptions({'text': lot.name + ' ' + (lot.maxCapacity - lot.occupancy) + '/' + lot.maxCapacity });
                }
            }
        }
    };

    var wsConnect = function() {
        var host = window.location.host;
        var ws = $websocket('ws://' + host + '/api/wlots');

        ws.onMessage(function(message) {
            updateLotStats(JSON.parse(message.data));
        });
    };

    wsConnect();
}]);
