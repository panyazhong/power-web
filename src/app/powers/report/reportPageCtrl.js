(function () {
    'use strict';

    angular.module('BlurAdmin.power.report')
        .controller('reportPageCtrl', reportPageCtrl)
        .controller('dayCtrl', dayCtrl);

    /** @ngInject */
    function reportPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, Log, locals, ReportSet, HttpToast,
                            $rootScope, ToastUtils, ModalUtils, ExportPrefix, $window) {
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
            beginDateMonth: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                    datepickerMode: 'month',
                    minMode: 'month'
                },
                isOpen: false,
                altInputFormats: ['yyyy-MM'],
                format: 'yyyy-MM',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            },
            endDateMonth: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                    datepickerMode: 'month',
                    minMode: 'month'
                },
                isOpen: false,
                altInputFormats: ['yyyy-MM'],
                format: 'yyyy-MM',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            },
            beginDateYear: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                    datepickerMode: 'year',
                    minMode: 'year'
                },
                isOpen: false,
                altInputFormats: ['yyyy'],
                format: 'yyyy',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            },
            endDateYear: {
                options: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    showWeeks: false,
                    language: 'zh-CN',
                    datepickerMode: 'year',
                    minMode: 'year'
                },
                isOpen: false,
                altInputFormats: ['yyyy'],
                format: 'yyyy',
                modelOptions: {
                    timezone: 'Asia/beijing'
                }
            }
        };

        $scope.show = {
            clientName: '',  //变电站
            sidebarArr: [],   //变电站数组
            setList: [],        // 日报表
            setListMonth: [],   // 月报表
            setListYear: [],     // 年报表

            daySelect: false,   // 日月年全选全不选
            monthSelect: false,
            yearSelect: false
        };
        $scope.rowCollection = [];
        $scope.rowCollectionMonth = [];
        $scope.rowCollectionYear = [];

        $scope.form = {
            client_id: '',  //变电站cid
            beginDate: '',
            endDate: '',
            beginMonth: '',
            endMonth: '',
            beginYear: '',
            endYear: ''
        };

        $scope.formatForm = function () {

            // init form
            $scope.form.beginDate = '';
            $scope.form.endDate = '';
            $scope.form.beginMonth = '';
            $scope.form.endMonth = '';
            $scope.form.beginYear = '';
            $scope.form.endYear = '';

            if ($scope.show.beginDate) {
                $scope.form.beginDate = moment($scope.show.beginDate).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.endDate) {
                $scope.form.endDate = moment($scope.show.endDate).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.beginDateMonth) {
                $scope.form.beginMonth = moment($scope.show.beginDateMonth).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.endDateMonth) {
                $scope.form.endMonth = moment($scope.show.endDateMonth).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.beginDateYear) {
                $scope.form.beginYear = moment($scope.show.beginDateYear).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.endDateYear) {
                $scope.form.endYear = moment($scope.show.endDateYear).format('YYYY-MM-DD HH:mm:ss');
            }

            var params = {};
            for (var Key in $scope.form) {
                if ($scope.form[Key]) {
                    params[Key] = $scope.form[Key];
                }
            }

            return params;
        };

        $scope.checkForm = function () {
            if (!$scope.form.client_id) {
                ToastUtils.openToast('warning', '变电站信息异常,请稍后再试!');
                return false;
            }

            /** 都存在比较才有意义**/
            if ($scope.show.endDate && $scope.show.beginDate &&
                moment($scope.show.endDate).isBefore($scope.show.beginDate)) {
                ToastUtils.openToast('warning', '起始日不能晚于结束日!');
                return false;
            }

            if ($scope.show.endDateMonth && $scope.show.beginDateMonth &&
                moment($scope.show.endDateMonth).isBefore($scope.show.beginDateMonth)) {
                ToastUtils.openToast('warning', '起始月不能晚于结束月!');
                return false;
            }

            if ($scope.show.endDateYear && $scope.show.beginDateYear &&
                moment($scope.show.endDateYear).isBefore($scope.show.beginDateYear)) {
                ToastUtils.openToast('warning', '起始年不能晚于结束年!');
                return false;
            }

            return true
        };

        $scope.queryList = function (cid) {
            Log.i('queryList : ' + cid);

            if ($scope.checkForm()) {

                var params = $scope.formatForm();
                Log.i('query params : ' + JSON.stringify(params));

                ReportSet.query(params,
                    function (data) {
                        if (Array.isArray(data.daily)) {
                            $scope.show.setList = data.daily;
                            $scope.rowCollection = data.daily;
                        }

                        if (Array.isArray(data.monthly)) {
                            $scope.show.setListMonth = data.monthly;
                            $scope.rowCollectionMonth = data.monthly;
                        }

                        if (Array.isArray(data.yearly)) {
                            $scope.show.setListYear = data.yearly;
                            $scope.rowCollectionYear = data.yearly;
                        }
                    },
                    function (err) {
                        HttpToast.toast(err);
                    });

            }

        };

        // dropdown set 1
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            $scope.form.client_id = obj.clientId;
            $scope.show.clientName = obj.clientName;

            // 更换变电站更新列表
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

        $scope.formatDownloadForm = function () {
            var parmas = [];

            $scope.show.setList.map(function (item) {
                if (item.checked) {
                    parmas.push(item.id);
                }
            });
            $scope.show.setListMonth.map(function (item) {
                if (item.checked) {
                    parmas.push(item.id);
                }
            });
            $scope.show.setListYear.map(function (item) {
                if (item.checked) {
                    parmas.push(item.id);
                }
            });

            return parmas;
        };

        $scope.downAll = function () {

            var params = $scope.formatDownloadForm();
            if (params.length === 0) {
                ToastUtils.openToast('warning', '您还没有选择报表!');
                return
            }

            $window.location.href = ExportPrefix.reportDown(params);

        };

        $scope.editItem = function (item, pos) {
            switch (pos) {
                case 0: // 日
                case 1: // 月
                    ModalUtils.open('app/powers/report/widgets/dayModal.html', 'lg',
                        dayCtrl, item,
                        function (info) {
                            // 传值走这里
                            if (info) {
                                $scope.queryList($scope.form.client_id);
                            }
                        }, function (empty) {
                            // 不传值关闭走这里
                        });

                    break;
                case 2: // 年
                    ToastUtils.openToast('info', '编辑 年报表：' + item.fileName);
                    break;
            }
        };

        $scope.downItem = function (item, pos) {

            if (!item.id) {
                ToastUtils.openToast('warning', '报表信息异常!');
                return;
            }

            var params = [];
            params.push(item.id);

            $window.location.href = ExportPrefix.reportDown(params);

        };

        // date picker
        $scope.togglePicker = function () {
            $scope.data.beginDate.isOpen = !$scope.data.beginDate.isOpen;
        };

        $scope.toggleEndPicker = function () {
            $scope.data.endDate.isOpen = !$scope.data.endDate.isOpen;
        };

        $scope.togglePickerMonth = function () {
            $scope.data.beginDateMonth.isOpen = !$scope.data.beginDateMonth.isOpen;
        };

        $scope.toggleEndPickerMonth = function () {
            $scope.data.endDateMonth.isOpen = !$scope.data.endDateMonth.isOpen;
        };

        $scope.togglePickerYear = function () {
            $scope.data.beginDateYear.isOpen = !$scope.data.beginDateYear.isOpen;
        };

        $scope.toggleEndPickerYear = function () {
            $scope.data.endDateYear.isOpen = !$scope.data.endDateYear.isOpen;
        };

        // day/month/year 全选,反选
        $scope.daySelect = function () {
            if ($scope.show.daySelect) {
                $scope.show.setList.map(function (item) {
                    item.checked = true
                });
            } else {
                $scope.show.setList.map(function (item) {
                    item.checked = false
                });
            }

        };

        $scope.monthSelect = function () {
            if ($scope.show.monthSelect) {
                $scope.show.setListMonth.map(function (item) {
                    item.checked = true
                });
            } else {
                $scope.show.setListMonth.map(function (item) {
                    item.checked = false
                });
            }

        };

        $scope.yearSelect = function () {
            if ($scope.show.yearSelect) {
                $scope.show.setListYear.map(function (item) {
                    item.checked = true
                });
            } else {
                $scope.show.setListYear.map(function (item) {
                    item.checked = false
                });
            }

        };

        $rootScope.$on('filterInfo', function (event, data) {
            if (!data) {
                return
            }
            if ($state.$current != 'report') {
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

    }

    function dayCtrl($scope, params, Log, ToastUtils, $sce) {
        Log.i('frame: ' + JSON.stringify(params));

        $scope.url = params.html + "#/?id=" + params.id;
        // $scope.url = "app/powers/report/widgets/dayIframe.html" + "#/?id=" + params.id;
        $scope.path = $sce.trustAsResourceUrl($scope.url);

        $scope.$on('iframe', function (e, data) {
            if (!data) {
                return;
            }

            if (data == 'dimiss') {
                $scope.$close();
            } else if (data == 'sub') {
                ToastUtils.openToast('success', '更新报表成功');
                $scope.$close(data);
            }

        });

    }

})();
