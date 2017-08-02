(function () {
  'use strict';

  angular.module('BlurAdmin.power.checkin', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('checkin', {
          url: '/checkin',
          title: '巡检查询',
          templateUrl: 'app/powers/checkin/checkin.html',
          controller: 'checkinPageCtrl',
        });
  }

})();
