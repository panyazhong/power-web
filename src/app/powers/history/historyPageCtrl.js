(function () {
    'use strict';

    angular.module('BlurAdmin.power.history')
        .controller('historyPageCtrl', historyPageCtrl)
        .controller('PieChartCtrl', PieChartCtrl);

    /** @ngInject */
    function historyPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, HttpToast, Log,
                             ToastUtils, pieChartCache, History, $rootScope) {

        $scope.GetDateStr = function (AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            return dd;
        };

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
            from_time: $scope.GetDateStr(-7),  // 默认查询7天之前数据
            to_time: new Date(),

            searchData: {},     // 搜索后的数据
            queryArr: [
                {
                    key: 'eQuantity',
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
            ],    // 左侧可信息查询
            queryName: '电量',    // def 显示的val
            queryKey: 'eQuantity',  // def 显示的key
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

        // 树状图
        $scope.tree = [];

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

            return 2;
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

        $scope.randomColor = function () {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        };

        $scope.setMorrisData = function () {

            // init
            $scope.lData = [];
            // lYkeys 在下部方法内初始化
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

        $scope.setData = function (sucData) {
            /**
             * data => deepClone
             */

            // a. morris
            $scope.show.searchData = {
                bid: sucData.bid,
                data: sucData.data
            };

            $scope.setMorrisData();

            // b. pie
            pieChartCache.cache.data = [];  // init
            pieChartCache.cache.data = _.cloneDeep(sucData.pie);    // set

            // c. tree
            $scope.tree = [];             // init
            $scope.tree = sucData.tree;  // set

            $rootScope.$emit('pieRefresh', 'update');
        };

        $scope.query = function () {
            var params = $scope.formatForm();

            History.query({
                    clientId: params.cid,
                    time: 'time',
                    fromTime: params.from_time,
                    toTime: params.to_time
                },
                function (data) {
                    $scope.setData(data);
                    ToastUtils.openToast('success', '查询数据成功');
                }, function (err) {
                    HttpToast.toast(err);
                });
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
                case 2:
                    $scope.query();
                    break;
            }
        };

        $scope.initDefData = function () {
            /* 与签到不同，需要先拿到变电站信息 再搜索*/

            // 1.变电站
            var client = $scope.show.sidebarArr[0];
            if (client) {
                // set
                $scope.form.cid = client.clientId;
                $scope.show.clientName = client.clientName;
            }

            // 2.3 起止时间 show里设置了
            // 4. 左侧可信息查询 show里设置了
            $scope.search();
        };

        $scope.init = function () {
            if (SidebarCache.isEmpty()) {
                Log.i('empty： ——SidebarCache');

                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        $scope.show.sidebarArr = data.sidebar;
                        $scope.initDefData();
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                Log.i('exist： ——SidebarCache');
                $scope.show.sidebarArr = SidebarCache.getData().sidebar;
                $scope.initDefData();
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

        /**
         * 切换数据源
         * @param obj
         */
        $scope.changeQuery = function (obj) {
            if ($scope.show.queryName == obj.name) {
                return;
            }

            // set
            $scope.show.queryName = obj.name;
            $scope.show.queryKey = obj.key;
            // Log.i('click: \n' + JSON.stringify(obj));

            $scope.setMorrisData();
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
    }

    /** @ngInject */
    function PieChartCtrl($element, pieChartCache, $rootScope) {
        $rootScope.$on('pieRefresh', function () {

            var id = $element[0].getAttribute('id');
            var pieChart = AmCharts.makeChart(id, {
                type: 'pie',
                theme: 'light',
                dataProvider: pieChartCache.cache.data,
                valueField: 'val',
                titleField: 'branch',
                balloon: {
                    fixedPosition: true
                },
                export: {
                    enabled: true
                }
            });

            pieChart.addListener('init', handleInit);

            pieChart.addListener('rollOverSlice', function (e) {
                handleRollOver(e);
            });

            function handleInit() {
                pieChart.legend.addListener('rollOverItem', handleRollOver);
            }

            function handleRollOver(e) {
                var wedge = e.dataItem.wedge.node;
                wedge.parentNode.appendChild(wedge);
            }

        });
    }

})();