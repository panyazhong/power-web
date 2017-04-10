(function () {
    'use strict';

    angular.module('DataCache', [])
        .factory("PageTopCache", pageTopCache)
        .factory("ImgPrefix", imgPrefix)    // 用来配置图片前缀！！！！！正式需替换
        .factory("UserInfo", userInfo);

    function pageTopCache() {
        return {
            cache: {
                state: 'overview'
            }
        }
    }

    function imgPrefix() {
        return {
            prefix: 'http://192.168.0.150/'   // img前缀
        }
    }

    function userInfo() {
        return {
            info: {}
        }
    }

})();
