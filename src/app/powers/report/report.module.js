/**
 * @author a.demeshko
 * created on 12/17/15
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
          templateUrl: 'app/powers/report/report.html',
          controller: 'reportPageCtrl',
        })
  }

})();