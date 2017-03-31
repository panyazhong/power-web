/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.overview', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('overview', {
          url: '/overview',
          title: '概况总览',
          templateUrl: 'app/powers/overview/overview.html',
          controller: 'overviewPageCtrl',
        });
  }

})();
