/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.monitoring', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('monitoring', {
          url: '/monitoring',
          title: '实时监控',
          templateUrl: 'app/pages/monitoring/monitoring.html',
          controller: 'monitoringPageCtrl',
        });
  }

})();
