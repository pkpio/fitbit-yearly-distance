angular.module('newYearGoalsApp', ['n3-line-chart']);

angular.module('newYearGoalsApp').controller('MainController', function($scope, $http) {

    // Options for plot
    $scope.options = {
            margin: {
            top: 5
        },
        series: [
            {
              axis: "y",
              dataset: "distance_data",
              key: "actual",
              label: "Distance ran",
              color: "rgb(70, 191, 189)",
              type: ["dot","line","area"],
              id: "mySeries0"
            },
            {
              axis: "y",
              dataset: "distance_data",
              key: "target",
              label: "Expected distance",
              color: "rgb(247, 70, 74)",
              type: ["dot","line","area"],
              id: "mySeries1"
            }
        ],
        axes: {
            x: {
              key: "day"
            }
        }
    };

    // Init with some dummy data
    $scope.data = {
        distance_data:[
            {
                day: 0,
                actual: 2,
                target: 2.7 
            },
            {
                day: 1,
                actual: 5,
                target: 5.4 
            },
            {
                day: 3,
                actual: 9,
                target: 8.1 
            }
        ]
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
            distances = [];
            for (var i = 0; i < raw_data.length; i++) {
                point = {
                    day: i,
                    target: ((i+1)*1000/365).toFixed(1),
                    actual: (raw_data[i]).toFixed(1)
                };
                distances.push(point);
            }

            // show data to scope
            $scope.data = {distance_data:distances};
        },
        function (response) { //Error callback
            console.log(response.toString());
        }
    );


});