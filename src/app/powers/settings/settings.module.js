(function () {
  'use strict';

  angular.module('BlurAdmin.power.settings', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('settings', {
          url: '/settings',
          title: '平台设置',
          templateUrl: 'app/powers/settings/settings.html',
          controller: 'settingsPageCtrl',
        });
  }

})();
