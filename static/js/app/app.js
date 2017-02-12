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

    vm.lotStats = {
        'J': {
            'name': 'J',
            'center': { 'lat': 34.059023771209475, 'lng': -117.82856225967407 },
            'points': [
                { 'lat': 34.05623276041801, 'lng': -117.82768249511719 },
                { 'lat': 34.055877211042706, 'lng': -117.82864809036255 },
                { 'lat': 34.057246067955674, 'lng': -117.82944202423096 },
                { 'lat': 34.058223809359276, 'lng': -117.82933473587036 },
                { 'lat': 34.0587393411944, 'lng': -117.82856225967407 },
                { 'lat': 34.0587748949985, 'lng': -117.82740354537964 },
                { 'lat': 34.05808159312878, 'lng': -117.82742500305176 },
                { 'lat': 34.05799270786358, 'lng': -117.82809019088745 },
                { 'lat': 34.05781493705347, 'lng': -117.82849788665771 },
                { 'lat': 34.05744161713868, 'lng': -117.82843351364136 }
            ],
        },

        'M': {
            'name': 'M',
            'center': { 'lat': 34.056421647528826, 'lng': -117.83015741577148 },
            'points': [
                { 'lat': 34.05612609576202, 'lng': -117.83074021339417 },
                { 'lat': 34.05613498448846, 'lng': -117.82958149909973 },
                { 'lat': 34.0559972091236, 'lng': -117.8295385837555 },
                { 'lat': 34.05597054289807, 'lng': -117.82899677753448 },
                { 'lat': 34.05558388168536, 'lng': -117.82882511615753 },
                { 'lat': 34.05538388381427, 'lng': -117.82882511615753 },
                { 'lat': 34.05535721739583, 'lng': -117.82921135425568 },
                { 'lat': 34.05485055385117, 'lng': -117.82920598983765 },
                { 'lat': 34.05483722055911, 'lng': -117.83051490783691 },
                { 'lat': 34.05533499537405, 'lng': -117.8307455778122 }
            ]
        }
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
                paths: lot.points,
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
