/**
 * @author a.demeshko
 * created on 12/17/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.device', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('device', {
          url: '/device',
          templateUrl: 'app/powers/device/device.html',
          controller: 'devicePageCtrl',
        });
  }

})();