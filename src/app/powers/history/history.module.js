/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.history', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('history', {
          url: '/history',
          title: '历史数据',
          templateUrl: 'app/powers/history/history.html',
          controller: 'historyPageCtrl',
        });
  }

})();
