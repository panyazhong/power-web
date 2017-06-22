/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.report')
        .controller('reportPageCtrl', reportPageCtrl)
        .controller('reportDelCtrl', reportDelCtrl);

    /** @ngInject */
    function reportPageCtrl($scope, Log, Report, HttpToast, ToastUtils, ExportPrefix, $window,
                            PageTopCache, $state, Upload, locals, ModalUtils, Device, SidebarCache, Sidebar, reportHelper) {

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
            reportList: [], // 报表列表
            hasTop: '',      // 是否显示
            uploadUserArr: [],      // 上传者列表

            from_time: '',
            to_time: '',
            upload_user: '',
            clientName: '所属变电站',  //变电站
            sidebarArr: []
        };
        $scope.rowCollection = [];

        $scope.form = {
            from_time: '',
            to_time: '',
            filename: '',
            upload_user: ''
        };

        $scope.up = {
            client_ids: []
        };

        $scope.formatForm = function () {
            // change格式
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

        $scope.changeClent = function (obj) {
            obj.state = !obj.state;

            /**
             * 遍历变电站数组，看那个是选中的
             */
            $scope.show.clientName = '';
            $scope.up.client_ids = [];
            $scope.show.sidebarArr.map(function (item) {
                if (item.state) {
                    $scope.show.clientName += item.clientName + "，";
                    $scope.up.client_ids.push(item.clientId);
                }
            });
            if ($scope.show.clientName.length > 0) {
                $scope.show.clientName = $scope.show.clientName.substring(0, $scope.show.clientName.length - 1);
            }

        };

        /**
         * clear form
         */
        $scope.clear = function () {
            $scope.form.from_time = '';
            $scope.form.to_time = '';
            $scope.form.filename = '';
            $scope.form.upload_user = '';

            $scope.show.from_time = '';
            $scope.show.to_time = '';
            $scope.show.upload_user = '';

            $scope.show.clientName = '所属变电站';
            $scope.up.client_ids = [];
        };

        $scope.search = function () {
            var params = $scope.formatForm();

            Report.query(params,
                function (data) {
                    // ToastUtils.openToast('success', '获取报表列表成功！');

                    $scope.show.reportList = reportHelper.query(data);
                    $scope.rowCollection = reportHelper.query(data);

                    console.log('$scope.show.reportList'+JSON.stringify($scope.show.reportList));
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };
        $scope.search();

        $scope.getReportUser = function () {
            $scope.show.hasTop = locals.getObject('user').hasTop;
            if ($scope.show.hasTop == '1') {

                Report.queryUser({
                        user: 'user'
                    },
                    function (data) {
                        $scope.show.uploadUserArr = data;
                    },
                    function (err) {
                        HttpToast.toast(err);
                    })
            }
        };
        $scope.getReportUser();

        $scope.uploadFiles = function (file, errFiles) {
            if ($scope.up.client_ids.length === 0) {
                ToastUtils.openToast('warning', '请选择文件所属变电站!');
                return
            }

            if (file) {
                file.upload = Upload.upload({
                    url: ExportPrefix.uploadReport,
                    data: {file: file, client_ids: $scope.up.client_ids},
                    withCredentials: true
                });

                file.upload.then(function (data) {
                    if (data.data && data.data.message) {
                        ToastUtils.openToast('success', data.data.message);
                        // 清除下form
                        $scope.clear();
                        $scope.search();
                    }

                }, function (err) {
                    if (err.data && err.data.message) {
                        ToastUtils.openToast('error', err.data.message);
                    }
                    // if (response.status > 0)
                    //     $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    // file.progress = Math.min(100, parseInt(100.0 *
                    //     evt.loaded / evt.total));
                });
            }
        };

        /**
         * 批量下载
         */
        $scope.download = function () {

            var params = $scope.formatForm();

            Report.query(params,
                function (data) {
                    // 查询到再下载
                    if (Array.isArray(data) && data.length < 1) {
                        ToastUtils.openToast('warning', '未筛选到文件，请换个条件试试！');
                        return;
                    }

                    var pam = '';
                    for (var Key in $scope.form) {
                        if ($scope.form[Key]) {
                            pam += Key + '=' + $scope.form[Key] + "&";
                        }
                    }

                    var p = pam ? pam.substring(0, pam.length - 1) : '';

                    $window.location.href = ExportPrefix.reportAll + p;
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        /**
         *  下载单个报表
         */
        $scope.downItem = function (id) {
            var link = ExportPrefix.reportItem(id);
            if (link) {
                $window.location.href = link;
            }
        };

        /**
         * 删除单个报表
         */
        $scope.delItem = function (id) {

            ModalUtils.openMsg('app/powers/modal/dangerDelReport.html', '',
                reportDelCtrl, {},
                function (info) {
                    // 传值走这里
                    if (info) {
                        Report.delete({
                                rpid: id
                            },
                            function (data) {
                                ToastUtils.openToast('success', data.message);
                                $scope.search();
                            },
                            function (err) {
                                HttpToast.toast(err);
                            })
                    }
                }, function (empty) {
                    // 不传值关闭走这里
                });

        };

        // dropdown set

        $scope.setUploadUser = function (obj) {
            $scope.show.upload_user = obj.name;
            $scope.form.upload_user = obj.uid;
        }

    }

    function reportDelCtrl($scope) {

        $scope.submit = function () {
            var data = 'submit';
            $scope.$close(data);
        };

    }

})();
