(function () {
    'use strict';

    angular.module('BlurAdmin.power.history')
        .controller('historyPageCtrl', historyPageCtrl)
        .controller('PieChartCtrl', PieChartCtrl);

    /** @ngInject */
    function historyPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, HttpToast, Log,
                             ToastUtils, pieChartCache, History, $rootScope) {

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

        $scope.setLineData = function (sucData) {
            /**
             * data => deepClone
             */

            // a. morris
            $scope.show.searchData = {
                bid: sucData.bid,
                data: sucData.data
            };
            $scope.show.queryArr = [
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
            ];

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

            // b. pie
            pieChartCache.cache.data = [];  // init
            pieChartCache.cache.data = _.cloneDeep(sucData.pie);    // set

            // c. tree
            $scope.tree = [];             // init
            $scope.tree = sucData.tree;  // set

            $rootScope.$emit('pieRefresh', 'update');
            $rootScope.$digest();
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
                    $scope.setLineData(data);
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

        $scope.init = function () {

            // 模拟饼状图数据
            // pieChartCache.cache.data = [
            //     {
            //         branch: '支线1',
            //         val: 40
            //     },
            //     {
            //         branch: '支线2',
            //         val: 50
            //     },
            //     {
            //         branch: '支线3',
            //         val: 10
            //     },
            //     {
            //         branch: '支线4',
            //         val: 70
            //     },
            //     {
            //         branch: '支线5',
            //         val: 120
            //     },
            //     {
            //         branch: '支线6',
            //         val: 18
            //     },
            //     {
            //         branch: '支线7',
            //         val: 110
            //     },
            //     {
            //         branch: '支线8',
            //         val: 88
            //     }
            // ];

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

        /*
         切换数据： 如电量，三项电流等...
         */
        $scope.processMorrisData = function (key) {
            if (!key) {
                return
            }

            // 更新key
            $scope.show.queryKey = key;

            // 更新data
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
    function PieChartCtrl($element, layoutPaths, baConfig, pieChartCache, $rootScope) {
        $rootScope.$on('pieRefresh', function () {

            var layoutColors = baConfig.colors;
            var id = $element[0].getAttribute('id');
            var pieChart = AmCharts.makeChart(id, {
                type: 'pie',
                startDuration: 0,
                theme: 'blur',
                addClassNames: true,
                color: layoutColors.defaultText,
                labelTickColor: layoutColors.borderDark,
                legend: {
                    position: 'right',
                    marginRight: 100,
                    autoMargins: false,
                },
                innerRadius: '40%',
                defs: {
                    filter: [
                        {
                            id: 'shadow',
                            width: '200%',
                            height: '200%',
                            feOffset: {
                                result: 'offOut',
                                in: 'SourceAlpha',
                                dx: 0,
                                dy: 0
                            },
                            feGaussianBlur: {
                                result: 'blurOut',
                                in: 'offOut',
                                stdDeviation: 5
                            },
                            feBlend: {
                                in: 'SourceGraphic',
                                in2: 'blurOut',
                                mode: 'normal'
                            }
                        }
                    ]
                },
                dataProvider: pieChartCache.cache.data,
                valueField: 'val',
                titleField: 'branch',
                export: {
                    enabled: true
                },
                creditsPosition: 'bottom-left',

                autoMargins: false,
                marginTop: 10,
                alpha: 0.8,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                pullOutRadius: 0,
                pathToImages: layoutPaths.images.amChart,
                responsive: {
                    enabled: true,
                    rules: [
                        // at 900px wide, we hide legend
                        {
                            maxWidth: 900,
                            overrides: {
                                legend: {
                                    enabled: false
                                }
                            }
                        },

                        // at 200 px we hide value axis labels altogether
                        {
                            maxWidth: 200,
                            overrides: {
                                valueAxes: {
                                    labelsEnabled: false
                                },
                                marginTop: 30,
                                marginBottom: 30,
                                marginLeft: 30,
                                marginRight: 30
                            }
                        }
                    ]
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