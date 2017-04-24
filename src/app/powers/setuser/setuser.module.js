(function () {
  'use strict';

  angular.module('BlurAdmin.power.setuser', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setuser', {
          url: '/setuser',
          title: '平台设置 / 用户设置',
          templateUrl: 'app/powers/setuser/setuser.html',
          controller: 'setuserPageCtrl',
        });
  }

})();
