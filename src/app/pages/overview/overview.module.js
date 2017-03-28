/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.overview', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('overview', {
          url: '/overview',
          title: '概况总览',
          templateUrl: 'app/pages/overview/overview.html',
          controller: 'overviewPageCtrl',
        });
  }

})();
