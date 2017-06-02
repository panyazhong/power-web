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

            searchData: {},     // 搜索后的数据
            queryArr: [],    // 左侧可信息查询
            queryName: '',
            queryKey: 'electricity',
            bCheckArr: [],   // 左侧 checkbox状态
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
        $scope.line = {};   // checkbox 所需data

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

        $scope.setLineData = function () {
            // 模拟返回
            $scope.show.searchData = {
                bid: [
                    {
                        name: '支线1',
                        id: 'a'
                    },
                    {
                        name: '支线2',
                        id: 'b'
                    },
                    {
                        name: '支线3',
                        id: 'c'
                    },
                    {
                        name: '支线4',
                        id: 'd'
                    }
                ],
                data: [
                    {
                        time: "2017-05-01 12:00:12",
                        a: {
                            electricity: 78,
                            current: 48,
                            voltage: 58,
                            reactive: 88,
                            power: 98,
                        },
                        b: {
                            electricity: 35,
                            current: 43,
                            voltage: 43,
                            reactive: 46,
                            power: 42,
                        },
                        c: {
                            electricity: 45,
                            current: 34,
                            voltage: 34,
                            reactive: 24,
                            power: 25,
                        },
                        d: {
                            electricity: 25,
                            current: 36,
                            voltage: 25,
                            reactive: 25,
                            power: 57,
                        }
                    },
                    {
                        time: "2017-05-03 13:13:24",
                        a: {
                            electricity: 35,
                            current: 43,
                            voltage: 43,
                            reactive: 46,
                            power: 42,
                        },
                        b: {
                            electricity: 78,
                            current: 48,
                            voltage: 58,
                            reactive: 88,
                            power: 98,
                        },
                        c: {
                            electricity: 25,
                            current: 36,
                            voltage: 25,
                            reactive: 25,
                            power: 57,
                        },
                        d: {
                            electricity: 45,
                            current: 34,
                            voltage: 34,
                            reactive: 24,
                            power: 25,
                        }
                    },
                    {
                        time: "2017-05-05 14:35:33",
                        a: {
                            electricity: 28,
                            current: 28,
                            voltage: 58,
                            reactive: 28,
                            power: 28,
                        },
                        b: {
                            electricity: 55,
                            current: 53,
                            voltage: 53,
                            reactive: 56,
                            power: 52,
                        },
                        c: {
                            electricity: 75,
                            current: 74,
                            voltage: 74,
                            reactive: 74,
                            power: 75,
                        },
                        d: {
                            electricity: 65,
                            current: 66,
                            voltage: 65,
                            reactive: 65,
                            power: 67,
                        }
                    },
                    {
                        time: "2017-05-07 15:35:35",
                        a: {
                            electricity: 38,
                            current: 38,
                            voltage: 38,
                            reactive: 38,
                            power: 38,
                        },
                        b: {
                            electricity: 45,
                            current: 43,
                            voltage: 43,
                            reactive: 46,
                            power: 42,
                        },
                        c: {
                            electricity: 95,
                            current: 94,
                            voltage: 94,
                            reactive: 94,
                            power: 95,
                        },
                        d: {
                            electricity: 15,
                            current: 16,
                            voltage: 15,
                            reactive: 15,
                            power: 17,
                        }
                    },
                    {
                        time: "2017-05-11 16:23:11",
                        a: {
                            electricity: 68,
                            current: 24,
                            voltage: 46,
                            reactive: 46,
                            power: 24,
                        },
                        b: {
                            electricity: 76,
                            current: 74,
                            voltage: 71,
                            reactive: 72,
                            power: 70,
                        },
                        c: {
                            electricity: 80,
                            current: 87,
                            voltage: 75,
                            reactive: 83,
                            power: 84,
                        },
                        d: {
                            electricity: 35,
                            current: 29,
                            voltage: 27,
                            reactive: 21,
                            power: 14,
                        }
                    },
                ]
            };
            $scope.show.queryArr = [
                {
                    key: 'electricity',
                    name: '电量'
                },
                {
                    key: 'current',
                    name: '三项电流'
                },
                {
                    key: 'voltage',
                    name: '三相电压'
                },
                {
                    key: 'reactive',
                    name: '有功无功'
                },
                {
                    key: 'power',
                    name: '功率因素'
                }
            ];

            // init
            $scope.lData = [];
            $scope.lLabels = [];
            $scope.lColors = [];

            $scope.show.bCheckArr = [];

            // set
            $scope.show.searchData.bid.forEach(function (item) {
                $scope.lLabels.push(item.name);
                $scope.lColors.push($scope.randomColor());
                $scope.show.bCheckArr.push({
                    bid: item.id,
                    name: item.name,
                    checked: true
                })
            });

            $scope.show.searchData.data.forEach(function (item) {
                $scope.lYkeys = [];

                // 1.拿到每一个item，遍历key
                var obj = {};
                for (var i in item) {
                    if (i === 'time') {
                        obj.y = item[i];
                    } else {
                        var info = item[i];
                        for (var j in info) {
                            if (j === $scope.show.queryKey) {
                                obj["" + i + ""] = info[j];
                                $scope.lYkeys.push(i);
                            }
                        }

                    }
                }
                $scope.lData.push(obj);
            });

            $scope.line.lData = _.cloneDeep($scope.lData);
            $scope.line.lYkeys = _.cloneDeep($scope.lYkeys);
            $scope.line.lLabels = _.cloneDeep($scope.lLabels);
            $scope.line.lColors = _.cloneDeep($scope.lColors);
        };

        $scope.randomColor = function () {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
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

            $scope.show.searchData = {
                bid: [],
                data: [
                    {
                        time: "2017-05-01 12:00:00",
                        a: {
                            electricity: 78,
                            current: 48,
                            voltage: 58,
                            reactive: 88,
                            power: 98,
                        },
                        b: {
                            electricity: 35,
                            current: 43,
                            voltage: 43,
                            reactive: 46,
                            power: 42,
                        },
                        c: {
                            electricity: 45,
                            current: 34,
                            voltage: 34,
                            reactive: 24,
                            power: 25,
                        },
                        d: {
                            electricity: 25,
                            current: 36,
                            voltage: 25,
                            reactive: 25,
                            power: 57,
                        }
                    },
                    {
                        time: "2017-05-03 13:00:00",
                        a: {
                            electricity: 35,
                            current: 43,
                            voltage: 43,
                            reactive: 46,
                            power: 42,
                        },
                        b: {
                            electricity: 78,
                            current: 48,
                            voltage: 58,
                            reactive: 88,
                            power: 98,
                        },
                        c: {
                            electricity: 25,
                            current: 36,
                            voltage: 25,
                            reactive: 25,
                            power: 57,
                        },
                        d: {
                            electricity: 45,
                            current: 34,
                            voltage: 34,
                            reactive: 24,
                            power: 25,
                        }
                    },
                    {
                        time: "2017-05-05 14:00:00",
                        a: {
                            electricity: 28,
                            current: 28,
                            voltage: 58,
                            reactive: 28,
                            power: 28,
                        },
                        b: {
                            electricity: 55,
                            current: 53,
                            voltage: 53,
                            reactive: 56,
                            power: 52,
                        },
                        c: {
                            electricity: 75,
                            current: 74,
                            voltage: 74,
                            reactive: 74,
                            power: 75,
                        },
                        d: {
                            electricity: 65,
                            current: 66,
                            voltage: 65,
                            reactive: 65,
                            power: 67,
                        }
                    },
                    {
                        time: "2017-05-07 15:00:00",
                        a: {
                            electricity: 38,
                            current: 38,
                            voltage: 38,
                            reactive: 38,
                            power: 38,
                        },
                        b: {
                            electricity: 45,
                            current: 43,
                            voltage: 43,
                            reactive: 46,
                            power: 42,
                        },
                        c: {
                            electricity: 95,
                            current: 94,
                            voltage: 94,
                            reactive: 94,
                            power: 95,
                        },
                        d: {
                            electricity: 15,
                            current: 16,
                            voltage: 15,
                            reactive: 15,
                            power: 17,
                        }
                    },
                    {
                        time: "2017-05-11 16:00:00",
                        a: {
                            electricity: 68,
                            current: 24,
                            voltage: 46,
                            reactive: 46,
                            power: 24,
                        },
                        b: {
                            electricity: 76,
                            current: 74,
                            voltage: 71,
                            reactive: 72,
                            power: 70,
                        },
                        c: {
                            electricity: 80,
                            current: 87,
                            voltage: 75,
                            reactive: 83,
                            power: 84,
                        },
                        d: {
                            electricity: 35,
                            current: 29,
                            voltage: 27,
                            reactive: 21,
                            power: 14,
                        }
                    },
                ]
            };
            $scope.show.queryArr = [
                {
                    key: 'electricity',
                    name: '电量'
                },
                {
                    key: 'current',
                    name: '三项电流'
                },
                {
                    key: 'voltage',
                    name: '三相电压'
                },
                {
                    key: 'reactive',
                    name: '有功无功'
                },
                {
                    key: 'power',
                    name: '功率因素'
                }
            ];

            $scope.setLineData();
        };

        $scope.init = function () {
            $scope.setLineData();

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
            if ($scope.show.queryName == obj.name) {
                return;
            }

            // set
            $scope.show.queryName = obj.name;
            $scope.processMorrisData(obj.id);
        };

        $scope.processMorrisData = function (key) {
            if (!key) {
                return
            }

            ToastUtils.openToast('info', '需要处理的key是：' + key);

            /*
             切换数据： 如电量，三项电流等...
             */

            // $scope.show.searchData = {
            //     bid: [],
            //     data: [
            //
            //         {
            //             time: "2017-05-01 12:00:00",
            //             a: {
            //                 power: 78,
            //                 current: 80
            //             },
            //             b: {},
            //             c: {}
            //         }
            //     ]
            // }

        };

        /**
         * 改变支线条数
         */
        $scope.changeBCheck = function (item) {

            // init
            $scope.lData = [];
            $scope.lYkeys = [];
            $scope.lLabels = [];
            $scope.lColors = [];

            // set
            var obj = $scope.line;
            var checkArr = [];
            for (var i = 0; i < $scope.show.bCheckArr.length; i++) {
                if ($scope.show.bCheckArr[i].checked) {
                    $scope.lYkeys.push(obj.lYkeys[i]);
                    $scope.lLabels.push(obj.lLabels[i]);
                    $scope.lColors.push(obj.lColors[i]);
                    checkArr.push($scope.show.bCheckArr[i].bid);
                }
            }

            obj.lData.forEach(function (item) {
                // 1.拿到每一个item，遍历key
                var info = {};
                for (var i in item) {
                    if (i === 'y') {
                        info.y = item[i];
                    } else {
                        if (checkArr.indexOf(i) !== -1) {
                            info["" + i + ""] = item[i];
                        }
                    }
                }
                $scope.lData.push(info);
            });

        };

        // Pie
    }

})();