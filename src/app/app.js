'use strict';

angular.module('BlurAdmin', [
    'ngAnimate',
    'ui.bootstrap',
    'ui.sortable',
    'ui.router',
    'ngTouch',
    'toastr',
    'smart-table',
    "xeditable",
    'ui.slimscroll',
    'ngJsTree',
    'angular-progress-button-styles',

    // lib
    'ngResource',
    'ngCookies',
    'mgcrea.ngStrap.popover',
    'DataCache',
    'Utils',
    'HttpHelper',
    'ui.bootstrap.datetimepicker',
    'ngFileUpload',
    'ngLocale',

    'BlurAdmin.theme',
    'BlurAdmin.power'

]).run(function (Log, locals) {
    /*
    var userInfo = locals.getObject('user');
    if (JSON.stringify(userInfo) == '{}') {

        // 跳转
        window.location.replace('/auth.html');
    }
    */
});
