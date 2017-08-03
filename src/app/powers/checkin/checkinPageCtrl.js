(function () {
    'use strict';

    angular.module('BlurAdmin.power.checkin')
        .controller('checkinPageCtrl', checkinPageCtrl)
        .controller('excepDetailCtrl', excepDetailCtrl);

    /** @ngInject */
    function checkinPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, Log, locals, Task, HttpToast,
                             $rootScope, Exception, KeywordCache, Keyword, ModalUtils) {
        PageTopCache.cache.state = $state.$current; // active

        $scope.GetDateStr = function () {
            var dd = new Date();
            dd.setHours(0);
            dd.setMinutes(0);
            dd.setSeconds(0);
            return dd;
        };

        $scope.data = {
            beginDate: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                },
                isOpen: false,
                altInputFormats: ['yyyy-MM-dd'],
                format: 'yyyy-MM-dd',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            },

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
            beginDate: $scope.GetDateStr(),
            clientName: '',  //变电站
            sidebarArr: [],   //变电站数组
            setList: [],        // 实时
            setListHistory: [],   // 历史
            currentState: 'main',    // 页面state

            timeStart: '', // 异常起始时间
            timeEnd: '',     // 异常结束时间

            excepListTitle: ['客户名称', '当前巡检点', '设备名称', '异常名称', '异常等级', '建议完成期限', '状态', '最后更新时间', '最后更新人'],
            excepList: [],

            exceptionTypeArr: []    // 异常类型keyword
        };
        $scope.rowCollection = [];
        $scope.rowCollectionHistory = [];
        $scope.rowExcepList = [];

        $scope.form = {
            client_id: '',  //变电站cid
            beginDate: '',
            endDate: '',

            imeStart: '', // 异常起始时间
            timeEnd: ''     // 异常结束时间
        };

        $scope.formatForm = function () {

            $scope.form.client_id = $scope.form.client_id || 0;
            if ($scope.show.beginDate) {
                $scope.form.beginDate = moment(moment($scope.show.beginDate).format('YYYY-MM-DD HH:mm:ss')).unix();
                $scope.form.endDate = moment(moment($scope.show.beginDate).format('YYYY-MM-DD') + " 23:59:59").unix();
            } else {
                $scope.form.beginDate = 0;
                $scope.form.endDate = 0;
            }

            var params = {};
            params["client_id"] = $scope.form.client_id;
            params["beginDate"] = $scope.form.beginDate;
            params["endDate"] = $scope.form.endDate;

            return params;
        };

        $scope.queryList = function (cid) {

            var params = $scope.formatForm();
            Log.i('query params : ' + JSON.stringify(params));

            // 历史
            params.history = 'history';
            Task.query(params,
                function (data) {
                    if (Array.isArray(data)) {
                        $scope.show.setListHistory = data;
                        $scope.rowCollectionHistory = data;
                    }
                },
                function (err) {
                    HttpToast.toast(err);
                });

            // 实时
            var p = {
                real_time: 'real-time',
                client_id: $scope.form.client_id
            };
            Task.query(p,
                function (data) {
                    if (Array.isArray(data)) {
                        $scope.show.setList = data;
                        $scope.rowCollection = data;
                    }
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        // dropdown set 1
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            $scope.form.client_id = obj.clientId;
            $scope.show.clientName = obj.clientName;

            // 更新列表
            $scope.queryList($scope.form.client_id);
        };

        $scope.initFilterInfo = function () {

            var cid = locals.get('cid', '') ? locals.get('cid', '') : SidebarCache.getData().sidebar[0].clientId;
            if (cid) {
                for (var i = 0; i < $scope.show.sidebarArr.length; i++) {
                    var item = $scope.show.sidebarArr[i];
                    if (item.clientId == cid) {
                        $scope.changeClent(item);
                    }
                }
            }

        };

        $scope.init = function () {

            if (KeywordCache.isEmpty()) {
                Keyword.query({},
                    function (data) {
                        KeywordCache.create(data);
                        $scope.show.exceptionTypeArr = KeywordCache.getInspect_exception_type();
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                $scope.show.exceptionTypeArr = KeywordCache.getInspect_exception_type();
            }

            if (SidebarCache.isEmpty()) {
                Log.i('empty： ——SidebarCache');

                Sidebar.query({},
                    function (data) {
                        SidebarCache.create(data);
                        $scope.show.sidebarArr = data.sidebar;
                        $scope.initFilterInfo();
                    }, function (err) {
                        HttpToast.toast(err);
                    });
            } else {
                Log.i('exist： ——SidebarCache');
                $scope.show.sidebarArr = SidebarCache.getData().sidebar;
                $scope.initFilterInfo();
            }

        };
        $scope.init();

        // 逻辑code
        $scope.search = function () {
            $scope.queryList($scope.form.client_id);

        };

        $scope.clear = function () {
            $scope.show.beginDate = null;
            $scope.show.clientName = '';

            $scope.form = {
                client_id: '',  //变电站cid
                beginDate: '',
                endDate: ''
            };
        };

        $scope.viewException = function () {
            $scope.show.currentState = 'excep';
            // get list
            $scope.searchExcep();
        };

        // date picker
        $scope.togglePicker = function () {
            $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
        };

        $rootScope.$on('filterInfo', function (event, data) {
            if (!data) {
                return
            }
            if ($state.$current != 'checkin') {
                return
            }

            if (data.cid) {
                for (var i = 0; i < $scope.show.sidebarArr.length; i++) {
                    var item = $scope.show.sidebarArr[i];
                    if (item.clientId == data.cid) {
                        $scope.changeClent(item);
                    }

                }
            }

        });

        // 异常列表
        $scope.formatFormExcep = function () {

            $scope.form.client_id = $scope.form.client_id || 0;
            $scope.form.timeStart = $scope.show.timeStart ? moment(moment($scope.show.timeStart).format('YYYY-MM-DD HH:mm:ss')).unix() : 0;
            $scope.form.timeEnd = $scope.show.timeEnd ? moment(moment($scope.show.timeEnd).format('YYYY-MM-DD HH:mm:ss')).unix() : 9999999999;

            var params = {};
            params["clientIDs"] = $scope.form.client_id;
            params["timeStart"] = $scope.form.timeStart;
            params["timeEnd"] = $scope.form.timeEnd;

            return params;
        };

        $scope.clearExcep = function () {
            $scope.show.clientName = '';
            $scope.show.timeStart = null;
            $scope.show.timeEnd = null;

            $scope.form.client_id = ''; //变电站cid
            $scope.form.timeStart = '';
            $scope.form.timeEnd = '';
        };

        $scope.searchExcep = function () {

            var params = $scope.formatFormExcep();
            Log.i('query params : ' + JSON.stringify(params));

            params.list = 'list';
            Exception.query(params,
                function (data) {
                    if (Array.isArray(data)) {
                        $scope.show.excepList = data;
                        $scope.rowExcepList = data;
                    }
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.backMain = function () {
            $scope.show.currentState = 'main';
            // get list
            $scope.queryList($scope.form.client_id);
        };

        $scope.getExcepType = function (type) {

            for (var i = 0; i < $scope.show.exceptionTypeArr.length; i++) {
                var item = $scope.show.exceptionTypeArr[i];
                if (item.id = type) {
                    return item.name;
                }
            }
        };

        $scope.viewExcepDetail = function (id) {
            ModalUtils.open('app/powers/checkin/widgets/excepDetailModal.html', 'lg',
                excepDetailCtrl, {
                    id: id,
                    keys: $scope.show.exceptionTypeArr
                },
                function (info) {
                    // 传值走这里
                    if (info) {
                        // $scope.init();
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });
        };

        // dropdown set 1
        $scope.changeClentExcep = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            $scope.form.client_id = obj.clientId;
            $scope.show.clientName = obj.clientName;

            // 更新列表
            $scope.searchExcep();
        };

    }

    function excepDetailCtrl($scope, $state, params, Log, Exception, HttpToast) {

        $scope.show = {
            id: params.id,
            exceptionTypeArr: params.keys,

            processStateArr: [
                {
                    status: 1,
                    statusDesc: '已提交'
                },
                {
                    status: 2,
                    statusDesc: '已确认'
                },
                {
                    status: 3,
                    statusDesc: '已有方案'
                },
                {
                    status: 4,
                    statusDesc: '已修复'
                }
            ]
        };
        $scope.form = {};

        $scope.init = function () {

            var params = {
                exceptionID: $scope.show.id
            };

            Exception.detail(params,
                function (data) {
                    for (var i = 0; i < $scope.show.exceptionTypeArr.length; i++) {
                        var item = $scope.show.exceptionTypeArr[i];
                        if (item.id = data.exceptionLevel) {
                            data.excepLevel = item.name;
                        }
                    }

                    if (Array.isArray(data.handleHistory) && data.handleHistory.length > 0) {

                    } else {
                        data.handleHistory.push({
                            manufacturer: data.device.manufacturer,
                            manufacturercontact: data.device.manufacturercontact,
                            manufacturer_tel: data.device.manufacturer_tel,

                            timeDesc: null,
                            description: '',
                            statusDesc: '',

                            // date config
                            date: {
                                options: {
                                    formatYear: 'yyyy',
                                    startingDay: 1,
                                    showWeeks: false,
                                    language: 'zh-CN',
                                },
                                isOpen: false,
                                altInputFormats: ['yyyy-MM-dd'],
                                format: 'yyyy-MM-dd',
                                modelOptions: {
                                    timezone: 'Asia/beijing'
                                }
                            }
                        });
                    }

                    $scope.form = data;

                    console.log('handleHistory：' + JSON.stringify($scope.form));
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };
        $scope.init();

        $scope.submit = function () {
            Log.i('位置：' + $scope.form.position);
            Log.i('保护名称：' + $scope.form.protectName);
            Log.i('详细描述：' + $scope.form.description);
        };

        $scope.addProcessItem = function () {
            Log.i('$scope.addProcessItem...');
        };

        $scope.changeStatus = function (item, pos) {
            if ($scope.handleHistory[pos].status == item.status) {
                return
            }

            $scope.handleHistory[pos].status = item.status;
            $scope.handleHistory[pos].statusDesc = item.statusDesc;
        };

        // date picker
        $scope.togglePicker = function (pos) {
            $scope.handleHistory[pos].date.isOpen = !$scope.handleHistory[pos].date.isOpen;
        };

    }

})();
