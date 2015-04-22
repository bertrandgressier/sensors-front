'use strict';

/**
 * @ngdoc function
 * @name sensorFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sensorFrontApp
 */
angular.module('sensorFrontApp')
  .controller('MainCtrl', function ($scope, $http, temperatureSensorService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //$http.get('http://api.openweathermap.org/data/2.5/history/city?id=2998520&type=hour').then(function(response)
    $http.get('http://api.wunderground.com/api/7adcbd42c43e3992/history_20150421/q/FR/libercourt.json', {cache: true}).then(function (response) {
      $scope.data = _(response.data.history.observations).map(function (hourlyData) {
        //return {date: {hour: hourlyData.date.hour, min: hourlyData.date.min} , temp: hourlyData.tempm, humidity: hourlyData.hum};
        return parseInt(hourlyData.tempm);
      });

      console.log(_(response.data.history.observations).map(function (hourlyData) {
        return {
          date: {hour: hourlyData.date.hour, min: hourlyData.date.min},
          temp: hourlyData.tempm,
          humidity: hourlyData.hum
        };

      }));

      $scope.chartConfig = {

        options: {
          chart: {
            type: 'line'
          },
          title: {
            text: 'Daily Temperature'
          },
          xAxis: {
            categories: _.range(0.0, 24, 0.5),
            allowDecimals: true
          },
          yAxis: {
            title: {
              text: 'Temperature (°C)'
            }
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true
              },
              enableMouseTracking: false
            }
          }
        },
        series: [{
          name: 'Libercourt',
          data: $scope.data
        }],
        //function (optional)
        func: function (chart) {
          //setup some logic for the chart
        }
      };
    });

    temperatureSensorService.getData().then(function (datas) {
      var lastData = {temp: undefined, hour: 0};
      $scope.temperatures = _(_(datas).map(function (data) {
        var result = [];
        while (lastData.hour < data._id.hour - 1) {
          result.push(lastData.temp);
          lastData.hour++;
        }
        lastData.temp = data.last;
        lastData.hour = data._id.hour;
        result.push(data.avg);
        console.log(result);
        return result;
      })).flatten();

      $scope.chartConfig2 = {

        options: {
          chart: {
            type: 'line'
          },
          title: {
            text: 'Evolution of temperature in Bertrand\'s bedroom'
          },
          xAxis: {
            categories: _.range(1, 24),
            allowDecimals: true
          },
          yAxis: {
            title: {
              text: 'Temperature (°C)'
            }
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true
              },
              enableMouseTracking: false
            }
          }
        },
        series: [{
          name: 'Bertrand\'s bedroom',
          data: $scope.temperatures
        }],
        //function (optional)
        func: function (chart) {
          //setup some logic for the chart
        }
      };
    });
  });
