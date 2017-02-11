var app = angular.module('parking', ['ngRoute']);

app.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
    var vm = this;
    vm.test = 'Hello World!';

    vm.lotStats = {
        'A': {

        },
        'B': {

        }
    };

    var load = function() {
        $http({
            'url': 'api/lots',
            'method': 'GET'
        }).then(function(resp) {
            // loop through lot data returned
            var lots = resp.data;
            for (var lotName in lots) {
                // make sure lot exists
                if (lots.hasOwnProperty(lot) && vm.lotStats.hasOwnProperty(lotName)) {
                    // copy keys to internal lot state object
                    var lot = lots[lotName];
                    for (var key in lot) {
                        if (lot.hasOwnProperty(key)) {
                            vm.lotStats[lotName][key] = lot[key];
                        }
                    }
                }
            }
        }, function (resp) {
            console.log(resp);
        });
    };

    load();
}]);
