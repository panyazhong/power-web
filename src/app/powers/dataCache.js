(function () {
    'use strict';

    angular.module('DataCache', [])
        .factory("PageTopCache", pageTopCache)
        .factory("ImgPrefix", imgPrefix)    // 用来配置图片前缀！！！！！正式需替换
        .factory("ExportPrefix", exportPrefix)    // 用来配置图片前缀！！！！！正式需替换
        .factory("KeywordCache", keywordCache)  // key
        .factory("SidebarCache", sidebarCache)  // 侧边栏和地图数据

    function pageTopCache() {
        return {
            cache: {
                state: 'overview'
            }
        }
    }

    function imgPrefix() {
        return {
            prefix: 'http://192.168.0.150/'
        }
    }

    function exportPrefix() {
        return {
            prefix: 'http://192.168.0.150/device/export',   // 设备导出
            eventPrefix: 'http://192.168.0.150/event/export',  // 事件导出
        }
    }

    function keywordCache(_) {
        var kws = [];
        var kwCache = {};
        var groups = {
            user_position: "user_position",
            client_type: "client_type",
            client_level: "client_level",
            device_type: "device_type",
            device_operationstatus: "device_operationstatus",
            device_phasenum: "device_phasenum",
            device_usecondition: "device_usecondition",
            device_insulationclass: "device_insulationclass",
        };
        kwCache.create = function (arr) {
            if (Array.isArray(arr)) {
                kws = _.cloneDeep(arr);
            }
            return;
        };

        var getType = function (type) {
            return _.cloneDeep(_.filter(kws, function (kw) {
                return kw.group === type;
            }));
        };

        kwCache.getUser_position = function () {
            return getType(groups.user_position);
        };
        kwCache.getClient_type = function () {
            return getType(groups.client_type);
        };
        kwCache.getClient_level = function () {
            return getType(groups.client_level);
        };
        kwCache.getDevice_type = function () {
            return getType(groups.device_type);
        };
        kwCache.getDevice_operationstatus = function () {
            return getType(groups.device_operationstatus);
        };
        kwCache.getDevice_phasenum = function () {
            return getType(groups.device_phasenum);
        };
        kwCache.getDevice_usecondition = function () {
            return getType(groups.device_usecondition);
        };
        kwCache.getDevice_insulationclass = function () {
            return getType(groups.device_insulationclass);
        };

        kwCache.isEmpty = function () {
            return kws.length === 0;
        };

        return kwCache;
    }

    function sidebarCache(_, ImgPrefix, ToastUtils) {   // 缓存侧边栏和地图所需信息

        var obj;
        var cache = {};
        cache.create = function (data) {
            if (data.clients && Array.isArray(data.clients)) {
                data.clients.map(function (item) {
                    item.ico = ImgPrefix.prefix + item.ico; // 变电站icon
                });

                obj = _.cloneDeep(data);
                return;
            }

            ToastUtils.openToast('info', '获取变电站信息失败，请联系管理员。');
        };

        cache.getData = function () {
            return _.cloneDeep(obj);
        };

        cache.isEmpty = function () {
            return !obj;
        };

        return cache;
    }

})();
