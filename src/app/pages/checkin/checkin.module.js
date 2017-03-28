/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.checkin', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('checkin', {
          url: '/checkin',
          title: '签到查询',
          templateUrl: 'app/pages/checkin/checkin.html',
          controller: 'checkinPageCtrl',
        });
  }

})();
