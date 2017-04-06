(function () {
    'use strict';

    angular.module('DataCache', [])
        .factory("PageTopCache", pageTopCache);

    // function criterionCache(_) {
    //
    //     var items = [];
    //
    //     return {
    //         list: function () {
    //             return items;
    //         },
    //         isEmpty: function () {
    //             return items && items.length > 0 ? false : true;
    //         },
    //         create: function (args) {
    //             if (Array.isArray(args) && args.length > 0) {
    //                 for (var i = 0; i < args.length; i++) {
    //                     args[i].weight = '';
    //                 }
    //                 items = _.cloneDeep(args);
    //             }
    //         }
    //     }
    // }

    function pageTopCache() {

        var currentState = 'overview';  // pageTop选中的状态

        return {
            cState : currentState,
            isEmpty: function () {
                return currentState.length == 0;
            },
            setState: function (args) {

                if (args.length > 0) {
                    // currentState = _.cloneDeep(args);
                    currentState = args;
                }
            },
            getState: function () {

                return currentState;
            }
        }

    }

})();
