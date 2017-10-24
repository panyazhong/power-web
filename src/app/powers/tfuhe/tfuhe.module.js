/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.tfuhe', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('tfuhe', {
          url: '/tfuhe',
          title: '历史数据/负荷数据',
          templateUrl: 'app/powers/tfuhe/tfuhe.html',
          controller: 'tfuhePageCtrl',
        });
  }

})();
