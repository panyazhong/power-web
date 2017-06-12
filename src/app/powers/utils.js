(function () {
    'use strict';

    angular.module('Utils', [])
        .service('ToastUtils', toastUtils)
        .service('HttpToast', httpToast)
        .service('ModalUtils', modalUtils)
        .service('Log', log)
        .service('SkipUtils', skipUtils);       // 用来主动跳转（主动退出 或 无权限的跳转）！！！！！正式需替换

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
            }
        }
    }

    function httpToast(ToastUtils, SkipUtils) {
        return {
            toast: function (err) {
                if (err.status == 403) {
                    SkipUtils.errExit();
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
    function skipUtils(locals, ToastUtils) {

        var link = '/auth.html';

        return {
            exit: function (data) { // 退出登录、修改密码退出登录，msg是成功的回调
                ToastUtils.openToast('success', data.message);

                locals.clear();
                // 跳转
                window.location.replace(link);
            },
            errExit: function () {  // 错误处理，test!!!

                locals.clear();
                // 跳转
                window.location.replace(link);
            }
        }
    }

}());
