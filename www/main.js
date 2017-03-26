angular.module('newYearGoalsApp', ['chart.js']);

angular.module('newYearGoalsApp').controller('MainController', function($scope, $http) {
    // chart options
    $scope.options = {
        hover: {
            mode: "x-axis"
        },
        tooltips: {
            mode: "x-axis"
        },
        elements: {
            point: { 
                radius: 0
            }
        },
        scales: {
            xAxes: [{
                ticks: {
                    maxTicksLimit: 20
                }
            }]
        }
    };

    $scope.datasetOverride = [{
        lineTension: 0
    }]

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
            diff_dists = []
            for (var i = 0; i < raw_data.length; i++) {
                target = (i+1)*1000/365;
                actual = raw_data[i];

                label_days.push("Day " + (i+1));
                target_dists.push(target.toFixed(1));
                actual_dists.push(actual.toFixed(1));
                diff_dists.push( (actual-target).toFixed(1) ) ;
            }

            // show data to scope
            $scope.labels = label_days;
            $scope.series = ['Distance Ran', 'Target Distance'];
            $scope.data = [actual_dists,target_dists];

            $scope.diffLabels = label_days;
            $scope.diffSeries = ['Difference'];
            $scope.diffData = [diff_dists];
        },
        function (response) { //Error callback
            console.log(response.toString());
        }
    );


});
