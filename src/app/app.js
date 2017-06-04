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

    'BlurAdmin.theme',
    'BlurAdmin.power',
    // 'BlurAdmin.pages'

]).run(function (Log, locals) {

    Log.i('ng is run...');

    // var userInfo = locals.getObject('user');
    //
    // if (JSON.stringify(userInfo) == '{}') {
    //
    //     // local
    //     window.location.assign('/auth.html');
    //     // rel
    //     // window.location.assign('/aa/bb/cc');
    // }

});
