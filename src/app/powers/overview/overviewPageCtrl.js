/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Overview, User, ImgPrefix, Log) {

        $scope.show = {};
        $scope.prefix = ImgPrefix.prefix;

        /**
         * ---------------- del --------
         */
        $scope.d = function () {
            var data = {
                "status": "OK",
                "message": "",
                "data": [
                    {
                        "cid": "1",
                        "name": "时代金融",
                        "ico": "public/img/client/blue.png",
                        "longitude": "121.48",
                        "latitude": "31.22"
                    },
                    {
                        "cid": "2",
                        "name": "交通大学",
                        "ico": "public/img/client/red.png",
                        "longitude": "121.16",
                        "latitude": "30.89"
                    }
                ],
                "auth": ""
            };

            for (var i = 0; i < data.data.length; i++) {
                data.data[i].ico = ImgPrefix.prefix + data.data[i].ico;
            }

            $scope.show = data.data;
        };
        $scope.dd = function () {

            var data = {
                "status": "OK",
                "message": "",
                "data": {
                    "cid": "1",
                    "name": "时代金融",
                    "address": "上海",
                    "level": "10000kV",
                    "contactor": "李四",
                    "contactortel": "22",
                    "customer_contactor": "王平",
                    "customer_contactortel": "12345678",
                    "requiredmd": "20000kW",
                    "currentmd": "15000kW"
                },
                "auth": ""
            };

            return data.data;
        };

        $scope.init = function () {

            // 模拟登陆
            User.login({
                    account: 111,
                    psw: 111111
                },
                function (data) {
                    Log.i(JSON.stringify(data.data));
                }, function (err) {

                });

            Overview.query({},
                function (data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].ico = ImgPrefix.prefix + data.data[i].ico;
                    }
                    $scope.show = data.data;

                }, function (err) {

                });

            $scope.d();
        };
        $scope.init();

        $scope.getDetail = function (id) {

            Overview.queryDetail({
                    cid: id
                },
                function (data) {
                    return data.data;
                }, function (err) {

                });

            return $scope.dd();
        };

    }

})();
