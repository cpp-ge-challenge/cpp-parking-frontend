mapReady = false;
mapCallback = function() {
    mapReady = true;
};

var points = [];
getPoints = function() {
    console.log(JSON.stringify(points, null, 4));
    return points;
};

var app = angular.module('parking', ['ngWebSocket']);

app.controller('mainCtrl', ['$scope', '$http', '$websocket', '$sce', function($scope, $http, $websocket, $sce) {
    var vm = this;

    // TODO: move this to a webservice or something and preprocess points into latlng objects
    vm.lotStats = {
        'J': {
            'name': 'J',
            'prefix': 'Lot',
            'center': { 'lat': 34.059023771209475, 'lng': -117.82856225967407 },
            'points': [
                -117.828163,34.05888, -117.828255,34.058876, -117.828568,34.058815, -117.82885,34.058701, -117.829079,34.058567, -117.829262,34.058392, -117.829391,34.058205, -117.829483,34.05798, -117.829498,34.057796, -117.829483,34.057613, -117.829468,34.057503, -117.829407,34.057339, -117.829193,34.056931, -117.829155,34.05687, -117.829002,34.056602, -117.828941,34.056477, -117.828926,34.056431, -117.828728,34.056004, -117.828667,34.055992, -117.828629,34.055943, -117.828575,34.055923, -117.828156,34.056068, -117.827888,34.056164, -117.827843,34.056198, -117.827843,34.05624, -117.827873,34.056286, -117.82782,34.056293, -117.828278,34.057224, -117.828514,34.057659, -117.828522,34.057796, -117.828445,34.057949, -117.828346,34.058022, -117.828209,34.05806, -117.828079,34.058067, -117.827736,34.058067, -117.827721,34.058094, -117.8274,34.058083, -117.827347,34.058105, -117.827339,34.058548, -117.827385,34.058598, -117.827438,34.058601, -117.827469,34.058655, -117.827858,34.058659, -117.827904,34.058697, -117.828018,34.0588, -117.82814,34.05883, -117.828194,34.05883, -117.828163,34.05888
            ],
        },

        'M': {
            'name': 'M',
            'prefix': 'Lot',
            'center': { 'lat': 34.056421647528826, 'lng': -117.83015741577148 },
            'points': [
                -117.830688,34.056198, -117.83078,34.056095, -117.830788,34.055725, -117.830795,34.055389, -117.830788,34.055302, -117.830574,34.054855, -117.830521,34.054832, -117.829994,34.054832, -117.829994,34.054783, -117.829201,34.054775, -117.829208,34.054829, -117.82914,34.054829, -117.82914,34.055267, -117.829201,34.055271, -117.829193,34.055344, -117.828773,34.055351, -117.828781,34.055458, -117.828751,34.055496, -117.828598,34.05555, -117.82856,34.055542, -117.828491,34.0555, -117.828384,34.055473, -117.8283,34.05555, -117.828163,34.055622, -117.828133,34.055634, -117.828156,34.055672, -117.827469,34.055912, -117.827545,34.056065, -117.82756,34.05611, -117.827614,34.056103, -117.828354,34.055843, -117.828499,34.055775, -117.828598,34.055695, -117.828644,34.055656, -117.82872,34.055634, -117.828804,34.055573, -117.828865,34.055573, -117.828865,34.055592, -117.828819,34.055634, -117.828934,34.055862, -117.829033,34.055889, -117.829475,34.055874, -117.829514,34.05603, -117.829521,34.056194, -117.830688,34.056198
            ]
        },

        'S': {
            'name': 'S',
            'prefix': 'Structure',
            'center': { 'lat': 34.060668113523576, 'lng': -117.81787633895874},
            'points': [
                -117.818184,34.060295, -117.818138,34.06031, -117.818062,34.060329, -117.818024,34.060276, -117.817291,34.06041, -117.817329,34.060474, -117.817291,34.060493, -117.817245,34.060425, -117.816879,34.060604, -117.816299,34.061092, -117.815887,34.060749, -117.815903,34.060722, -117.815872,34.060692, -117.816017,34.060574, -117.815964,34.060528, -117.815987,34.060505, -117.816025,34.060524, -117.816414,34.060204, -117.816452,34.06023, -117.81649,34.060188, -117.81646,34.060143, -117.816635,34.060074, -117.816628,34.060043, -117.816803,34.059967, -117.816818,34.059994, -117.817017,34.059898, -117.817039,34.05986, -117.817093,34.059845, -117.817123,34.059875, -117.817917,34.059738, -117.817947,34.05978, -117.81797,34.059784, -117.818092,34.060204, -117.818146,34.060219, -117.818184,34.060295
            ]
        }
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
            console.log(event.latLng.lat() + " " + event.latLng.lng());
            points.push({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            });
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
            var label = new Label({
                'text': text,
                map: map,
                position: new google.maps.LatLng(lot.center.lat, lot.center.lng)
           });

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
