/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.overview')
        .controller('overviewPageCtrl', overviewPageCtrl);

    /** @ngInject */
    function overviewPageCtrl($scope, Overview, User, ImgPrefix) {

        $scope.show = {};
        $scope.prefix = ImgPrefix.prefix;

        $scope.init = function () {

            // 模拟登陆
            User.login({
                    account: 111,
                    psw: 111111
                },
                function (data) {

                }, function (err) {

                });

            Overview.query({},
                function (data) {

                }, function (err) {

                });

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
        $scope.init();

        $scope.getDetail = function (id) {

            var info = [{
                clientId: '021001',
                clientName: '时代金融',
                addresss: '浦东新区银城中路68号',
                level: '10kv',
                contactor: '王平',
                contactortel: '13822223333',
                clientAdmin: '魏延',
                clientTel: '18878789999',
                requiredmd: '2000kW',
                requiredmdCurrent: '1500kW'
            }, {
                clientId: '021002',
                clientName: '上海中心',
                addresss: '浦东新区张杨路174号',
                level: '15kv',
                contactor: '关平',
                contactortel: '15933445533',
                clientAdmin: '关兴',
                clientTel: '13099998888',
                requiredmd: '1500kW',
                requiredmdCurrent: '120kW'
            }, {
                clientId: '021003',
                clientName: '世博轴',
                addresss: '浦东新区周家渡路',
                level: '12kv',
                contactor: '黄盖',
                contactortel: '15600990909',
                clientAdmin: '周瑜',
                clientTel: '13412312323',
                requiredmd: '1000kw',
                requiredmdCurrent: '555kW'
            }, {
                clientId: '021004',
                clientName: '上海体育馆',
                addresss: '徐汇区漕溪北路1114号',
                level: '200kW',
                contactor: '赵云',
                contactortel: '18767678899',
                clientAdmin: '嘟嘟',
                clientTel: '15099998888',
                requiredmd: '100kW',
                requiredmdCurrent: '67kW'
            }];
            return info[id];
        };

    }

})();
