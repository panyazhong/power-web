(function () {
    'use strict';

    angular.module('BlurAdmin.power.history')
        .controller('historyPageCtrl', historyPageCtrl);

    /** @ngInject */
    function historyPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, HttpToast, Log,
                             ToastUtils) {

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

        $scope.show = {
            sidebarArr: [],    // 变电站
            clientName: '',

            from_time: '',
            to_time: '',

            filterData: {},     // 搜索后的数据

            queryArr: [],    // 左侧可信息查询
            queryType: '',

            bCheckArr: [], // 左侧 底部 checkbox
        };

        $scope.form = {
            cid: "",  //变电站cid
            from_time: '',
            to_time: ''
        };

        // morris
        $scope.lData = [];
        $scope.lYkeys = [];
        $scope.lLabels = [];
        $scope.lColors = [];

        $scope.checkForm = function () {
            if (!$scope.form.cid) {
                return 0
            }

            if (!$scope.show.from_time) {
                return 0
            }

            if (!$scope.show.to_time) {
                return 0
            }

            if (moment($scope.show.to_time).isBefore($scope.show.from_time)) {
                return 1
            }
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
            var state = $scope.checkForm();

            switch (state) {
                case 0:
                    ToastUtils.openToast('warning', '请完善所有查询条件！');
                    break;
                case 1:
                    ToastUtils.openToast('warning', '起始不能小于结束时间！');
                    break;
            }

            var params = $scope.formatForm();

            Log.i('search: \n' + JSON.stringify(params));

            // data => deepClone

            $scope.show.filterData = {data: 'test'};
            $scope.show.queryArr = [
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
        };

        $scope.init = function () {

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
            $scope.show.queryType = obj.name;
            $scope.processMorrisData(obj.id);
        };

        $scope.processMorrisData = function (id) {
            if (!id) {
                return
            }

            ToastUtils.openToast('info', '需要处理的id是：' + id);
            /*
             切换数据： 如电量，三项电流等...
             */

        };

        /**
         * 改变支线条数
         * @param item
         */
        $scope.changeBCheck = function (item) {
            console.log(JSON.stringify($scope.show.bCheckArr));
        };

    }

})();
