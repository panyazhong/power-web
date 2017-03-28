/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components.pageTop')
        .controller('pageTopCtrl', pageTopCtrl);

    /** @ngInject */
    function pageTopCtrl($scope, $state, $timeout) {
        // $scope.progressFunction = function() {
        //   return $timeout(function() {}, 3000);
        // };

        $scope.test = function (e) {

            $state.go('profile');

            $('.page-top-content-title').removeClass('page-top-title-active');
            $(e.target).addClass('page-top-title-active');
        };

        /**
         * 退出
         */
        $scope.logout = function () {
            alert('退出');
        };

    }

})();
