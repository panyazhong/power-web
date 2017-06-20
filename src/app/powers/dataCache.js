(function () {
    'use strict';

    angular.module('DataCache', [])
        .factory("EventsCache", eventsCache)    // 需要配置事件前缀！！！正式需替换，需要更换 index 页的引入
        .factory("PageTopCache", pageTopCache)
        .factory("ImgPrefix", imgPrefix)    // 用来配置图片前缀！！！！！正式需替换
        .factory("ExportPrefix", exportPrefix)    // 用来配置图片前缀！！！！！正式需替换
        .factory("KeywordCache", keywordCache)  // key
        .factory("SidebarCache", sidebarCache)  // 侧边栏和地图数据
        .factory("locals", locals)
        .factory("pieChartCache", pieChartCache)
        .factory("clientCache", clientCache);

    function eventsCache(Log, ModalUtils, $state, $rootScope, clientCache) {
        var bid = "";       // 支线 id

        var socket = io.connect('http://monitor.shanghaihenghui.com:6688', {resource: 'event/socket.io'});
        socket.on('alert', function (data) {    // 监听事件

            var obj = JSON.parse(data);

            socket.emit('received', {mhid: obj.mhid}); // 收到alert事件后响应
            // switch (parseInt(obj.level)) {
            //     case 1:
            //         ModalUtils.openMsg('app/powers/modal/warningEvent.html', '',
            //             warningEventCtrl, {
            //                 data: obj
            //             },
            //             function (info) {
            //                 // 传值走这里
            //                 if (info) {
            //                     $state.go('events');
            //                 }
            //             }, function (empty) {
            //                 // 不传值关闭走这里
            //             });
            //         break;
            //     case 2:
            //         ModalUtils.openMsg('app/powers/modal/dangerEvent.html', '',
            //             eventCtrl, {
            //                 data: obj
            //             },
            //             function (info) {
            //                 // 传值走这里
            //                 if (info) {
            //                     $state.go('events');
            //                 }
            //             }, function (empty) {
            //                 // 不传值关闭走这里
            //             });
            //
            //         break;
            // }

            function eventCtrl($scope, params) {
                $scope.title = params.data.desc;

                $scope.submit = function () {
                    var data = 'submit';
                    $scope.$close(data);
                };
            }

            function warningEventCtrl($scope, params) {
                $scope.title = params.data.desc;

                $scope.submit = function () {
                    var data = 'submit';
                    $scope.$close(data);
                };
            }
        });

        socket.on('monitor', function (data) {
            var obj = JSON.parse(JSON.parse(data).content);
            clientCache.cache.data = obj;

            if (bid) {
                var branchInfo = obj[bid];
                $rootScope.$emit('branchRefresh', branchInfo);   // 订阅的支线基本信息
                $rootScope.$digest();
            }
        });

        socket.on('status', function (data) {
            var obj = JSON.parse(data);
            var item = {
                count: JSON.parse(obj.content).total,  // 未处理的event数量
                states: (JSON.parse(obj.content)).detail // 侧边栏和一次系统图
            };
            $rootScope.$emit('refresh', item);
        });

        socket.on('overall', function (data) {
            var obj = JSON.parse(data);
            var item = JSON.parse(obj.content);
            clientCache.cache.p = item;

            $rootScope.$emit('overallRefresh', item);
        });

        return {
            subscribeClient: function (cid) {
                socket.emit('subscribe', {client_id: cid}); // 订阅——变电站信息
            },
            subscribeBranch: function (id) { // 订阅——支线基本信息
                bid = id;
            },
            login: function () {
                socket.emit('login', {});
            }
        }
    }

    function pageTopCache() {
        return {
            cache: {
                state: 'overview'
            },
            currentState: {
                state: ''
            }
        }
    }

    function imgPrefix() {
        return {
            prefix: 'http://monitor.shanghaihenghui.com/'
        }
    }

    function exportPrefix(ImgPrefix) {
        var host = ImgPrefix.prefix + "api/";

        return {
            prefix: host + 'device/export',      // 设备导出
            prefixPrint: host + 'device/print',   // 设备打印

            eventPrefix: host + 'event/export',  // 事件导出
            eventPrefixPrint: host + 'event/print',  // 事件打印

            userPrefix: host + 'user/export',      // 用户列表导出
            userPrefixPrint: host + 'user/print',  // 用户列表打印

            reportItem: function (rpid) {
                return host + 'report/' + rpid;    //下载报表 单个
            },
            uploadReport: host + 'report/upload',   // 上传报表文件
            reportAll: host + 'report/multi?',   //下载报表 所有

            checkinAll: host + 'signin/export?',   // 签到列表导出
            checkinAllPrint: host + 'signin/print?',   // 签到列表打印
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

            history_querytype: 'history_querytype',  //历史数据，左侧查询类型
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
        kwCache.getHistory_querytype = function () {
            return getType(groups.history_querytype);
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

    function pieChartCache() {
        return {
            cache: {
                data: []
            }
        }
    }

    function clientCache() {
        return {
            cache: {
                data: {},// 某个变电站
                p: {}    // 当前负荷
            }
        }
    }

})();
