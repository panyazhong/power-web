/**
 * @author a.demeshko
 * created on 12/17/15
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.train', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('train', {
          url: '/train',
          templateUrl: 'app/powers/train/train.html',
          controller: 'trainPageCtrl',
        });
  }

})();