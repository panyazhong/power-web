/**
 * @author a.demeshko
 * created on 12/17/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.setuser', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setuser', {
          url: '/setuser',
          templateUrl: 'app/powers/setuser/setuser.html',
          controller: 'setuserPageCtrl',
        });
  }

})();