(function () {
    'use strict';

    angular.module('BlurAdmin.power.events')
        .controller('eventsPageCtrl', eventsPageCtrl);

    /** @ngInject */
    function eventsPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, HttpToast, Log,
                            ToastUtils, ExportPrefix, Event, locals, $stateParams, $rootScope, $timeout, treeCache, timeUtil) {

        PageTopCache.cache.state = $state.$current; // active

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
            endDate: {
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
        };

        $scope.show = {
            isLoading: true,
            maxSize: 15,    // 每页显示的数量
            displayedPages: 0,
            selectAll: false,   //是否全选
            eventsData: {},

            clientName: '变电站',  //变电站
            incominglineName: '总进线',    //总线
            branchName: '所处支线',    //支线
            sidebarArr: [],    //变电站数组，默认从缓存里拿
            incominglingArr: [],  //总线数组
            branchArr: [],    //支线数组,
            beginDate: '',  //开始时间
            endDate: ''     //结束时间
        };

        $scope.form = {
            client_id: $stateParams.cid ? $stateParams.cid : '',  //变电站cid，有可能是从地图界面传过来的参
            incomingline_id: "",    //总进线inid
            branch_id: "",  //所处支线bid
            name: '',   //设备名称
            beginDate: '',   //开始时间
            endDate: ''  //结束时间
        };

        $scope.clearForm = function () {
            // 1 初始化显示
            $scope.show.clientName = '变电站';
            $scope.show.incominglineName = '总进线';
            $scope.show.branchName = '所处支线';
            $scope.show.beginDate = '';
            $scope.show.endDate = '';

            // 2.初始化form
            $scope.form = {
                client_id: "",  //变电站cid
                incomingline_id: "",    //总进线inid
                branch_id: "",  //所处支线bid
                name: '',   //设备名称
                beginDate: '',   //开始时间
                endDate: ''  //结束时间
            };

            // 3.初始化dropdown数据
            $scope.show.incominglingArr = [];
            $scope.show.branchArr = [];
        };

        $scope.formatDate = function (date) {
            if (date) {
                return moment(date).format('YYYY-MM-DD HH:mm');
            }
        };

        // dropdown set 1
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            $scope.form.client_id = obj.clientId;
            // $scope.form.incomingline_id = '';   //和新增设备不同，需清空子集
            // $scope.form.branch_id = '';
            // set
            $scope.show.clientName = obj.clientName;
            // $scope.show.incominglingArr = obj.incominglineData;

            // clear
            // $scope.show.incominglineName = '总进线';
            // $scope.show.branchName = '所处支线';
            // $scope.show.branchArr = [];
        };

        $scope.changeIncomingling = function (obj) {
            if ($scope.show.incominglineName == obj.incominglineName) {
                return;
            }

            $scope.form.incomingline_id = obj.incominglingId;
            $scope.form.branch_id = '';   //和新增设备不同，需清空子集
            // set
            $scope.show.incominglineName = obj.incominglineName;
            $scope.show.branchArr = obj.branchData;

            // clear
            $scope.show.branchName = '所处支线';
        };

        $scope.initFilterInfo = function () {

            var cid = locals.get('cid', '');
            if (cid) {
                for (var i = 0; i < $scope.show.sidebarArr.length; i++) {
                    var item = $scope.show.sidebarArr[i];
                    if (item.clientId == cid) {
                        $scope.changeClent(item);
                    }

                }
            }

            var inid = locals.get('inid', '');
            if (inid) {
                for (var j = 0; j < $scope.show.incominglingArr.length; j++) {
                    var inItem = $scope.show.incominglingArr[j];
                    if (inItem.incominglingId == inid) {
                        $scope.changeIncomingling(inItem);
                    }

                }
            }

        };

        $scope.init = function () {

            var pm = treeCache.getTree();
            pm.then(function (data) {
                $scope.show.sidebarArr = treeCache.createClientArr(data);
                $scope.initFilterInfo();
            });

        };
        $scope.init();

        // smart table
        $scope.getData = function (tableState) {

            $scope.show.selectAll = false;  // 与设备台账区别
            $scope.show.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || $scope.show.maxSize;  // Number of entries showed per page.

            var params = {
                start: start,
                number: number
            };

            if ($scope.form.client_id) {
                params.client_id = $scope.form.client_id;
            }
            if ($scope.form.incomingline_id) {
                params.incomingline_id = $scope.form.incomingline_id;
            }
            if ($scope.form.branch_id) {
                params.branch_id = $scope.form.branch_id;
            }
            if ($scope.form.name) {
                params.name = $scope.form.name;
            }
            if ($scope.show.beginDate) {
                params.timeStart = moment($scope.show.beginDate).unix();
            }
            if ($scope.show.endDate) {
                params.timeEnd = timeUtil.lastUTS(moment($scope.show.endDate).unix());
            }

            Event.query(params,
                function (obj) {
                    $timeout(function () {
                        $scope.show.isLoading = false;
                    }, 300);

                    $scope.show.eventsData = obj;
                    tableState.pagination.numberOfPages = obj.totalPage;
                    $scope.show.displayedPages = Math.ceil(parseFloat(obj.totalCount) / parseInt(obj.totalPage));
                    $scope.show.eventsData.tableState = tableState;
                }, function (err) {
                    $scope.show.isLoading = false;
                    HttpToast.toast(err);
                });

        };

        $scope.refreshTable = function () {
            if (parseInt($scope.show.eventsData.totalPage) <= 1 && $scope.show.eventsData.tableState) {
                $scope.getData($scope.show.eventsData.tableState);
            } else {
                angular
                    .element('#powerTablePagination')
                    .isolateScope()
                    .selectPage(1);
            }
        };

        $scope.searchDevice = function () {
            $scope.refreshTable();
        };

        $scope.switchSelectAll = function () {
            $scope.show.selectAll = !$scope.show.selectAll;

            if ($scope.show.selectAll) {
                $scope.show.eventsData.events.map(function (item) {
                    item.checked = true;
                });
            } else {
                $scope.show.eventsData.events.map(function (item) {
                    item.checked = false;
                });
            }
        };

        $scope.convertSelect = function () {
            $scope.show.eventsData.events.map(function (item) {
                item.checked = !item.checked;
            });
        };

        $scope.eventConfirm = function (parmas) {

            Log.i('需要确认的事件id：' + JSON.stringify(parmas));
            Event.update({
                    event_ids: parmas,
                    confirm: 'confirm'
                },
                function (data) {

                    ToastUtils.openToast('success', data.message);
                    $scope.clearForm(); // 确认完需要初始化表单状态
                    $scope.searchDevice();
                },
                function (err) {
                    HttpToast.toast(err);
                });

        };

        // 批量确认
        $scope.batchConfirm = function () {
            var parmas = [];

            $scope.show.eventsData.events.map(function (item) {
                if (item.checked && !item.confirm_time) {
                    parmas.push(item.id);
                }
            });

            if (parmas.length == 0) {
                ToastUtils.openToast('warning', '至少要选择一个未确认的事件。');
                return;
            }

            $scope.eventConfirm(parmas);
        };

        // 单个确认
        $scope.confirmItemEvent = function (id) {
            var parmas = [];
            parmas.push(id);

            $scope.eventConfirm(parmas);
        };

        // 导出excel
        $scope.exportExcel = function () {
            var p = $scope.allPrpos();

            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            var URL = ExportPrefix.eventPrefix + p;
            window.open(URL, "_blank", strWindowFeatures);
        };

        $scope.allPrpos = function () {
            var params = {};

            if ($scope.form.client_id) {
                params.client_id = $scope.form.client_id;
            }
            if ($scope.form.incomingline_id) {
                params.incomingline_id = $scope.form.incomingline_id;
            }
            if ($scope.form.branch_id) {
                params.branch_id = $scope.form.branch_id;
            }
            if ($scope.form.name) {
                params.name = $scope.form.name;
            }
            if ($scope.show.beginDate) {
                params.timeStart = moment($scope.show.beginDate).unix();
            }
            if ($scope.show.endDate) {
                params.timeEnd = timeUtil.lastUTS(moment($scope.show.endDate).unix());
            }

            var names = "";
            for (var Key in params) {
                names += Key + "=" + params[Key] + "&";
            }

            return names ? '?' + names.substring(0, names.length - 1) : "";
        };

        // 打印
        $scope.print = function () {
            var p = $scope.allPrpos();

            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            var URL = ExportPrefix.eventPrefixPrint + p;
            window.open(URL, "_blank", strWindowFeatures);
        };

        // dropdown set 2
        $scope.setBranch = function (obj) {
            $scope.show.branchName = obj.branchName;
            $scope.form.branch_id = obj.branchId;
        };

        // date
        $scope.toggleDatepicker = function () {
            $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
        };

        $scope.toggleEndDatepicker = function () {
            $scope.data.endDate.isOpen = !$scope.data.endDate.isOpen;
        };

        // new fn
        /**
         * 查看变电站一次系统图
         */
        $scope.viewClientDetail = function (id) {
            if (!id) {
                ToastUtils.openToast('warning', '变电站信息异常。稍后再试.');
                return
            }
            $state.go('monitoring', {cid: id}, {reload: true});
        };

        /**
         * 查看分支详情
         */
        $scope.viewBranchDetail = function (id) {
            if (!id) {
                ToastUtils.openToast('warning', '支线信息异常。稍后再试.');
                return
            }

            $state.go('branch', {bid: id}, {reload: true});

            locals.put('bid', id);
        }

        $rootScope.$on('filterInfo', function (event, data) {
            if (!data) {
                return
            }
            if ($state.$current != 'events') {
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
            if (data.inid) {
                for (var j = 0; j < $scope.show.incominglingArr.length; j++) {
                    var inItem = $scope.show.incominglingArr[j];
                    if (inItem.incominglingId == data.inid) {
                        $scope.changeIncomingling(inItem);
                    }

                }
            }

            $timeout(function () {
                $scope.searchDevice();
            }, 500);

        });

    }

})();
