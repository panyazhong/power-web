(function () {
  'use strict';

  angular.module('BlurAdmin.power.setpwd', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('setpwd', {
          url: '/setpwd',
          title: '平台设置 / 账号设置',
          templateUrl: 'app/powers/setpwd/setpwd.html',
          controller: 'setpwdPageCtrl',
        });
  }

})();
