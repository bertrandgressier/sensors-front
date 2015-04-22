'use strict';

angular.module('sensorFrontApp')
  .factory('temperatureSensorService', function ($http) {
    var service = {};

    service.getData = function () {
      return $http.get('http://localhost:3000/api/sensors').then(function (response) {
        return response.data;
      });
    };

    return service;
  });
