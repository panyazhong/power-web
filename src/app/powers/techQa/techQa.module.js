/**
 * @author a.demeshko
 * created on 12/17/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.techQa', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('techQa', {
          url: '/techQa',
          templateUrl: 'app/powers/techQa/techQa.html',
          controller: 'techQaPageCtrl',
        });
  }

})();