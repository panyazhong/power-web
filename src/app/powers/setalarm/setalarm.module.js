(function () {
  'use strict';

  angular.module('BlurAdmin.power.setalarm', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setalarm', {
          url: '/setalarm',
          title: '平台设置 / 报警设置',
          templateUrl: 'app/powers/setalarm/setalarm.html',
          controller: 'setalarmPageCtrl',
        });
  }

})();
