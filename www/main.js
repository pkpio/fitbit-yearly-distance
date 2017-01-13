angular.module('newYearGoalsApp', ['chart.js']);

angular.module('newYearGoalsApp').controller('MainController', function($scope, $http) {
    // chart options
    $scope.options = {
      pointHitDetectionRadius : 1000
    };

	// Get data
    var req = {
        method: 'GET',
        url: 'distance.json'
    };
    $http(req)
        .then(
        function (response) { // Success callback
            raw_data = response.data;

            // Let's process now!
            label_days = []
            target_dists = []
            actual_dists = []
            for (var i = 0; i < raw_data.length; i++) {
                label_days.push("Day " + (i+1));
                target_dists.push( ((i+1)*1000/365).toFixed(1) );
                actual_dists.push( (raw_data[i]).toFixed(1) );
            }

            // show data to scope
            $scope.labels = label_days;
            $scope.series = ['Distance Ran', 'Target Distance'];
            $scope.data = [actual_dists,target_dists];
        },
        function (response) { //Error callback
            console.log(response.toString());
        }
    );


});