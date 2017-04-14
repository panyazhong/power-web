/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Overview, SidebarCache, $cookies, HttpToast) {

        // $scope.show = SidebarCache.getData().clients;
        $scope.show = $cookies.getObject('clientScope');

        $scope.getDetail = function (id, pos, cb) {
            Overview.queryDetail({
                    cid: id
                },
                function (data) {
                    cb(data, pos);
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

    }

})();
