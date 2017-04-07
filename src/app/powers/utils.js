(function () {
    'use strict';

    angular.module('Utils', [])
        .service('ToastUtils', toastUtils)
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