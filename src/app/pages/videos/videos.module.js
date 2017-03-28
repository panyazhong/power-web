/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.videos', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('videos', {
          url: '/videos',
          title: '视频监控',
          templateUrl: 'app/pages/videos/videos.html',
          controller: 'videosPageCtrl',
        });
  }

})();
