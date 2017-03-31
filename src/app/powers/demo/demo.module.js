/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.demo', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('demo', {
          url: '/demo',
          title: 'demo',
          templateUrl: 'app/powers/demo/demo.html',
          controller: 'demoPageCtrl',
        });
  }

})();
