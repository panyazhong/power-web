/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Keyword, Demo) {

        $scope.test = function () {

            Demo.login({
                account: '111',
                psw: '111111'
            }, function (data) {

            }, function (err) {

            })

        };
        $scope.test();

    }

})();
