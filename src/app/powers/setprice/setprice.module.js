/**
 * @author a.demeshko
 * created on 12/17/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.setprice', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setprice', {
          url: '/setprice',
          templateUrl: 'app/powers/setprice/setprice.html',
          controller: 'setpricePageCtrl',
        });
  }

})();