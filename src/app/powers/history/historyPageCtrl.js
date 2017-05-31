/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.history')
        .controller('historyPageCtrl', historyPageCtrl);

    /** @ngInject */
    function historyPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, HttpToast, Log,
                             Keyword, KeywordCache, ToastUtils) {

        PageTopCache.cache.state = $state.$current; // active
        $scope.data = {
            datetimepickerOptions1: {
                datetimepicker: {
                    popupPlacement: 'bottom',
                    isOpen: false,
                    buttonBar: {
                        show: true,
                        now: {
                            show: true,
                            text: '现在'
                        },
                        today: {
                            show: true,
                            text: '今天'
                        },
                        clear: {
                            show: true,
                            text: '清除'
                        },
                        date: {
                            show: true,
                            text: '日期'
                        },
                        time: {
                            show: true,
                            text: '时间'
                        },
                        close: {
                            show: true,
                            text: '关闭'
                        }
                    }
                },
                datepicker: {
                    showWeeks: false
                },
                timepicker: {
                    showMeridian: false
                },
                click: function () {
                    $scope.data.datetimepickerOptions1.datetimepicker.isOpen = true;
                }
            },
            datetimepickerOptions2: {
                datetimepicker: {
                    popupPlacement: 'bottom',
                    isOpen: false,
                    buttonBar: {
                        show: true,
                        now: {
                            show: true,
                            text: '现在'
                        },
                        today: {
                            show: true,
                            text: '今天'
                        },
                        clear: {
                            show: true,
                            text: '清除'
                        },
                        date: {
                            show: true,
                            text: '日期'
                        },
                        time: {
                            show: true,
                            text: '时间'
                        },
                        close: {
                            show: true,
                            text: '关闭'
                        }
                    }
                },
                datepicker: {
                    showWeeks: false
                },
                timepicker: {
                    showMeridian: false
                }
            },
        };

        $scope.testQueryArr = [
            {
                id: 201,
                name: '电量'
            },
            {
                id: 202,
                name: '三项电流'
            },
            {
                id: 203,
                name: '三相电压'
            },
            {
                id: 204,
                name: '有功无功'
            },
            {
                id: 205,
                name: '功率因素'
            }
        ];

        $scope.show = {
            // checkinList: [],     // 签到的列表

            sidebarArr: [],    //变电站
            clientName: '',
            // checkPlaceArr: [],  // 签到点
            // from_time: '',
            // to_time: '',
            //
            // isFirst: true       // 标识第一次、用来加载数据

            queryArr: [],    //左侧可信息查询
            queryType: ''
        };
        // $scope.rowCollection = [];

        $scope.form = {
            cid: "",  //变电站cid
            from_time: '',
            to_time: ''
        };
        $scope.queryForm = {
            typeId: ''
        };

        $scope.formatForm = function () {

            $scope.form.from_time = '';
            $scope.form.to_time = '';
            if ($scope.show.from_time) {
                $scope.form.from_time = moment($scope.show.from_time).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.to_time) {
                $scope.form.to_time = moment($scope.show.to_time).format('YYYY-MM-DD HH:mm:ss');
            }

            var params = {};
            for (var Key in $scope.form) {
                if ($scope.form[Key]) {
                    params[Key] = $scope.form[Key];
                }
            }

            return params;
        };

        $scope.search = function () {
            var params = $scope.formatForm();

            Log.i('search: \n' + JSON.stringify(params));
        };

        $scope.init = function () {
            $scope.search();

            // 模拟测试返回数据
            $scope.show.queryArr = $scope.testQueryArr;

            // if (KeywordCache.isEmpty()) {
            //     Keyword.query({},
            //         function (data) {
            //             KeywordCache.create(data);
            //             $scope.show.queryArr = KeywordCache.getHistory_querytype();
            //         }, function (err) {
            //             HttpToast.toast(err);
            //         });
            // } else {
            //     $scope.show.queryArr = KeywordCache.getHistory_querytype();
            // }

            if (SidebarCache.isEmpty()) {
                Log.i('empty： ——SidebarCache');

                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        $scope.show.sidebarArr = data.sidebar;
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                Log.i('exist： ——SidebarCache');
                $scope.show.sidebarArr = SidebarCache.getData().sidebar;
            }

        };
        $scope.init();

        // dropdown set
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            // set
            $scope.form.cid = obj.clientId;
            $scope.show.clientName = obj.clientName;
        };

        $scope.changeQuery = function (obj) {
            if ($scope.show.queryType == obj.name) {
                return;
            }

            // set
            $scope.queryForm.typeId = obj.id;
            $scope.show.queryType = obj.name;

            ToastUtils.openToast('info', '查询的类型，id: ' + $scope.queryForm.typeId + " / 名称: " + $scope.show.queryType);
            // 发送请求获取图标数据
            $scope.getInfo(obj.id);
        };

        $scope.getInfo = function (id) {
            if (!id) {
                return
            }

            Log.i('请求的id是：' + id);
        };

    }

})();
