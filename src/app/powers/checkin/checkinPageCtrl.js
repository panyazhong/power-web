(function () {
    'use strict';

    angular.module('BlurAdmin.power.checkin')
        .controller('checkinPageCtrl', checkinPageCtrl);

    /** @ngInject */
    function checkinPageCtrl($scope, $state, Sidebar, SidebarCache, Log, HttpToast, Signin,
                             PageTopCache, ToastUtils, ExportPrefix, $window) {

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
            checkinList: [],     // 签到的列表

            sidebarArr: [],    //变电站
            clientName: '',
            checkPlaceArr: [],  // 签到点
            from_time: '',
            to_time: '',

            isFirst: true       // 标识第一次、用来加载数据
        };
        $scope.rowCollection = [];

        $scope.form = {
            cid: "",  //变电站cid
            pos: '',
            from_time: '',
            to_time: '',
        };

        $scope.GetDateStr = function (AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
            var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
            return y + "-" + m + "-" + d + " 00:00:00";
        };

        $scope.formatForm = function () {
            // change格式
            if ($scope.show.isFirst) {
                var exDate = $scope.GetDateStr(-30);
                $scope.form.from_time = exDate;
                $scope.form.to_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            } else {
                $scope.form.from_time = '';
                $scope.form.to_time = '';
                if ($scope.show.from_time) {
                    $scope.form.from_time = moment($scope.show.from_time).format('YYYY-MM-DD HH:mm:ss');
                }
                if ($scope.show.to_time) {
                    $scope.form.to_time = moment($scope.show.to_time).format('YYYY-MM-DD HH:mm:ss');
                }
            }
            $scope.show.isFirst = false;

            var params = {};
            for (var Key in $scope.form) {
                if ($scope.form[Key]) {
                    params[Key] = $scope.form[Key];
                }
            }

            return params;
        };

        $scope.clear = function () {
            $scope.show.clientName = '';
            $scope.show.checkPlaceArr = [];
            $scope.show.from_time = '';
            $scope.show.to_time = '';

            $scope.form = {
                cid: "",  //变电站cid
                pos: '',
                from_time: '',
                to_time: '',
            };
        };

        $scope.search = function () {
            var params = $scope.formatForm();
            params.list = 'list';

            Signin.query(params,
                function (data) {
                    ToastUtils.openToast('success', '查询签到列表成功');
                    $scope.show.checkinList = data;
                    $scope.rowCollection = data;
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.init = function () {
            $scope.search();

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

        $scope.print = function () {
            var params = $scope.formatForm();
            params.list = 'list';

            var downForm = $scope.formatForm();

            Signin.query(params,
                function (data) {
                    if (Array.isArray(data) && data.length < 1) {
                        ToastUtils.openToast('warning', '未筛选到文件，请换个条件试试！');
                        return;
                    }

                    var pam = '';
                    for (var Key in downForm) {
                        if (downForm[Key]) {
                            pam += Key + '=' + downForm[Key] + "&";
                        }
                    }
                    var p = pam.substring(0, pam.length - 1);

                    // file exist
                    var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
                    var URL = ExportPrefix.checkinAllPrint + p;
                    window.open(URL, "_blank", strWindowFeatures);
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.export = function () {
            var params = $scope.formatForm();
            params.list = 'list';

            var downForm = $scope.formatForm();

            Signin.query(params,
                function (data) {
                    if (Array.isArray(data) && data.length < 1) {
                        ToastUtils.openToast('warning', '未筛选到文件，请换个条件试试！');
                        return;
                    }

                    var pam = '';
                    for (var Key in downForm) {
                        if (downForm[Key]) {
                            pam += Key + '=' + downForm[Key] + "&";
                        }
                    }
                    var p = pam.substring(0, pam.length - 1);

                    // file exist
                    $window.location.href = ExportPrefix.checkinAll + p;
                },
                function (err) {
                    HttpToast.toast(err);
                });
        };

        // dropdown set
        $scope.changeClent = function (obj) {
            if ($scope.show.clientName == obj.clientName) {
                return;
            }

            // set
            $scope.form.cid = obj.clientId;
            $scope.show.clientName = obj.clientName;

            // clear
            $scope.form.pos = '';
            $scope.show.checkPlaceArr = [];

            Signin.query({
                    client: 'client',
                    clientId: $scope.form.cid
                },
                function (data) {
                    $scope.show.checkPlaceArr = data;
                }, function (err) {
                    HttpToast.toast(err);
                });
        };

        $scope.changeCheckPlace = function (item) {
            if ($scope.form.pos == item) {
                return;
            }

            // set
            $scope.form.pos = item
        };
    }

})();
