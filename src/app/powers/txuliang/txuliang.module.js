/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.power.txuliang', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('txuliang', {
          url: '/txuliang',
          title: '历史数据/需量数据',
          templateUrl: 'app/powers/txuliang/txuliang.html',
          controller: 'txuliangPageCtrl',
        });
  }

})();
