var app = angular.module('parking', ['ngWebSocket']);

app.controller('mainCtrl', ['$scope', '$http', '$websocket', function($scope, $http, $websocket) {
    var vm = this;
    vm.test = 'Hello World!';

    vm.lotStats = {
        'A': {

        },
        'B': {

        }
    };

    var updateLotStats = function(lots) {
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
