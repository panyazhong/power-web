/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.power.report')
        .controller('reportPageCtrl', reportPageCtrl);

    /** @ngInject */
    function reportPageCtrl($scope, Log, Report, HttpToast, ToastUtils, ExportPrefix, $window,
                            PageTopCache, $state, Upload, locals) {

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
            upload_user: ''
        };
        $scope.rowCollection = [];

        $scope.form = {
            from_time: '',
            to_time: '',
            filename: '',
            upload_user: ''
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

        $scope.clear = function () {
            $scope.form.from_time = '';
            $scope.form.to_time = '';
            $scope.form.filename = '';
            $scope.form.upload_user = '';

            $scope.show.from_time = '';
            $scope.show.to_time = '';
            $scope.show.upload_user = '';
        };

        $scope.search = function () {
            var params = $scope.formatForm();

            Report.query(params,
                function (data) {
                    ToastUtils.openToast('success', '获取报表列表成功！');
                    $scope.show.reportList = data;
                    $scope.rowCollection = data;
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };
        $scope.search();

        $scope.init = function () {
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
        $scope.init();

        $scope.uploadFiles = function (file, errFiles) {

            if (file) {
                file.upload = Upload.upload({
                    url: ExportPrefix.uploadReport,
                    data: {file: file},
                    withCredentials: true
                });

                file.upload.then(function (data) {
                    ToastUtils.openToast('success', data.message);
                    $scope.search();
                }, function (err) {
                    ToastUtils.openToast('error', err.data.message);
                    // if (response.status > 0)
                    //     $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    // file.progress = Math.min(100, parseInt(100.0 *
                    //     evt.loaded / evt.total));
                });
            }
        };

        $scope.download = function () {

            var params = $scope.formatForm();

            Report.query(params,
                function (data) {
                    // 查询到再下载
                    if (data.length == 0) {
                        ToastUtils.openToast('warning', '未筛选到文件，请换个条件试试！');
                        return;
                    }

                    var params = '';
                    for (var Key in $scope.form) {
                        if ($scope.form[Key]) {
                            params += Key + '=' + $scope.form[Key] + "&";
                        }
                    }

                    var p = params ? params.substring(0, params.length - 2) : '';

                    var link = ExportPrefix.reportAll + p;
                    if (link) {
                        $window.location.href = link;
                    }
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.downItem = function (id) {
            var link = ExportPrefix.reportItem(id);
            if (link) {
                $window.location.href = link;
            }
        };

        $scope.delItem = function (id) {
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
        };

        // dp set

        $scope.setUploadUser = function (obj) {
            $scope.show.upload_user = obj.name;
            $scope.form.upload_user = obj.uid;
        }

    }

})();
