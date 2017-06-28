(function () {
    'use strict';

    angular.module('BlurAdmin.power.history')
        .controller('historyPageCtrl', historyPageCtrl)
        .controller('PieChartCtrl', PieChartCtrl);

    /** @ngInject */
    function historyPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, HttpToast, Log,
                             ToastUtils, pieChartCache, History, $rootScope, $timeout) {

        $scope.GetDateStr = function () {
            var dd = new Date();
            dd.setHours(0);
            dd.setMinutes(0);
            dd.setSeconds(0);
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
            from_time: $scope.GetDateStr(),  // 默认查询数据
            to_time: new Date(),

            searchData: {},     // 搜索后的数据
            queryArr: [
                {
                    key: 'A',
                    name: '电量'
                },
                {
                    key: 'B',
                    name: '三相电流'
                },
                {
                    key: 'C',
                    name: '三相电压'
                },
                {
                    key: 'P',
                    name: '有功功率'
                },
                {
                    key: 'Q',
                    name: '无功功率'
                },
                {
                    key: 'D',
                    name: '功率因数'
                }
            ],    // 左侧可信息查询
            queryName: '电量',    // def 显示的val
            queryKey: 'A',  // def 显示的key
            bCheckArr: [],   // 左侧 checkbox状态

            isLoadPie: true,
            isLoading: false
        };

        $scope.form = {
            cid: "",  //变电站cid
            from_time: '',
            to_time: '',
            interval: 3
        };

        // morris
        $scope.line = {};   // checkbox 所需data

        $scope.LineData = function (params) {
            params = params ? params : {};
            angular.extend(this, params);
        };

        $scope.setMorrisData = function () {

            if ($scope.show.searchData.bid && $scope.show.searchData.data) {

                // init
                var _lineData = [];
                // lYkeys 在下部方法内初始化
                $scope.lLabels = [];
                $scope.lColors = [];
                $scope.show.bCheckArr = [];

                // set
                $scope.show.searchData.bid.forEach(function (item, index) {
                    $scope.lLabels.push(item.name);
                    var color = $scope.randomColor(index);
                    $scope.lColors.push(color);
                    $scope.show.bCheckArr.push({
                        bid: item.id,
                        name: item.name,
                        checked: true,
                        style: {
                            background: color
                        }
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
                    _lineData.push(new $scope.LineData(obj));
                });

                if ($scope.show.isLoadPie) {
                    pieChartCache.cache.color = _.cloneDeep($scope.lColors);
                    $rootScope.$emit('pieRefresh', 'update');

                    $scope.show.isLoadPie = false;
                }

                $scope.line.lData = _.cloneDeep(_lineData);
                $scope.line.lYkeys = _.cloneDeep($scope.lYkeys);
                $scope.line.lLabels = _.cloneDeep($scope.lLabels);
                $scope.line.lColors = _.cloneDeep($scope.lColors);

                return _lineData;
            }
        };
        $scope.lData = $scope.setMorrisData();

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

        $scope.randomColor = function (pos) {
            // var safeColor = ['#000000', '#003300', '#330000', '#333300', '#660000', '#663300', '#990000', '#993300', '#CC0000', '#CC3300', '#FF0000', '#FF3300',
            //     '#0000FF', '#006699', '#3300FF', '#FF0099', '#FF0033', '#CC9966', '#CC6666', '#CC3366', '#99FF66', '#993366', '#669999', '#663366',
            //     '#33FF99', '#333399', '#003333', '#000033', '#333333', '#663333', '#993333', '#CCFF33'];
            //
            // if (safeColor[pos]) {
            //     return safeColor[pos];
            // } else {
            //     return '#' + Math.floor(Math.random() * 16777215).toString(16);
            // }

            return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
        };


        $scope.setData = function (sucData) {
            /**
             * data => deepClone
             */

            $scope.show.searchData = {
                bid: sucData.bid,
                data: sucData.data
            };

            // b. pie
            pieChartCache.cache.data = [];  // init
            pieChartCache.cache.data = _.cloneDeep(sucData.pie);    // set

            // c. tree
            $scope.tree = [];             // init
            $scope.tree = sucData.tree;  // set

            // $rootScope.$emit('pieRefresh', 'update');

            // a. morris
            $timeout(function () {
                $scope.lData = $scope.setMorrisData();
            }, 900);
        };

        $scope.query = function () {
            //init
            $scope.show.isLoadPie = true;
            $scope.show.isLoading = true;

            var params = $scope.formatForm();

            History.query({
                    clientId: params.cid,
                    time: 'time',
                    fromTime: params.from_time,
                    toTime: params.to_time,
                    interval: $scope.form.interval
                },
                function (data) {
                    $scope.show.isLoading = false;
                    $scope.setData(data);
                    ToastUtils.openToast('success', '查询数据成功');
                }, function (err) {
                    $scope.show.isLoading = false;
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

            $scope.lData = $scope.setMorrisData();
        };

        /**
         * 改变支线条数
         */
        $scope.changeBCheck = function () {

            // init
            var _lineData = [];
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
                        info["" + i + ""] = item[i];
                    }
                }
                _lineData.push(new $scope.LineData(info));
            });

            $scope.lData = _lineData;
        };

        $scope.selectAll = function () {

            $scope.show.bCheckArr.map(function (item) {
                item.checked = true;
            });

            $scope.changeBCheck();
        };

        $scope.selectNone = function () {
            $scope.show.bCheckArr.map(function (item) {
                item.checked = false;
            });

            $scope.changeBCheck();
        };

    }

    /** @ngInject */
    function PieChartCtrl($element, pieChartCache, $rootScope, Log) {
        $rootScope.$on('pieRefresh', function () {
            pieChartCache.cache.data.map(function (item, index) {
                item.color = pieChartCache.cache.color[index];
            });
            Log.i('pieData:\n' + JSON.stringify(pieChartCache.cache.data));

            var id = $element[0].getAttribute('id');
            var pieChart = AmCharts.makeChart(id, {
                type: 'pie',
                theme: 'light',
                dataProvider: pieChartCache.cache.data,
                valueField: 'val',
                titleField: 'branch',
                colorField: "color",
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