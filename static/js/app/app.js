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

        var shapeSettings = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.2,
            clickable: false
        };

        for (var lotName in vm.lotStats) {
            var lot = vm.lotStats[lotName];
            // Construct polygon.
            var settings = angular.copy(shapeSettings);
            settings.paths = lot.points;
            var bermudaTriangle = new google.maps.Polygon(settings);
            bermudaTriangle.setMap(map);

            var text = lot.name;
            if (typeof lot.maxCapacity !== 'undefined' && typeof lot.occupancy !== 'undefined') {
                text += ' ' + (lot.maxCapacity - lot.occupancy) + '/' + lot.maxCapacity;
            }

            // draw label on map
            var label = new Label({
                'text': text,
                map: map,
                position: new google.maps.LatLng(lot.center.lat, lot.center.lng),
                optimized: false,
                zIndex: 90,
                style: {
                    color: 'green'
                }
           });

           lot.mapLabel = label;
        }
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

                // update label on map
                lot = vm.lotStats[lotName];
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
