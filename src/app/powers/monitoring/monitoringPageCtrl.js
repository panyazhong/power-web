/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring')
        .controller('monitoringPageCtrl', monitoringPageCtrl);

    /** @ngInject */
    function monitoringPageCtrl($scope, $state, $location, PageTopCache, ToastUtils, ImgPrefix, Log,
                                Clientimg, ClientimgHelper, Branch) {


        $scope.show = {};
        $scope.branchData = {};

        /**
         * ------------- del -----------
         */
        $scope.d = function () {

            var data = {
                "status": "OK",
                "message": "",
                "data": {
                    "client": {
                        "cid": "1",
                        "img": "public/img/client_img/1.png",
                        "imgw": "1000.0",
                        "imgh": "705.6",
                        "imgleft": "0.0",
                        "imgtop": "0.0"
                    },
                    "incomingline": [
                        {
                            "inid": "1",
                            "img": "public/img/incomingline_img/1.png",
                            "imgw": "97.2",
                            "imgh": "235.9",
                            "imgleft": "185.4",
                            "imgtop": "67.5"
                        },
                        {
                            "inid": "2",
                            "img": "public/img/incomingline_img/2.png",
                            "imgw": "99.2",
                            "imgh": "233.8",
                            "imgleft": "461.5",
                            "imgtop": "67.5"
                        },
                        {
                            "inid": "3",
                            "img": "public/img/incomingline_img/3.png",
                            "imgw": "100.7",
                            "imgh": "233.8",
                            "imgleft": "742.4",
                            "imgtop": "67.5"
                        }
                    ],
                    "branch": [
                        {
                            "bid": "1",
                            "img": "public/img/branch_img/1.png",
                            "imgw": "52.7",
                            "imgh": "143.3",
                            "imgleft": "33.0",
                            "imgtop": "307.1"
                        },
                        {
                            "bid": "2",
                            "img": "public/img/branch_img/2.png",
                            "imgw": "53.6",
                            "imgh": "312.1",
                            "imgleft": "85.5",
                            "imgtop": "307.1"
                        },
                        {
                            "bid": "3",
                            "img": "public/img/branch_img/3.png",
                            "imgw": "43.9",
                            "imgh": "191.9",
                            "imgleft": "139.1",
                            "imgtop": "307.1"
                        },
                        {
                            "bid": "4",
                            "img": "public/img/branch_img/4.png",
                            "imgw": "49.4",
                            "imgh": "188.6",
                            "imgleft": "182.9",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "5",
                            "img": "public/img/branch_img/5.png",
                            "imgw": "48.6",
                            "imgh": "188.6",
                            "imgleft": "233.2",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "6",
                            "img": "public/img/branch_img/6.png",
                            "imgw": "51.1",
                            "imgh": "188.6",
                            "imgleft": "281.0",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "7",
                            "img": "public/img/branch_img/7.png",
                            "imgw": "51.9",
                            "imgh": "188.6",
                            "imgleft": "332.1",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "8",
                            "img": "public/img/branch_img/8.png",
                            "imgw": "54.4",
                            "imgh": "188.6",
                            "imgleft": "384.0",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "9",
                            "img": "public/img/branch_img/9.png",
                            "imgw": "42.0",
                            "imgh": "188.6",
                            "imgleft": "436.7",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "10",
                            "img": "public/img/branch_img/10.png",
                            "imgw": "77.5",
                            "imgh": "191.0",
                            "imgleft": "481.5",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "11",
                            "img": "public/img/branch_img/11.png",
                            "imgw": "38.7",
                            "imgh": "191.0",
                            "imgleft": "559.7",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "12",
                            "img": "public/img/branch_img/12.png",
                            "imgw": "46.2",
                            "imgh": "191.0",
                            "imgleft": "599.3",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "13",
                            "img": "public/img/branch_img/13.png",
                            "imgw": "50.3",
                            "imgh": "191.0",
                            "imgleft": "645.5",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "14",
                            "img": "public/img/branch_img/14.png",
                            "imgw": "49.4",
                            "imgh": "191.0",
                            "imgleft": "695.0",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "15",
                            "img": "public/img/branch_img/15.png",
                            "imgw": "56.9",
                            "imgh": "191.0",
                            "imgleft": "742.8",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "16",
                            "img": "public/img/branch_img/16.png",
                            "imgw": "48.6",
                            "imgh": "191.0",
                            "imgleft": "800.5",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "17",
                            "img": "public/img/branch_img/17.png",
                            "imgw": "51.1",
                            "imgh": "283.3",
                            "imgleft": "849.2",
                            "imgtop": "309.2"
                        },
                        {
                            "bid": "18",
                            "img": "public/img/branch_img/18.png",
                            "imgw": "55.2",
                            "imgh": "131.8",
                            "imgleft": "902.7",
                            "imgtop": "309.2"
                        }
                    ]
                },
                "auth": ""
            };

            $scope.show = ClientimgHelper.query(data.data);
        };
        $scope.dd = function () {
            var d = {
                "status": "OK",
                "message": "",
                "data": {
                    "bid": "1",
                    "name": "支线1",
                    "currentA": "100A",
                    "currentB": "100A",
                    "currentC": "100A",
                    "p": "30kW",
                    "powerFactor": "1",
                    "voltageA": "220kV",
                    "voltageB": "220kV",
                    "voltageC": "220kV",
                    "q": "30kVar",
                    "wp": "45kWh",
                    "temperature": "30℃"
                },
                "auth": ""
            };

            $scope.branchData = d.data;
        };

        $scope.init = function () {
            PageTopCache.cache.state = $state.$current; // 激活state

            Clientimg.query({
                    cid: $location.search().id
                },
                function (data) {
                    if (data.data) {
                        $scope.show = ClientimgHelper.query(data.data);
                    }
                }, function (err) {

                });

            $scope.d();
            $scope.dd();
        };
        $scope.init();

        /**
         * hover显示控件详情
         */
        $scope.showDetail = function (id) {

            Log.i("bid：" + id);
            
            // Branch.query({
            //         bid: id
            //     },
            //     function (data) {
            //         $scope.branchData = data.data;
            //     }, function (err) {
            //
            //     });

            // $scope.dd();
        };

        /**
         * 点击查看设备明细
         */
        $scope.lookDetail = function (id) {
            ToastUtils.openToast('info', '选中的支线id是：' + id);

            /**
             * 需要将设备id传递过去，或全局变量记录当前设备信息
             */
            $state.go('branch');
        }

    }

})();
