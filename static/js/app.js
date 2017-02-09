var app = angular.module('parking', []);

app.controller('mainCtrl', ['$scope', function($scope) {
    var vm = this;
    vm.test = 'Hello World!';
}]);
