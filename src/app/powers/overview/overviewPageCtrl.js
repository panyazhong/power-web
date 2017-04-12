/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Overview, SidebarCache, HttpToast) {

        $scope.show = SidebarCache.info.clients;

        $scope.getDetail = function (id, pos, cb) {

            Overview.queryDetail({
                    cid: id
                },
                function (data) {
                    if (data.data) {
                        cb(data.data, pos);
                    }
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

    }

})();
