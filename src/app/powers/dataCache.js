(function () {
    'use strict';

    angular.module('DataCache', [])
        .factory("PageTopCache", pageTopCache)
        .factory("ImgPrefix", imgPrefix)    // 用来配置图片前缀！！！！！正式需替换
        .factory("ExportPrefix", exportPrefix)    // 用来配置图片前缀！！！！！正式需替换
        .factory("KeywordCache", keywordCache)  // key
        .factory("SidebarCache", sidebarCache)  // 侧边栏和地图数据
        .factory("locals", locals);

    function pageTopCache() {
        return {
            cache: {
                state: 'overview'
            },
            currentState: {
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
        var host = 'http://192.168.0.150';

        return {
            prefix: host + '/device/export',   // 设备导出
            eventPrefix: host + '/event/export',  // 事件导出
            userPrefix: host + '/user/export',  // 用户导出
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
            user_contracttypt: 'user_contracttypt',  //用户合同类型
            user_education: 'user_education',  //用户教育程度
            user_status: 'user_status',  //用户状态
            user_authority: 'user_authority',  //用户权限
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
        kwCache.getUser_contracttypt = function () {
            return getType(groups.user_contracttypt);
        };
        kwCache.getUser_education = function () {
            return getType(groups.user_education);
        };
        kwCache.getUser_status = function () {
            return getType(groups.user_status);
        };
        kwCache.getUser_authority = function () {
            return getType(groups.user_authority);
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

    function locals($window) {
        return {
            put: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defValue) {
                return $window.localStorage[key] || defValue;
            },
            putObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            clear: function () {
                $window.localStorage.clear();
            }
        }
    }

})();
