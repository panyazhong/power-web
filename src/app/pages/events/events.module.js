/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.events', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('events', {
          url: '/events',
          title: '当前事件',
          templateUrl: 'app/pages/events/events.html',
          controller: 'eventsPageCtrl',
        });
  }

})();
