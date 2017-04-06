/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.branch', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('branch', {
          url: '/branch',
          title: '支线明细',
          templateUrl: 'app/powers/branch/branch.html',
          controller: 'branchPageCtrl',
        });
  }

})();
