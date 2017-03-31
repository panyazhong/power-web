/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Keyword) {

        $scope.test = function () {

            Keyword.getList({},
                function (data) {

                }, function (err) {

                })

        };
        $scope.test();

    }

})();
