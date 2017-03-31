/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.report', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('report', {
          url: '/report',
          title: '报表查询',
          templateUrl: 'app/pages/report/report.html',
          controller: 'reportPageCtrl',
        });
  }

})();
