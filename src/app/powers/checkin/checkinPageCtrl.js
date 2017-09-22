(function () {
    'use strict';

    angular.module('BlurAdmin.power.checkin')
        .controller('checkinPageCtrl', checkinPageCtrl)
        .controller('excepDetailCtrl', excepDetailCtrl)
        .controller('pollingDetailCtrl', pollingDetailCtrl)
        .controller('imgSlideCtrl', imgSlideCtrl);

    /** @ngInject */
    function checkinPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, Log, locals, Task, HttpToast,
                             $rootScope, Exception, KeywordCache, Keyword, ModalUtils, $timeout, treeCache, kCache) {
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

            exceptionTypeArr: [],    // 异常类型keyword
            inspectTypeArr: []   // 任务类型keyword
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

        $scope.queryHistory = function () {
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
        };

        $scope.queryReal = function () {
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

        $scope.queryList = function (cid) {
            $scope.queryHistory();
            $scope.queryReal();
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

            var cid = locals.get('cid', '') || $scope.show.sidebarArr[0].clientId;
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

            var pmKey = kCache.getKey();
            pmKey.then(function (data) {
                $scope.show.exceptionTypeArr = kCache.getInspect_exception_type(data);
                $scope.show.inspectTypeArr = kCache.getInspect_type(data);
            });

            var pm = treeCache.getTree();
            pm.then(function (data) {
                $scope.show.sidebarArr = treeCache.createClientArr(data);
                $scope.initFilterInfo();
            });

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

        $scope.viewPollingDetail = function (id) {
            ModalUtils.open('app/powers/checkin/widgets/pollingDetailModal.html', 'lg',
                pollingDetailCtrl, {
                    id: id,
                    keys: $scope.show.inspectTypeArr
                },
                function (info) {
                    // 传值走这里
                    if (info) {
                        $timeout(function () {
                            $scope.viewExcepDetail(info);
                        }, 500);
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });
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

        $rootScope.$on('inspectRefresh', function (event, data) {
            if (!data) {
                return
            }
            if ($state.$current != 'checkin') {
                return
            }

            console.log('inspectRefresh: \n' + JSON.stringify(data));

            switch (data.isEnd) {
                case 0:
                    $scope.queryReal();
                    break;
                case 1:
                    // 更新列表
                    $scope.queryList($scope.form.client_id);
                    break;
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
                if (item.id == type) {
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
                        $scope.searchExcep();
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

    function excepDetailCtrl($scope, params, Log, Exception, HttpToast, ToastUtils, ModalUtils, $timeout) {

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

        $scope.detailHelper = function (data) {

            // 异常等级
            for (var i = 0; i < $scope.show.exceptionTypeArr.length; i++) {
                var item = $scope.show.exceptionTypeArr[i];
                if (item.id == data.exceptionLevel) {
                    data.excepLevel = item.name;
                }
            }

            // 图片处理
            data.picturesArr = data.pictures;

            // 处理详情数组
            if (Array.isArray(data.handleHistory) && data.handleHistory.length > 0) {
                data.handleHistory.map(function (item) {
                    // 设备基本信息
                    item.manufacturer = item.manufacturer || data.device.manufacturer;
                    item.manufacturer_contact = item.manufacturer_contact || data.device.manufacturer_contact;
                    item.manufacturer_tel = item.manufacturer_tel || data.device.manufacturer_tel;

                    // 处理时间、状态
                    item.time = new Date(item.time);
                    for (var i = 0; i < $scope.show.processStateArr.length; i++) {
                        var statusItem = $scope.show.processStateArr[i];
                        if (statusItem.status == item.status) {
                            item.statusDesc = statusItem.statusDesc;
                        }
                    }

                    item.date = {
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
                            this.datetimepicker.isOpen = !this.datetimepicker.isOpen;
                        }
                    };
                });

            }
            else {
                // 初始插入一条
                data.handleHistory.push({
                    // 设备基本信息
                    manufacturer: data.device.manufacturer,
                    manufacturer_contact: data.device.manufacturer_contact,
                    manufacturer_tel: data.device.manufacturer_tel,

                    // 处理时间、描述、状态
                    time: new Date(),   // 服务器返回的需要转date
                    description: '',
                    status: '', // 状态

                    // config
                    date: {
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
                            this.datetimepicker.isOpen = !this.datetimepicker.isOpen;
                        }
                    }
                });
            }

            return data;
        };

        $scope.init = function () {

            var params = {
                exceptionID: $scope.show.id
            };

            Exception.detail(params,
                function (data) {
                    $scope.form = $scope.detailHelper(data);
                },
                function (err) {
                    HttpToast.toast(err);
                });

        };
        $scope.init();

        $scope.formatForm = function () {

            var params = {};
            params.id = $scope.form.id;

            // 基本
            params.position = $scope.form.position;
            params.protectName = $scope.form.protectName;
            params.description = $scope.form.description;

            // 处理
            params.handleHistory = [];
            $scope.form.handleHistory.map(function (item) {
                var i = {};

                i.id = item.id || 0;
                i.manufacturer = item.manufacturer;
                i.manufacturer_contact = item.manufacturer_contact;
                i.manufacturer_tel = item.manufacturer_tel;

                i.time = moment(item.time).unix();
                i.description = item.description;
                i.status = item.status;

                params.handleHistory.push(i);
            });

            return params;
        };

        $scope.checkForm = function () {

            for (var i = 0; i < $scope.form.handleHistory.length; i++) {
                var item = $scope.form.handleHistory[i];
                if (!item.time || !item.description || !item.status) {
                    ToastUtils.openToast('warning', '处理时间、详细描述、处理状态 不能为空!');
                    return false;
                }
            }

            return true
        };

        $scope.submit = function () {

            if (!$scope.checkForm()) {
                return
            }

            var params = $scope.formatForm();
            Log.i('edit params : ' + JSON.stringify(params));

            params.handle = 'handle';
            Exception.edit(params,
                function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.$close(data);
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.addProcessItem = function () {

            // 初始插入一条
            $scope.form.handleHistory.push({
                // 设备基本信息
                manufacturer: $scope.form.device.manufacturer,
                manufacturer_contact: $scope.form.device.manufacturer_contact,
                manufacturer_tel: $scope.form.device.manufacturer_tel,

                // 处理时间、描述、状态
                time: new Date(),   // 服务器返回的需要转date
                description: '',
                status: '', // 状态

                // config
                date: {
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
                        this.datetimepicker.isOpen = !this.datetimepicker.isOpen;
                    }
                }
            });

        };

        $scope.changeStatus = function (item, pos) {
            if ($scope.form.handleHistory[pos].status == item.status) {
                return
            }

            $scope.form.handleHistory[pos].status = item.status;
            $scope.form.handleHistory[pos].statusDesc = item.statusDesc;
        };

        $scope.showImg = function () {

            ModalUtils.open('app/powers/checkin/widgets/imageSildeModal.html', 'lg',
                imgSlideCtrl, {
                    imgs: $scope.form.picturesArr
                },
                function (info) {
                    // 传值走这里
                    if (info) {

                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });

            // $timeout(function () {
            //     $scope.$close();
            // }, 800);
        };

    }

    function pollingDetailCtrl($scope, params, Task, HttpToast) {

        $scope.show = {
            id: params.id,
            inspectTypeArr: params.keys,
            data: {},  // response data

            itemListTitle: ['客户名称', '巡检任务', '异常数量', '开始时间', '结束时间', '用时'],
            subItemListTitle: ['签到点名称', '签到时间', '签到状态', '共用时'],
            subSubItemListTitle: ['设备名称', '步骤内容', '步骤结果', '完成时间', '异常详情'],
            subItemList: []
        };

        $scope.formatTime = function (seconds) {
            var min = Math.floor(seconds / 60),
                second = seconds % 60,
                hour, newMin, time;

            if (min > 60) {
                hour = Math.floor(min / 60);
                newMin = min % 60;
            }

            if (second < 10) {
                second = '0' + second;
            }
            if (min < 10) {
                min = '0' + min;
            }

            return time = hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
        };

        $scope.init = function () {

            var params = {
                history: 'history',
                mainTaskID: $scope.show.id
            };

            Task.queryPolling(params,
                function (data) {
                    // item
                    for (var i = 0; i < $scope.show.inspectTypeArr.length; i++) {
                        var item = $scope.show.inspectTypeArr[i];
                        if (item.id == data.type) {
                            data.typeDesc = item.name;
                        }
                    }
                    data.timeUsedDesc = $scope.formatTime(data.timeUsed);
                    $scope.show.data = data;

                    //  list
                    data.smallTasks.map(function (item) {
                        item.timeUsedDesc = $scope.formatTime(item.timeUsed);

                        item.steps.map(function (subItem) {
                            var str = subItem.result_str ? '，' + subItem.result_str : '';
                            subItem.result = subItem.result_bool != 0 ? '正常' : "异常" + str;
                        })
                    });

                    $scope.show.subItemList = data.smallTasks;
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };
        $scope.init();

        $scope.viewExcepDetail = function (id) {
            $scope.$close(id);
        };

    }

    function imgSlideCtrl($scope, params) {
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];

        $scope.addSlide = function () {
            var imgs = params.imgs;

            /* 如果异常图片需要展示文字，且服务器有相应字段，给text字段赋值即可
            var dd = [
                '异常图片001',
                '异常图片007'
            ];
            */

            for (var i = 0; i < imgs.length; i++) {
                slides.push({
                    image: imgs[i],
                    text: ''
                })
            }
        };
        $scope.addSlide();

    }

})();
