(function () {
    'use strict';

    angular.module('BlurAdmin.power.monitoring')
        .controller('monitoringPageCtrl', monitoringPageCtrl);

    /** @ngInject */
    function monitoringPageCtrl($scope, $state, $stateParams, PageTopCache, Clientimg, ClientimgHelper,
                                Branch, HttpToast, SidebarCache, Sidebar, Log, locals, EventsCache,
                                $rootScope, ToastUtils, clientCache, previewCache, $timeout, Client, clientSvg) {

        PageTopCache.cache.state = $state.$current; // active
        $stateParams.cid ? locals.put('cid', $stateParams.cid) : '';

        /*
        $scope.show = {
            imgs: {},   // images info
            branch: {},  // branch info
            isGetData: false    // 待系统图信息获取OK订阅刷新才有意义
        };

        $scope.queryClientImg = function (cid) {

            var id = locals.get('cid', '') ? locals.get('cid', '') : cid;   //缓存不为空取缓存，否则默认取第一个
            EventsCache.subscribeClient(id);   // 订阅变电站信息

            Clientimg.query({
                    cid: id
                },
                function (data) {
                    $scope.show.imgs = ClientimgHelper.query(data, {});
                    // Log.i("Clientimg处理后:\n " + JSON.stringify($scope.show.imgs));
                    // data.client.name; 变电站名称，若需要可用
                    PageTopCache.currentState.state = data.client.name + " / 一次系统图";

                    $scope.show.isGetData = true;
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.init = function () {
            if (SidebarCache.isEmpty()) {
                Log.i('empty： ——SidebarCache');

                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        $scope.queryClientImg(data.sidebar[0].clientId);
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                $scope.queryClientImg(SidebarCache.getData().sidebar[0].clientId);
            }
        };
        $scope.init();

        $scope.setBranchInfo = function (data) {
            $scope.show.branch.currentA = data.currentA;
            $scope.show.branch.currentB = data.currentB;
            $scope.show.branch.currentC = data.currentC;
            $scope.show.branch.p = data.p;
            $scope.show.branch.powerFactor = data.powerFactor;

            $scope.show.branch.voltageA = data.voltageA;
            $scope.show.branch.voltageB = data.voltageB;
            $scope.show.branch.voltageC = data.voltageC;
            $scope.show.branch.q = data.q;
            $scope.show.branch.wp = data.wp;
            $scope.show.branch.temperature = data.temperature;
        };
        */

        /**
         * 显示前搜索
         */
        /*
        $scope.onBeforeShow = function (id) {

            $scope.show.branch = {};    // init

            // 1.缓存取变量信息
            var branchData = clientCache.cache.data[id];
            if (branchData) {
                console.log('branchData Cache不为空：' + JSON.stringify(branchData));
                // 支线详情
                $scope.setBranchInfo(branchData);
            }

            // 2.取支线名称、id
            Branch.query({
                    bid: id
                },
                function (data) {
                    $scope.show.branch.name = data.name;
                    $scope.show.branch.bid = data.bid;
                }, function (err) {
                    HttpToast.toast(err);
                });
        };
        */

        /**
         * 查看分支详情
         */
        /*
        $scope.viewBranchDetail = function (id) {
            if (!id) {
                ToastUtils.openToast('warning', '支线信息异常。稍后再试.');
                return
            }

            $state.go('branch', {bid: id}, {reload: true});

            locals.put('bid', id);
        };
        */

        $scope.setBgWidth = function (w) {
            if (!w) {
                return
            }

            return {
                "min-width": w + "px"
            }
        };

        /**
         *  查看line详情
         */
        $scope.viewBranch = function (id) {
            if (!id) {
                ToastUtils.openToast('warning', '支线信息异常。稍后再试.');
                return
            }

            $state.go('branch', {bid: id}, {reload: true});

            locals.put('bid', id);
        };

        $scope.queryClientSvg = function () {
            var p = {
                id: locals.get('cid', ''),
                svg: 'svg'
            };
            Client.querySvg(p,
                function (data) {
                    $scope.tree = clientSvg.create(data);
                    Log.i('b，svg转换后 :\n ' + JSON.stringify($scope.tree));
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        // b. 根据变电站id获取svg信息
        $scope.initFilterInfo = function () {
            // $scope.initInfo();  // clear info

            var cid = locals.get('cid', '');
            if (cid) {
                EventsCache.subscribeClient(cid);   // 订阅变电站信息

                $scope.queryClientSvg();
            }
            else {  // 和其它界面diff，不存在也需选中一个客户
                locals.put('cid', $scope.show.mapData[0].id);
                $timeout(function () {
                    EventsCache.subscribeClient($scope.show.mapData[0].id);   // 订阅变电站信息

                    $scope.queryClientSvg();
                }, 200);
            }

        };

        /**
         * a. 获取变电站信息
         * b. 根据变电站id获取svg信息
         */
        // a. 获取变电站信息
        $scope.init = function () {

            var pm = previewCache.getPreview();
            pm.then(function (data) {
                $scope.show.mapData = data;

                $scope.initFilterInfo();
            });

        };
        $scope.init();

        /**
         * socket
         */
        $rootScope.$on('refreshMonitor', function (event, data) {
            if (!data) {
                return
            }

            if (!$scope.show.isGetData) {
                return
            }
            // 一次系统图
            $scope.show.imgs = ClientimgHelper.query($scope.show.imgs, data);
            $rootScope.$digest();

            if (!$scope.show.branch.bid) {
                return
            }
            // 支线详情
            var branchInfo = data[$scope.show.branch.bid];
            $scope.setBranchInfo(branchInfo);
            $rootScope.$digest();
        });

        $rootScope.$on('filterInfo', function (event, data) {
            if (!data) {
                return
            }
            if ($state.$current != 'monitoring') {
                return
            }

            if (data.cid) {
                $scope.queryClientImg(data.cid);
            }

        });


        /**
         * svg test data
         */

        $scope.tree = {
            "name": "良友木业",
            "templateUrl": "app/powers/temp/template.html",
            "data": [{
                "id": 96,
                "name": "企口4#线电源控制柜",
                "lines": [{"id": 101, "name": "企口4#"}, {"id": 102, "name": "企口5#长"}, {"id": 103, "name": "企口5#短"}]
            }, {
                "id": 97,
                "name": "6#7#机电源控制柜",
                "lines": [{"id": 104, "name": "7#除尘"}, {"id": 105, "name": "企口6#机"}, {
                    "id": 106,
                    "name": "企口7#机"
                }, {"id": 107, "name": "企口7#机进板处电箱"}]
            }, {
                "id": 98,
                "name": "分检1#机电源控制柜",
                "lines": [{"id": 108, "name": "分检1#线双端锯"}, {"id": 109, "name": "分检1#线分板机"}, {
                    "id": 110,
                    "name": "分检1#线底砂机"
                }, {"id": 111, "name": "分检1#线背槽机"}, {"id": 112, "name": "分检1#线面砂机、1#线拐弯机"}]
            }, {
                "id": 99,
                "name": "分检2#3#机电源控制柜",
                "lines": [{"id": 113, "name": "分检3#线面砂机、3#线拐弯机"}, {"id": 114, "name": "分检3#线底砂机、3#线双端锯"}, {
                    "id": 115,
                    "name": "分检2#线底砂机、3#线双端锯"
                }, {"id": 116, "name": "分检2#线面砂机"}, {"id": 117, "name": "分检2#3#线分板机"}]
            }]
        };

        $scope.monitorData = [{
            "alerts": [{
                "prop": "OV",
                "title": "总线过压警告",
                "val": "0.00",
                "color": "#666666"
            }, {"prop": "UV", "title": "总线欠压警告", "val": "0.00", "color": "#666666"}],
            "id": "96",
            "lines": [{
                "alerts": [{
                    "prop": "IaOC",
                    "title": "A相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IbOC", "title": "B相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IcOC",
                    "title": "C相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }],
                "Ia": "0.00A",
                "Ib": "0.00A",
                "Ic": "0.00A",
                "Ua": "222.10V",
                "Uc": "224.30V",
                "P": "0.00kW",
                "Q": "0.00kVar",
                "Pt1": "316.40kWh",
                "Qt2": "22501.30kWh",
                "id": "101",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}],
                "Ia": "70.50A",
                "Ib": "72.00A",
                "Ic": "69.00A",
                "Ua": "221.70V",
                "Uc": "224.20V",
                "P": "39.80kW",
                "Q": "25.65kVar",
                "Pt1": "462.40kWh",
                "Qt2": "8462.60kWh",
                "id": "102",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}],
                "Ia": "41.00A",
                "Ib": "44.00A",
                "Ic": "39.00A",
                "Ua": "222.10V",
                "Uc": "224.30V",
                "P": "22.22kW",
                "Q": "16.70kVar",
                "Pt1": "314.60kWh",
                "Qt2": "777.70kWh",
                "id": "103",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "1.00",
                    "color": "#ef5c62"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "1.00", "color": "#ef5c62"}], "id": "118", "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "1.00", "color": "#ef5c62"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}], "id": "119", "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}], "id": "120", "lines": []
            }]
        }, {
            "alerts": [{"prop": "OV", "title": "总线过压警告", "val": "0.00", "color": "#666666"}, {
                "prop": "UV",
                "title": "总线欠压警告",
                "val": "0.00",
                "color": "#666666"
            }],
            "id": "97",
            "lines": [{
                "alerts": [{
                    "prop": "IaOC",
                    "title": "A相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IbOC", "title": "B相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IcOC",
                    "title": "C相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }],
                "Ia": "135.00A",
                "Ib": "135.00A",
                "Ic": "135.00A",
                "Ua": "221.40V",
                "Uc": "226.00V",
                "P": "82.21kW",
                "Q": "38.85kVar",
                "Pt1": "1563.20kWh",
                "Qt2": "58669.90kWh",
                "id": "104",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}],
                "Ia": "0.00A",
                "Ib": "0.00A",
                "Ic": "0.00A",
                "Ua": "221.50V",
                "Uc": "226.60V",
                "P": "0.00kW",
                "Q": "0.00kVar",
                "Pt1": "604.80kWh",
                "Qt2": "632.70kWh",
                "id": "105",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "1.00",
                    "color": "#ef5c62"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "1.00", "color": "#ef5c62"}],
                "Ia": "60.00A",
                "Ib": "66.00A",
                "Ic": "57.00A",
                "Ua": "221.40V",
                "Uc": "226.90V",
                "P": "28.36kW",
                "Q": "29.81kVar",
                "Pt1": "894.20kWh",
                "Qt2": "4710.30kWh",
                "id": "106",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "1.00", "color": "#ef5c62"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}],
                "Ia": "0.00A",
                "Ib": "0.00A",
                "Ic": "0.00A",
                "Ua": "221.40V",
                "Uc": "226.80V",
                "P": "0.00kW",
                "Q": "0.00kVar",
                "Pt1": "33.80kWh",
                "Qt2": "5258.50kWh",
                "id": "107",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "1.00",
                    "color": "#ef5c62"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "1.00", "color": "#ef5c62"}], "id": "121", "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "1.00", "color": "#ef5c62"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}], "id": "122", "lines": []
            }]
        }, {
            "alerts": [{"prop": "OV", "title": "总线过压警告", "val": "0.00", "color": "#666666"}, {
                "prop": "UV",
                "title": "总线欠压警告",
                "val": "0.00",
                "color": "#666666"
            }],
            "id": "98",
            "lines": [{
                "alerts": [{
                    "prop": "IaOC",
                    "title": "A相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IbOC", "title": "B相过流告警", "val": "1.00", "color": "#ef5c62"}, {
                    "prop": "IcOC",
                    "title": "C相过流告警",
                    "val": "1.00",
                    "color": "#ef5c62"
                }],
                "Ia": "16.00A",
                "Ib": "16.00A",
                "Ic": "17.00A",
                "Ua": "215.00V",
                "Uc": "215.90V",
                "P": "5.96kW",
                "Q": "8.71kVar",
                "Pt1": "90.90kWh",
                "Qt2": "13334.90kWh",
                "id": "108",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "1.00", "color": "#ef5c62"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}],
                "Ia": "25.50A",
                "Ib": "25.50A",
                "Ic": "27.00A",
                "Ua": "215.10V",
                "Uc": "216.10V",
                "P": "13.93kW",
                "Q": "9.43kVar",
                "Pt1": "185.90kWh",
                "Qt2": "11186.70kWh",
                "id": "109",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "1.00",
                    "color": "#ef5c62"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "1.00", "color": "#ef5c62"}],
                "Ia": "135.00A",
                "Ib": "138.00A",
                "Ic": "138.00A",
                "Ua": "214.10V",
                "Uc": "215.40V",
                "P": "76.45kW",
                "Q": "44.13kVar",
                "Pt1": "779.00kWh",
                "Qt2": "45634.30kWh",
                "id": "110",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "1.00", "color": "#ef5c62"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}],
                "Ia": "0.00A",
                "Ib": "0.00A",
                "Ic": "0.00A",
                "Ua": "213.80V",
                "Uc": "215.00V",
                "P": "0.00kW",
                "Q": "0.00kVar",
                "Pt1": "4.50kWh",
                "Qt2": "715.50kWh",
                "id": "111",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}],
                "Ia": "96.00A",
                "Ib": "93.00A",
                "Ic": "97.50A",
                "Ua": "214.40V",
                "Uc": "215.40V",
                "P": "56.22kW",
                "Q": "25.11kVar",
                "Pt1": "687.90kWh",
                "Qt2": "33320.50kWh",
                "id": "112",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}], "id": "123", "lines": []
            }]
        }, {
            "alerts": [{"prop": "OV", "title": "总线过压警告", "val": "0.00", "color": "#666666"}, {
                "prop": "UV",
                "title": "总线欠压警告",
                "val": "0.00",
                "color": "#666666"
            }],
            "id": "99",
            "lines": [{
                "alerts": [{
                    "prop": "IaOC",
                    "title": "A相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IbOC", "title": "B相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IcOC",
                    "title": "C相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }],
                "Ia": "60.00A",
                "Ib": "60.00A",
                "Ic": "57.00A",
                "Ua": "210.50V",
                "Uc": "216.60V",
                "P": "31.57kW",
                "Q": "20.92kVar",
                "Pt1": "577.80kWh",
                "Qt2": "21408.60kWh",
                "id": "113",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "0.00", "color": "#666666"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "1.00",
                    "color": "#ef5c62"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "1.00", "color": "#ef5c62"}],
                "Ia": "127.50A",
                "Ib": "109.50A",
                "Ic": "124.50A",
                "Ua": "211.40V",
                "Uc": "217.40V",
                "P": "63.81kW",
                "Q": "44.24kVar",
                "Pt1": "754.90kWh",
                "Qt2": "22839.80kWh",
                "id": "114",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "1.00", "color": "#ef5c62"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "1.00",
                    "color": "#ef5c62"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "1.00", "color": "#ef5c62"}],
                "Ia": "138.00A",
                "Ib": "138.00A",
                "Ic": "138.00A",
                "Ua": "211.30V",
                "Uc": "217.40V",
                "P": "76.45kW",
                "Q": "45.47kVar",
                "Pt1": "733.40kWh",
                "Qt2": "32608.60kWh",
                "id": "115",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "1.00", "color": "#ef5c62"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "1.00",
                    "color": "#ef5c62"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "1.00", "color": "#ef5c62"}],
                "Ia": "85.50A",
                "Ib": "81.00A",
                "Ic": "85.50A",
                "Ua": "210.80V",
                "Uc": "216.70V",
                "P": "47.74kW",
                "Q": "25.17kVar",
                "Pt1": "502.20kWh",
                "Qt2": "18370.00kWh",
                "id": "116",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "1.00", "color": "#ef5c62"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "1.00",
                    "color": "#ef5c62"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "1.00", "color": "#ef5c62"}],
                "Ia": "43.00A",
                "Ib": "44.00A",
                "Ic": "44.00A",
                "Ua": "210.20V",
                "Uc": "216.20V",
                "P": "22.78kW",
                "Q": "16.26kVar",
                "Pt1": "337.30kWh",
                "Qt2": "13969.00kWh",
                "id": "117",
                "lines": []
            }, {
                "alerts": [{"prop": "IaOC", "title": "A相过流告警", "val": "1.00", "color": "#ef5c62"}, {
                    "prop": "IbOC",
                    "title": "B相过流告警",
                    "val": "0.00",
                    "color": "#666666"
                }, {"prop": "IcOC", "title": "C相过流告警", "val": "0.00", "color": "#666666"}], "id": "124", "lines": []
            }]
        }];
    }

})();