/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Log, Demo) {

        $scope.init = function () {

            Demo.login({
                // account: '111',
                // psw: '111111'
                account: '222',
                psw: '222222'
            }, function (data) {

                Log.i(JSON.stringify(data));

            }, function (err) {

            });

        };
        $scope.init();

    }

})();
