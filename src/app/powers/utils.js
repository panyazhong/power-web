(function () {
    'use strict';

    angular.module('Utils', [])
        .service('ToastUtils', toastUtils)
        .service('HttpToast', httpToast)
        .service('ModalUtils', modalUtils)
        .service('Log', log);

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

    function httpToast(ToastUtils) {
        return {
            toast: function (err) {
                if (err.message) {  // 失败处理
                    ToastUtils.openToast('error', err.message);
                } else {
                    ToastUtils.openToast('error', '很抱歉，无法从服务器获取数据。');
                }
            }
        }
    }

    function modalUtils($uibModal) {
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
            }
        }
    }

}());
