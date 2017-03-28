/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.history', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('history', {
          url: '/history',
          title: '历史数据',
          templateUrl: 'app/pages/history/history.html',
          controller: 'historyPageCtrl',
        });
  }

})();
