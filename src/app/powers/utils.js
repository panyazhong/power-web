(function () {
    'use strict';

    angular.module('Utils', [])
        .service('ToastUtils', toastUtils)
        .service('HttpToast', httpToast)
        .service('ModalUtils', modalUtils)
        .service('Log', log)
        .service('SkipUtils', skipUtils)
        .service('arrUtil', arrUtil)
        .service('timeUtil', timeUtil);

    function toastUtils(toastr, toastrConfig) {
        var defaultConfig = angular.copy(toastrConfig);
        var types = ['success', 'error', 'info', 'warning'];
        var openedToasts = [];
        var options = {
            autoDismiss: false,
            positionClass: 'toast-top-right',
            type: 'error',
            timeOut: '2000',
            extendedTimeOut: '2000',
            allowHtml: false,
            closeButton: false,
            tapToDismiss: true,
            progressBar: false,
            newestOnTop: true,
            maxOpened: 0,
            preventDuplicates: false,
            preventOpenDuplicates: false,
            title: "",
            msg: ""
        };
        var optionsStr;
        return {
            openToast: function (type, title, msg, duration) {
                if (!type || !title) {
                    return;
                }

                options.type = type;
                options.title = title;
                options.msg = msg ? msg : '';
                options.timeOut = duration ? duration : '3000';

                angular.extend(toastrConfig, options);
                openedToasts.push(toastr[options.type](options.msg, options.title));
                var strOptions = {};
                for (var o in options)
                    if (o != 'msg' && o != 'title') strOptions[o] = options[o];
                optionsStr = "toastr." + options.type + "(\'" + options.msg + "\', \'" + options.title + "\', " + JSON.stringify(strOptions, null, 2) + ")";

            }
        }
    }

    function modalUtils($uibModal) {
        var modalInstance;

        return {
            open: function (page, size, ctrl, params, saveCB, cancelCB) {

                $uibModal.open({
                    animation: true,
                    templateUrl: page,
                    size: size,
                    controller: ctrl,
                    // appendTo: angular.element('#' + eleId),
                    resolve: {
                        params: params
                    },
                    windowTopClass: "power-modal-layout"
                }).result.then(function (result) {
                    saveCB(result);
                }, function (result) {
                    cancelCB(result);
                });

            },
            openMsg: function (page, size, ctrl, params, saveCB, cancelCB) {

                // if(modalInstance){
                //     modalInstance.close();
                // }

                // modalInstance = $uibModal.open({
                $uibModal.open({
                    animation: true,
                    templateUrl: page,
                    size: size,
                    controller: ctrl,
                    // appendTo: angular.element('#' + eleId),
                    resolve: {
                        params: params
                    },
                    windowTopClass: "power-modal-layout-msg"
                }).result.then(function (result) {
                    saveCB(result);
                }, function (result) {
                    cancelCB(result);
                });

            },
        }
    }

    function log() {

        var isDebug = true;     // 开发结束改为false

        return {
            i: function (msg) {
                if (isDebug) {
                    console.log(msg);
                }
            },
            e: function (msg) {
                if (isDebug) {
                    console.error(msg);
                }
            }
        }
    }

    function httpToast(ToastUtils, SkipUtils) {
        return {
            toast: function (err) {
                if (err.status === 403) {
                    SkipUtils.errExit(err.data);
                    return;
                }

                if (err.data && err.data.message) {  // 失败msg处理
                    ToastUtils.openToast('error', err.data.message);
                } else {
                    ToastUtils.openToast('error', '很抱歉，无法从服务器获取数据。');
                }
            }
        }
    }

    /**
     * 用来主动跳转（退出登陆、登陆信息已过期或错误时需要跳转到登陆页）
     */
    function skipUtils(locals, ToastUtils, $timeout) {

        var link = '/auth.html';

        return {
            exit: function (data) { // 退出登陆
                ToastUtils.openToast('info', data.message);

                locals.clear();
                // 跳转
                window.location.replace(link);
            },
            errExit: function (data) {  // 登陆信息已过期
                ToastUtils.openToast('error', data.message);

                $timeout(function () {
                    locals.clear();
                    // 跳转
                    window.location.replace(link);
                }, 2000);
            }
        }
    }

    function arrUtil(_) {

        return {
            delObjById: function (arr, id) { // 根据id，删除数组中某个对象
                if (!arr || !arr.length) return;

                return _.cloneDeep(arr.filter(function (obj) {
                    return id !== obj.id;
                }));
            },
            getValById: function (arr, id) {
                if (!arr || !arr.length) return;

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].id == id) {
                        return arr[i].name;
                    }
                }
            },
            getSafeDaysById: function (arr, id) {
                if (!arr || !arr.length) return;

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].id == id) {
                        return arr[i].safeRunningDays;
                    }
                }
            }
        }
    }

    function timeUtil() {
        return {
            lastUTS: function (uts) {   //根据unix时间戳获取当前日期23:59:59的时间戳
                var dd = new Date(uts * 1000);
                dd.setHours(23);
                dd.setMinutes(59);
                dd.setSeconds(59);

                var dateTime = dd.getTime();
                return Math.floor(dateTime / 1000);
            },
            zeroUTS: function (uts) {   //根据unix时间戳获取当前日期00:00:00的时间戳
                var dd = new Date(uts * 1000);
                dd.setHours(0);
                dd.setMinutes(0);
                dd.setSeconds(0);

                var dateTime = dd.getTime();
                return Math.floor(dateTime / 1000);
            },
            getDateUTS: function (uts, AddDayCount) {
                var dd = new Date(uts * 1000);
                dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期

                var dateTime = dd.getTime();
                return Math.floor(dateTime / 1000);
            },
            getMonthUTS: function (uts, AddMonthCount) {
                var dd = new Date(uts * 1000);
                dd.setMonth(dd.getMonth() + AddMonthCount);//获取AddMonthCount月后的日期
                dd.setDate(1);

                var dateTime = dd.getTime();
                return Math.floor(dateTime / 1000);
            },
            getYearUTS: function (uts, AddYearCount) {
                var dd = new Date(uts * 1000);
                dd.setFullYear(dd.getFullYear() + AddYearCount);//获取AddYearCount年后的日期
                dd.setMonth(0);
                dd.setDate(1);

                var dateTime = dd.getTime();
                return Math.floor(dateTime / 1000);
            }
        }
    }

}());
