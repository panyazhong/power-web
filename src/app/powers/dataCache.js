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

        return {
            cache: {
                state: 'overview'
            }
        }

    }

})();
