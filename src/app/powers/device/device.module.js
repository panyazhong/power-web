/**
 * @author v.lugovsky
 * created on 16.12.2015
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
          title: '设备台账',
          templateUrl: 'app/powers/device/device.html',
          controller: 'devicePageCtrl',
        });
  }

})();
