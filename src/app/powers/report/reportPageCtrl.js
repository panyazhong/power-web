(function () {
    'use strict';

    angular.module('BlurAdmin.power.report')
        .controller('reportPageCtrl', reportPageCtrl);

    /** @ngInject */
    function reportPageCtrl($scope, $state, PageTopCache, Sidebar, SidebarCache, Log, locals, ReportSet, HttpToast,
                            $rootScope, ToastUtils) {
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
            beginDateMonth: '',
            endDateMonth: '',
            beginDateYear: '',
            endDateYear: ''
        };

        $scope.formatForm = function () {

            // init form
            $scope.form.beginDate = '';
            $scope.form.endDate = '';
            $scope.form.beginDateMonth = '';
            $scope.form.endDateMonth = '';
            $scope.form.beginDateYear = '';
            $scope.form.endDateYear = '';

            if ($scope.show.beginDate) {
                $scope.form.beginDate = moment($scope.show.beginDate).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.endDate) {
                $scope.form.endDate = moment($scope.show.endDate).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.beginDateMonth) {
                $scope.form.beginDateMonth = moment($scope.show.beginDateMonth).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.endDateMonth) {
                $scope.form.endDateMonth = moment($scope.show.endDateMonth).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.beginDateYear) {
                $scope.form.beginDateYear = moment($scope.show.beginDateYear).format('YYYY-MM-DD HH:mm:ss');
            }
            if ($scope.show.endDateYear) {
                $scope.form.endDateYear = moment($scope.show.endDateYear).format('YYYY-MM-DD HH:mm:ss');
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

            var p = $scope.formatDownloadForm();
            if (p.length === 0) {
                ToastUtils.openToast('warning', '您还没有选择报表!');
                return
            }

            ToastUtils.openToast('info', '批量下载的id数组是：' + JSON.stringify(p));
            Log.i('批量下载：' + JSON.stringify(p));
            
        };

        $scope.editItem = function (item, pos) {
            switch (pos) {
                case 0: // 日
                    ToastUtils.openToast('info', '编辑 日报表：' + item.fileName);
                    break;
                case 1: // 月
                    ToastUtils.openToast('info', '编辑 月报表：' + item.fileName);
                    break;
                case 2: // 年
                    ToastUtils.openToast('info', '编辑 年报表：' + item.fileName);
                    break;
            }
        };

        $scope.downItem = function (item, pos) {
            switch (pos) {
                case 0: // 日
                    ToastUtils.openToast('info', '下载 日报表：' + item.fileName);
                    break;
                case 1: // 月
                    ToastUtils.openToast('info', '下载 月报表：' + item.fileName);
                    break;
                case 2: // 年
                    ToastUtils.openToast('info', '下载 年报表：' + item.fileName);
                    break;
            }
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

        $scope.demo = function () {
            var tempData = [
                {
                    fileName: '时代金融20170101',
                    id: 'id201'
                },
                {
                    fileName: '时代金融20170208',
                    id: 'id202'
                },
                {
                    fileName: '时代金融20170301',
                    id: 'id203'
                },
                {
                    fileName: '时代金融20170411',
                    id: 'id204'
                },
                {
                    fileName: '时代金融20170515',
                    id: 'id205'
                },
                {
                    fileName: '时代金融20170520',
                    id: 'id206'
                },
                {
                    fileName: '时代金融20170611',
                    id: 'id207'
                },
                {
                    fileName: '时代金融20170712',
                    id: 'id208'
                }
            ];
            $scope.show.setList = tempData;
            $scope.rowCollection = tempData;

            tempData = [
                {
                    fileName: '时代月201702',
                    id: 'id301'
                },
                {
                    fileName: '时代月201703',
                    id: 'id302'
                },
                {
                    fileName: '时代月201704',
                    id: 'id303'
                },
                {
                    fileName: '时代月201705',
                    id: 'id304'
                },
                {
                    fileName: '时代月201706',
                    id: 'id305'
                }
            ];
            $scope.show.setListMonth = tempData;
            $scope.rowCollectionMonth = tempData;

            tempData = [
                {
                    fileName: '时代年2011',
                    id: 'id401'
                },
                {
                    fileName: '时代年2012',
                    id: 'id402'
                },
                {
                    fileName: '时代年2013',
                    id: 'id403'
                },
                {
                    fileName: '时代年2014',
                    id: 'id404'
                },
                {
                    fileName: '时代年2015',
                    id: 'id405'
                },
                {
                    fileName: '时代年2016',
                    id: 'id406'
                },
                {
                    fileName: '时代年2017',
                    id: 'id407'
                },
                {
                    fileName: '时代年2018',
                    id: 'id408'
                },
                {
                    fileName: '时代年2019',
                    id: 'id409'
                },
                {
                    fileName: '时代年2020',
                    id: 'id410'
                },
                {
                    fileName: '时代年2021',
                    id: 'id411'
                },
                {
                    fileName: '时代年2022',
                    id: 'id412'
                },
                {
                    fileName: '时代年2023',
                    id: 'id413'
                },
                {
                    fileName: '时代年2024',
                    id: 'id414'
                },
                {
                    fileName: '时代年2025',
                    id: 'id415'
                }
            ];
            $scope.show.setListYear = tempData;
            $scope.rowCollectionYear = tempData;

        };
        $scope.demo();

    }

})();
