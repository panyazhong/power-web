/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Overview, Sidebar, SidebarCache, Log, $cookies, HttpToast) {

        // $scope.show = $cookies.getObject('clientScope');

        $scope.info = {};

        $scope.init = function () {
            Sidebar.query({},
                function (data) {
                    SidebarCache.create(data);
                    $scope.info.clients = data.clients;

                    Log.i('http clients：' + JSON.stringify($scope.info.clients));

                    var script = document.createElement('script');
                    script.src = "http://webapi.amap.com/maps?v=1.3&key=3f2f7af161fc3682e1a9702914394aed";
                    document.head.appendChild(script);
                }, function (err) {
                    HttpToast.toast(err);
                });
        };
        $scope.init();

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
