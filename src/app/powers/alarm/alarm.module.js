/**
 * @author a.demeshko
 * created on 12/17/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.alarm', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('alarm', {
          url: '/alarm',
          templateUrl: 'app/powers/alarm/alarm.html',
          controller: 'alarmPageCtrl',
        });
  }

})();