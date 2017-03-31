/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
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
          templateUrl: 'app/pages/settings/settings.html',
          controller: 'settingsPageCtrl',
        });
  }

})();
