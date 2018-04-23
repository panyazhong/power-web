/**
 * @author a.demeshko
 * created on 12/17/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.setaccount', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setaccount', {
          url: '/setaccount',
          templateUrl: 'app/powers/setaccount/setaccount.html',
          controller: 'setaccountPageCtrl',
        });
  }

})();